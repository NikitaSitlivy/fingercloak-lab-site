export function collectNetwork() {
  const conn: any =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;
  if (!conn) return { supported: false };
  const { effectiveType, downlink, rtt, saveData } = conn;
  return { supported: true, effectiveType, downlink, rtt, saveData };
}
