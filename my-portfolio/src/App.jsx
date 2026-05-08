import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import LandingScreen from './components/LandingScreen'
import MainLayout from './components/MainLayout'
import './index.css'

export default function App() {
  const [mainActive, setMainActive] = useState(false)
  const [landingOut, setLandingOut] = useState(false)

  function handleEnter() {
    setLandingOut(true)
    setTimeout(() => setMainActive(true), 120)
  }

  function handleBack() {
    setLandingOut(false)
    setMainActive(false)
  }

  return (
    <div className="screens">
      <LandingScreen onEnter={handleEnter} out={landingOut} />
      <MainLayout onBack={handleBack} active={mainActive} />
      <Analytics />
    </div>
  )
}
