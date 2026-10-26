import { describe, expect, it } from 'vitest'
import { draftOf, form, shape } from '../testing/test-draft'
import { firstLine } from './first-line'

describe('firstLine', () => {
  it('keeps the first line of the first section, and the notes in it', () => {
    const draft = draftOf({
      key: 'C',
      sections: [
        { kind: 'verse', lines: ['C G', 'F C'] },
        { kind: 'chorus', lines: ['Am'] },
      ],
      hands: { rh: 'C4/4 | D4/4 | E4/4 | - | -' },
    })
    const line = firstLine(draft)
    expect(form(line)).toEqual([[['C@0', 'G@0']]])
    expect(shape(line.hands.rh)).toEqual(['C4@0/96', 'D4@96/96'])
    expect(line.sections[0]?.heading).toEqual(draft.sections[0]?.heading)
  })

  it('is the draft itself where it has one line', () => {
    const draft = draftOf()
    expect(firstLine(draft)).toBe(draft)
  })
})
