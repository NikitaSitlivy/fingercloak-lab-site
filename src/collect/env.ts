export type EnvInfo = {
  ua: string;
  uaData?: any;
  languages?: readonly string[];  // <-- так
  timezone?: string;
  platform?: string | null;
  hardwareConcurrency?: number | null;
  deviceMemory?: number | null;
  doNotTrack?: string | null;
  cookiesEnabled?: boolean | null;
};

export async function collectEnv(): Promise<EnvInfo> {
  const ua = navigator.userAgent;
  let uaData: any = null;
  try {
    if ((navigator as any).userAgentData?.getHighEntropyValues) {
      uaData = await (navigator as any).userAgentData.getHighEntropyValues([
        "architecture","bitness","platform","platformVersion","uaFullVersion","fullVersionList","model","mobile"
      ]);
    }
  } catch (e) {
    uaData = { error: String(e) };
  }

  return {
    ua,
    uaData,
    languages: navigator.languages,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: (navigator as any).platform ?? null,
    hardwareConcurrency: (navigator as any).hardwareConcurrency ?? null,
    deviceMemory: (navigator as any).deviceMemory ?? null,
    doNotTrack: (navigator as any).doNotTrack ?? null,
    cookiesEnabled: (navigator as any).cookieEnabled ?? null
  };
}
