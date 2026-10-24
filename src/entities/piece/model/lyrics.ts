import type { Chart, ChartBar, HandNote, Melody } from '@/shared/lib/arrangement'
import type { NoteLyrics, Syllable } from '@/shared/lib/music'
import { ContentError } from './content-error'
import type { ChartPiece } from './types'

/** A verse aligned to the tune's notes in order (ADR 0093): null under a note that sings nothing. */
export type Verse = readonly (Syllable | null)[]

/** A syllable's text, then `-` where its word goes on, then one `_` for each note it is held over. */
const TOKEN = /^(.*?)(-?)(_*)$/

/**
 * A verse as the content writes it (docs/CONTENT.md): syllables parted by spaces, each under the
 * tune's next note; `-` ends a syllable its word carries on (`A- ma- zing`), `_` holds it over the
 * next note (a melisma, one `_` a note), `~` leaves a note's place empty.
 */
export function readLyrics(text: string): Verse {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((token): Verse => {
      if (token === '~') return [null]
      const [, word = '', hyphen, held = ''] = TOKEN.exec(token) ?? []
      return [
        { text: word, hyphen: hyphen === '-', melisma: held.length > 0 },
        ...Array.from(held, () => null),
      ]
    })
}

/** A verse written back as `readLyrics` reads it: a melisma over the empty places that follow it. */
export function writeLyrics(verse: Verse): string {
  const tokens: string[] = []
  for (let i = 0; i < verse.length; i++) {
    const sung = verse[i]
    if (!sung) {
      tokens.push('~')
      continue
    }
    let held = 0
    if (sung.melisma) while (i + 1 + held < verse.length && verse[i + 1 + held] === null) held++
    tokens.push(`${sung.text}${sung.hyphen ? '-' : ''}${'_'.repeat(held)}`)
    i += held
  }
  return tokens.join(' ')
}

/** What each verse sings on the tune's note `index`, by verse; none where every verse sings nothing. */
function sungAt(verses: readonly Verse[], index: number): NoteLyrics | undefined {
  const sung = verses.map((verse) => verse[index] ?? null)
  while (sung.length > 0 && sung.at(-1) === null) sung.pop()
  return sung.length > 0 ? sung : undefined
}

/** The verses the tune's notes sing, in order, as many as any note has; each note's place filled. */
export function gatherLyrics(tune: readonly { readonly lyrics?: NoteLyrics }[]): Verse[] {
  const count = Math.max(0, ...tune.map((n) => n.lyrics?.length ?? 0))
  return Array.from({ length: count }, (_, verse) => tune.map((n) => n.lyrics?.[verse] ?? null))
}

/**
 * The note each onset sings on, in time order, where the right hand is the tune: the one of its
 * chord carrying words, else its highest.
 */
export function singingNotes<
  N extends { readonly startTick: number; readonly midi: number; readonly lyrics?: NoteLyrics },
>(notes: readonly N[]): N[] {
  const sings = new Map<number, N>()
  for (const n of notes) {
    const held = sings.get(n.startTick)
    if (!held || (n.lyrics && !held.lyrics) || (n.midi > held.midi && !held.lyrics))
      sings.set(n.startTick, n)
  }
  return [...sings.values()].sort((a, b) => a.startTick - b.startTick)
}

const barsOf = (chart: Chart): ChartBar[] =>
  chart.sections.flatMap((section) => section.lines.flat())

/** The right hand's notes as written, bar by bar: each bar's from its own start, so onsets never meet across bars. */
const handTune = (chart: Chart): HandNote[][] =>
  barsOf(chart).map((bar) => singingNotes(bar.hands?.rh ?? []))

/** How many notes the tune a piece sings on has: the melody's, else the right hand's onsets. */
export const tuneLength = (chart: Chart, melody: Melody | undefined): number =>
  melody ? melody.length : handTune(chart).reduce((sum, bar) => sum + bar.length, 0)

/** The melody with its verses on its notes. */
export const withMelodyLyrics = (melody: Melody, verses: readonly Verse[]): Melody =>
  melody.map((n, i) => {
    const lyrics = sungAt(verses, i)
    return lyrics ? { ...n, lyrics } : n
  })

/** The chart with its verses on the right hand's notes, the highest at each onset singing. */
export function withHandLyrics(chart: Chart, verses: readonly Verse[]): Chart {
  let index = 0
  const sung = (bar: ChartBar): ChartBar => {
    const rh = bar.hands?.rh
    if (!rh) return bar
    const tops = new Set(singingNotes(rh))
    const notes = rh.map((n) => {
      if (!tops.has(n)) return n
      const lyrics = sungAt(verses, index++)
      return lyrics ? { ...n, lyrics } : n
    })
    return { ...bar, hands: { ...bar.hands, rh: notes } }
  }
  return {
    ...chart,
    sections: chart.sections.map((section) => ({
      ...section,
      lines: section.lines.map((line) => line.map(sung)),
    })),
  }
}

/**
 * A piece's verses read (docs/CONTENT.md), each no longer than its tune of `tune` notes; none for a
 * piece without words. A verse too long is the content's mistake: a ContentError names it.
 */
export function parseLyrics(piece: ChartPiece, tune: number): Verse[] | undefined {
  if (piece.lyrics === undefined) return undefined
  return piece.lyrics.map((text, v) => {
    const verse = readLyrics(text)
    if (verse.length > tune) {
      throw new ContentError(
        piece.id,
        { verse: v + 1 },
        `the verse sings ${verse.length} notes of a tune of ${tune}`,
      )
    }
    return verse
  })
}
