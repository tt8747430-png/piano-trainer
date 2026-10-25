import { describe, expect, it } from 'vitest'
import { lastWord } from './last-word'

describe('lastWord', () => {
  it('parts a name before its last word', () => {
    expect(lastWord('Hide them on a phone on its side')).toEqual({
      head: 'Hide them on a phone on its',
      last: 'side',
    })
    expect(lastWord('Звук MIDI-клавиатуры')).toEqual({ head: 'Звук', last: 'MIDI-клавиатуры' })
  })

  it('keeps a name of one word whole, as its last word', () => {
    expect(lastWord('Metronome')).toEqual({ head: '', last: 'Metronome' })
    expect(lastWord(' Melody ')).toEqual({ head: '', last: 'Melody' })
  })
})
