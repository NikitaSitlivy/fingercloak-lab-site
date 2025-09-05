import { sha256Hex } from "../lib/sha256";

export type AudioFP = { hash: string; sampleRate: number; length: number } | { error: string };

export async function runAudioFP(): Promise<AudioFP> {
  try {
    const sr = 44100;
    const ctx = new OfflineAudioContext(1, sr, sr);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 10000;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -24;
    comp.knee.value = 30;
    comp.ratio.value = 12;
    comp.attack.value = 0.003;
    comp.release.value = 0.25;

    osc.connect(comp);
    comp.connect(ctx.destination);
    osc.start(0);

    const buf = await ctx.startRendering();
    // берём небольшую выборку из конца буфера
    const data = buf.getChannelData(0).slice(buf.length - 2048);
    const raw = new Float32Array(data);
    const hash = await sha256Hex(raw.buffer);
    return { hash, sampleRate: buf.sampleRate, length: buf.length };
  } catch (e: any) {
    return { error: String(e?.message || e) };
  }
}
