/** Brand mark in the admin's top bar. */
export function Icon() {
  // eslint-disable-next-line @next/next/no-img-element -- admin graphic, outside next/image's pipeline
  return <img src="/brand/logo.png" alt="PcWizard_uz" width={64} height={28} style={{ objectFit: "contain" }} />;
}
