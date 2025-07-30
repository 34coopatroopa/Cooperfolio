import React, { useMemo, useEffect } from 'react'
import { RoundedBox, Edges } from '@react-three/drei'
import * as THREE from 'three'

export default function MonitorWithTexture({
  output,
  isRetro,
  isDestroyed,
}) {
  // 1️⃣ Offscreen canvas
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 400
    c.height = 250
    return c
  }, [])

  // 2️⃣ Texture
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearFilter
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [canvas])

  // 3️⃣ Draw each frame
  useEffect(() => {
    const ctx = canvas.getContext('2d')
    // clear to black
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (isDestroyed) {
      // draw random cracks
      ctx.strokeStyle = isRetro ? '#FFFDD0' : '#888'
      ctx.lineWidth = 2
      for (let i = 0; i < 10; i++) {
        const x1 = Math.random() * canvas.width
        const y1 = Math.random() * canvas.height
        const x2 = Math.random() * canvas.width
        const y2 = Math.random() * canvas.height
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      texture.needsUpdate = true
      return
    }

    // normal terminal rendering
    const fontSize = 14
    const lineHeight = 18
    const margin = 8
    ctx.font = `${fontSize}px monospace`
    ctx.fillStyle = '#00FF00'

    // wrap long lines
    const maxChars = Math.floor((canvas.width - margin * 2) / (fontSize * 0.6))
    const wrapped = []
    output.forEach((line) => {
      for (let i = 0; i < line.length; i += maxChars) {
        wrapped.push(line.slice(i, i + maxChars))
      }
    })

    // how many rows fit?
    const topOffset = 20
    const maxRows = Math.floor((canvas.height - topOffset - margin) / lineHeight)
    const toDraw = wrapped.slice(-maxRows)

    let y = topOffset
    toDraw.forEach((l) => {
      ctx.fillText(l, margin, y)
      y += lineHeight
    })
    // prompt
    ctx.fillText('$ ', margin, y)

    texture.needsUpdate = true
  }, [output, canvas, texture, isDestroyed, isRetro])

  // monitor geometry
  const W = 4,
    H = 2.5,
    D = 0.05,
    bezel = 0.1
  const bezelColor = isRetro ? '#FFFDD0' : '#444444'

  return (
    <group>
      {/* Bezel */}
      <RoundedBox
        args={[W + bezel * 2, H + bezel * 2, D]}
        radius={0.05}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={bezelColor}
          metalness={0.6}
          roughness={0.3}
        />
        <Edges color="#888888" />
      </RoundedBox>

      {/* Screen plane */}
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={texture} />
        <Edges color="#00AA00" />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, -(H / 2 + 0.5), 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -(H / 2 + 1.1), 0]} castShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}
