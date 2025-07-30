import React, { useMemo, useEffect } from 'react'
import { RoundedBox, Edges } from '@react-three/drei'
import * as THREE from 'three'

export default function MonitorWithTexture({ output, isRetro }) {
  // offscreen canvas
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 400
    c.height = 250
    return c
  }, [])

  // texture
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearFilter
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [canvas])

  // draw text
  useEffect(() => {
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const fontSize = 14
    const lineHeight = 18
    const margin = 8
    ctx.font = `${fontSize}px monospace`
    ctx.fillStyle = '#00FF00'

    const maxChars = Math.floor((canvas.width - margin * 2) / (fontSize * 0.6))
    const wrapped = []
    output.forEach((line) => {
      for (let i = 0; i < line.length; i += maxChars) {
        wrapped.push(line.slice(i, i + maxChars))
      }
    })

    const topOffset = 20
    const maxRows = Math.floor((canvas.height - topOffset - margin) / lineHeight)
    const toDraw = wrapped.slice(-maxRows)

    let y = topOffset
    toDraw.forEach((l) => {
      ctx.fillText(l, margin, y)
      y += lineHeight
    })

    ctx.fillText('$ ', margin, y)
    texture.needsUpdate = true
  }, [output, canvas, texture])

  // dimensions & bezel color
  const W = 4, H = 2.5, D = 0.05, bezel = 0.1
  const bezelColor = isRetro ? '#FFFDD0' : '#444444'

  return (
    <group>
      <RoundedBox
        args={[W + bezel * 2, H + bezel * 2, D]}
        radius={0.05}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={bezelColor} metalness={0.6} roughness={0.3} />
        <Edges color="#888888" />
      </RoundedBox>

      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={texture} />
        <Edges color="#00AA00" />
      </mesh>

      <mesh position={[0, -(H / 2 + 0.5), 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[0, -(H / 2 + 1.1), 0]} castShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}
