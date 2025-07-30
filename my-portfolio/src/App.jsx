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
    <div className="boot-screen">
      Loading Coop‑OS...
    </div>
  )
}

function App() {
  const controlsRef = useRef()
  const [booting, setBooting] = useState(true)
  const [isMobile, setMobile] = useState(false)
  const [output, setOutput] = useState([HEADER])
  const [isRetro, setRetro] = useState(false)
  const [flashEyes, setFlashEyes] = useState(false)
  const [isDestroyed, setDestroyed] = useState(false)

  // 1) Boot screen for 2s
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 2000)
    return () => clearTimeout(t)
  }, [])

  // 2) Detect mobile on mount & resize
  useEffect(() => {
    function onResize() {
      setMobile(window.innerWidth < 768)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 3) All your commands
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
      '  linkedin    – open LinkedIn profile',
    ],
    about: [
      'Cooper Hoy',
      'Cybersecurity Engineering student at Iowa State University',
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
      'IT Infrastructure Engineer @ ISU (2024–2025)',
      'IT Support Specialist (2023–2025)',
      'Configured & deployed Windows Servers',
      'Built AD‑clone sandbox',
      'Developed hardening GPOs',
    ],
    projects: [
      'W@v3 Encryption Software (Python)',
      'visit wav3.fit :)',
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
      'You are a curious developer exploring my 3D portfolio terminal!',
    ],
    destroy: ['💥 Boom! The monitor is shattered!'],
    linkedin: [
      'Opening LinkedIn…',
    ],
    'sudo rm -rf /': [
      'Error: Permission denied.',
      'This portfolio is safe from wipes! 🌱',
    ],
  }

  // 4) Handle commands
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
    if (key === 'linkedin') {
      window.open('https://linkedin.com/in/cooperhoy', '_blank')
      setOutput([`$ ${cmd}`, ...commands.linkedin])
      return
    }

    const resp = commands[key] || [
      `Unknown command: "${cmd}". Type "help".`,
    ]
    setOutput([`$ ${cmd}`, ...resp])
  }

  // 5) Center view (kill momentum)
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

  // 6) Render boot screen until done
  if (booting) {
    return <BootScreen />
  }

  // 7) Main UI
  return (
    <>
      <div className="app-container" style={{
        background: isRetro
          ? 'linear-gradient(135deg, pink 0%, purple 100%)'
          : '#000',
        filter: isRetro
          ? 'contrast(200%) brightness(140%) saturate(200%) hue-rotate(-10deg) blur(0.8px)'
          : 'none',
      }}>
        {flashEyes && (
          <div className="flash-eyes">
            <img src="/eyes.png" alt="Scary eyes" />
          </div>
        )}

        {/* Center button (desktop only) */}
        {!isMobile && (
          <button className="center-button" onClick={centerView}>
            Center
          </button>
        )}

        {/* 3D Canvas on desktop, 2D fallback on mobile */}
        {!isMobile ? (
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: false }}
            dpr={1}
          >
            <ambientLight intensity={0.8} />
            <hemisphereLight skyColor="#222" groundColor="#000" intensity={0.1} />
            <directionalLight castShadow position={[5, 10, 5]} intensity={1} />
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
        ) : (
          <div className="terminal-fallback">
            {output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed command bar at bottom */}
      <div className="command-bar">
        <input
          placeholder="Type command and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCommand(e.target.value.trim())
              e.target.value = ''
            }
          }}
        />
      </div>

      {/* Analytics */}
      <Analytics />
    </>
  )
}

const root = document.getElementById('root')
createRoot(root).render(<App />)
