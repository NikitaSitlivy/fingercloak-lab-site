import React, { useEffect, useMemo, useState } from "react";
import { collectEnv } from "./collect/env";
import { collectScreen } from "./collect/screen";
import { collectStorage } from "./collect/storage";
import { collectWebGL } from "./collect/webgl";
import { runCanvas } from "./collect/canvas";
import { runRTC } from "./collect/rtc";
import { collectPerms } from "./collect/perms";
import { Card } from "./components/Card";

type State = {
  env?: any; screen?: any; storage?: any; webgl?: any; canvas?: any; rtc?: any; perms?: any; api?: any;
};

const pillStyle = {
  base: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px",
          borderRadius: 999, font: "12px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
          border: "1px solid #2a4058", background: "#0a1220" },
  ok:   { color: "#0bd27a", borderColor: "#0bd27a66" },
  bad:  { color: "#ff4769", borderColor: "#ff476966" },
  warn: { color: "#ffc14d", borderColor: "#ffc14d66" }
} as const;

export default function App() {
  const [state, setState] = useState<State>({});
  const [apiPill, setApiPill] = useState<"warn"|"ok"|"bad">("warn");
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
    alert("Отчёт скопирован в буфер обмена.");
  };

  return (
    <div className="wrap" style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div aria-hidden style={{
          width: 42, height: 42, borderRadius: 10,
          background: "conic-gradient(from 120deg,#38e8ff,#c43cff,#0ff,#38e8ff)",
          filter: "blur(.2px) saturate(1.2)", boxShadow: "0 0 24px #00f5ff66"
        }}/>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, letterSpacing: ".4px" }}>
            Eterium / <span style={{ color: "#38e8ff" }}>FingerCloak</span> Lab
          </h1>
          <div style={{ color: "#8fa7b7", marginTop: 2 }}>
            Показываем, что сайт может узнать о вас прямо сейчас — локально, без установки.
          </div>
        </div>
      </header>

      <div className="grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <Card title="Статус">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ ...pillStyle.base, ...(apiPill === "ok" ? pillStyle.ok : apiPill === "bad" ? pillStyle.bad : pillStyle.warn) }}>
              ● API /ping {apiPill === "warn" ? "…" : apiPill === "ok" ? "OK" : "ошибка"}
            </span>
            <span style={pillStyle.base}>● WebRTC не запускался</span>
            <span style={pillStyle.base}>● Canvas не запускался</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "8px 14px",
                        font: "13px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace" }}>
            <div style={{ color: "#8fa7b7" }}>Страница</div><div>{location.href}</div>
            <div style={{ color: "#8fa7b7" }}>Время</div><div>{now.toISOString().replace("T"," ").replace("Z"," UTC")}</div>
          </div>
          <div style={{ height:1, background: "linear-gradient(90deg,transparent,#375573,transparent)", margin: "12px 0" }}/>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={copyReport} style={{ border: "1px solid #2a4058", background:"#0a1220", color:"inherit",
              padding:"8px 12px", borderRadius:10, cursor:"pointer" }}>
              Скопировать полный отчёт
            </button>
          </div>
        </Card>

        <Card title="Окружение браузера">
          <KV obj={{
            UA: (state.env?.ua || "").slice(0,140) + ((state.env?.ua?.length||0) > 140 ? "…" : ""),
            "UA platform": state.env?.uaData?.platform ?? state.env?.platform ?? "—",
            "UA version": state.env?.uaData?.uaFullVersion ?? "—",
            Mobile: String(state.env?.uaData?.mobile ?? false),
            Languages: state.env?.languages?.join(", "),
            Timezone: state.env?.timezone,
            "Hardware threads": state.env?.hardwareConcurrency,
            "Device memory (GB)": state.env?.deviceMemory,
            "Do Not Track": state.env?.doNotTrack,
            "Cookies enabled": state.env?.cookiesEnabled
          }}/>
          <hr style={{ border: 0, height:1, background: "linear-gradient(90deg,transparent,#375573,transparent)", margin: "12px 0" }}/>
          <Pre json={state.env}/>
        </Card>

        <Card title="Экран и хранилища">
          <KV obj={state.screen}/>
          <hr style={{ border: 0, height:1, background: "linear-gradient(90deg,transparent,#375573,transparent)", margin: "12px 0" }}/>
          <KV obj={state.storage}/>
        </Card>

        <Card title="WebGL / GPU">
          <KV obj={{
            Vendor: state.webgl?.vendor, Renderer: state.webgl?.renderer,
            "GL version": state.webgl?.version, GLSL: state.webgl?.glsl,
            "Max texture": state.webgl?.maxTexture, "Max attribs": state.webgl?.maxAttribs,
            "Ext (first 25)": state.webgl?.extensionsFirst25?.length
          }}/>
          <hr style={{ border: 0, height:1, background: "linear-gradient(90deg,transparent,#375573,transparent)", margin: "12px 0" }}/>
          <Pre json={state.webgl}/>
        </Card>

        <Card title="Canvas fingerprint">
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <button onClick={async ()=>{
              const res = await runCanvas();
              setState(s => ({ ...s, canvas: res }));
            }} style={{ border:"1px solid #2a4058", background:"#0a1220", color:"inherit", padding:"8px 12px", borderRadius:10, cursor:"pointer" }}>
              Запустить Canvas-хэш
            </button>
          </div>
          <KV obj={{ Hash: state.canvas?.hash ?? "—", Size: state.canvas ? `${state.canvas.w}×${state.canvas.h}` : "—" }}/>
        </Card>

        <Card title="WebRTC">
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <button onClick={async ()=>{
              const res = await runRTC();
              setState(s => ({ ...s, rtc: res }));
            }} style={{ border:"1px solid #2a4058", background:"#0a1220", color:"inherit", padding:"8px 12px", borderRadius:10, cursor:"pointer" }}>
              Проверить ICE-кандидаты (IP-утечки)
            </button>
          </div>
          <KV obj={{
            "Найдено кандидатов": state.rtc?.candidates?.length ?? 0,
            "Приватные адреса": state.rtc?.privateIPs?.length ? state.rtc.privateIPs.join(", ") : "—",
            "Публичные адреса": state.rtc?.publicIPs?.length ? state.rtc.publicIPs.join(", ") : "—",
            "Типы": state.rtc?.types?.length ? state.rtc.types.join(", ") : "—"
          }}/>
          <hr style={{ border: 0, height:1, background: "linear-gradient(90deg,transparent,#375573,transparent)", margin: "12px 0" }}/>
          <Pre text={(state.rtc?.candidates || []).join("\n") || "—"}/>
        </Card>

        <Card title="Разрешения и сигналы приватности">
          <KV obj={state.perms}/>
        </Card>

        <Card title="API / Ping">
          <KV obj={{ Endpoint: "https://eterium-api.onrender.com/ping" }}/>
          <hr style={{ border: 0, height:1, background: "linear-gradient(90deg,transparent,#375573,transparent)", margin: "12px 0" }}/>
          <Pre json={state.api}/>
        </Card>
      </div>

      <div style={{ margin: "24px 0 60px", color: "#9bb3c4", fontSize: 13 }}>
        © {new Date().getFullYear()} Eterium / FingerCloak Lab. Данные показываются локально в вашем браузере; мы их никуда не отправляем.
      </div>
    </div>
  );
}

const KV: React.FC<{ obj?: Record<string, any> | null }> = ({ obj }) => {
  const entries = Object.entries(obj || {});
  if (!entries.length) return <div style={{ color:"#8fa7b7" }}>—</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "8px 14px",
      font: "13px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace" }}>
      {entries.map(([k, v]) => (
        <React.Fragment key={k}>
          <div style={{ color: "#8fa7b7" }}>{k}</div>
          <div>{typeof v === "object" ? JSON.stringify(v) : String(v)}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

const Pre: React.FC<{ json?: any; text?: string }> = ({ json, text }) => (
  <pre style={{
    margin: 0, font: "12px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
    background: "#0b1020", color: "#e8f0ff", padding: 12, borderRadius: 12, border: "1px solid #1c2c42",
    maxHeight: 320, overflow: "auto"
  }}>
    {text ?? JSON.stringify(json ?? "—", null, 2)}
  </pre>
);
