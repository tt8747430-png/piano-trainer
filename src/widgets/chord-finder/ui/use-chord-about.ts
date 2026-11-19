import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  alteredSymbol,
  keysHolding,
  numeralText,
  printedNote,
  printedSymbol,
  sameKey,
  voicingKind,
  writtenSymbol,
  type FoundChord,
  type Key,
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
 * What a found chord is, in words (ADR 0052; canvas 181's "C major 7th, 1st inversion · Imaj7 in C
 * major"): its root and kind where the table names it, with its inversion (or, where the name leaves
 * its bass out and the bass is no inversion, the note in the bass); each tone left out; how the keys
 * lay it out, where it is more than a close voicing (open, drop 2 or 3, a shell, 4ths, So What); an
 * altered dominant's chart name. Its numeral in the key it is spelled in is the key picker's, never
 * the line's (the board's "Imaj7 in C major ⌃"). The same function until the language changes.
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
            : t('practice:chordFinder.bass', { note: printedNote(found.bass) })
      const voicing = keys ? voicingKind(keys, found) : undefined
      const altered = alteredSymbol(found)
      const { root, quality } = found.chord
      const named = quality
        ? t('practice:chordFinder.named', {
            root: printedNote(root),
            quality: t(`music:quality.${quality}`),
          })
        : undefined
      const head = [named, inversion].filter((part) => part).join(', ')
      return [
        ...(head ? [head] : []),
        ...found.leftOut.map((tone) => t(`practice:chordFinder.${LEFT_OUT_WORDS[tone]}`)),
        ...(voicing && voicing !== 'close' ? [t(`practice:chordFinder.voicing.${voicing}`)] : []),
        ...(altered ? [t('practice:chordFinder.altered', { symbol: printedSymbol(altered) })] : []),
      ]
    },
    [t],
  )
}

/**
 * The chord's numeral in the key it is spelled in, printed as the sheets print a chord (`Imaj7`), where
 * the key holds it; the key picker shows it before the key's name.
 */
export function useChordNumeral(found: FoundChord | undefined, musicKey: Key): string | undefined {
  const quality = found?.chord.quality
  const there =
    found && quality
      ? keysHolding(found.chord.root, quality).find((holding) => sameKey(holding.key, musicKey))
      : undefined
  return there ? printedSymbol(numeralText(there.numeral)) : undefined
}
