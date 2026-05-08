import { useState } from 'react'
import MapColumn from './MapColumn'
import ContentColumn from './ContentColumn'

export default function MainLayout({ onBack, active }) {
  const [curSlide, setCurSlide] = useState(0)
  const [mapOpen, setMapOpen] = useState(false)

  function handleSelect(idx) {
    setCurSlide(idx)
    setMapOpen(false)
  }

  return (
    <div className={`main${active ? ' in' : ''}`}>
      <MapColumn
        curSlide={curSlide}
        onSelect={handleSelect}
        onBack={onBack}
        mapOpen={mapOpen}
      />

      <ContentColumn
        curSlide={curSlide}
        onSlideChange={setCurSlide}
      />

      <button className="mobile-map-btn" onClick={() => setMapOpen(o => !o)} aria-label="Toggle map">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2,4 L6,2 L12,6 L16,4 L16,14 L12,16 L6,12 L2,14 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
          <line x1="6" y1="2" x2="6" y2="12" stroke="currentColor" strokeWidth="1"/>
          <line x1="12" y1="6" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </button>
    </div>
  )
}
