// src/App.jsx
import { Analytics } from "@vercel/analytics/react"
import React, { useRef, useState, useEffect } from 'react'
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

function BootScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: '#000',
        color: '#0F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '24px',
        zIndex: 100,
      }}
    >
      Loading Coop‑OS...
    </div>
  )
}

const container = document.getElementById('root')
createRoot(container).render(<App />)

export default function App() {
  const controlsRef = useRef()
  const [booting, setBooting] = useState(true)
  const [output, setOutput] = useState([HEADER])
  const [isRetro, setRetro] = useState(false)
  const [flashEyes, setFlashEyes] = useState(false)
  const [isDestroyed, setDestroyed] = useState(false)

  // show boot screen for 2s
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 2000)
    return () => clearTimeout(t)
  }, [])

  const commands = {
    help: [
      'Commands available:',
      '  help        – this menu',
      '  about       – who I am',
      '  contact     – how to reach me',
      '  education   – my degree & graduation',
      '  experience  – professional highlights',
      '  projects    – what I’ve built',
      '  skills      – my skillset',
      '  clear       – reset terminal',
    ],
    about: [
      'Cooper Hoy',
      'Cybersecurity Engineering student.',
      'Iowa State University',
      'Based in Ames, Iowa',
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
      '---------------------',
      'Configured & deployed Windows Servers',
      'Built AD‑clone sandbox',
      'Developed hardening GPOs',
      'Automated Tasks via. Powershell',
      'DNS and Subnet Adjustments'
    ],
    projects: [
      'W@v3 Encryption Library (Python)',
      'HelpLLama AI Help‑desk Chat‑bot',
      'Roomba “Multi Function” Robot',
    ],
    skills: [
      'Python • AD • Exchange • PowerShell',
      'Windows • Linux • VMware • Intune',
      'Cryptography • GitHub • Troubleshooting',
    ],
    bob: ['You’ve summoned BOB…', '…and now you SEE him!'],
    rickroll: [
      '♪ Never gonna give you up',
      '♪ Never gonna let you down',
      '♪ Never gonna run around and desert you',
    ],
    whoami: [
      'You are a curious developer...', 
      'exploring my 3D portfolio terminal!',
    ],
    destroy: ['💥 Boom! The monitor is shattered!'],
    'sudo rm -rf /': [
      'Error: Permission denied. This portfolio is safe from wipes! 🌱',
    ],
  }

  function onCommand(cmd) {
    if (!cmd) return
    const key = cmd.toLowerCase()

    if (key === 'clear') {
      setBooting(false)
      setRetro(false)
      setDestroyed(false)
      setOutput([HEADER])
      return
    }
    if (key === 'retro') {
      const next = !isRetro
      setRetro(next)
      setOutput([`$ ${cmd}`, next ? 'Retro mode ON!' : 'Retro mode OFF!'])
      return
    }
    if (key === 'bob') {
      setFlashEyes(true)
      setTimeout(() => setFlashEyes(false), 2000)
      setOutput([`$ ${cmd}`, ...commands.bob])
      return
    }
    if (key === 'destroy') {
      setDestroyed(true)
      setOutput([`$ ${cmd}`, ...commands.destroy])
      return
    }

    const resp = commands[key] || [
      `Unknown command: "${cmd}". Type "help".`,
    ]
    setOutput([`$ ${cmd}`, ...resp])
  }

  function centerView() {
    const ctrl = controlsRef.current
    if (ctrl) {
      const prev = ctrl.enableDamping
      ctrl.enableDamping = false
      ctrl.reset()
      ctrl.update()
      ctrl.enableDamping = prev
    }
  }

  // If we’re still booting, show only the splash
  if (booting) {
    return <BootScreen />
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          background: isRetro
            ? 'linear-gradient(135deg, pink 0%, purple 100%)'
            : '#000',
          overflow: 'hidden',
          filter: isRetro
            ? 'contrast(200%) brightness(140%) saturate(200%) hue-rotate(-10deg) blur(0.8px)'
            : 'none',
        }}
      >
        {flashEyes && (
          <div className="flash-eyes">
            <img src="/eyes.png" alt="Scary eyes" />
          </div>
        )}

        <button
          onClick={centerView}
          style={{
            position: 'absolute',
            top: '16px', right: '16px', zIndex: 10,
            padding: '8px 12px', background: '#8B0000',
            color: '#FFF', border: 'none', borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Center
        </button>

        <div
          style={{
            position: 'absolute',
            bottom: '20px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 10,
          }}
        >
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
        >
          <ambientLight intensity={0.8} />
          <hemisphereLight
            skyColor="#222222" groundColor="#000000" intensity={0.1}
          />
          <directionalLight
            castShadow position={[5, 10, 5]} intensity={1}
          />
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -2, 0]}
            opacity={0.4} width={10} height={10} blur={2}
          />

          <MonitorWithTexture
            output={output}
            isRetro={isRetro}
            isDestroyed={isDestroyed}
          />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableRotate
            enableZoom
            enableDamping
            dampingFactor={0.1}
          />

          <Environment preset="studio" background={false} />
        </Canvas>
      </div>

      {/* Analytics must live outside of the <Canvas> */}
      <Analytics />
    </>
  )
}
