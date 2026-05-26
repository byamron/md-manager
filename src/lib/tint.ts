// Helpers to derive the page-edge color (`--page-tint-edge`) from the
// page-tint color (`--page-tint`), so the edge follows the user's chosen
// hue instead of staying at the warm-orange of the default Sand hue.
//
// See `core-docs/feedback.md` FB-0027 (grep old literal before declaring a
// default change done) for the bug class these helpers prevent.

/**
 * Canonical fallback edge — used when a tint string can't be parsed as HSL
 * (e.g. hex input from the manual color picker). Matches the prior hardcoded
 * default in `src/store.tsx` byte-for-byte so behavior is preserved for
 * unrecognized inputs.
 */
const FALLBACK_EDGE = 'hsla(30, 30%, 50%, 0.10)';

/**
 * Parse the hue (degrees) from an `hsl(...)` color string.
 * Returns null for non-HSL inputs (hex, named colors, malformed values).
 */
export function hueFromTint(tint: string): number | null {
  const match = tint.match(/hsl\(\s*([\d.]+)/);
  if (!match) return null;
  const hue = parseFloat(match[1]);
  return Number.isFinite(hue) ? hue : null;
}

/**
 * Build the edge HSLA string for a given hue.
 * Formula matches `src/components/ColorRail.tsx`'s prior local `edgeFor(y)`
 * so behavior is byte-equivalent when the input hue matches.
 */
export function edgeForHue(hue: number): string {
  return `hsla(${hue.toFixed(0)}, 30%, 50%, 0.10)`;
}

/**
 * Convenience: derive an edge string from a tint color string.
 * Falls back to the canonical default for non-HSL inputs.
 */
export function edgeFromTint(tint: string): string {
  const hue = hueFromTint(tint);
  return hue === null ? FALLBACK_EDGE : edgeForHue(hue);
}
