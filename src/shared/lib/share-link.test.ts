// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { shareLink } from './share-link'

const LINK = { title: 'Triads', path: '/lessons/triads' }

afterEach(() => {
  Reflect.deleteProperty(navigator, 'share')
  Reflect.deleteProperty(navigator, 'clipboard')
})

describe('shareLink (round 28)', () => {
  it('hands the link to the share sheet where there is one', async () => {
    const share = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    expect(await shareLink(LINK)).toBe('shared')
    expect(share).toHaveBeenCalledWith({
      title: 'Triads',
      url: `${window.location.origin}/lessons/triads`,
    })
  })

  it('copies it where there is none', async () => {
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    expect(await shareLink(LINK)).toBe('copied')
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/lessons/triads`)
  })

  it('says nothing of a share sheet closed, and a failure where neither works', async () => {
    const closed = async () => {
      throw new DOMException('closed', 'AbortError')
    }
    Object.defineProperty(navigator, 'share', { value: closed, configurable: true })
    expect(await shareLink(LINK)).toBeNull()
    Reflect.deleteProperty(navigator, 'share')
    const refused = async () => {
      throw new Error('denied')
    }
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: refused },
      configurable: true,
    })
    expect(await shareLink(LINK)).toBe('failed')
  })
})
