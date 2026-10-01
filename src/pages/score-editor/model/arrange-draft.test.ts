import { describe, expect, it } from 'vitest'
import { barsOf, readDraft } from '@/features/score-editor'
import { arrangeDraft, playedInBar } from './arrange-draft'

const draft = readDraft({
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C G'] }],
  melody: 'E4/4 | D4/4',
  hands: { lh: '- | G2/4' },
})

describe('arrangeDraft', () => {
  it('plays the draft as written: the pattern, the written hand, and the melody heard', () => {
    const performance = arrangeDraft(draft)
    expect(performance.notes.filter((n) => n.hand === 'melody').map((n) => n.startTick)).toEqual([
      0, 48,
    ])
    const [, second] = barsOf(draft)
    if (!second) throw new Error('a second bar')
    expect(playedInBar(performance, 'lh', second).map((n) => [n.midi, n.startTick])).toEqual([
      [43, 48],
    ])
  })

  it('gives what the pattern plays in a bar a hand leaves to it', () => {
    const [first] = barsOf(draft)
    if (!first) throw new Error('a first bar')
    const left = playedInBar(arrangeDraft(draft), 'lh', first)
    expect(left.length).toBeGreaterThan(0)
    expect(left.every((n) => n.startTick >= 0 && n.startTick < 48)).toBe(true)
  })
})
