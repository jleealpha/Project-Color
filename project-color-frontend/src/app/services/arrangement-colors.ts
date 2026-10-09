export interface Swatch {
  /** Stable id. Stage 1 ids are the global spectrum index; Stage 2 ids are offset by STAGE2_ID_OFFSET. */
  id: number;
  nm: number;
  color: string;
  /** Anchors bookend each tray and cannot be moved. */
  fixed: boolean;
}

export const SPECTRUM_MIN_NM = 380;
export const SPECTRUM_MAX_NM = 740;
export const TRAY_COUNT = 3;
export const TRAY_SIZE = 29;
export const TRAY_OVERLAP = 4;
export const STAGE2_SHADES = 25;
export const STAGE2_SPAN_NM = 40;
export const STAGE2_ID_OFFSET = 1000;
/** A swatch placed this many slots (or more) from its true rank counts as displaced. */
export const DISPLACEMENT_THRESHOLD = 2;
/** Minimum displaced swatches before a confusion axis is flagged. */
export const CONFUSION_MIN_DISPLACED = 3;

/** Unique colors across all trays: 3 * 29 - 2 * 4 = 79. */
export const UNIQUE_COLOR_COUNT = TRAY_COUNT * TRAY_SIZE - (TRAY_COUNT - 1) * TRAY_OVERLAP;

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/**
 * Approximates a dominant wavelength as saturated RGB channels in 0..1.
 * Channels are used as Display P3 coordinates, so the swatches reach the
 * saturated ends of the gamut. Out-of-gamut wavelengths are clamped and dimmed.
 */
function wavelengthToChannels(nm: number): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else {
    r = 1;
  }

  let dim = 1;
  if (nm < 420) {
    dim = 0.3 + (0.7 * (nm - SPECTRUM_MIN_NM)) / 40;
  } else if (nm > 700) {
    dim = 0.3 + (0.7 * (SPECTRUM_MAX_NM - nm)) / 40;
  }
  return [clamp01(r * dim), clamp01(g * dim), clamp01(b * dim)];
}
// convert wavelengths to P3 value
function toP3(channels: [number, number, number], desaturation = 0): string {
  const [r, g, b] = channels.map((c) => c + (0.5 - c) * desaturation).map((c) => c.toFixed(3));
  return `color(display-p3 ${r} ${g} ${b})`;
}

/** Builds the full 79-color spectrum in wavelength order. */
export function buildSpectrum(): Swatch[] {
  const step = (SPECTRUM_MAX_NM - SPECTRUM_MIN_NM) / (UNIQUE_COLOR_COUNT - 1);
  return Array.from({ length: UNIQUE_COLOR_COUNT }, (_, i) => {
    const nm = SPECTRUM_MIN_NM + i * step;
    return { id: i, nm, color: toP3(wavelengthToChannels(nm)), fixed: false };
  });
}

/** Splits the spectrum into overlapping trays, anchoring the first and last swatch of each. */
export function buildTrays(): Swatch[][] {
  const spectrum = buildSpectrum();
  const stride = TRAY_SIZE - TRAY_OVERLAP;
  return Array.from({ length: TRAY_COUNT }, (_, t) =>
    spectrum
      .slice(t * stride, t * stride + TRAY_SIZE)
      .map((s, i, all) => ({ ...s, fixed: i === 0 || i === all.length - 1 })),
  );
}

/** Builds the desaturated 25-shade micro-scale centered on the confusion axis. */
export function buildMicroScale(centerNm: number): Swatch[] {
  const half = STAGE2_SPAN_NM / 2;
  const center = Math.min(SPECTRUM_MAX_NM - half, Math.max(SPECTRUM_MIN_NM + half, centerNm));
  const step = STAGE2_SPAN_NM / (STAGE2_SHADES - 1);
  return Array.from({ length: STAGE2_SHADES }, (_, i) => {
    const nm = center - half + i * step;
    return {
      id: STAGE2_ID_OFFSET + i,
      nm,
      color: toP3(wavelengthToChannels(nm), 0.55),
      fixed: i === 0 || i === STAGE2_SHADES - 1,
    };
  });
}

/** Shuffles only the non-anchor swatches, guaranteeing the result is not already sorted. */
export function shuffleMiddle(tray: Swatch[]): Swatch[] {
  const first = tray[0];
  const last = tray[tray.length - 1];
  const middle = tray.slice(1, -1);
  const sortedIds = middle.map((s) => s.id).join();
  let shuffled = middle;
  do {
    shuffled = [...middle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (middle.length > 1 && shuffled.map((s) => s.id).join() === sortedIds);
  return [first, ...shuffled, last];
}

/**
 * Linear scan: returns swatches placed far from their true wavelength rank.
 * No binary search is used; each pass is a straight sweep over the tray.
 */
export function findDisplaced(arranged: Swatch[]): Swatch[] {
  const trueOrder = [...arranged].sort((a, b) => a.nm - b.nm);
  return arranged.filter((s, placed) => {
    const rank = trueOrder.findIndex((t) => t.id === s.id);
    return Math.abs(placed - rank) >= DISPLACEMENT_THRESHOLD;
  });
}

/** Returns the confusion-axis center wavelength, or null when sorting shows no reversals. */
export function findConfusionCenter(displaced: Swatch[]): number | null {
  if (displaced.length < CONFUSION_MIN_DISPLACED) {
    return null;
  }
  return displaced.reduce((sum, s) => sum + s.nm, 0) / displaced.length;
}
