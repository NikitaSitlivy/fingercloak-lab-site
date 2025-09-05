import { sha256Hex } from "../lib/sha256";

export type CanvasInfo = { hash: string; w: number; h: number };

export async function runCanvas(): Promise<CanvasInfo> {
  const w = 2400, h = 600;
  const cnv = new OffscreenCanvas(w, h);
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "#0b1020"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#39e9ff"; ctx.font = "48px 'Segoe UI', Tahoma, sans-serif";
  ctx.fillText("FingerCloak ✦ canvas fp", 30, 80);
  ctx.strokeStyle = "#c43cff"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(360,160,70,0,Math.PI*2); ctx.stroke();
  const grd = ctx.createLinearGradient(0,0,400,0); grd.addColorStop(0,"#39e9ff"); grd.addColorStop(1,"#c43cff");
  ctx.fillStyle = grd; ctx.fillRect(30,120,420,60);
  ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#ffd54a"; ctx.fillRect(60,150,260,80);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#e8f0ff"; ctx.font = "28px Georgia, serif";
  ctx.fillText("ΔΣπ glyphs: ẞЖЙשم漢字 — AaBb", 30, 240);

  const blob = await cnv.convertToBlob({ type: "image/png", quality: 1 });
  const arr = await blob.arrayBuffer();
  const hash = await sha256Hex(arr);
  return { hash, w, h };
}
