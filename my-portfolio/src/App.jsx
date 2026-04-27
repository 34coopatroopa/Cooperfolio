// src/App.jsx
import React, { useState, useRef, useCallback, memo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Analytics } from '@vercel/analytics/react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STATIONS } from './data/stations'
import { heightAt, MTN_R, MTN_H, fbm } from './utils/terrain'
import './index.css'

const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

/* ─────────────────────────────────────────────────────────────
   3D Scene — built imperatively inside the r3f Canvas
───────────────────────────────────────────────────────────── */
const SceneSetup = memo(function SceneSetup({ sceneApiRef, labelElsRef, onSelect, onTourChange, onLoaded }) {
  const { scene, camera, gl } = useThree()
  const refs = useRef({
    controls: null,
    markers: [],
    lakeMesh: null,
    lakeY: 0,
    waterfallPoints: [],
    birds: [],
    flyState: null,
    tourActive: false,
    tourTimer: null,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const r = refs.current
    gl.outputColorSpace = THREE.SRGBColorSpace
    scene.fog = new THREE.FogExp2(0xd9c9aa, 0.0042)

    // ── OrbitControls ──────────────────────────────────────────
    const controls = new OrbitControls(camera, gl.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 70
    controls.maxDistance = 340
    controls.minPolarAngle = 0.25
    controls.maxPolarAngle = Math.PI / 2 - 0.06
    controls.enablePan = false
    controls.target.set(0, 36, 0)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.18
    r.controls = controls

    // ── Sky ────────────────────────────────────────────────────
    const skyGeo = new THREE.SphereGeometry(1800, 32, 18)
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        top:    { value: new THREE.Color(0xc6b594) },
        midhi:  { value: new THREE.Color(0xe9d4a8) },
        midlo:  { value: new THREE.Color(0xeec39b) },
        horizon:{ value: new THREE.Color(0xf3deb3) },
        bot:    { value: new THREE.Color(0xc8a280) },
      },
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `
        varying vec3 vP;
        uniform vec3 top, midhi, midlo, horizon, bot;
        void main(){
          float h = normalize(vP).y;
          vec3 c;
          if (h < 0.0)       c = mix(bot, horizon, smoothstep(-0.3, 0.0, h));
          else if (h < 0.18) c = mix(horizon, midlo, smoothstep(0.0, 0.18, h));
          else if (h < 0.45) c = mix(midlo, midhi, smoothstep(0.18, 0.45, h));
          else               c = mix(midhi, top, smoothstep(0.45, 0.95, h));
          gl_FragColor = vec4(c, 1.0);
        }
      `,
    })
    scene.add(new THREE.Mesh(skyGeo, skyMat))

    // Sun disc + halo
    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(40, 48),
      new THREE.MeshBasicMaterial({ color: 0xfbe6b8, transparent: true, opacity: 0.95 })
    )
    sun.position.set(-560, 220, -1200); sun.lookAt(0, 60, 0); scene.add(sun)
    const haloDisc = new THREE.Mesh(
      new THREE.CircleGeometry(90, 48),
      new THREE.MeshBasicMaterial({ color: 0xf6d8a4, transparent: true, opacity: 0.35 })
    )
    haloDisc.position.copy(sun.position).add(new THREE.Vector3(0, 0, 5))
    haloDisc.lookAt(0, 60, 0); scene.add(haloDisc)

    // ── Lights ─────────────────────────────────────────────────
    scene.add(new THREE.HemisphereLight(0xfbe6b8, 0x4c5e57, 0.95))
    const sunLight = new THREE.DirectionalLight(0xffe2b4, 1.25)
    sunLight.position.set(-180, 220, -150); scene.add(sunLight)
    const fill = new THREE.DirectionalLight(0x9bbecc, 0.32)
    fill.position.set(160, 80, 200); scene.add(fill)

    // ── Mountain ───────────────────────────────────────────────
    const SEG = 280
    const mtnGeo = new THREE.PlaneGeometry(MTN_R * 2, MTN_R * 2, SEG, SEG).rotateX(-Math.PI / 2)
    const mpos = mtnGeo.attributes.position
    for (let i = 0; i < mpos.count; i++) mpos.setY(i, heightAt(mpos.getX(i), mpos.getZ(i)))
    mtnGeo.computeVertexNormals()

    const mcolors = new Float32Array(mpos.count * 3)
    mtnGeo.setAttribute('color', new THREE.BufferAttribute(mcolors, 3))
    const cMeadow = new THREE.Color(0x6f8a55), cSlope = new THREE.Color(0x8a7a52)
    const cRock   = new THREE.Color(0x7a6e62), cAlp   = new THREE.Color(0xb6a48a)
    const cSnow   = new THREE.Color(0xf5ecdc), ctmp   = new THREE.Color()
    for (let i = 0; i < mpos.count; i++) {
      const x = mpos.getX(i), y = mpos.getY(i), z = mpos.getZ(i)
      const t = THREE.MathUtils.clamp(y / (MTN_H * 0.95), 0, 1)
      const j = (fbm(x * 0.18, z * 0.18, 2) - 0.5) * 0.18
      const slope = 1 - Math.max(0, Math.min(1,
        (heightAt(x+1,z) + heightAt(x-1,z) + heightAt(x,z+1) + heightAt(x,z-1)) * 0.25 / Math.max(0.1, y)
      ))
      if      (t < 0.25) ctmp.copy(cMeadow).lerp(cSlope, t / 0.25 + j * 0.6)
      else if (t < 0.50) ctmp.copy(cSlope).lerp(cRock,  (t - 0.25) / 0.25 + j * 0.5)
      else if (t < 0.78) ctmp.copy(cRock).lerp(cAlp,    (t - 0.50) / 0.28 + j * 0.4)
      else               ctmp.copy(cAlp).lerp(cSnow,    (t - 0.78) / 0.22)
      if (t > 0.62) {
        const snowAmt = THREE.MathUtils.clamp((t - 0.62) / 0.38 + slope * 0.2 + j * 0.2, 0, 1)
        ctmp.lerp(cSnow, snowAmt * 0.85)
      }
      mcolors[i*3] = ctmp.r; mcolors[i*3+1] = ctmp.g; mcolors[i*3+2] = ctmp.b
    }
    scene.add(new THREE.Mesh(mtnGeo, new THREE.MeshStandardMaterial({
      vertexColors: true, flatShading: true, roughness: 1.0, metalness: 0.0,
    })))

    // Ground ring
    scene.add(new THREE.Mesh(
      new THREE.CircleGeometry(900, 80).rotateX(-Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x9c8a64, roughness: 1, metalness: 0 })
    ))

    // ── Lake ───────────────────────────────────────────────────
    const lakeCx = 86, lakeCz = 95
    r.lakeY = heightAt(lakeCx, lakeCz) + 0.15
    const baseAttr = mtnGeo.attributes.position
    for (let i = 0; i < baseAttr.count; i++) {
      const bx = baseAttr.getX(i), bz = baseAttr.getZ(i)
      const d  = Math.hypot(bx - lakeCx, bz - lakeCz)
      if (d < 22) {
        const ny = r.lakeY - 0.6 - (1 - d / 22) * 1.4
        if (baseAttr.getY(i) > ny) baseAttr.setY(i, ny)
      }
    }
    baseAttr.needsUpdate = true; mtnGeo.computeVertexNormals()

    const lakeGeo = new THREE.CircleGeometry(20, 64).rotateX(-Math.PI / 2)
    lakeGeo.scale(1.15, 1, 0.9)
    const lakeMat = new THREE.MeshStandardMaterial({ color: 0x4a7e8c, roughness: 0.25, metalness: 0.4, transparent: true, opacity: 0.85 })
    r.lakeMesh = new THREE.Mesh(lakeGeo, lakeMat)
    r.lakeMesh.position.set(lakeCx, r.lakeY, lakeCz)
    scene.add(r.lakeMesh)
    for (let k = 0; k < 3; k++) {
      const rr = 5 + k * 4
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(rr, rr + 0.2, 64).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xcfe1e6, transparent: true, opacity: 0.18 - k * 0.04 })
      )
      ring.position.set(lakeCx, r.lakeY + 0.02, lakeCz); ring.scale.set(1.15, 1, 0.9); scene.add(ring)
    }

    // ── Waterfall ──────────────────────────────────────────────
    const wfGroup = new THREE.Group(); scene.add(wfGroup)
    const wfStart = new THREE.Vector3(40, heightAt(40, 30) + 1, 30)
    const wfMid1  = new THREE.Vector3(58, heightAt(58, 55) + 0.5, 55)
    const wfMid2  = new THREE.Vector3(74, heightAt(74, 78) + 0.5, 78)
    const wfEnd   = new THREE.Vector3(86, r.lakeY + 0.05, 95)
    const wfCurve = new THREE.CatmullRomCurve3([wfStart, wfMid1, wfMid2, wfEnd], false, 'catmullrom', 0.5)
    wfGroup.add(new THREE.Mesh(
      new THREE.TubeGeometry(wfCurve, 80, 0.9, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xeaf2f4, transparent: true, opacity: 0.88, roughness: 0.4, metalness: 0.1, emissive: 0x223740, emissiveIntensity: 0.06 })
    ))
    ;[wfStart, wfMid1, wfMid2, wfEnd].forEach(p => {
      const N = 60, pos = new Float32Array(N * 3), data = []
      for (let i = 0; i < N; i++) {
        pos[i*3]=p.x; pos[i*3+1]=p.y; pos[i*3+2]=p.z
        data.push({ life: Math.random(), speed: 0.5 + Math.random()*0.7, vx: (Math.random()-0.5)*0.6, vy: 0.3+Math.random()*0.6, vz: (Math.random()-0.5)*0.6 })
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xf5fbfc, size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false }))
      pts.userData = { origin: p.clone(), data }
      wfGroup.add(pts); r.waterfallPoints.push(pts)
    })

    // ── Haze ridges ────────────────────────────────────────────
    function makeHaze(z, w, h, color, opacity) {
      const seg = 220, g = new THREE.PlaneGeometry(w, h, seg, 1), p = g.attributes.position
      for (let i = 0; i <= seg; i++)
        p.setY(i, Math.sin(i/seg*Math.PI*1.8+z*0.01)*h*0.18 + Math.sin(i/seg*Math.PI*4.4+z*0.02)*h*0.10 + fbm(i/seg*6+z*0.01,0,3)*h*0.42)
      for (let i = 0; i <= seg; i++) p.setY((seg+1)+i, -h*0.5)
      g.computeVertexNormals()
      const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }))
      mesh.position.set(0, h*0.08, z); return mesh
    }
    ;[[-340,1500,130,0x8a8e90,0.78],[-460,1700,150,0xa0a3a4,0.62],[-600,1900,175,0xb9b8b3,0.46],[-780,2100,195,0xd0c8b8,0.32]]
      .forEach(([z,w,h,c,o]) => scene.add(makeHaze(z,w,h,c,o)))
    ;[Math.PI*0.5, Math.PI, Math.PI*1.5].forEach(a => {
      const l = makeHaze(-460, 1600, 140, 0xa0a3a4, 0.55)
      l.rotation.y = a; l.position.set(Math.sin(a)*460, 14, Math.cos(a)*-460); scene.add(l)
    })

    // ── Trees ──────────────────────────────────────────────────
    const treeGroup = new THREE.Group(); scene.add(treeGroup)
    const mPine  = new THREE.MeshStandardMaterial({ color: 0x2f5236, flatShading: true, roughness: 1 })
    const mPine2 = new THREE.MeshStandardMaterial({ color: 0x4f6f3f, flatShading: true, roughness: 1 })
    const mTrunk = new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 1 })
    for (let i = 0; i < 420; i++) {
      const rr = Math.sqrt(Math.random()) * MTN_R * 0.96, a = Math.random() * Math.PI * 2
      const tx = Math.cos(a)*rr, tz = Math.sin(a)*rr, ty = heightAt(tx, tz)
      if (ty < 0.4 || ty > MTN_H * 0.55 || Math.hypot(tx-86, tz-95) < 24) continue
      const tg = new THREE.Group()
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.10, 0.4, 5), mTrunk)
      trunk.position.y = 0.2; tg.add(trunk)
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.0, 5), Math.random() < 0.5 ? mPine : mPine2)
      cone.position.y = 1.2; tg.add(cone)
      tg.position.set(tx, ty, tz); tg.scale.setScalar(0.7 + Math.random()*1.1); tg.rotation.y = Math.random()*Math.PI*2
      treeGroup.add(tg)
    }

    // ── Birds ──────────────────────────────────────────────────
    const birdGroup = new THREE.Group(); scene.add(birdGroup)
    const bMat = new THREE.MeshBasicMaterial({ color: 0x1f2a30, side: THREE.DoubleSide })
    for (let i = 0; i < 7; i++) {
      const sh = new THREE.Shape(); sh.moveTo(0,0); sh.quadraticCurveTo(0.4,0.18,0.8,0); sh.quadraticCurveTo(0.4,-0.04,0,0)
      const sh2 = new THREE.Shape(); sh2.moveTo(0,0); sh2.quadraticCurveTo(-0.4,0.18,-0.8,0); sh2.quadraticCurveTo(-0.4,-0.04,0,0)
      const wings = new THREE.Group()
      wings.add(new THREE.Mesh(new THREE.ShapeGeometry(sh), bMat))
      wings.add(new THREE.Mesh(new THREE.ShapeGeometry(sh2), bMat))
      wings.scale.setScalar(2 + Math.random()*1.5)
      wings.userData = { ang: Math.random()*Math.PI*2, radius: 110+Math.random()*40, height: 70+Math.random()*30, speed: 0.05+Math.random()*0.03, flap: Math.random()*Math.PI*2 }
      birdGroup.add(wings); r.birds.push(wings)
    }

    // ── Cairns ─────────────────────────────────────────────────
    function stationWorldPos(s) {
      const az = s.pos.az + s.pos.t * 1.4, radius = (1 - s.pos.t * 0.92) * (MTN_R * 0.78)
      const x = Math.cos(az)*radius, z = Math.sin(az)*radius
      return new THREE.Vector3(x, heightAt(x, z), z)
    }
    function makeMarker() {
      const g = new THREE.Group()
      const brass = new THREE.MeshStandardMaterial({ color: 0xc79a4a, metalness: 0.7, roughness: 0.45 })
      const dark  = new THREE.MeshStandardMaterial({ color: 0x6e4d20, metalness: 0.3, roughness: 0.85 })
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.4, 0.4, 12), dark); base.position.y = 0.2; g.add(base)
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.6, 12), brass); stem.position.y = 1.0; g.add(stem)
      const orb  = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 14), brass); orb.position.y = 1.95; g.add(orb)
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 12), new THREE.MeshBasicMaterial({ color: 0xffb24a, transparent: true, opacity: 0.95 })); flame.position.y = 2.45; g.add(flame)
      const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(0.36, 1.0, 12), new THREE.MeshBasicMaterial({ color: 0xffd58c, transparent: true, opacity: 0.5, depthWrite: false })); flameOuter.position.y = 2.6; g.add(flameOuter)
      const haloRing = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.85, 36).rotateX(-Math.PI/2), new THREE.MeshBasicMaterial({ color: 0xffb24a, transparent: true, opacity: 0.4, side: THREE.DoubleSide })); haloRing.position.y = 0.05; g.add(haloRing)
      const shaft = new THREE.Mesh(new THREE.ConeGeometry(2.4, 22, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe0a8, transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false })); shaft.position.y = 12.5; g.add(shaft)
      g.userData = { flame, flameOuter, halo: haloRing, shaft }; return g
    }
    STATIONS.forEach((s, i) => {
      const m = makeMarker(); m.position.copy(stationWorldPos(s)); m.userData.stationIndex = i
      scene.add(m); r.markers.push(m)
    })

    // ── Trail ──────────────────────────────────────────────────
    const trailCurve = new THREE.CatmullRomCurve3(r.markers.map(m => m.position.clone()), false, 'centripetal')
    const trailLine  = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(trailCurve.getPoints(260).map(v => new THREE.Vector3(v.x, heightAt(v.x, v.z) + 0.35, v.z))),
      new THREE.LineDashedMaterial({ color: 0x3a2a1c, dashSize: 0.9, gapSize: 0.7, transparent: true, opacity: 0.6 })
    )
    trailLine.computeLineDistances(); scene.add(trailLine)

    // ── Pointer events ─────────────────────────────────────────
    const dom = gl.domElement, raycaster = new THREE.Raycaster(), ptr = new THREE.Vector2()
    let pressXY = null
    function setPtr(e) { const rect = dom.getBoundingClientRect(); ptr.x = ((e.clientX-rect.left)/rect.width)*2-1; ptr.y = -((e.clientY-rect.top)/rect.height)*2+1 }
    function onPtrDown(e) { pressXY = [e.clientX, e.clientY] }
    function onPtrUp(e) {
      if (!pressXY) return; const dx=e.clientX-pressXY[0], dy=e.clientY-pressXY[1]; pressXY=null
      if (Math.hypot(dx,dy)>6) return; setPtr(e); raycaster.setFromCamera(ptr, camera)
      const hits = raycaster.intersectObjects(r.markers, true)
      if (hits.length) { let g=hits[0].object; while(g&&!Number.isInteger(g.userData.stationIndex)) g=g.parent; if(g){api.stopTour();api.selectStation(g.userData.stationIndex,true)} }
    }
    function onPtrMove(e) { setPtr(e); raycaster.setFromCamera(ptr,camera); dom.style.cursor=raycaster.intersectObjects(r.markers,true).length?'pointer':'' }
    dom.addEventListener('pointerdown', onPtrDown)
    dom.addEventListener('pointerup',   onPtrUp)
    dom.addEventListener('pointermove', onPtrMove)

    // ── Camera fly ─────────────────────────────────────────────
    function flyCameraTo(target, dur = 1300) {
      return new Promise(resolve => {
        if (r.flyState) r.flyState.resolve()
        const dir = target.clone().setY(0); if (dir.lengthSq()<0.001) dir.set(1,0,1)
        dir.normalize().multiplyScalar(56).add(new THREE.Vector3(0,28,0))
        r.flyState = { startCam: camera.position.clone(), endCam: target.clone().add(dir), startTarget: r.controls.target.clone(), endTarget: target.clone(), t0: performance.now(), dur, resolve }
      })
    }

    // ── Station API ────────────────────────────────────────────
    function selectStation(i, flyTo=false) { onSelect(i); r.controls.autoRotate=false; if(flyTo) flyCameraTo(r.markers[i].position.clone()) }
    function closePanel() { onSelect(null); r.controls.autoRotate=true }
    async function startTour() {
      if (r.tourActive) return; r.tourActive=true; onTourChange(true)
      for (let i=0;i<STATIONS.length;i++) {
        if (!r.tourActive) return
        selectStation(i,false)
        await flyCameraTo(r.markers[i].position.clone(), 1400)
        if (!r.tourActive) return
        await new Promise(res => { r.tourTimer=setTimeout(res,5500) })
      }
      if (r.tourActive) { closePanel(); await flyCameraTo(new THREE.Vector3(0,36,0),1500) }
      stopTour()
    }
    function stopTour() { r.tourActive=false; clearTimeout(r.tourTimer); onTourChange(false) }

    const api = { selectStation, closePanel, startTour, stopTour }
    sceneApiRef.current = api
    setTimeout(() => onLoaded(), 800)

    return () => {
      dom.removeEventListener('pointerdown', onPtrDown)
      dom.removeEventListener('pointerup',   onPtrUp)
      dom.removeEventListener('pointermove', onPtrMove)
      controls.dispose(); scene.fog = null
    }
  }, [])

  useFrame((state, delta) => {
    const r = refs.current
    if (!r.controls) return
    const t = state.clock.getElapsedTime(), dt = Math.min(0.05, delta)

    // Camera fly
    if (r.flyState) {
      const p = Math.min(1, (performance.now()-r.flyState.t0)/r.flyState.dur), e = easeInOutQuad(p)
      camera.position.lerpVectors(r.flyState.startCam, r.flyState.endCam, e)
      r.controls.target.lerpVectors(r.flyState.startTarget, r.flyState.endTarget, e)
      if (p >= 1) { const res = r.flyState.resolve; r.flyState = null; res() }
    }
    r.controls.update()

    // Cairn flame animation
    r.markers.forEach((m, i) => {
      const ph = i*0.7, { flame, flameOuter, halo, shaft } = m.userData
      const fk = 1 + 0.18*Math.sin(t*8+ph)
      flame.scale.set(fk, 1+0.12*Math.sin(t*7+ph), fk)
      flameOuter.scale.set(fk*1.05, 1+0.18*Math.sin(t*5+ph), fk*1.05)
      halo.scale.setScalar(1+0.12*Math.sin(t*1.6+ph)); halo.material.opacity = 0.32+0.18*Math.sin(t*1.6+ph)
      shaft.material.opacity = 0.10+0.05*Math.sin(t*1.4+ph)
    })

    // Lake ripple
    if (r.lakeMesh) {
      r.lakeMesh.material.opacity = 0.78+0.07*Math.sin(t*1.3)
      r.lakeMesh.material.color.setHSL(0.52+0.01*Math.sin(t*0.6), 0.32, 0.42+0.04*Math.sin(t*0.9))
    }

    // Waterfall spray
    r.waterfallPoints.forEach(pts => {
      const { data, origin: o } = pts.userData, pos = pts.geometry.attributes.position
      for (let i=0;i<data.length;i++) {
        const d=data[i]; d.life+=dt*d.speed*0.5; if(d.life>1) d.life=0
        pos.setXYZ(i, o.x+d.vx*d.life*4, o.y+d.vy*d.life*4-d.life*d.life*6, o.z+d.vz*d.life*4)
      }
      pos.needsUpdate = true
    })

    // Birds
    r.birds.forEach(b => {
      const u=b.userData; u.ang+=u.speed*dt; u.flap+=dt*8
      b.position.set(Math.cos(u.ang)*u.radius, u.height+Math.sin(t*0.5+u.ang)*3, Math.sin(u.ang)*u.radius)
      b.rotation.y = -u.ang+Math.PI/2; b.scale.y = 2.5*(0.4+Math.sin(u.flap)*0.5)
    })

    // Station label DOM update (direct, avoids React re-render per frame)
    if (labelElsRef.current) {
      r.markers.forEach((m, i) => {
        const el = labelElsRef.current[i]; if (!el) return
        const wp = m.position.clone().add(new THREE.Vector3(0,4.2,0)).project(camera)
        const x=(wp.x*0.5+0.5)*window.innerWidth, y=(-wp.y*0.5+0.5)*window.innerHeight
        if (wp.z<1 && x>-100 && x<window.innerWidth+100 && y>-50 && y<window.innerHeight+50) {
          el.classList.remove('hide'); el.style.left=x+'px'; el.style.top=y+'px'
        } else { el.classList.add('hide') }
      })
    }
  })

  return null
})

/* ─────────────────────────────────────────────────────────────
   HUD Components
───────────────────────────────────────────────────────────── */
function buildPanelHTML(s) {
  const parts = []
  if (s.lede) parts.push(`<div class="lede">${s.lede}</div>`)
  if (s.highlights) parts.push(`<div class="hl">${s.highlights.map(h=>`<div class="c"><div class="k">${h.k}</div><div class="v">${h.v}</div></div>`).join('')}</div>`)
  if (s.moments) parts.push(`<div class="block"><h4>Notable moments</h4><ul class="moments">${s.moments.map(m=>`<li>${m}</li>`).join('')}</ul></div>`)
  if (s.projects) parts.push(`<div class="block"><h4>Recent works</h4>${s.projects.map(p=>`<div class="proj"><div class="pt">${p.t}<span class="st">${p.st}</span></div><div class="pd">${p.d}</div><div class="ps">${p.s.map(tag=>`<span>${tag}</span>`).join('')}</div></div>`).join('')}</div>`)
  if (s.groups) parts.push(s.groups.map(g=>`<div class="block"><h4>${g.h}</h4><div class="tags">${g.v.map(v=>`<span class="tag">${v}</span>`).join('')}</div></div>`).join(''))
  return parts.join('')
}

function Panel({ selectedIndex, onClose }) {
  const s = selectedIndex !== null ? STATIONS[selectedIndex] : null
  return (
    <aside className={`panel${s ? ' open' : ''}`} aria-live="polite">
      <button className="close" onClick={onClose} aria-label="Close">&times;</button>
      {s && <>
        <div className="head">
          <span className="n">Station &middot; {s.num}</span>
          <span>Elev &middot; {s.elev}</span>
        </div>
        <h2 dangerouslySetInnerHTML={{ __html: s.title }} />
        <div className="sub">{s.sub}</div>
        <div className="ornament">&#10022; &nbsp; &middot; &nbsp; &#10022;</div>
        <div dangerouslySetInnerHTML={{ __html: buildPanelHTML(s) }} />
      </>}
    </aside>
  )
}

function Rail({ selectedIndex, onSelect }) {
  return (
    <nav className="rail" aria-label="Stations">
      <div className="legend">&#8212; Stations of the ascent &#8212;</div>
      {STATIONS.map((s, i) => (
        <button key={i} className={`item${selectedIndex===i?' active':''}`} onClick={() => onSelect(i)} aria-current={selectedIndex===i?'true':undefined}>
          <span className="n">{s.num}</span>
          <span className="nm">{s.name}</span>
          <span className="el">{s.elev}</span>
        </button>
      ))}
    </nav>
  )
}

function PlayButton({ tourActive, onToggle }) {
  return (
    <button className={`play${tourActive?' playing':''}`} onClick={onToggle}>
      <span className="ic" aria-hidden="true" />
      <span>{tourActive ? 'Pause journey' : 'Begin the journey'}</span>
    </button>
  )
}

function TopBar() {
  return (
    <div className="top">
      <div className="brand">Cooper <i>Hoy</i><small>An illustrated curriculum vit&aelig;</small></div>
      <div className="meta"><b>Plate I</b><br />Cyber Security Engineer<br />Ames &middot; Iowa</div>
    </div>
  )
}

function Bottom() {
  return (
    <div className="bottom">
      <div className="hint">
        <span><b>drag</b> orbit</span>
        <span><b>scroll</b> zoom</span>
        <span><b>click</b> a station</span>
      </div>
      <div className="links">
        <a href="mailto:cjhoy@iastate.edu">cjhoy@iastate.edu</a>
        <a href="tel:+13192403504">319.240.3504</a>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Root App
───────────────────────────────────────────────────────────── */
export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [tourActive,    setTourActive]    = useState(false)
  const [loaded,        setLoaded]        = useState(false)
  const sceneApiRef = useRef(null)
  const labelElsRef = useRef([])

  const handleLoaded     = useCallback(() => setLoaded(true), [])
  const selectFromRail   = useCallback(i => { const a=sceneApiRef.current; if(a){a.stopTour();a.selectStation(i,true)} }, [])
  const toggleTour       = useCallback(() => { const a=sceneApiRef.current; if(a){if(tourActive)a.stopTour();else a.startTour()} }, [tourActive])
  const handleClosePanel = useCallback(() => { const a=sceneApiRef.current; if(a){a.stopTour();a.closePanel()} }, [])

  return (
    <>
      <div className={`loader${loaded?' hide':''}`}>Setting the scene&hellip;</div>

      <div className="scene-wrap">
        <Canvas
          gl={{ antialias: true }}
          camera={{ fov: 40, position: [160, 110, 160], near: 0.1, far: 4000 }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%' }}
        >
          <SceneSetup
            sceneApiRef={sceneApiRef}
            labelElsRef={labelElsRef}
            onSelect={setSelectedIndex}
            onTourChange={setTourActive}
            onLoaded={handleLoaded}
          />
        </Canvas>
      </div>

      <div className="vignette" />
      <div className="grain" />

      <div className="hud">
        <TopBar />
        <Rail selectedIndex={selectedIndex} onSelect={selectFromRail} />
        <PlayButton tourActive={tourActive} onToggle={toggleTour} />
        <Bottom />
        <Panel selectedIndex={selectedIndex} onClose={handleClosePanel} />
      </div>

      <div id="labels">
        {STATIONS.map((s, i) => (
          <div key={i} className="label hide" ref={el => { labelElsRef.current[i] = el }}>
            <span className="num">{s.num}</span>{s.name}
          </div>
        ))}
      </div>

      <Analytics />
    </>
  )
}
