import React from 'react'
import { RoundedBox } from '@react-three/drei'

export default function ServerCase({ onSelect }) {
  return (
    <group>
      {/* Chassis */}
      <RoundedBox
        args={[4, 6, 3]}
        radius={0.1}
        smoothness={5}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#2c3e50" metalness={0.9} roughness={0.1} />
      </RoundedBox>

      {/* Open front door */}
      <RoundedBox
        args={[0.1, 6, 3]}
        radius={0.05}
        smoothness={5}
        rotation={[0, -Math.PI / 2, 0]}
        position={[2, 0, 1.51]}
        castShadow
      >
        <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.3} />
      </RoundedBox>

      {/* Rack rails */}
      {[1.6, -1.6].map((x, i) => (
        <RoundedBox
          key={i}
          args={[0.1, 6, 0.1]}
          radius={0.05}
          smoothness={3}
          position={[x, 0, -1.5]}
        >
          <meshStandardMaterial color="#7f8c8d" metalness={0.8} roughness={0.2} />
        </RoundedBox>
      ))}

      {/* Motherboard plane (just decoration) */}
      <mesh position={[0, 0.5, -1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 4.6, 64, 64]} />
        <meshStandardMaterial color="#16a085" metalness={0.2} roughness={0.7} />
      </mesh>

      {/* CPU (clickable) */}
      <RoundedBox
        args={[0.6, 0.6, 0.05]}
        radius={0.02}
        smoothness={3}
        position={[0.8, 0.5, -1.38]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect('cpu')
        }}
        onPointerOver={(e) => (e.object.scale.set(1.1,1.1,1.1))}
        onPointerOut={(e) => (e.object.scale.set(1,1,1))}
        castShadow
      >
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* RAM sticks (clickable) */}
      {[-0.6, 0.6].map((x, i) => (
        <RoundedBox
          key={i}
          args={[0.2, 1.8, 0.05]}
          radius={0.02}
          smoothness={3}
          position={[x, 0.1, -1.38]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelect('ram')
          }}
          onPointerOver={(e) => (e.object.scale.set(1.05,1.05,1.05))}
          onPointerOut={(e) => (e.object.scale.set(1,1,1))}
          castShadow
        >
          <meshStandardMaterial color="#8e44ad" metalness={0.5} roughness={0.3} />
        </RoundedBox>
      ))}

      {/* SSD (clickable) */}
      <RoundedBox
        args={[1.5, 1, 0.1]}
        radius={0.02}
        smoothness={3}
        position={[-1.2, 1.5, -1.38]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect('ssd')
        }}
        onPointerOver={(e) => (e.object.scale.set(1.05,1.05,1.05))}
        onPointerOut={(e) => (e.object.scale.set(1,1,1))}
        castShadow
      >
        <meshStandardMaterial color="#ecf0f1" metalness={0.4} roughness={0.4} />
      </RoundedBox>

      {/* Fans (just decorative rings) */}
      {[-1.2, 1.2].map((x, i) => (
        <mesh
          key={i}
          position={[x, -1.5, -1.35]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.6, 0.1, 16, 100]} />
          <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Front LEDs */}
      {[0.5, -0.5].map((y, i) => (
        <mesh key={i} position={[2.01, y, 0.8]}>
          <boxGeometry args={[0.1, 0.2, 0.02]} />
          <meshStandardMaterial
            emissive={i % 2 ? 'limegreen' : 'cyan'}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}
