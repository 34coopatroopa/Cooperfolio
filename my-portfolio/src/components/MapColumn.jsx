import { useRef, useEffect } from 'react'
import { NODE_POS } from '../data/stations'

const TRAM_PATH = "M 160,82 C 167,102 175,120 181,142 C 187,164 179,180 173,200 C 167,220 173,236 177,256 C 181,276 172,290 165,310 C 158,330 158,348 155,368 C 152,388 144,402 136,422 C 128,442 122,456 116,476 C 110,496 106,510 102,530"

const LABELS = [
  'FIRST Tech Challenge',
  'The Kit',
  'Side Projects',
  'Cambridge Investments',
  'ISU IT Solution Center',
  'Iowa State University',
  'Off the Trail',
]

const NODES = ['VI', 'V', 'IV', 'III', 'II', 'I', '🌿']

export default function MapColumn({ curSlide, onSelect, onBack, mapOpen }) {
  const tramRef    = useRef(null)
  const ringRef    = useRef(null)
  const ringAnimRef = useRef(null)
  const posRef     = useRef({ x: NODE_POS[0].x, y: NODE_POS[0].y })
  const rafRef     = useRef(null)

  function placeTram(x, y) {
    tramRef.current?.setAttribute('transform', `translate(${x.toFixed(2)},${y.toFixed(2)})`)
  }

  function moveTram(targetIdx) {
    const target = NODE_POS[targetIdx]
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    function step() {
      const p = posRef.current
      const dx = target.x - p.x
      const dy = target.y - p.y
      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        posRef.current = { x: target.x, y: target.y }
        placeTram(target.x, target.y)
        return
      }
      posRef.current = { x: p.x + dx * 0.1, y: p.y + dy * 0.1 }
      placeTram(posRef.current.x, posRef.current.y)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  function moveRing(idx) {
    const p = NODE_POS[idx]
    if (!ringRef.current) return
    ringRef.current.setAttribute('cx', p.x)
    ringRef.current.setAttribute('cy', p.y)
    if (ringAnimRef.current) {
      ringAnimRef.current.setAttribute('from', `0 ${p.x} ${p.y}`)
      ringAnimRef.current.setAttribute('to',   `360 ${p.x} ${p.y}`)
    }
  }

  useEffect(() => {
    moveTram(curSlide)
    moveRing(curSlide)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [curSlide]) // eslint-disable-line react-hooks/exhaustive-deps

  const elevLabels = [
    { y: 85,  t: "6,643'" },
    { y: 204, t: "5,540'" },
    { y: 262, t: "4,910'" },
    { y: 320, t: "3,840'" },
    { y: 377, t: "2,280'" },
    { y: 454, t: "1,460'" },
    { y: 527, t: "800'"   },
  ]

  const contours = [
    { rx: 130, ry: 60, stroke: '#c0d8a4', sw: .65, o: .4  },
    { rx: 108, ry: 50, stroke: '#aacca0', sw: .75, o: .45 },
    { rx: 88,  ry: 40, stroke: '#8ab870', sw: .85, o: .5  },
    { rx: 66,  ry: 30, stroke: '#6aa058', sw: .95, o: .55 },
    { rx: 46,  ry: 21, stroke: '#4a8040', sw: 1.05, o: .6 },
    { rx: 28,  ry: 13, stroke: '#306030', sw: 1.15, o: .65 },
    { rx: 13,  ry: 6,  stroke: '#1e4820', sw: 1.25, o: .7 },
  ]

  const towerLines = [
    [179,132,145], [175,192,204], [176,248,260],
    [162,302,315], [155,360,372], [120,468,480],
  ]

  const leftTreeYs  = [145,163,183,204,224,245,265,285,308,330,352,374,396,418,440,462,484,506]
  const rightTreeYs = [148,168,190,212,234,256,278,300,322,344,366,388,410,432,454,476,498,520]

  function TreeSymbol({ x, y, large }) {
    return (
      <g transform={`translate(${x},${y})`}>
        <polygon points={large ? '0,-9 7,5 -7,5' : '0,-8 6,4 -6,4'}/>
        <line x1="0" y1={large ? 5 : 4} x2="0" y2={large ? 10 : 9}/>
      </g>
    )
  }

  return (
    <div className={`map-col${mapOpen ? ' mob-open' : ''}`}>
      <div className="map-head">
        <button className="back-btn" onClick={onBack}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <polyline points="5,1 2,4 5,7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Back
        </button>
        <div className="map-title-wrap">
          <div className="map-title">Ascent Map</div>
          <div className="map-sub">Summit → Valley · 7 stations</div>
        </div>
      </div>

      <div className="topo-wrap">
        <svg id="topoSvg" viewBox="0 0 320 580" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="tF" cx="50%" cy="18%" r="52%">
              <stop offset="0%"   stopColor="#356828" stopOpacity=".22"/>
              <stop offset="60%"  stopColor="#4e8a3c" stopOpacity=".08"/>
              <stop offset="100%" stopColor="#a0cc84" stopOpacity=".02"/>
            </radialGradient>
          </defs>

          <rect width="320" height="580" fill="var(--paper)"/>

          {/* grid */}
          <g stroke="#c0d8a4" strokeWidth=".45" opacity=".5">
            {[82,164,246,328,410,492].map(y => <line key={y} x1="0" y1={y} x2="320" y2={y}/>)}
            {[80,160,240].map(x => <line key={x} x1={x} y1="0" x2={x} y2="580"/>)}
          </g>

          {/* contours */}
          {contours.map(({ rx, ry, stroke, sw, o }) => (
            <ellipse key={rx} cx="160" cy="82" rx={rx} ry={ry} stroke={stroke} strokeWidth={sw} opacity={o} fill="none"/>
          ))}
          <ellipse cx="160" cy="82" rx="5" ry="2.5" fill="#1e3318" opacity=".85"/>
          <ellipse cx="160" cy="82" rx="130" ry="60" fill="url(#tF)"/>

          {/* elevation labels */}
          <g fontFamily="'JetBrains Mono',monospace" fontSize="5.8" fill="#8aaa78" opacity=".6">
            {elevLabels.map(({ y, t }) => <text key={y} x="283" y={y}>{t}</text>)}
          </g>

          {/* tree symbols */}
          <g fill="none" stroke="#4e8a3c" strokeWidth="1" opacity=".45">
            {leftTreeYs.map((y, i)  => <TreeSymbol key={'L'+y} x={i%2===0?44:58}  y={y} large={i%2===0}/>)}
            {rightTreeYs.map((y, i) => <TreeSymbol key={'R'+y} x={i%2===0?258:272} y={y} large={i%2===0}/>)}
          </g>

          {/* tram path */}
          <path d={TRAM_PATH} fill="none" stroke="#356828" strokeWidth="2" strokeOpacity=".28"/>
          <path d={TRAM_PATH} fill="none" stroke="#4e8a3c" strokeWidth=".9" strokeOpacity=".55" strokeDasharray="5,4"/>

          {/* tower marks */}
          <g stroke="#356828" strokeWidth="1.2" opacity=".4">
            {towerLines.map(([x, y1, y2]) => <line key={x+'-'+y1} x1={x} y1={y1} x2={x} y2={y2}/>)}
          </g>

          {/* active ring */}
          <circle ref={ringRef} cx={NODE_POS[0].x} cy={NODE_POS[0].y} r="14"
            fill="none" stroke="#4e8a3c" strokeWidth="1.1" strokeOpacity=".4" strokeDasharray="3,3">
            <animateTransform ref={ringAnimRef} attributeName="transform" attributeType="XML" type="rotate"
              from={`0 ${NODE_POS[0].x} ${NODE_POS[0].y}`}
              to={`360 ${NODE_POS[0].x} ${NODE_POS[0].y}`}
              dur="12s" repeatCount="indefinite"/>
          </circle>

          {/* station nodes */}
          {NODE_POS.map((p, i) => (
            <g key={i} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.y} r="9"
                fill="var(--paper)"
                stroke={i === curSlide ? '#224618' : '#6aa058'}
                strokeWidth={i === curSlide ? 1.5 : 1}/>
              <text x={p.x} y={p.y + 3.5} textAnchor="middle"
                fontFamily="'Cormorant Garamond',serif"
                fontSize={i === 6 ? 9 : 8} fill="#224618" fontWeight="600">
                {NODES[i]}
              </text>
            </g>
          ))}

          {/* labels */}
          <g fontFamily="'JetBrains Mono',monospace" fontSize="6.8" fill="#506048">
            {NODE_POS.map((p, i) => (
              <text key={i} x={p.x + 13} y={p.y + 3}>{LABELS[i]}</text>
            ))}
          </g>

          {/* compass */}
          <g transform="translate(24,548)" fill="none" stroke="#8aaa78" strokeWidth=".9" opacity=".55">
            <line x1="0" y1="-12" x2="0" y2="12"/>
            <line x1="-12" y1="0" x2="12" y2="0"/>
            <polygon points="0,-12 3,-4 0,-8 -3,-4" fill="#4e8a3c" stroke="none"/>
            <text x="0" y="-15" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="6" fill="#4e8a3c" stroke="none">N</text>
          </g>

          {/* scale */}
          <g transform="translate(196,560)" stroke="#8aaa78" strokeWidth=".8" fill="none" opacity=".5">
            <line x1="0" y1="0" x2="64" y2="0"/>
            <line x1="0" y1="-3" x2="0" y2="3"/>
            <line x1="64" y1="-3" x2="64" y2="3"/>
            <text x="32" y="-6" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="6" fill="#8aaa78">0.5 mi</text>
          </g>

          {/* tram car */}
          <g ref={tramRef} transform={`translate(${NODE_POS[0].x},${NODE_POS[0].y})`}>
            <ellipse cx="1" cy="17" rx="10" ry="3" fill="rgba(22,42,18,.16)"/>
            <line x1="-7" y1="-14" x2="-10" y2="-8" stroke="#224618" strokeWidth=".9" opacity=".65"/>
            <line x1="7"  y1="-14" x2="10"  y2="-8" stroke="#224618" strokeWidth=".9" opacity=".65"/>
            <circle cx="0" cy="-17" r="3.5" fill="none" stroke="#224618" strokeWidth="1.2"/>
            <circle cx="0" cy="-17" r="1.2" fill="#224618"/>
            <line x1="0" y1="-13" x2="0" y2="-9" stroke="#356828" strokeWidth="1.4"/>
            <path d="M -11,-9 Q -12,0 -11,8 L 11,8 Q 12,0 11,-9 Z" fill="#f3ede0" stroke="#224618" strokeWidth="1.3"/>
            <path d="M -11,-9 Q 0,-15 11,-9" fill="#d4e8c0" stroke="#224618" strokeWidth="1"/>
            <rect x="-8"   y="-5" width="4.5" height="5" rx="1" fill="rgba(53,104,40,.12)" stroke="#356828" strokeWidth=".8"/>
            <rect x="-2"   y="-5" width="4"   height="5" rx="1" fill="rgba(53,104,40,.12)" stroke="#356828" strokeWidth=".8"/>
            <rect x="3.5"  y="-5" width="4.5" height="5" rx="1" fill="rgba(53,104,40,.12)" stroke="#356828" strokeWidth=".8"/>
            <line x1="-11" y1="8" x2="11" y2="8" stroke="#224618" strokeWidth=".8" opacity=".4"/>
          </g>

          {/* border */}
          <rect x="1" y="1" width="318" height="578" fill="none" stroke="#b8d89a" strokeWidth="1" opacity=".35"/>
          <g stroke="#8aaa78" strokeWidth=".8" opacity=".4">
            <polyline points="1,1 13,1 13,13"/>
            <polyline points="307,1 319,1 319,13"/>
            <polyline points="1,567 1,579 13,579"/>
            <polyline points="319,567 319,579 307,579"/>
          </g>
        </svg>
      </div>

      <div className="map-foot">
        <a href="mailto:cjhoy@iastate.edu" className="clink"><span className="ck">mail</span><span className="cv">cjhoy@iastate.edu</span></a>
        <a href="tel:+13192403504" className="clink"><span className="ck">tel</span><span className="cv">319.240.3504</span></a>
        <a href="https://linkedin.com/in/cooperhoy" target="_blank" rel="noreferrer" className="clink"><span className="ck">in</span><span className="cv">linkedin.com/in/cooperhoy</span></a>
        <a href="https://github.com/34coopatroopa" target="_blank" rel="noreferrer" className="clink"><span className="ck">gh</span><span className="cv">34coopatroopa</span></a>
      </div>
    </div>
  )
}
