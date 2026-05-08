import { useState, useEffect } from 'react'
import Slide from './Slide'
import { STATIONS } from '../data/stations'

const LABELS = [
  'FIRST Tech Challenge',
  'The Kit',
  'Side Projects',
  'Cambridge Investments',
  'ISU IT Solution Center',
  'Iowa State University',
  'Off the Trail',
]

export default function ContentColumn({ curSlide, onSlideChange }) {
  const [leavingSlide, setLeavingSlide] = useState(null)

  function goTo(idx) {
    if (idx === curSlide) return
    setLeavingSlide(curSlide)
    onSlideChange(idx)
    setTimeout(() => setLeavingSlide(null), 320)
  }

  function goHigher() {
    if (curSlide > 0) goTo(curSlide - 1)
  }

  function goLower() {
    if (curSlide < STATIONS.length - 1) goTo(curSlide + 1)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowUp')   { e.preventDefault(); goHigher() }
      if (e.key === 'ArrowDown') { e.preventDefault(); goLower() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [curSlide])

  return (
    <div className="content-col">
      <div className="slide-window">
        {STATIONS.map((station, i) => (
          <Slide
            key={i}
            station={station}
            isActive={i === curSlide}
            isLeaving={i === leavingSlide}
          />
        ))}
      </div>

      <nav className="content-nav">
        <button className="nav-btn" onClick={goHigher} disabled={curSlide === 0}
          aria-label="Higher elevation">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <polyline points="3,9 7,5 11,9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Higher</span>
        </button>

        <div className="ndots">
          {STATIONS.map((_, i) => (
            <button key={i} className={`ndot${i === curSlide ? ' active' : ''}`}
              onClick={() => goTo(i)} aria-label={`Station ${i + 1}`}/>
          ))}
        </div>

        <button className="nav-btn" onClick={goLower} disabled={curSlide === STATIONS.length - 1}
          aria-label="Lower elevation">
          <span>Lower</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <polyline points="3,5 7,9 11,5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </nav>
    </div>
  )
}
