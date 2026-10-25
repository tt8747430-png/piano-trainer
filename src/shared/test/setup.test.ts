// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'

// Made beside the tests, so it lives across them, as a worker keeps every mock (`isolate: false`):
// the tests below run in order, each looking at what the one before left.
const heard = vi.fn()

describe('test setup', () => {
  it('installs the jest-dom matchers', () => {
    const paragraph = document.createElement('p')
    document.body.append(paragraph)
    expect(paragraph).toBeInTheDocument()
  })

  it('answers prefers-color-scheme with light until a test says otherwise', () => {
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false)
  })

  it('lets a test call a mock with its page', () => {
    heard(document.body)
    expect(heard).toHaveBeenCalledWith(document.body)
  })

  it('forgets the mock’s calls by the next test', () => {
    expect(heard).not.toHaveBeenCalled()
  })
})
