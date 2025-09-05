import React from "react";

type Props = {
  env?: any;
  screen?: any;
};

const HeroViz: React.FC<Props> = ({ env, screen }) => {
  const os = env?.uaData?.platform ?? env?.platform ?? "—";
  const browser = (env?.ua || "").match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/g)?.[0] ?? "—";
  const device =
    env?.uaData?.mobile ? "Mobile" :
    /iPhone|iPad|Android/i.test(env?.ua||"") ? "Mobile" :
    "Desktop";

  return (
    <div className="hero-viz">
      <div className="hero-scan" />
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        <div className="hero-icon">
          {/* simple inline SVG “device” */}
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <rect x="5" y="2.5" width="14" height="19" rx="2.5" stroke="#27e38a" fill="none"/>
            <rect x="7.5" y="5.5" width="9" height="12" rx="1.5" fill="#0b1816" stroke="#1a5c4c"/>
            <circle cx="12" cy="19" r="1" fill="#27e38a"/>
          </svg>
        </div>
        <div style={{ fontWeight:700 }}>Ваше окружение</div>
      </div>

      <div className="hero-kv">
        <div className="dim">Устройство</div><div>{device}</div>
        <div className="dim">Браузер</div><div>{browser}</div>
        <div className="dim">OS</div><div>{os}</div>
        <div className="dim">Языки</div><div>{env?.languages?.join(", ") || "—"}</div>
        <div className="dim">Timezone</div><div>{env?.timezone || "—"}</div>
        <div className="dim">DPR</div><div>{screen?.dpr ?? "—"}</div>
        <div className="dim">Screen</div><div>{screen?.screen ?? "—"}</div>
        <div className="dim">Inner</div><div>{screen?.inner ?? "—"}</div>
      </div>
    </div>
  );
};

export default HeroViz;
