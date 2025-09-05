export async function runFPJS() {
  const { default: FingerprintJS } = await import("@fingerprintjs/fingerprintjs");
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const components: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(result.components as any)) {
    components[k] = (v as any).value;
  }
  return {
    visitorId: result.visitorId,
    conf: result.confidence?.score,
    componentsCount: Object.keys(components).length,
    components
  };
}
