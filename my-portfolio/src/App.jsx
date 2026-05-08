import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import LandingScreen from './components/LandingScreen'
import MainLayout from './components/MainLayout'
import './index.css'

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [landingOut, setLandingOut] = useState(false)

  function handleEnter() {
    setLandingOut(true)
    setTimeout(() => setShowLanding(false), 600)
  }

  function handleBack() {
    setShowLanding(true)
    setLandingOut(false)
  }

  return (
    <>
      {showLanding && <LandingScreen onEnter={handleEnter} out={landingOut} />}
      {!showLanding && <MainLayout onBack={handleBack} />}
      <Analytics />
    </>
  )
}
