import { describe, expect, it } from 'vitest'
import { LESSONS } from '@/entities/lesson'
import { pieceById, type Piece } from '@/entities/piece'
import type { NoteSound, Sound } from '@/shared/lib/schedule'
import { patternOpening } from './pattern-example'

function piece(id: string): Piece {
  const found = pieceById(id)
  if (!found) throw new Error(`${id} is missing`)
  return found
}

const noteSounds = (sounds: readonly Sound[]): NoteSound[] =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound] : []))

describe('patternOpening', () => {
  it('plays the piece’s first line with the pattern, both hands, and no further', () => {
    const notes = noteSounds(patternOpening(piece('ex3'), 'M1').sounds)
    // C Dm G C: four bars of 4/4 at the study's 76 beats a minute.
    const lineEnd = (4 * 4 * 60) / 76
    expect(notes.every((sound) => sound.at < lineEnd)).toBe(true)
    expect(notes.some((sound) => sound.at >= (lineEnd * 3) / 4)).toBe(true)
    expect(notes.some((sound) => sound.midi < 60)).toBe(true)
    expect(notes.some((sound) => sound.midi > 60)).toBe(true)
  })

  it('ends a piece in 3/4 where its first line of 3/4 bars ends', () => {
    const notes = noteSounds(patternOpening(piece('amazing'), 'r3').sounds)
    // G G7 C G: four bars of 3/4 at the hymn's 80 beats a minute.
    const lineEnd = (4 * 3 * 60) / 80
    expect(notes.every((sound) => sound.at < lineEnd)).toBe(true)
    expect(notes.some((sound) => sound.at >= (lineEnd * 3) / 4)).toBe(true)
  })

  it('shows the keys it plays, lowest first, each once, unmarked', () => {
    const opening = patternOpening(piece('ex3'), 'M2')
    const keys = [...new Set(noteSounds(opening.sounds).map((sound) => sound.midi))].sort(
      (a, b) => a - b,
    )
    expect(opening.shown.keys).toEqual(keys)
    expect(opening.shown.marks.size).toBe(0)
  })

  it('plays the tune under a pattern that doubles it', () => {
    const notes = noteSounds(patternOpening(piece('otche'), 'r5').sounds)
    // The hymn's upbeat: C4 before the first bar.
    expect(notes.some((sound) => sound.midi === 60 && sound.at === 0)).toBe(true)
  })

  it('plays every lesson’s pattern over its piece, from its first chord', () => {
    const blocks = LESSONS.flatMap((lesson) =>
      lesson.sections.flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === 'pattern' ? [block] : [])),
      ),
    )
    expect(blocks.length).toBeGreaterThan(0)
    for (const block of blocks) {
      const notes = noteSounds(patternOpening(piece(block.piece), block.pattern).sounds)
      expect(notes.length, `${block.pattern} over ${block.piece}`).toBeGreaterThan(0)
      expect(Math.min(...notes.map((sound) => sound.at))).toBe(0)
    }
  })
})
