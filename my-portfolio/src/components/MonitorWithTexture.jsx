// src/components/MonitorWithTexture.jsx
import React, { useMemo, useEffect } from 'react'
import { RoundedBox, Edges } from '@react-three/drei'
import * as THREE from 'three'

export default function MonitorWithTexture({ output }) {
  // 1️⃣ Create the offscreen canvas once
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 400
    c.height = 250
    return c
  }, [])

  // 2️⃣ Create the CanvasTexture once
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearFilter
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [canvas])

  // 3️⃣ Redraw & wrap text whenever `output` changes
  useEffect(() => {
    const ctx = canvas.getContext('2d')

    // clear background
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // text settings
    const fontSize = 14
    const lineHeight = 18
    const margin = 8
    ctx.font = `${fontSize}px monospace`
    ctx.fillStyle = '#00FF00'

    // compute wrap width in characters
    const maxChars = Math.floor((canvas.width - margin * 2) / (fontSize * 0.6))
    // split & wrap
    const wrapped = []
    output.forEach((line) => {
      for (let i = 0; i < line.length; i += maxChars) {
        wrapped.push(line.slice(i, i + maxChars))
      }
    })

    // figure out how many lines fit
    const topOffset = 20
    const maxRows = Math.floor((canvas.height - topOffset - margin) / lineHeight)

    // draw only the last maxRows lines
    const toDraw = wrapped.slice(-maxRows)
    let y = topOffset
    toDraw.forEach((l) => {
      ctx.fillText(l, margin, y)
      y += lineHeight
    })

    // draw the prompt at bottom
    ctx.fillText('$ ', margin, y)

    // upload to texture
    texture.needsUpdate = true
  }, [output, canvas, texture])

  // monitor dimensions
  const W = 4,
        H = 2.5,
        D = 0.05,
        bezel = 0.1

  return (
    <group>
      {/* Bezel / frame */}
      <RoundedBox
        args={[W + bezel*2, H + bezel*2, D]}
        radius={0.05}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.3} />
        <Edges color="#888888" />
      </RoundedBox>

      {/* Screen plane with our CanvasTexture */}
      <mesh position={[0, 0, D/2 + 0.001]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={texture} />
        <Edges color="#00AA00" />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, -(H/2 + 0.5), 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -(H/2 + 1.1), 0]} castShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}
