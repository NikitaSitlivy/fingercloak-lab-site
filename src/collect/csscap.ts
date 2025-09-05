export function collectCSSCapabilities() {
  const mq = (q: string) => window.matchMedia?.(q).matches ?? false;
  const prefers = {
    colorScheme:
      (mq("(prefers-color-scheme: dark)") && "dark") ||
      (mq("(prefers-color-scheme: light)") && "light") ||
      "no-preference",
    reducedMotion:
      (mq("(prefers-reduced-motion: reduce)") && "reduce") ||
      (mq("(prefers-reduced-motion: no-preference)") && "no-preference") ||
      "unknown",
  };
  const colorGamut = ["rec2020", "p3", "srgb"].find(g => mq(`(color-gamut:${g})`)) || "unknown";
  const dynamicRange =
    (mq("(dynamic-range: high)") && "high") ||
    (mq("(dynamic-range: standard)") && "standard") ||
    "unknown";
  const displayMode =
    ["fullscreen", "standalone", "minimal-ui", "browser"].find(m => mq(`(display-mode:${m})`)) ||
    "browser";

  return { prefers, colorGamut, dynamicRange, displayMode };
}
