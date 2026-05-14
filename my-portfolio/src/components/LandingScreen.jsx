export default function LandingScreen({ onEnter, out }) {
  return (
    <div className={`landing${out ? ' out' : ''}`} id="landing">
      <div className="hero">
        <img src="/photos/Me_Personally.jpeg" alt="Cooper Hoy" />
        <div className="hero-overlay" />
        <svg className="hero-trees" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax meet" fill="none">
          <g fill="#162a12" opacity=".5">
            <polygon points="0,200 22,132 44,200"/><polygon points="10,200 28,112 46,200"/>
            <polygon points="64,200 86,138 108,200"/><polygon points="74,200 92,118 110,200"/>
            <polygon points="130,200 152,134 174,200"/><polygon points="140,200 158,116 176,200"/>
            <polygon points="194,200 216,130 238,200"/><polygon points="204,200 222,112 240,200"/>
            <polygon points="258,200 280,136 302,200"/><polygon points="268,200 286,118 304,200"/>
            <polygon points="322,200 344,128 366,200"/><polygon points="332,200 350,112 368,200"/>
            <polygon points="386,200 408,134 430,200"/><polygon points="396,200 414,116 432,200"/>
            <polygon points="450,200 472,130 494,200"/><polygon points="460,200 478,114 496,200"/>
            <polygon points="514,200 536,136 558,200"/><polygon points="524,200 542,118 560,200"/>
            <polygon points="578,200 600,128 622,200"/><polygon points="588,200 606,112 624,200"/>
            <polygon points="642,200 664,134 686,200"/><polygon points="652,200 670,116 688,200"/>
            <polygon points="706,200 728,130 750,200"/><polygon points="716,200 734,114 752,200"/>
            <polygon points="770,200 792,136 814,200"/><polygon points="780,200 798,118 816,200"/>
            <polygon points="834,200 856,128 878,200"/><polygon points="844,200 862,112 880,200"/>
            <polygon points="898,200 920,134 942,200"/><polygon points="908,200 926,116 944,200"/>
            <polygon points="962,200 984,130 1006,200"/><polygon points="972,200 990,114 1008,200"/>
            <polygon points="1026,200 1048,136 1070,200"/><polygon points="1036,200 1054,118 1072,200"/>
            <polygon points="1090,200 1112,128 1134,200"/><polygon points="1100,200 1118,112 1136,200"/>
            <polygon points="1154,200 1176,134 1198,200"/><polygon points="1164,200 1182,116 1200,172 1200,200"/>
          </g>
        </svg>
        <div className="hero-name">
          <h1>Cooper <em>Hoy</em></h1>
          <div className="tag">Cyber Security Engineering · Ames, Iowa</div>
        </div>
        <div className="enter-zone">
          <button className="enter-btn" onClick={onEnter}>
            <div className="ring">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polyline points="4,8 10,14 16,8" stroke="rgba(192,222,160,.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="enter-label">Enter the descent</span>
          </button>
        </div>
      </div>
      <div className="land-foot">
        <span className="foot-meta">An illustrated curriculum vitæ</span>
        <span className="foot-meta">Plate I · 2025</span>
      </div>
    </div>
  )
}
