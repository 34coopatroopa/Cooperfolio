// src/App.jsx
import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei'
import MonitorWithTexture from './components/MonitorWithTexture.jsx'
import './index.css'

const HEADER = 'Welcome! Type "help" and press Enter.'

const container = document.getElementById('root')
createRoot(container).render(<App />)

export default function App() {
  const controlsRef = useRef()
  // Start with our header
  const [output, setOutput] = useState([HEADER])

  const commands = {
    help: [
      'Commands available:',
      '  help         – this menu',
      '  about        – who I am',
      '  contact      – how to reach me',
      '  education    – my degree & graduation',
      '  experience   – professional highlights',
      '  projects     – what I’ve built',
      '  skills       – my skillset',
      '  clear        – clear screen',
    ],
    about: [
      'Cooper Hoy',
      'Cybersecurity Engineering student.',
      'Iowa State University',
      'Based in Ames, Iowa',
      'love to hike, play frisbee, and read'
    ],
    contact: [
      'Phone: +1 319‑240‑3504',
      'Email: cooper.hoy3105@gmail.com',
      'LinkedIn: linkedin.com/in/cooperhoy',
    ],
    education: [
      'BA in Cybersecurity Engineering', 
      'Iowa State University',
      'Expected Graduation: May 2027',
    ],
    experience: [
      'IT Infrastructure Engineer',
      'IT Support Specialist',
      'Configured & deployed Windows Server 2025 in hypervisor',
      'Built AD‑clone testing sandbox for new products',
      'Developed hardening GPOs for security baseline',
    ],
    projects: [
      'W@v3 Encryption Library (Python)',
      'HelpLLama AI Help‑desk Chat‑bot',
      'SentinelAI Proxy (Node.js)',
      'BetterMap Scanner (React, Three.js)',
    ],
    skills: [
      'Python • AD • Exchange • PowerShell',
      'Windows • Linux • VMware • ServiceNow',
      'Cryptography • Storage • Troubleshooting',
    ],
    rickroll: [
      '♪ Never gonna give you up',
      '♪ Never gonna let you down',
      '♪ Never gonna run around and desert you',
    ],
    whoami: [
      'You are a curious person exploring my 3D portfolio terminal!',
    ],
    'sudo rm -rf /': [
      'Error: Permission denied.',
      'This portfolio is safe from wipes! 🌱',
    ],
  }

  // Clears to HEADER on 'clear', otherwise shows only command + its response
  function onCommand(cmd) {
    if (!cmd) return
    if (cmd === 'clear') {
      setOutput([HEADER])
      return
    }
    const key = cmd.toLowerCase()
    const resp = commands[key] || [`Unknown command: "${cmd}". Type "help".`]
    setOutput([`$ ${cmd}`, ...resp])
  }

  // Snap face‑on & lock OrbitControls
  function centerView() {
    const ctrl = controlsRef.current
    if (ctrl) {
      ctrl.reset()
      ctrl.enabled = false
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Center button */}
      <button
        onClick={centerView}
        style={{
          position: 'absolute',
          top: '16px', right: '16px', zIndex: 10,
          padding: '8px 12px', background: '#8B0000',
          color: '#FFF', border: 'none', borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Center
      </button>

      {/* External command bar */}
      <div style={{
        position: 'absolute',
        bottom: '20px', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <input
          placeholder="Type command and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCommand(e.target.value.trim())
              e.target.value = ''
            }
          }}
          style={{
            padding: '8px',
            fontSize: '14px',
            width: '400px',
            background: '#000',
            color: '#0F0',
            fontFamily: 'monospace',
            border: '1px solid #0F0',
          }}
        />
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <hemisphereLight
          skyColor="#222222" groundColor="#000000" intensity={0.1}
        />
        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Ground shadow */}
        <ContactShadows
          rotation-x={Math.PI / 2}
          position={[0, -2, 0]}
          opacity={0.4} width={10} height={10} blur={2}
        />

        {/* Monitor + terminal */}
        <MonitorWithTexture output={output} />

        {/* OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableRotate
          enableZoom
          enableDamping
          dampingFactor={0.1}
        />

        {/* Environment */}
        <Environment preset="studio" background={false} />
      </Canvas>
    </div>
  )
}
