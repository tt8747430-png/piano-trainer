/**
 * jsdom has no fonts and no canvas. `document.fonts.load` resolves at once (or fails, `loads: false`),
 * and every canvas's 2D context measures text as 0.6em a character, which VexFlow engraves by. Called
 * before every test by the setup; a test that needs the font to fail calls it again.
 */
export function stubFonts({ loads = true }: { loads?: boolean } = {}) {
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: {
      load: () =>
        loads
          ? Promise.resolve([{ family: 'stub' }])
          : Promise.reject(new Error('The font did not load')),
    },
  })
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: () => ({
      font: '10px sans-serif',
      measureText(this: { font: string }, text: string) {
        const size = Number.parseFloat(/(\d+(?:\.\d+)?)(?:px|pt)/.exec(this.font)?.[1] ?? '10')
        const width = text.length * size * 0.6
        return {
          width,
          actualBoundingBoxAscent: size * 0.8,
          actualBoundingBoxDescent: size * 0.2,
          actualBoundingBoxLeft: 0,
          actualBoundingBoxRight: width,
          fontBoundingBoxAscent: size,
          fontBoundingBoxDescent: size * 0.25,
        }
      },
    }),
  })
}
