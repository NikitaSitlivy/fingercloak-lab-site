export type WebGLInfo = {
  supported: boolean;
  vendor?: string;
  renderer?: string;
  version?: string;
  glsl?: string;
  maxTexture?: number;
  maxAttribs?: number;
  extensionsFirst25?: string[];
};

export function collectWebGL(): WebGLInfo {
  const c = document.createElement("canvas");
  const gl = (c.getContext("webgl") || c.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) return { supported: false };

  const dbg = gl.getExtension("WEBGL_debug_renderer_info") as any;
  const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
  const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);

  return {
    supported: true,
    vendor: String(vendor),
    renderer: String(renderer),
    version: String(gl.getParameter(gl.VERSION)),
    glsl: String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION)),
    maxTexture: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    extensionsFirst25: (gl.getSupportedExtensions() || []).slice(0, 25)
  };
}
