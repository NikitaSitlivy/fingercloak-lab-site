export async function collectBattery() {
  const nav: any = navigator as any;
  if (!nav.getBattery) return { supported: false };
  try {
    const b = await nav.getBattery();
    return {
      supported: true,
      charging: b.charging,
      level: b.level,
      chargingTime: b.chargingTime,
      dischargingTime: b.dischargingTime
    };
  } catch (e: any) {
    return { supported: true, error: String(e?.message || e) };
  }
}
