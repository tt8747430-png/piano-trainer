import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, type BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { lineWords, lyricLines } from './lyric-lines'
import { sungPlace } from './sung-place'

const B = TICKS_PER_BEAT

/** A song of 4/4 bars in C, one line of the chart to a string, its words on a staff over the piano. */
function song(lines: readonly string[], { notes, lyrics }: { notes: string; lyrics: string[] }) {
  const piece: ChartPiece = {
    id: 'my-1',
    kind: 'song',
    title: 'Morning',
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines }],
    staves: [{ notes }],
    lyrics,
  }
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

// Bars of a word each: line 1 "One two", line 2 "three four", line 3 "five six".
const WORDS = {
  notes: 'E4/4 | F4/4 | G4/4 | A4/4 | B4/4 | C5/4',
  lyrics: ['One two three four five six'],
}

/** A 4/4 bar's beat, as played, in its ticks. */
const beat = (bar: number, beat = 0) => ({
  bar,
  played: { from: bar * 4 * B + beat * B, to: bar * 4 * B + (beat + 1) * B },
})

/** Where the words are, by what they say: the line sung or the wait's progress, and the next line. */
const place = (
  performance: Performance,
  at: ReturnType<typeof beat>,
  loop: BarRange | null = null,
) => {
  const found = sungPlace(performance, lyricLines(performance), at, loop)
  if (!found) return null
  const coming = found.coming ? lineWords(found.coming) : null
  return found.kind === 'line'
    ? { line: lineWords(found.line), coming }
    : { wait: found.progress, coming }
}

describe('sungPlace', () => {
  it('is the line sung, and the next as the bars are played, a repeat’s first line again', () => {
    // Played One two | One two | three four | five six.
    const repeated = song(['|: C F :|', 'G Am', 'Dm E'], WORDS)
    expect(place(repeated, beat(1))).toEqual({ line: 'One two', coming: 'One two' })
    expect(place(repeated, beat(3))).toEqual({ line: 'One two', coming: 'three four' })
    expect(place(repeated, beat(4))).toEqual({ line: 'three four', coming: 'five six' })
  })

  it('goes round to the loop’s first line where the loop goes round', () => {
    const plain = song(['C F', 'G Am', 'Dm E'], WORDS)
    expect(place(plain, beat(3))?.coming).toBe('five six')
    expect(place(plain, beat(3), { first: 2, last: 3 })?.coming).toBe('three four')
    expect(place(plain, beat(1), { first: 0, last: 1 })?.coming).toBe('One two')
  })

  it('waits between lines that sing, its beats counted to the next line’s first word', () => {
    const between = song(['C F', 'G Am', 'Dm E'], {
      notes: 'E4/4 | F4/4 | r/4 | r/4 | B4/4 | C5/4',
      lyrics: ['One two five six'],
    })
    expect(place(between, beat(0))).toEqual({ line: 'One two', coming: 'five six' })
    // The wait: bars 3 and 4, eight beats to "five".
    expect(place(between, beat(2))).toEqual({ wait: 1 / 8, coming: 'five six' })
    expect(place(between, beat(3, 1))).toEqual({ wait: 6 / 8, coming: 'five six' })
    expect(place(between, beat(3, 3))).toEqual({ wait: 1, coming: 'five six' })
    // A loop of bars 1–4 goes round to "One two" after the wait's eight beats.
    expect(place(between, beat(2), { first: 0, last: 3 })).toEqual({
      wait: 1 / 8,
      coming: 'One two',
    })
    expect(place(between, beat(4))).toEqual({ line: 'five six', coming: null })
  })

  it('waits from the music’s start for the first line sung', () => {
    const intro = song(['C F', 'G Am'], {
      notes: 'r/4 | r/4 | G4/4 | A4/4',
      lyrics: ['three four'],
    })
    expect(place(intro, beat(0))).toEqual({ wait: 1 / 8, coming: 'three four' })
    expect(place(intro, beat(1, 3))).toEqual({ wait: 1, coming: 'three four' })
  })

  it('is none past the last line sung', () => {
    const outro = song(['C F', 'G Am'], { notes: 'E4/4 | F4/4 | r/4 | r/4', lyrics: ['One two'] })
    expect(place(outro, beat(2))).toBeNull()
  })
})
