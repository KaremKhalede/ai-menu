/**
 * Returns a color based on intensity (0 = cold #2a2a3e, 1 = hot #d4a853).
 * Interpolates through blue → yellow → red.
 */
export function heatColor(intensity: number): string {
  const t = Math.max(0, Math.min(1, intensity));

  if (t < 0.5) {
    // Cold blue (#2a2a3e) → warm yellow (#d4a853)
    const s = t * 2;
    const r = Math.round(42 + (212 - 42) * s);
    const g = Math.round(42 + (168 - 42) * s);
    const b = Math.round(62 + (83 - 62) * s);
    return `rgb(${r},${g},${b})`;
  } else {
    // Warm yellow (#d4a853) → hot red (#e74c3c)
    const s = (t - 0.5) * 2;
    const r = Math.round(212 + (231 - 212) * s);
    const g = Math.round(168 + (76 - 168) * s);
    const b = Math.round(83 + (60 - 83) * s);
    return `rgb(${r},${g},${b})`;
  }
}

/**
 * Returns CSS properties for radial heat backgrounds based on intensity.
 */
export function heatBgStyle(intensity: number): React.CSSProperties {
  const t = Math.max(0, Math.min(1, intensity));
  return {
    background: `radial-gradient(circle, ${heatColor(t)}88 0%, ${heatColor(t * 0.4)}22 70%, transparent 100%)`,
  };
}
