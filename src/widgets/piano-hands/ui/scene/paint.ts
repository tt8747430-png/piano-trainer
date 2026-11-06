import { Color, SRGBColorSpace } from 'three'

/**
 * Reads the app's colours for the 3D piano (R36): within `draw`, a token (`var(--hand-rh-wash)`) as
 * the theme resolves it under `host`. A browser reports a mixed colour in its own notation
 * (`oklab(…)`), so the colour is painted on a pixel and read back as plain red, green and blue.
 */
export function withPaint<T>(host: HTMLElement, draw: (read: (css: string) => Color) => T): T {
  const probe = document.createElement('span')
  probe.hidden = true
  host.append(probe)
  const pixel = document.createElement('canvas')
  pixel.width = 1
  pixel.height = 1
  const context = pixel.getContext('2d', { willReadFrequently: true })
  const read = (css: string): Color => {
    probe.style.color = css
    const computed = getComputedStyle(probe).color
    let colour = new Color(0xffffff)
    if (context) {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = '#ffffff'
      context.fillStyle = computed
      context.fillRect(0, 0, 1, 1)
      const [r = 255, g = 255, b = 255] = context.getImageData(0, 0, 1, 1).data
      colour = new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace)
    }
    return colour
  }
  try {
    return draw(read)
  } finally {
    probe.remove()
  }
}
