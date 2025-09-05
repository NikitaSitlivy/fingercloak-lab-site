export type PermsInfo = Record<string, string>;

export async function collectPerms(): Promise<PermsInfo> {
  const out: PermsInfo = {};
  const list = ["geolocation","notifications","camera","microphone","persistent-storage","background-sync","clipboard-read","clipboard-write"];
  for (const name of list) {
    try {
      const api: any = (navigator as any).permissions;
      if (!api?.query) { out[name] = "no API"; continue; }
      const st = await api.query({ name } as any);
      out[name] = st.state;
    } catch { out[name] = "unknown"; }
  }
  const conn: any = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (conn) {
    out["network.effectiveType"] = conn.effectiveType;
    out["network.downlink"] = String(conn.downlink);
    out["network.rtt"] = String(conn.rtt);
    out["network.saveData"] = String(conn.saveData);
  }
  return out;
}
