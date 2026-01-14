
/**
 * WCAG 2.1 Contrast Ratio Utility
 * 
 * Formula: (L1 + 0.05) / (L2 + 0.05)
 * L1 is the relative luminance of the lighter color
 * L2 is the relative luminance of the darker color
 */

export const getLuminance = (hex: string): number => {
    const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0]
    const [r, g, b] = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const getContrastRatio = (c1: string, c2: string): number => {
    const l1 = getLuminance(c1)
    const l2 = getLuminance(c2)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    return parseFloat(ratio.toFixed(2))
}

export const checkContrast = (color: string, bgColor: string, level: 'AA' | 'AAA' = 'AA', isLargeText = false): boolean => {
    const ratio = getContrastRatio(color, bgColor)
    if (level === 'AAA') return isLargeText ? ratio >= 4.5 : ratio >= 7
    return isLargeText ? ratio >= 3 : ratio >= 4.5
}
