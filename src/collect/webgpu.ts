export type WebGPUInfo =
  | { supported: false }
  | {
      supported: true;
      adapter: {
        name?: string;
        features: string[];
        limits: Record<string, number>;
      } | null;
    };

export async function collectWebGPU(): Promise<WebGPUInfo> {
  const nav: any = navigator as any;
  if (!nav.gpu) return { supported: false };

  let adapter: any = null;
  try {
    adapter = await nav.gpu.requestAdapter?.({ powerPreference: "high-performance" });
  } catch { adapter = null; }
  if (!adapter) return { supported: true, adapter: null };

  const features: string[] = Array.from(
    typeof adapter.features?.values === "function"
      ? adapter.features.values()
      : adapter.features ?? []
  ) as string[];

  const limits: Record<string, number> = {};
  try {
    const raw = adapter.limits ?? {};
    for (const k in raw) {
      const v: any = raw[k];
      limits[k] = typeof v === "number" ? v : Number(v);
    }
  } catch {}

  return { supported: true, adapter: { name: adapter.name as string | undefined, features, limits } };
}
