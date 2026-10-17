// Rendered logo heights in px. Also set as the <img> height attribute so the
// logo can never flash at its full intrinsic size before styles load. Keep
// in step with the --height-logo-* tokens.
export const LOGO_HEIGHT = {
  horizontal: { md: 40, lg: 48 },
  stacked: { md: 72, lg: 96 },
} as const;
