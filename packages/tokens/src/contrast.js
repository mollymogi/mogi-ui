// Shared by the docs swatches and CI; accepts opaque #rrggbb / rgb() colors.
export function rgb(color) {
  if (/^#[\da-f]{6}$/i.test(color)) {
    return [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16))
  }
  const match = color.match(/^rgb\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)\s*\)$/)
  if (!match) throw new Error(`Unsupported opaque color: ${color}`)
  return match.slice(1).map(Number)
}

export function contrast(foreground, background) {
  const luminance = (color) => rgb(color).map((n) => {
    const s = n / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0)
  const a = luminance(foreground), b = luminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

export function labelColor(background, dark = "#291b15") {
  if (contrast(dark, background) >= 4.5) return dark
  if (contrast("#ffffff", background) >= 4.5) return "#ffffff"
  return "#000000"
}

export function composite(foreground, background, alpha) {
  const fg = rgb(foreground), bg = rgb(background)
  return `rgb(${fg.map((v, i) => Math.round(v * alpha + bg[i] * (1 - alpha))).join(", ")})`
}
