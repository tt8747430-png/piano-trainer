import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { arrangeDraft } from './arrange-draft'

const draft = readDraft({
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C G'] }],
  melody: 'E4/4 | D4/4',
  hands: { rh: 'r/4 | r/4', lh: 'r/4 | G2/4' },
})

describe('arrangeDraft', () => {
  it('plays the draft as written: the hands’ notes alone, and the melody heard', () => {
    const performance = arrangeDraft(draft)
    expect(performance.notes.filter((n) => n.hand === 'melody').map((n) => n.startTick)).toEqual([
      0, 96,
    ])
    expect(
      performance.notes
        .filter((n) => n.hand !== 'melody')
        .map((n) => [n.hand, n.midi, n.startTick]),
    ).toEqual([['lh', 43, 96]])
  })
})
