import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { readDraft } from '@/features/score-editor'
import { arrangeDraft } from './arrange-draft'

const B = TICKS_PER_BEAT

const draft = readDraft({
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C G'] }],
  staves: [{ notes: 'E4/4 | D4/4' }],
  hands: { rh: 'r/4 | r/4', lh: 'r/4 | G2/4' },
})

describe('arrangeDraft', () => {
  it('plays the draft as written: the hands’ notes alone, and its single staff heard (ADR 0097)', () => {
    const performance = arrangeDraft(draft)
    const staff = performance.notes.filter((n) => n.hand === 'staff')
    expect(staff.map((n) => [n.startTick, n.silent])).toEqual([
      [0, undefined],
      [4 * B, undefined],
    ])
    expect(
      performance.notes.filter((n) => n.hand !== 'staff').map((n) => [n.hand, n.midi, n.startTick]),
    ).toEqual([['lh', 43, 4 * B]])
  })
})
