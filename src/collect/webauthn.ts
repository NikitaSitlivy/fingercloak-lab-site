export async function collectWebAuthn() {
  const has = !!(window as any).PublicKeyCredential;
  const out: any = { supported: has };

  try {
    out.platform = await (window as any).PublicKeyCredential
      ?.isUserVerifyingPlatformAuthenticatorAvailable?.();
  } catch { out.platform = false; }

  try {
    out.conditionalMediation = await (window as any).PublicKeyCredential
      ?.isConditionalMediationAvailable?.();
  } catch { out.conditionalMediation = false; }

  return out;
}
