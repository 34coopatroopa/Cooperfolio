import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function ServerRack() {
  const group = useRef()

  // rotate the whole rack slowly
  useFrame(({ clock }) => {
    group.current.rotation.y = clock.getElapsedTime() * 0.15
  })

  // create 5 “servers” stacked vertically
  const servers = Array.from({ length: 5 }, (_, i) => (
    <group key={i} position={[0, i * 1.3 - 2.6, 0]}>
      {/* server body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* front LEDs */}
      <mesh position={[1.4, 0.2, 0.8]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial emissive={i % 2 ? 'limegreen' : 'cyan'} />
      </mesh>
      <mesh position={[1.4, -0.2, 0.8]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial emissive={i % 3 ? 'orange' : 'magenta'} />
      </mesh>
    </group>
  ))

  return <group ref={group}>{servers}</group>
}
