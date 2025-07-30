import React, { useRef, useEffect } from 'react'
import { Html, RoundedBox, Edges } from '@react-three/drei'

export default function Monitor({ output, onCommand }) {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [output])

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      const cmd = e.target.value.trim()
      if (cmd) onCommand(cmd)
      e.target.value = ''
    }
  }

  const screenW = 4
  const screenH = 2.5
  const bezel = 0.1
  const depth = 0.05

  return (
    <group>
      {/* Brighter bezel */}
      <RoundedBox
        args={[screenW + bezel * 2, screenH + bezel * 2, depth]}
        radius={0.05}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#444444"       /* lighter gray */
          metalness={0.6}
          roughness={0.3}
        />
        <Edges color="#888888" />  {/* lighter edge highlight */}
      </RoundedBox>

      {/* Slightly tinted screen plane */}
      <mesh position={[0, 0, depth / 2 + 0.001]} castShadow>
        <planeGeometry args={[screenW, screenH]} />
        <meshStandardMaterial
          color="#0a1a0a"       /* very dark green tint */
          emissive="#003300"
          emissiveIntensity={0.4}
          roughness={0.5}
        />
        <Edges color="#00aa00" /> {/* green highlight */}
      </mesh>

      {/* HTML terminal */}
      <Html
        transform
        occlude={false}
        center
        position={[0, 0, depth / 2 + 0.002]}
        distanceFactor={100}      /* 400px → 4 units */
        style={{
          width:  '400px',
          height: '250px',
          pointerEvents: 'auto',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: '#00FF00',
            fontFamily: 'monospace',
            fontSize: '14px',
            padding: '8px',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {output.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div style={{ display: 'flex', marginTop: '8px' }}>
            <span style={{ marginRight: '8px' }}>$</span>
            <input
              ref={inputRef}
              onKeyDown={handleKey}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#00FF00',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </Html>

      {/* Stand neck */}
      <mesh position={[0, - (screenH / 2 + 0.5), 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, - (screenH / 2 + 1.1), 0]} castShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}
