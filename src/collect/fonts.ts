// Лёгкий детектор наличия популярных системных шрифтов через измерение метрик
const CANDIDATES = [
  "Arial","Helvetica","Times New Roman","Georgia","Verdana","Trebuchet MS","Tahoma",
  "Segoe UI","Courier New","Consolas","Menlo","Monaco","Impact","Comic Sans MS"
];

function measure(font: string, fallback: string) {
  const span = document.createElement("span");
  span.style.cssText = `
    position:absolute; left:-9999px; top:-9999px;
    font-size:72px; font-family:${fallback};
    white-space:nowrap;`;
  span.textContent = "mmmmmmmmmmlIlO0СБЖ漢字"; // набор разной ширины
  document.body.appendChild(span);
  const w = span.getBoundingClientRect().width;
  span.style.fontFamily = `'${font}', ${fallback}`;
  const w2 = span.getBoundingClientRect().width;
  span.remove();
  return { w, w2 };
}

export async function detectFonts() {
  const base = ["serif","sans-serif","monospace"];
  const present: string[] = [];
  for (const f of CANDIDATES) {
    // если хотя бы с одной базой ширина меняется — шрифт есть
    const ok = base.some(b => {
      const { w, w2 } = measure(f, b);
      return Math.abs(w - w2) > 0.3;
    });
    if (ok) present.push(f);
  }
  return present;
}
