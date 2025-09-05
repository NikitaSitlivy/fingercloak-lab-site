export async function collectMediaCapabilities() {
  const mc: any = (navigator as any).mediaCapabilities;
  if (!mc?.decodingInfo) return { supported: false };

  const videoQueries = [
    { type: "file", video: { contentType: 'video/mp4; codecs="avc1.42E01E"', width: 1920, height: 1080, bitrate: 5e6, framerate: 30 } },
    { type: "file", video: { contentType: 'video/webm; codecs="vp9"', width: 1920, height: 1080, bitrate: 5e6, framerate: 30 } },
    { type: "file", video: { contentType: 'video/mp4; codecs="av01.0.08M.08"', width: 1920, height: 1080, bitrate: 5e6, framerate: 30 } },
  ];
  const audioQueries = [
    { type: "file", audio: { contentType: 'audio/webm; codecs="opus"', channels: 2, bitrate: 128000, samplerate: 48000 } },
    { type: "file", audio: { contentType: 'audio/mp4; codecs="mp4a.40.2"', channels: 2, bitrate: 128000, samplerate: 48000 } },
  ];

  const results: any = { supported: true, video: {}, audio: {} };

  for (const q of videoQueries) {
    try { results.video[q.video.contentType] = await mc.decodingInfo(q); }
    catch (e) { results.video[q.video.contentType] = { error: String(e) }; }
  }
  for (const q of audioQueries) {
    try { results.audio[q.audio.contentType] = await mc.decodingInfo(q); }
    catch (e) { results.audio[q.audio.contentType] = { error: String(e) }; }
  }

  const mq = (s: string) => matchMedia(s).matches;
  const gamut = ["rec2020", "p3", "srgb"].find(g => mq(`(color-gamut:${g})`)) || "unknown";
  const hdr =
    (mq("(dynamic-range: high)") && "high") ||
    (mq("(dynamic-range: standard)") && "standard") ||
    "unknown";

  results.display = { colorGamut: gamut, dynamicRange: hdr };
  return results;
}
