import { useTranslation } from 'react-i18next'
import {
  CHORD_FAMILIES,
  printedNote,
  printedSymbol,
  qualitiesIn,
  qualitySuffix,
  type ChordQuality,
  type SpelledNote,
} from '@/shared/lib/music'

/** A group of chord types: its family's name, and each type by its symbol on the root and its full name. */
export interface ChordTypeGroup {
  readonly label: string
  readonly options: readonly {
    readonly value: ChordQuality
    readonly label: string
    readonly detail: string
  }[]
}

/**
 * Every chord the app names, on a root, in the canvas's groups, each by its symbol first and then its
 * full name, as every chord list reads (canvas 148): the Chord picker's list and the Next chord
 * sheet's All chords.
 */
export function useChordTypes(root: SpelledNote): ChordTypeGroup[] {
  const { t } = useTranslation('music')
  return CHORD_FAMILIES.map((family) => ({
    label: t(`family.${family}`),
    options: qualitiesIn(family).map((each) => ({
      value: each,
      label: printedNote(root) + printedSymbol(qualitySuffix(each)),
      detail: t(`quality.${each}`),
    })),
  }))
}
