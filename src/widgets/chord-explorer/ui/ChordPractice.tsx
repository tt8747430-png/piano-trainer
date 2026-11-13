import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { exerciseOf, isArpeggioQuality } from '@/entities/exercise'
import { chordsParam, walkOpening } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import {
  isInversion,
  noteParam,
  printedNote,
  printedSymbol,
  qualitySuffix,
  spellChord,
  type ChordQuality,
  type KeyParam,
  type SpelledNote,
} from '@/shared/lib/music'
import { PractiseRow, PractiseRows } from '@/shared/ui'

const ARPEGGIO = exerciseOf('arpeggio')
const INVERSIONS = exerciseOf('inversions')
/** The chord walked through every key: Chromatically, then round the Circle of fifths (canvas 160). */
const WALKS = ['up', 'fifths'] as const

/**
 * A chord the table names, practised in the Player (the canvas's PRACTISE): its inversions and its
 * arpeggio where the exercises play it, then the chord walked through every key, Chromatically and
 * round the Circle of fifths, each row showing the music it plays, every chord in the inversion shown.
 */
export function ChordPractice({
  root,
  quality,
  inversion,
  changes,
}: {
  root: SpelledNote
  quality: ChordQuality
  /** The inversion shown, where the Player's right hand plays it the same: a chord of up to four notes. */
  inversion: number
  /** Several chords on the staff, as numerals in their key: played one after another, as written. */
  changes?: { readonly numerals: string; readonly key: KeyParam; readonly line: string } | undefined
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  // Each row shows its music (canvas 160): the chord's notes as it plays them.
  const names = spellChord(root, quality).map((tone) => printedNote(tone.note))
  const symbol = printedNote(root) + printedSymbol(qualitySuffix(quality))
  return (
    <PractiseRows
      title={changes ? t('chords.practiseThese') : t('chords.practiseIn', { chord: symbol })}
    >
      {changes ? (
        <PractiseRow
          title={t('chords.changes')}
          detail={changes.line}
          render={
            <Link to="/play/progression" search={{ p: changes.numerals, key: changes.key }} />
          }
        />
      ) : null}
      {isArpeggioQuality(quality) ? (
        <PractiseRow
          title={localText(INVERSIONS.name, locale)}
          detail={names
            .map((_, at) => [...names.slice(at), ...names.slice(0, at)].join(' '))
            .join(' · ')}
          render={
            <Link
              to="/play/exercise/$exerciseId"
              params={{ exerciseId: INVERSIONS.id }}
              search={{ root: noteParam(root), quality }}
            />
          }
        />
      ) : null}
      {isArpeggioQuality(quality) ? (
        <PractiseRow
          title={localText(ARPEGGIO.name, locale)}
          detail={`${names.join(' ')} ${names[0]} …`}
          render={
            <Link
              to="/play/exercise/$exerciseId"
              params={{ exerciseId: ARPEGGIO.id }}
              search={{ root: noteParam(root), quality }}
            />
          }
        />
      ) : null}
      {WALKS.map((direction) => (
        <PractiseRow
          key={direction}
          title={t(direction === 'up' ? 'chords.chromatic' : 'chords.fifths')}
          detail={walkOpening(root, quality, direction)}
          render={
            <Link
              to="/play/chromatic"
              search={{
                chords: chordsParam([quality]),
                root: noteParam(root),
                direction,
                ...(isInversion(inversion) ? { inversion } : {}),
                nearest: false,
              }}
            />
          }
        />
      ))}
    </PractiseRows>
  )
}
