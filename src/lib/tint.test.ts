import { describe, it, expect } from 'vitest';
import { hueFromTint, edgeForHue, edgeFromTint } from './tint';

describe('hueFromTint', () => {
  it('parses hue from a standard HSL color string', () => {
    expect(hueFromTint('hsl(30, 25%, 88.5%)')).toBe(30);
  });

  it('parses fractional hue values (drag-derived colors)', () => {
    expect(hueFromTint('hsl(123.4, 50%, 50%)')).toBeCloseTo(123.4);
  });

  it('returns null for hex inputs', () => {
    expect(hueFromTint('#abcdef')).toBeNull();
  });

  it('returns null for named colors', () => {
    expect(hueFromTint('rebeccapurple')).toBeNull();
  });

  // Contract: parser requires comma-syntax HSL. No current caller produces
  // CSS Color Module Level 4 space-syntax (`hsl(30 25% 88%)`); pinning the
  // rejection here so a future migration explicitly opts in.
  it('returns null for space-syntax HSL (CSS Color Module Level 4)', () => {
    expect(hueFromTint('hsl(30 25% 88%)')).toBeNull();
  });
});

describe('edgeForHue', () => {
  // FB-0027 byte-equivalence guard: the canonical default value must not
  // drift when computed via the helper. If this test fails, the formula
  // changed and every consumer of --page-tint-edge needs revisiting.
  it('matches the prior hardcoded default for hue 30 (Sand)', () => {
    expect(edgeForHue(30)).toBe('hsla(30, 30%, 50%, 0.10)');
  });

  it('produces an edge string for cool hues', () => {
    expect(edgeForHue(200)).toBe('hsla(200, 30%, 50%, 0.10)');
  });

  it('rounds fractional hues for output stability', () => {
    expect(edgeForHue(123.4)).toBe('hsla(123, 30%, 50%, 0.10)');
  });
});

describe('edgeFromTint', () => {
  // FB-0027 byte-equivalence guard: the default Sand pageTint must derive
  // to exactly the prior hardcoded edge string.
  it('derives the edge from the default Sand pageTint byte-for-byte', () => {
    expect(edgeFromTint('hsl(30, 25%, 88.5%)')).toBe('hsla(30, 30%, 50%, 0.10)');
  });

  it('derives a cool edge for the Mist preset (hue 200)', () => {
    expect(edgeFromTint('hsl(200, 33%, 92.5%)')).toBe('hsla(200, 30%, 50%, 0.10)');
  });

  it('falls back to the canonical edge for non-HSL (hex) inputs', () => {
    expect(edgeFromTint('#abcdef')).toBe('hsla(30, 30%, 50%, 0.10)');
  });
});
