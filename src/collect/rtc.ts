export type RTCInfo = {
  candidates: string[];
  publicIPs: string[];
  privateIPs: string[];
  types: string[];
};

const isPrivate = (ip: string) =>
  /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.)/.test(ip);

export async function runRTC(): Promise<RTCInfo> {
  const lines: string[] = [];
  const pub = new Set<string>(), priv = new Set<string>(), types = new Set<string>();
  let pc: RTCPeerConnection | null = null;
  try {
    pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.createDataChannel("fc");
    pc.onicecandidate = ev => {
      if (!ev.candidate) return;
      const s = ev.candidate.candidate;
      lines.push(s);
      const m = s.match(/candidate:\S+ \d+ \w+ (\d+\.\d+\.\d+\.\d+) (\d+) typ (\w+)/);
      if (m) { (isPrivate(m[1]) ? priv : pub).add(m[1]); types.add(m[3]); }
    };
    const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
    await pc.setLocalDescription(offer);
    await new Promise<void>(r => {
      const t = setTimeout(r, 2500);
      pc!.onicegatheringstatechange = () => {
        if (pc!.iceGatheringState === "complete") { clearTimeout(t); r(); }
      };
    });
  } finally {
    try { pc?.close(); } catch {}
  }
  return { candidates: lines, publicIPs: [...pub], privateIPs: [...priv], types: [...types] };
}
