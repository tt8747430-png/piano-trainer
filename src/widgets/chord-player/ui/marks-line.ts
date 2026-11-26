import type { TFunction } from 'i18next'
import type { ArrangerNumber, Main, SectionMarks } from '@/shared/lib/arrangement'

/** The arranger's numbers as the Genos writes them. */
export const ROMAN: Readonly<Record<ArrangerNumber, string>> = { 1: 'I', 2: 'II', 3: 'III' }

/** A section's marks in a line, as its head's tag shows them: "Intro I · Main A, Main B · Fill in". */
export function marksLine(marks: SectionMarks, t: TFunction<'practice'>): string {
  const mains = marks.mains.filter((main): main is Main => main !== null)
  return [
    marks.intro === null ? null : t('chordPlayer.arranger.intro', { n: ROMAN[marks.intro] }),
    mains.length ? mains.map((main) => t('chordPlayer.arranger.main', { main })).join(', ') : null,
    marks.into === null ? null : t(`chordPlayer.arranger.into.${marks.into}`),
    marks.ending === null ? null : t('chordPlayer.arranger.ending', { n: ROMAN[marks.ending] }),
  ]
    .filter(Boolean)
    .join(' · ')
}
