import { Link } from '@tanstack/react-router'
import { AudioWaveform, Disc3, Footprints, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { exerciseOf, isArpeggioQuality } from '@/entities/exercise'
import { chordsParam, walkOpening } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import {
  isInversion,
  noteParam,
  printedNote,
  spellChord,
  type ChordQuality,
  type SpelledNote,
} from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'

const ARPEGGIO = exerciseOf('arpeggio')
const INVERSIONS = exerciseOf('inversions')
/** The chord walked through every key: Chromatically, then round the Circle of fifths (canvas 160). */
const WALKS = [
  { direction: 'up', icon: Footprints },
  { direction: 'fifths', icon: Disc3 },
] as const

/**
 * A chord the table names, practised in the Player: its arpeggio and its inversions where the
 * exercises play it, and the chord walked through every key, Chromatically and round the Circle of
 * fifths, each row showing its first chords, every chord in the inversion shown.
 */
export function ChordPractice({
  root,
  quality,
  inversion,
}: {
  root: SpelledNote
  quality: ChordQuality
  /** The inversion shown, where the Player's right hand plays it the same: a chord of up to four notes. */
  inversion: number
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const fold = useFold('chords.practice')
  // Each row shows its music (canvas 160): the chord's notes as it plays them.
  const names = spellChord(root, quality).map((tone) => printedNote(tone.note))
  return (
    <RowGroup title={t('inPlayer')} fold={fold}>
      {isArpeggioQuality(quality) ? (
        <li>
          <RowLink
            title={localText(ARPEGGIO.name, locale)}
            detail={`${names.join(' ')} ${names[0]} …`}
            icon={AudioWaveform}
            paint="sky"
            render={
              <Link
                to="/play/exercise/$exerciseId"
                params={{ exerciseId: ARPEGGIO.id }}
                search={{ root: noteParam(root), quality }}
              />
            }
          />
        </li>
      ) : null}
      {isArpeggioQuality(quality) ? (
        <li>
          <RowLink
            title={localText(INVERSIONS.name, locale)}
            detail={names
              .map((_, at) => [...names.slice(at), ...names.slice(0, at)].join(' '))
              .join(' · ')}
            icon={Layers}
            paint="sky"
            render={
              <Link
                to="/play/exercise/$exerciseId"
                params={{ exerciseId: INVERSIONS.id }}
                search={{ root: noteParam(root), quality }}
              />
            }
          />
        </li>
      ) : null}
      {WALKS.map(({ direction, icon }) => (
        <li key={direction}>
          <RowLink
            title={t(direction === 'up' ? 'chords.chromatic' : 'chords.fifths')}
            detail={walkOpening(root, quality, direction)}
            icon={icon}
            paint="lilac"
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
        </li>
      ))}
    </RowGroup>
  )
}
