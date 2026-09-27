import { describe, expect, it } from 'vitest'

describe('test setup', () => {
  it('installs the jest-dom matchers', () => {
    const paragraph = document.createElement('p')
    document.body.append(paragraph)
    expect(paragraph).toBeInTheDocument()
  })

  it('answers prefers-color-scheme with light until a test says otherwise', () => {
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false)
  })

  it('loads fonts at once and measures text by its length, as a canvas does', async () => {
    await expect(document.fonts.load('30px Bravura')).resolves.toHaveLength(1)
    const context = document.createElement('canvas').getContext('2d')
    if (!context) throw new Error('No 2D context')
    context.font = '20px Onest'
    expect(context.measureText('abc').width).toBe(36)
  })
})
