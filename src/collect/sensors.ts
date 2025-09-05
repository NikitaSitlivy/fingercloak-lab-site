export async function collectSensors() {
  const out: any = {
    deviceOrientation: "DeviceOrientationEvent" in window,
    deviceMotion: "DeviceMotionEvent" in window
  };
  try {
    if (navigator.permissions?.query) {
      const names: any[] = ["accelerometer", "gyroscope", "magnetometer"];
      const statuses: Record<string, string> = {};
      for (const n of names) {
        try {
          // @ts-ignore
          const st = await navigator.permissions.query({ name: n });
          statuses[n] = st.state;
        } catch { /* ignore */ }
      }
      out.permissions = statuses;
    }
  } catch {}
  return out;
}
