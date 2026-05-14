import { useState, useEffect } from 'react'
import { ILLUSTRATIONS } from '../illustrations'

const PinIcon = () => (
  <svg className="sh-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6,11 C6,11 1,8 1,4.5 C1,2.5 3.2,1 6,1 C8.8,1 11,2.5 11,4.5 C11,8 6,11 6,11Z" stroke="#4e8a3c" strokeWidth=".9"/>
    <line x1="6" y1="11" x2="6" y2="4" stroke="#4e8a3c" strokeWidth=".7"/>
  </svg>
)

function HighlightCell({ k, v, vEm, vSuffix }) {
  return (
    <div className="sl-hl">
      <div className="hl-k">{k}</div>
      <div className="hl-v">
        {v}{vEm ? <em>{vEm}</em> : null}{vSuffix}
      </div>
    </div>
  )
}

export default function Slide({ station, isActive, isLeaving }) {
  const photos = station.photos || []
  const [bgIdx, setBgIdx] = useState(0)

  useEffect(() => {
    if (!isActive || photos.length === 0) return
    const t = setInterval(() => setBgIdx(i => (i + 1) % photos.length), 5500)
    return () => clearInterval(t)
  }, [isActive, photos.length])

  const baseCls = ['slide', isActive ? 'active' : '', isLeaving ? 'leaving' : ''].filter(Boolean)

  if (station.idx === 7) {
    return (
      <div className={[...baseCls, 'contact'].join(' ')} data-i={station.idx}>
        <div className="cs-bg">
          {photos.map((p, i) => (
            <div
              key={p.src}
              className={`cs-bg-img${i === bgIdx ? ' on' : ''}`}
              style={{ backgroundImage: `url(${p.src})` }}
            />
          ))}
        </div>
        <div className="cs-overlay" />
        <div className="cs-body">
          <div className="cs-quote-wrap">
            <p className="cs-quote">"If we were meant to stay in one place, we would have roots instead of feet"</p>
            <p className="cs-attr">— Rachel Wolchin</p>
          </div>
          <div className="cs-contact">
            <a href="mailto:cjhoy@iastate.edu" className="cs-link">
              <span className="cs-k">mail</span><span className="cs-v">cjhoy@iastate.edu</span>
            </a>
            <a href="tel:+13192403504" className="cs-link">
              <span className="cs-k">tel</span><span className="cs-v">319.240.3504</span>
            </a>
            <a href="https://linkedin.com/in/cooperhoy" target="_blank" rel="noreferrer" className="cs-link">
              <span className="cs-k">in</span><span className="cs-v">linkedin.com/in/cooperhoy</span>
            </a>
            <a href="https://github.com/34coopatroopa" target="_blank" rel="noreferrer" className="cs-link">
              <span className="cs-k">gh</span><span className="cs-v">34coopatroopa</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  const Illustration = ILLUSTRATIONS[station.idx]
  const cls = baseCls.join(' ')

  return (
    <div className={cls} data-i={station.idx}>
      <div className="wm">{station.node}</div>
      <div className="sl-badge">
        <span className="sl-num">{station.stationLabel}</span>
        <span className="sl-elev">{station.elev}</span>
      </div>
      <div className="sl-title">{station.title} <em>{station.titleEm}</em></div>
      <div className="sl-sub">{station.sub}</div>
      {station.desc && <p className="sl-desc">{station.desc}</p>}

      <Illustration />

      {station.highlights && (
        <>
          <div className="sl-grid">
            {station.highlights.map(h => <HighlightCell key={h.k} {...h} />)}
          </div>
          <div className="sh">
            <span className="sh-text">{station.sectionHead}</span>
            <div className="sh-line" />
            <PinIcon />
          </div>
          <ul className="sl-moments">
            {station.moments.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
          <div className="sl-tags">
            {station.tags.map(t => <span key={t} className="sl-tag">{t}</span>)}
          </div>
        </>
      )}

      {station.skillGroups && (
        <div className="sl-skills">
          {station.skillGroups.map(g => (
            <div key={g.h}>
              <div className="sg-h">{g.h}</div>
              <div className="sg-tags">
                {g.tags.map(t => <span key={t} className="sg-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {station.projects && (
        <div className="sl-projects">
          {station.projects.map(p => (
            <div key={p.t} className="sl-proj">
              <div className="proj-hd">
                <span className="proj-t">{p.t}</span>
                <span className="proj-st">{p.st}</span>
              </div>
              <div className="proj-d">{p.d}</div>
              <div className="proj-stack">
                {p.stack.map(s => <span key={s} className="ptag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {station.hobbyCards && (
        <>
          <div className="hobby-cards">
            {station.hobbyCards.map(c => (
              <div key={c.t} className="hc">
                <div className="hc-icon">{c.icon}</div>
                <div className="hc-t">{c.t}</div>
                <div className="hc-d">{c.d}</div>
              </div>
            ))}
          </div>
          <div className="sl-tags">
            {station.tags.map(t => <span key={t} className="sl-tag">{t}</span>)}
          </div>
        </>
      )}
    </div>
  )
}
