// Derive the page-edge color (`--page-tint-edge`) from the page-tint color
// (`--page-tint`) so the edge follows the user's chosen hue instead of
// staying at the warm-orange of the default Sand hue. See FB-0027.

/**
 * Build the edge HSLA string for a given hue.
 * Output is comma-syntax HSLA; consumers writing to a CSS var get the
 * format browsers accept everywhere (no Color Module Level 4 dependency).
 */
export function edgeForHue(hue: number): string {
  return `hsla(${hue.toFixed(0)}, 30%, 50%, 0.10)`;
}

/**
 * Fallback edge for tints that can't be parsed as HSL (e.g. hex input from
 * the manual color picker). Derived from `edgeForHue(30)` rather than
 * hardcoded so a formula change in `edgeForHue` propagates here automatically
 * — guards against the FB-0027 class of bug.
 */
const FALLBACK_EDGE = edgeForHue(30);

/**
 * Parse the hue (degrees) from an `hsl(...)` color string.
 * Returns null for non-HSL inputs (hex, named colors, space-syntax
 * `hsl(30 25% 88%)`, malformed values).
 */
export function hueFromTint(tint: string): number | null {
  const match = tint.match(/hsl\(\s*([\d.]+)\s*,/);
  if (!match) return null;
  const hue = parseFloat(match[1]);
  return Number.isFinite(hue) ? hue : null;
}

/**
 * Convenience: derive an edge string from a tint color string.
 * Falls back to the canonical default for non-HSL inputs.
 */
export function edgeFromTint(tint: string): string {
  const hue = hueFromTint(tint);
  return hue === null ? FALLBACK_EDGE : edgeForHue(hue);
}
