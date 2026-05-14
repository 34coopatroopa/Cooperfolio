/* eslint-disable react-refresh/only-export-components */
function IllustrationVI() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <line x1="20" y1="105" x2="260" y2="105" stroke="#c0d8a4" strokeWidth="1"/>
        <g style={{animation:'float 3s ease-in-out infinite'}}>
          <circle cx="80" cy="45" r="12" fill="none" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="57" x2="80" y2="85" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="65" x2="62" y2="78" stroke="#356828" strokeWidth="1.5" style={{transformOrigin:'80px 65px',animation:'wave 1.8s ease-in-out infinite'}}/>
          <line x1="80" y1="65" x2="98" y2="75" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="85" x2="68" y2="105" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="85" x2="92" y2="105" stroke="#356828" strokeWidth="1.5"/>
          <text x="80" y="125" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">Mentor</text>
        </g>
        <g opacity=".6" style={{animation:'pulse 2s ease-in-out infinite'}}>
          <line x1="115" y1="68" x2="145" y2="68" stroke="#a0cc84" strokeWidth="1.5"/>
          <polyline points="140,63 147,68 140,73" stroke="#a0cc84" strokeWidth="1.5" fill="none"/>
        </g>
        <g style={{animation:'float 3s ease-in-out .5s infinite'}}>
          <rect x="158" y="34" width="28" height="24" rx="3" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <rect x="165" y="38" width="6" height="6" rx="1" fill="#4e8a3c" opacity=".4" style={{animation:'blink 1.2s step-end infinite'}}/>
          <rect x="175" y="38" width="6" height="6" rx="1" fill="#4e8a3c" opacity=".4" style={{animation:'blink 1.2s step-end .4s infinite'}}/>
          <rect x="161" y="58" width="36" height="20" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="172" y1="58" x2="172" y2="78" stroke="#4e8a3c" strokeWidth=".8" opacity=".4"/>
          <line x1="183" y1="58" x2="183" y2="78" stroke="#4e8a3c" strokeWidth=".8" opacity=".4"/>
          <line x1="150" y1="65" x2="161" y2="68" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="197" y1="65" x2="208" y2="62" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="172" y1="78" x2="168" y2="105" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="186" y1="78" x2="190" y2="105" stroke="#4e8a3c" strokeWidth="1.5"/>
          <text x="179" y="125" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">Robot</text>
        </g>
        <g style={{animation:'glow 2s ease-in-out infinite'}}>
          <circle cx="128" cy="40" r="2" fill="#a0cc84"/>
          <circle cx="135" cy="52" r="1.5" fill="#a0cc84"/>
          <circle cx="122" cy="55" r="1.5" fill="#a0cc84"/>
        </g>
      </svg>
    </div>
  )
}

function IllustrationV() {
  return (
    <div className="fig-box" style={{background:'linear-gradient(135deg,#1a3214 0%,#243c1c 100%)'}}>
      <svg viewBox="0 0 280 120" fill="none">
        <rect x="20" y="10" width="240" height="100" rx="4" fill="#0d1a0a" stroke="#4e8a3c" strokeWidth="1"/>
        <rect x="20" y="10" width="240" height="18" rx="4" fill="#1a3214"/>
        <circle cx="34" cy="19" r="4" fill="#a0cc84" opacity=".6"/>
        <circle cx="48" cy="19" r="4" fill="#6aa058" opacity=".5"/>
        <circle cx="62" cy="19" r="4" fill="#356828" opacity=".45"/>
        <text x="32" y="42" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#a0cc84">$ python exploit.py</text>
        <text x="32" y="56" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#6aa058">[+] scanning targets...</text>
        <text x="32" y="70" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#4e8a3c">[✓] AD enumerated</text>
        <text x="32" y="84" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#a0cc84">$ git commit -m "hardened"</text>
        <rect x="32" y="92" width="6" height="10" fill="#a0cc84" style={{animation:'blink 1s step-end infinite'}}/>
      </svg>
    </div>
  )
}

function IllustrationIV() {
  const cards = [
    { x: 20,  name: 'Nerd Market', delay: 0 },
    { x: 104, name: 'Outpost',     delay: .8 },
    { x: 188, name: 'HelpLlama',   delay: 1.6 },
  ]
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        {cards.map(({ x, name, delay }) => (
          <g key={name} style={{ animation: `float 3s ease-in-out ${delay}s infinite` }}>
            <rect x={x} y="22" width="72" height="72" rx="4" fill="var(--mist)" stroke="#4e8a3c" strokeWidth="1.2"/>
            <rect x={x+8} y="30" width="56" height="8" rx="2" fill="#a0cc84" opacity=".5"/>
            <rect x={x+8} y="44" width="40" height="4" rx="1" fill="#c0d8a4" opacity=".4"/>
            <rect x={x+8} y="52" width="50" height="4" rx="1" fill="#c0d8a4" opacity=".3"/>
            <rect x={x+8} y="60" width="34" height="4" rx="1" fill="#c0d8a4" opacity=".3"/>
            <text x={x+36} y="106" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">{name}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function IllustrationIII() {
  const racks = [26, 36, 46, 56, 66]
  const blinkTimes = [1, 1.4, 1.2, 1.8, 1]
  const blinkDelays = [0, .3, .6, .9, .2]
  const adNodes = [{ y: 26, t: 'AD' }, { y: 52, t: 'Exchange' }, { y: 78, t: 'GPO' }]
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <rect x="22" y="20" width="36" height="70" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
        {racks.map((y, i) => (
          <g key={y}>
            <rect x="26" y={y} width="28" height="6" rx="1" fill="var(--mist)" stroke="#4e8a3c" strokeWidth=".8"/>
            <circle cx="50" cy={y+3} r="2" fill="#a0cc84" style={{ animation: `blink ${blinkTimes[i]}s ease-in-out ${blinkDelays[i]}s infinite` }}/>
          </g>
        ))}
        <rect x="116" y="50" width="48" height="24" rx="3" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
        {[128, 140, 152].map((cx, i) => (
          <circle key={cx} cx={cx} cy="62" r="2" fill="#a0cc84" style={{ animation: `pulse 1.5s ease-in-out ${i*.3}s infinite` }}/>
        ))}
        <line x1="58" y1="55" x2="116" y2="62" stroke="#a0cc84" strokeWidth=".9" strokeDasharray="4,3" style={{ animation: 'dash 2s linear infinite' }}/>
        {adNodes.map(({ y, t }, i) => (
          <g key={t}>
            <rect x="198" y={y} width="60" height="18" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
            <text x="228" y={y+12} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">{t}</text>
            <line x1="164" y1={60+i*2} x2="198" y2={y+9} stroke="#a0cc84" strokeWidth=".9" strokeDasharray="4,3" style={{ animation: `dash ${2+i*.3}s linear ${i*.4}s infinite` }}/>
          </g>
        ))}
      </svg>
    </div>
  )
}

function IllustrationII() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <g style={{ animation: 'float 3s ease-in-out infinite' }}>
          <path d="M 90,30 A 35,35 0 0,1 160,30" stroke="#4e8a3c" strokeWidth="2" fill="none"/>
          <rect x="78"  y="30" width="14" height="22" rx="4" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <rect x="160" y="30" width="14" height="22" rx="4" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <circle cx="125" cy="68" r="14" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <circle cx="125" cy="64" r="4"  fill="#4e8a3c" opacity=".5"/>
          <circle cx="125" cy="68" r="20" fill="none" stroke="#a0cc84" strokeWidth=".8" opacity=".5" style={{ animation: 'ripple 2s ease-out infinite' }}/>
          <circle cx="125" cy="68" r="28" fill="none" stroke="#a0cc84" strokeWidth=".5" opacity=".3" style={{ animation: 'ripple 2s ease-out .5s infinite' }}/>
        </g>
        {[{ y: 18, w: 32 }, { y: 34, w: 44 }, { y: 50, w: 28 }, { y: 66, w: 40 }].map(({ y, w }) => (
          <g key={y}>
            <rect x="190" y={y} width="68" height="12" rx="2" fill="var(--mist)" stroke="#4e8a3c" strokeWidth=".9"/>
            <rect x="195" y={y+3} width={w} height="4" rx="1" fill="#a0cc84" opacity=".5"/>
          </g>
        ))}
        <text x="224" y="90" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">ticket queue</text>
      </svg>
    </div>
  )
}

function IllustrationI() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <rect x="60"  y="40" width="100" height="65" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
        <rect x="75"  y="45" width="20"  height="20" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="103" y="45" width="20"  height="20" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="131" y="45" width="20"  height="20" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="75"  y="72" width="20"  height="33" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="131" y="72" width="20"  height="33" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="100" y="78" width="20"  height="27" rx="10" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="98"  y="18" width="24"  height="22" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
        <polygon points="98,18 110,6 122,18" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
        <g style={{ animation: 'float 3s ease-in-out infinite' }}>
          <rect x="188" y="36" width="48" height="5" rx="1" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
          <polygon points="212,22 236,36 212,36 188,36" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
          <line x1="236" y1="36" x2="240" y2="52" stroke="#4e8a3c" strokeWidth="1.2"/>
          <circle cx="240" cy="54" r="3" fill="#a0cc84"/>
        </g>
        <g style={{ animation: 'float 3s ease-in-out .8s infinite' }}>
          <rect x="185" y="62" width="52" height="36" rx="2" fill="none" stroke="#6aa058" strokeWidth="1"/>
          <line x1="193" y1="70" x2="229" y2="70" stroke="#a0cc84" strokeWidth=".8"/>
          <line x1="193" y1="78" x2="220" y2="78" stroke="#a0cc84" strokeWidth=".8"/>
          <line x1="193" y1="86" x2="215" y2="86" stroke="#a0cc84" strokeWidth=".8"/>
          <circle cx="211" cy="88" r="6" fill="none" stroke="#6aa058" strokeWidth=".8"/>
          <text x="211" y="91" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="5" fill="#4e8a3c">ISU</text>
        </g>
      </svg>
    </div>
  )
}

function IllustrationHomelab() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <rect x="18" y="18" width="52" height="76" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
        {[28, 41, 54, 67, 80].map((y, i) => (
          <g key={y}>
            <rect x="24" y={y} width="40" height="9" rx="1" fill="var(--mist)" stroke="#4e8a3c" strokeWidth=".8"/>
            <circle cx="60" cy={y+4.5} r="2" fill="#a0cc84" style={{ animation: `blink ${1+i*.2}s ease-in-out ${i*.25}s infinite` }}/>
          </g>
        ))}
        <text x="44" y="106" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">NAS</text>
        <line x1="70" y1="56" x2="108" y2="42" stroke="#a0cc84" strokeWidth=".9" strokeDasharray="4,3" style={{ animation: 'dash 2s linear infinite' }}/>
        <line x1="70" y1="56" x2="108" y2="70" stroke="#a0cc84" strokeWidth=".9" strokeDasharray="4,3" style={{ animation: 'dash 2s linear .5s infinite' }}/>
        <rect x="108" y="30" width="56" height="26" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
        <circle cx="126" cy="43" r="7" fill="none" stroke="#4e8a3c" strokeWidth=".8"/>
        <circle cx="126" cy="43" r="2.5" fill="#a0cc84" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}/>
        <text x="148" y="47" fontFamily="'JetBrains Mono',monospace" fontSize="6.5" fill="#6aa058">Pi-hole</text>
        <rect x="108" y="62" width="56" height="28" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
        <rect x="116" y="68" width="10" height="8" rx="1" fill="var(--mist)" stroke="#4e8a3c" strokeWidth=".7"/>
        <rect x="130" y="68" width="10" height="8" rx="1" fill="var(--mist)" stroke="#4e8a3c" strokeWidth=".7"/>
        <circle cx="152" cy="76" r="3" fill="none" stroke="#4e8a3c" strokeWidth=".8"/>
        <text x="136" y="86" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="6.5" fill="#6aa058">RPi 5</text>
        <line x1="164" y1="43" x2="200" y2="48" stroke="#a0cc84" strokeWidth=".9" strokeDasharray="4,3" style={{ animation: 'dash 2s linear 1s infinite' }}/>
        <rect x="200" y="34" width="62" height="56" rx="2" fill="none" stroke="#6aa058" strokeWidth="1"/>
        <text x="231" y="54" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">Ollama</text>
        <rect x="210" y="59" width="42" height="4" rx="1" fill="#a0cc84" opacity=".45" style={{ animation: 'pulse 2s ease-in-out infinite' }}/>
        <rect x="210" y="67" width="34" height="4" rx="1" fill="#a0cc84" opacity=".35" style={{ animation: 'pulse 2s ease-in-out .5s infinite' }}/>
        <rect x="210" y="75" width="38" height="4" rx="1" fill="#a0cc84" opacity=".4" style={{ animation: 'pulse 2s ease-in-out 1s infinite' }}/>
        <text x="231" y="99" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="6" fill="#6aa058" opacity=".7">local LLM</text>
      </svg>
    </div>
  )
}

function IllustrationHobby({ photos }) {
  const rows = [photos.slice(0, 3), photos.slice(3, 6), photos.slice(6, 9)]
  return (
    <div className="photo-gallery">
      {rows.map((row, ri) => (
        <div key={ri} className="photo-row">
          {row.map(p => (
            <div key={p.src} className="photo-cell">
              <img src={p.src} alt={p.label}/>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const ILLUSTRATIONS = [
  IllustrationVI,
  IllustrationV,
  IllustrationIV,
  IllustrationIII,
  IllustrationII,
  IllustrationI,
  IllustrationHomelab,
  IllustrationHobby,
]
