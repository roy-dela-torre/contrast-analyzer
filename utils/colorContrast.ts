import chroma from 'chroma-js';

export interface ColorPair {
  foreground: string;
  background: string;
  contrastRatio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  element: string;
  selector: string;
}

export interface ContrastReport {
  url: string;
  totalPairs: number;
  passed: number;
  failed: number;
  colorPairs: ColorPair[];
  timestamp: string;
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrast(color1: string, color2: string): number {
  try {
    const c1 = chroma(color1);
    const c2 = chroma(color2);
    return chroma.contrast(c1, c2);
  } catch (error) {
    return 0;
  }
}

/**
 * Check if contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large)
 */
export function meetsWCAG_AA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA (7:1 for normal text, 4.5:1 for large)
 */
export function meetsWCAG_AAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Extract color from CSS value (handles rgb, rgba, hex, named colors)
 */
export function extractColor(cssValue: string): string | null {
  if (!cssValue || cssValue === 'transparent' || cssValue === 'inherit' || cssValue === 'initial') {
    return null;
  }
  
  try {
    // Try to parse the color
    const color = chroma(cssValue);
    return color.hex();
  } catch {
    return null;
  }
}

/**
 * Generate accessible color alternatives
 */
export function generateAccessibleColors(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): { adjustedForeground: string; adjustedBackground: string }[] {
  const alternatives: { adjustedForeground: string; adjustedBackground: string }[] = [];
  
  try {
    const fg = chroma(foreground);
    const bg = chroma(background);
    
    // Strategy 1: Darken foreground
    let darkened = fg;
    for (let i = 0; i < 20; i++) {
      darkened = darkened.darken(0.3);
      if (chroma.contrast(darkened, bg) >= targetRatio) {
        alternatives.push({
          adjustedForeground: darkened.hex(),
          adjustedBackground: background
        });
        break;
      }
    }
    
    // Strategy 2: Lighten foreground
    let lightened = fg;
    for (let i = 0; i < 20; i++) {
      lightened = lightened.brighten(0.3);
      if (chroma.contrast(lightened, bg) >= targetRatio) {
        alternatives.push({
          adjustedForeground: lightened.hex(),
          adjustedBackground: background
        });
        break;
      }
    }
    
    // Strategy 3: Darken background
    let bgDarkened = bg;
    for (let i = 0; i < 20; i++) {
      bgDarkened = bgDarkened.darken(0.3);
      if (chroma.contrast(fg, bgDarkened) >= targetRatio) {
        alternatives.push({
          adjustedForeground: foreground,
          adjustedBackground: bgDarkened.hex()
        });
        break;
      }
    }
    
    // Strategy 4: Lighten background
    let bgLightened = bg;
    for (let i = 0; i < 20; i++) {
      bgLightened = bgLightened.brighten(0.3);
      if (chroma.contrast(fg, bgLightened) >= targetRatio) {
        alternatives.push({
          adjustedForeground: foreground,
          adjustedBackground: bgLightened.hex()
        });
        break;
      }
    }
    
  } catch (error) {
    console.error('Error generating alternatives:', error);
  }
  
  return alternatives;
}

/**
 * Parse HTML and extract color pairs
 */
export function parseHTMLColors(html: string, css: string = ''): ColorPair[] {
  // This is a simplified version - the actual parsing happens in the API route
  // This function is used for client-side previews
  return [];
}

/**
 * Format contrast ratio for display
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Get color name or description
 */
export function getColorName(hex: string): string {
  try {
    const color = chroma(hex);
    const hsl = color.hsl();
    const lightness = hsl[2];
    
    if (lightness < 0.1) return 'Very Dark';
    if (lightness < 0.3) return 'Dark';
    if (lightness < 0.5) return 'Medium Dark';
    if (lightness < 0.7) return 'Medium Light';
    if (lightness < 0.9) return 'Light';
    return 'Very Light';
  } catch {
    return 'Unknown';
  }
}

/**
 * Validate hex color
 */
export function isValidColor(color: string): boolean {
  try {
    chroma(color);
    return true;
  } catch {
    return false;
  }
}
