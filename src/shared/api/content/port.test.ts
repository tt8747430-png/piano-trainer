import { describe, expect, it } from 'vitest'
import { createFakeContent, filesContent } from './port'

describe('filesContent', () => {
  it('has everything on the device: it reads at once and ensures without asking', async () => {
    const content = filesContent()
    expect(content.has('piece', 'bz5')).toBe(true)
    expect(await content.ensure('lesson', 'anything')).toEqual({ ok: true, value: undefined })
  })
})

describe('createFakeContent', () => {
  it('fetches what is not on the device, then has it', async () => {
    const content = createFakeContent({ away: [['piece', 'bz5']] })
    expect(content.has('piece', 'bz5')).toBe(false)
    expect(await content.ensure('piece', 'bz5')).toEqual({ ok: true, value: undefined })
    expect(content.has('piece', 'bz5')).toBe(true)
  })

  it('says offline for what is away while the device has no connection', async () => {
    const content = createFakeContent({ away: [['piece', 'bz5']], online: () => false })
    expect(await content.ensure('piece', 'bz5')).toEqual({ ok: false, reason: 'offline' })
    expect(await content.ensure('piece', 'bz6')).toEqual({ ok: true, value: undefined })
  })

  it('refuses what the server has not got, or will not give this learner', async () => {
    const content = createFakeContent({ refused: [['lesson', 'hidden']] })
    expect(await content.ensure('lesson', 'hidden')).toEqual({
      ok: false,
      reason: 'refused',
      detail: 'lesson hidden',
    })
  })
})
