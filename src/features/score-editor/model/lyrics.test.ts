import { describe, expect, it } from 'vitest'
import { gatherLyrics, writeLyrics } from '@/entities/piece'
import { draftOf } from '../testing/test-draft'
import { tuneNotes, writeDraft } from './draft'
import {
  setSyllable,
  singsHere,
  sungAt,
  sungNear,
  syllableAt,
  tuneLayer,
  verseCount,
} from './lyrics'

/** A tune of four quarters in bar 1, bar 2 silent; the piano written and silent. */
const sung = draftOf({
  key: 'C',
  sections: [{ kind: 'verse', lines: ['C G'] }],
  melody: 'C4/1 D4/1 E4/1 F4/1 | r/4',
  hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
  lyrics: ['Si-_ lent night,'],
})
const verses = (draft: typeof sung) => gatherLyrics(tuneNotes(draft)).map(writeLyrics)

describe('the words in the editor (ADR 0093)', () => {
  it('go under the tune’s staff: the melody’s where the score has it, else the upper staff, in sight', () => {
    expect(tuneLayer(sung)).toBe('melody')
    expect(singsHere(sung, 'melody')).toBe(true)
    expect(singsHere(sung, 'rh')).toBe(false)
    expect(singsHere({ ...sung, hidden: ['melody'] }, 'melody')).toBe(false)
    const piano = draftOf({ hands: { rh: 'G4+B4/2 D5/2 | r/4', lh: 'r/4 | r/4' } })
    expect(tuneLayer(piano)).toBe('rh')
    expect(singsHere(piano, 'rh')).toBe(true)
    expect(singsHere(piano, 'lh')).toBe(false)
  })

  it('count the verses, find the note singing at a tick and the tune’s notes on either side', () => {
    expect(verseCount(sung)).toBe(1)
    expect(verseCount(draftOf())).toBe(0)
    expect(sungAt(sung, 24)?.midi).toBe(62)
    expect(sungAt(sung, 96)).toBeNull()
    expect(sungNear(sung, 24, 1)).toBe(48)
    expect(sungNear(sung, 24, -1)).toBe(0)
    expect(sungNear(sung, 72, 1)).toBeNull()
    expect(sungNear(sung, 0, -1)).toBeNull()
  })

  it('show each note’s syllable as the field writes it: its dash and the notes it is held over', () => {
    expect([0, 24, 48, 72].map((tick) => syllableAt(sung, tick, 0))).toEqual([
      'Si-_',
      '',
      'lent',
      'night,',
    ])
    expect(syllableAt(sung, 0, 1)).toBe('')
  })

  it('set a syllable on the note at the caret, a melisma silencing the notes it is held over', () => {
    const changed = setSyllable(sung, 24, 0, 'lent')
    expect(verses(changed)).toEqual(['Si- lent lent night,'])
    const held = setSyllable(sung, 0, 0, 'Si__')
    expect(verses(held)).toEqual(['Si__ night,'])
    expect(verses(setSyllable(held, 24, 0, 'x'))).toEqual(['Si x ~ night,'])
    expect(verses(setSyllable(sung, 72, 0, ''))).toEqual(['Si-_ lent ~'])
    expect(verses(setSyllable(sung, 72, 0, '~'))).toEqual(['Si-_ lent ~'])
    expect(setSyllable(sung, 96, 0, 'x')).toBe(sung)
  })

  it('start a verse where none was, written with the music', () => {
    const second = setSyllable(sung, 48, 1, 'Nacht')
    expect(verseCount(second)).toBe(2)
    expect(writeDraft(second).lyrics).toEqual(['Si-_ lent night,', '~ ~ Nacht ~'])
    // Taken back, the verse goes.
    expect(writeDraft(setSyllable(second, 48, 1, '')).lyrics).toEqual(['Si-_ lent night,'])
  })

  it('sing a chord of the upper staff on one note where the piano is the tune', () => {
    const piano = draftOf({ hands: { rh: 'G4+B4/2 D5/2 | r/4', lh: 'r/4 | r/4' } })
    const worded = setSyllable(setSyllable(piano, 0, 0, 'A-'), 48, 0, 'men')
    expect(writeDraft(worded).lyrics).toEqual(['A- men'])
    expect(worded.hands.rh.filter((n) => n.lyrics).map((n) => n.midi)).toEqual([71, 74])
  })
})
