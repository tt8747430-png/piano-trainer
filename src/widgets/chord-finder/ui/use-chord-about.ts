import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { FoundChord, LeftOut } from '@/shared/lib/music'

/** Each tone a hand leaves out, as the locales' `finder` key it. */
const LEFT_OUT_WORDS = {
  '3rd': 'no3rd',
  '5th': 'no5th',
  '9th': 'no9th',
  '11th': 'no11th',
} as const satisfies Readonly<Record<LeftOut, string>>

/**
 * What a found chord is, in words: its kind where the table names it, then each tone left out. The
 * same function until the language changes.
 */
export function useChordAbout(): (found: FoundChord) => string[] {
  const { t } = useTranslation(['learn', 'music'])
  return useCallback(
    (found) => [
      ...(found.chord.quality ? [t(`music:quality.${found.chord.quality}`)] : []),
      ...found.leftOut.map((tone) => t(`learn:finder.${LEFT_OUT_WORDS[tone]}`)),
    ],
    [t],
  )
}
