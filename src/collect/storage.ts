export type StorageInfo =
  | { usage?: string; quota?: string; error?: string }
  | { message: string };

const fmt = (n?: number) =>
  n == null ? undefined :
  n > 1e9 ? (n / 1e9).toFixed(2) + " GB" :
  n > 1e6 ? (n / 1e6).toFixed(2) + " MB" :
  n > 1e3 ? (n / 1e3).toFixed(2) + " KB" : n + " B";

export async function collectStorage(): Promise<StorageInfo> {
  try {
    if ((navigator as any).storage?.estimate) {
      const { usage, quota } = await (navigator as any).storage.estimate();
      return { usage: fmt(usage), quota: fmt(quota) };
    }
    return { message: "no storage API" };
  } catch (e) {
    return { error: String(e) };
  }
}
