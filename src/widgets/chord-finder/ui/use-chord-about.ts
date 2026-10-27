import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  alteredSymbol,
  noteName,
  printedSymbol,
  voicingKind,
  writtenSymbol,
  type FoundChord,
  type LeftOut,
  type Midi,
} from '@/shared/lib/music'
import { INVERSION_NAMES } from '@/shared/ui'

/** Each tone a hand leaves out, as the locales' `finder` key it. */
const LEFT_OUT_WORDS = {
  '3rd': 'no3rd',
  '5th': 'no5th',
  '9th': 'no9th',
  '11th': 'no11th',
} as const satisfies Readonly<Record<LeftOut, string>>

/** How a reading is written (ADR 0052): over its bass (`C/E`), or by its root alone (`C`). */
export const chordLabel = (found: FoundChord, slash: boolean): string =>
  slash ? found.symbol : writtenSymbol(found.chord)

/** What a found chord is said with: the keys that play it, and whether its name shows its bass. */
interface Telling {
  readonly keys?: readonly Midi[]
  readonly slash: boolean
}

/**
 * What a found chord is, in words (ADR 0052): its kind where the table names it; its inversion (or,
 * where the name leaves its bass out and the bass is no inversion, the note in the bass); each tone
 * left out; how the keys lay it out (close, open, drop 2 or 3, a shell, 4ths, So What); and an altered
 * dominant's chart name, printed as the sheets print a chord. The same function until the language
 * changes.
 */
export function useChordAbout(): (found: FoundChord, telling: Telling) => string[] {
  const { t } = useTranslation(['music', 'practice'])
  return useCallback(
    (found, { keys, slash }) => {
      // Its inversion's name where a tone of the chord is lowest (1 its 3rd, up to its 7th), never root.
      const word =
        found.inversion !== undefined && found.inversion >= 1
          ? INVERSION_NAMES[found.inversion]
          : undefined
      const inversion = !found.bass
        ? null
        : word
          ? t(`music:inversionName.${word}`)
          : slash
            ? null
            : t('practice:chordFinder.bass', { note: noteName(found.bass) })
      const voicing = keys ? voicingKind(keys, found) : undefined
      const altered = alteredSymbol(found)
      return [
        ...(found.chord.quality ? [t(`music:quality.${found.chord.quality}`)] : []),
        ...(inversion ? [inversion] : []),
        ...found.leftOut.map((tone) => t(`practice:chordFinder.${LEFT_OUT_WORDS[tone]}`)),
        ...(voicing ? [t(`practice:chordFinder.voicing.${voicing}`)] : []),
        ...(altered ? [t('practice:chordFinder.altered', { symbol: printedSymbol(altered) })] : []),
      ]
    },
    [t],
  )
}
