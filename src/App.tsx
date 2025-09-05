import React, { useEffect, useMemo, useState } from "react";
import Card from "./components/Card";
import { collectEnv } from "./collect/env";
import { collectScreen } from "./collect/screen";
import { collectStorage } from "./collect/storage";
import { collectWebGL } from "./collect/webgl";
import { runCanvas } from "./collect/canvas";
import { runRTC } from "./collect/rtc";
import { collectPerms } from "./collect/perms";
import "./styles.css";

/* ---------- Small inline components ---------- */

const Logo: React.FC = () => (
  <div className="logo-badge" aria-hidden>
    {/* minimal shield with F mark */}
    <svg width="22" height="22" viewBox="0 0 24 24" role="img" aria-label="FingerCloak logo">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#25e089" />
          <stop offset="100%" stopColor="#17b46a" />
        </linearGradient>
      </defs>
      <path d="M12 2.5c3.6 1.5 6.3 1 9.5 0v7.8c0 5.1-3.9 8.9-9.5 11.2C6.4 19.2 2.5 15.4 2.5 10.3V2.5c3.2 1 5.9 1.5 9.5 0Z" fill="url(#g)" opacity="0.18" />
      <path d="M7.5 8.2h6.5M7.5 12.2h4" stroke="#25e089" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </div>
);

const HeroViz: React.FC<{ env?: any; screen?: any }> = ({ env, screen }) => {
  const os = env?.uaData?.platform ?? env?.platform ?? "—";
  const browser =
    (env?.ua || "").match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/g)?.[0] ??
    (env?.ua || "").match(/(Chromium)\/[\d.]+/g)?.[0] ??
    "—";
  const device =
    env?.uaData?.mobile ? "Mobile" :
    /iPhone|iPad|Android/i.test(env?.ua || "") ? "Mobile" : "Desktop";

  return (
    <div className="hero-viz" aria-label="Ваше окружение">
      <div className="hero-scan" />
      <div className="hero-header">
        <div className="hero-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <rect x="5" y="2.5" width="14" height="19" rx="2.5" stroke="#25e089" fill="none"/>
            <rect x="7.7" y="5.6" width="8.6" height="11.8" rx="1.4" fill="#0b1a17" stroke="#1a5c4c"/>
            <circle cx="12" cy="19" r="1" fill="#25e089"/>
          </svg>
        </div>
        <div>Ваше окружение</div>
      </div>
      <div className="hero-grid">
        <div className="dim">Устройство</div><div style={{fontWeight:700}}>{device}</div>
        <div className="dim">Браузер</div><div>{browser}</div>

        <div className="dim">OS</div><div style={{fontWeight:700}}>{os}</div>
        <div className="dim">Языки</div><div>{env?.languages?.join(", ") || "—"}</div>

        <div className="dim">Timezone</div><div style={{fontWeight:700}}>{env?.timezone || "—"}</div>
        <div className="dim">DPR</div><div>{screen?.dpr ?? "—"}</div>

        <div className="dim">Screen</div><div>{screen?.screen ?? "—"}</div>
        <div className="dim">Inner</div><div>{screen?.inner ?? "—"}</div>
      </div>
    </div>
  );
};

/* ---------- App ---------- */

type State = {
  env?: any; screen?: any; storage?: any; webgl?: any; canvas?: any; rtc?: any; perms?: any; api?: any;
};

export default function App() {
  const [state, setState] = useState<State>({});
  const [apiPill, setApiPill] = useState<"warn"|"ok"|"bad">("warn");
  const [showDiag, setShowDiag] = useState(false);
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    (async () => {
      const env = await collectEnv();
      const screen = await collectScreen();
      const storage = await collectStorage();
      const webgl = collectWebGL();
      const perms = await collectPerms();
      setState(s => ({ ...s, env, screen, storage, webgl, perms }));
      try {
        const r = await fetch("https://eterium-api.onrender.com/ping", { mode: "cors" });
        const j = await r.json();
        setState(s => ({ ...s, api: j }));
        setApiPill("ok");
      } catch (e) {
        setState(s => ({ ...s, api: { error: String(e) } }));
        setApiPill("bad");
      }
    })();
  }, []);

  const copyReport = async () => {
    const report = {
      meta: { when: now.toISOString(), page: location.href },
      ...state
    };
    const text = JSON.stringify(report, null, 2);
    await navigator.clipboard.writeText(text);

    // mini toast
    const t = document.createElement("div");
    t.textContent = "Отчёт скопирован";
    Object.assign(t.style, {
      position: "fixed", bottom: "22px", left: "50%", transform: "translateX(-50%)",
      background: "#0b1c1a", border: "1px solid #14453b", color: "var(--text)",
      padding: "10px 14px", borderRadius: "12px", boxShadow: "0 12px 40px #000a", zIndex: "9999"
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1400);
  };

  return (
    <div className="wrap">
      <header className="header">
        <Logo />
        <div>
          <div className="title-wrap" aria-label="FingerCloak Lab">
            <div className="title-scan" />
            <h1 className="title">
              <span className="brand">FingerCloak</span> <span className="accent">Lab</span>
            </h1>
            <div className="title-underline" />
          </div>
          <div className="sub">
            Показываем, что сайт может узнать о вас прямо сейчас — локально, без установки.
          </div>
          <HeroViz env={state.env} screen={state.screen} />
        </div>
      </header>

      <div style={{margin:"6px 0 16px"}}>
        <button className="btn" onClick={()=>setShowDiag(v=>!v)}>
          {showDiag ? "Скрыть диагностику" : "Показать диагностику"}
        </button>
      </div>

      <div className="grid">
        {/* Статус */}
        <Card title="Статус">
          <div className="inner">
            <div className="pills">
              <span className={`pill ${apiPill}`}>
                <span className="dot" /> API /ping {apiPill === "warn" ? "…" : apiPill === "ok" ? "OK" : "ошибка"}
              </span>
              <span className="pill"><span className="dot" /> WebRTC не запускался</span>
              <span className="pill"><span className="dot" /> Canvas не запускался</span>
            </div>

            <div className="kv">
              <div className="dim">Страница</div><div>{location.href}</div>
              <div className="dim">Время</div><div>{now.toISOString().replace("T"," ").replace("Z"," UTC")}</div>
            </div>

            <div className="hr"></div>
            <div className="pills" style={{ margin: 0 }}>
              <button className="btn" onClick={copyReport}>Скопировать полный отчёт</button>
            </div>
          </div>
        </Card>

        {/* Окружение */}
        <Card title="Окружение браузера">
          <div className="inner">
            <div className="kv">
              <div className="dim">UA</div>
              <div>{(state.env?.ua || "").slice(0,140)}{(state.env?.ua?.length||0)>140 ? "…" : ""}</div>

              <div className="dim">UA platform</div><div>{state.env?.uaData?.platform ?? state.env?.platform ?? "—"}</div>
              <div className="dim">UA version</div><div>{state.env?.uaData?.uaFullVersion ?? "—"}</div>
              <div className="dim">Mobile</div><div>{String(state.env?.uaData?.mobile ?? false)}</div>
              <div className="dim">Languages</div><div>{state.env?.languages?.join(", ")}</div>
              <div className="dim">Timezone</div><div>{state.env?.timezone}</div>
              <div className="dim">Hardware threads</div><div>{state.env?.hardwareConcurrency}</div>
              <div className="dim">Device memory (GB)</div><div>{state.env?.deviceMemory}</div>
              <div className="dim">Do Not Track</div><div>{String(state.env?.doNotTrack)}</div>
              <div className="dim">Cookies enabled</div><div>{String(state.env?.cookiesEnabled)}</div>
            </div>
            <div className="hr"></div>
            <pre className="pre">{JSON.stringify(state.env ?? "—", null, 2)}</pre>
          </div>
        </Card>

        {/* Экран и хранилища */}
        <Card title="Экран и хранилища">
          <div className="inner">
            <div className="kv">
              {Object.entries(state.screen || {}).map(([k,v])=>(
                <React.Fragment key={k}><div className="dim">{k}</div><div>{String(v)}</div></React.Fragment>
              ))}
            </div>
            <div className="hr"></div>
            <div className="kv">
              {Object.entries(state.storage || {}).map(([k,v])=>(
                <React.Fragment key={k}><div className="dim">{k}</div><div>{String(v)}</div></React.Fragment>
              ))}
            </div>
          </div>
        </Card>

        {/* WebGL */}
        <Card title="WebGL / GPU">
          <div className="inner">
            <div className="kv">
              <div className="dim">Vendor</div><div>{state.webgl?.vendor}</div>
              <div className="dim">Renderer</div><div>{state.webgl?.renderer}</div>
              <div className="dim">GL version</div><div>{state.webgl?.version}</div>
              <div className="dim">GLSL</div><div>{state.webgl?.glsl}</div>
              <div className="dim">Max texture</div><div>{state.webgl?.maxTexture}</div>
              <div className="dim">Max attribs</div><div>{state.webgl?.maxAttribs}</div>
              <div className="dim">Ext (first 25)</div><div>{state.webgl?.extensionsFirst25?.length ?? 0}</div>
            </div>
            <div className="hr"></div>
            <pre className="pre">{JSON.stringify(state.webgl ?? "—", null, 2)}</pre>
          </div>
        </Card>

        {/* Canvas */}
        <Card title="Canvas fingerprint">
          <div className="inner">
            <div className="pills" style={{ marginBottom: 10 }}>
              <button className="btn" onClick={async ()=>{
                const res = await runCanvas();
                setState(s => ({ ...s, canvas: res }));
              }}>
                Запустить Canvas-хэш
              </button>
            </div>
            <div className="kv">
              <div className="dim">Хэш</div><div>{state.canvas?.hash ?? "—"}</div>
              <div className="dim">Размер</div><div>{state.canvas ? `${state.canvas.w}×${state.canvas.h}` : "—"}</div>
            </div>
          </div>
        </Card>

        {/* WebRTC */}
        <Card title="WebRTC">
          <div className="inner">
            <div className="pills" style={{ marginBottom: 10 }}>
              <button className="btn" onClick={async ()=>{
                const res = await runRTC();
                setState(s => ({ ...s, rtc: res }));
              }}>
                Проверить ICE-кандидаты (IP-утечки)
              </button>
            </div>
            <div className="kv">
              <div className="dim">Найдено кандидатов</div><div>{state.rtc?.candidates?.length ?? 0}</div>
              <div className="dim">Приватные адреса</div><div>{state.rtc?.privateIPs?.length ? state.rtc.privateIPs.join(", ") : "—"}</div>
              <div className="dim">Публичные адреса</div><div>{state.rtc?.publicIPs?.length ? state.rtc.publicIPs.join(", ") : "—"}</div>
              <div className="dim">Типы</div><div>{state.rtc?.types?.length ? state.rtc.types.join(", ") : "—"}</div>
            </div>
            <div className="hr"></div>
            <pre className="pre">{(state.rtc?.candidates || []).join("\n") || "—"}</pre>
          </div>
        </Card>

        {/* Permissions */}
        <Card title="Разрешения и сигналы приватности">
          <div className="inner">
            <div className="kv">
              {Object.entries(state.perms || {}).map(([k,v])=>(
                <React.Fragment key={k}><div className="dim">{k}</div><div>{String(v)}</div></React.Fragment>
              ))}
            </div>
          </div>
        </Card>

        {/* Diagnostics (API) */}
        {showDiag && (
          <Card title="API / Ping">
            <div className="inner">
              <div className="kv">
                <div className="dim">Endpoint</div><div>https://eterium-api.onrender.com/ping</div>
              </div>
              <div className="hr"></div>
              <pre className="pre">{JSON.stringify(state.api ?? "—", null, 2)}</pre>
            </div>
          </Card>
        )}
      </div>

      <div className="footer">
        © {new Date().getFullYear()} FingerCloak Lab. Данные показываются локально в вашем браузере; мы их никуда не отправляем.
      </div>
    </div>
  );
}
