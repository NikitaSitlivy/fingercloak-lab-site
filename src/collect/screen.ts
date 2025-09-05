export type ScreenInfo = {
  screen: string;
  avail: string;
  inner: string;
  colorDepth: number;
  dpr: number;
  touchPoints: number;
};

export async function collectScreen(): Promise<ScreenInfo> {
  const dpr = window.devicePixelRatio || 1;
  return {
    screen: `${screen.width}×${screen.height}`,
    avail: `${screen.availWidth}×${screen.availHeight}`,
    inner: `${innerWidth}×${innerHeight}`,
    colorDepth: screen.colorDepth,
    dpr,
    touchPoints: (navigator as any).maxTouchPoints ?? 0
  };
}
