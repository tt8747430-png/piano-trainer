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
})
