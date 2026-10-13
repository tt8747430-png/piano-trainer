import { Link } from '@tanstack/react-router'
import { AudioWaveform, Footprints, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { exerciseOf, isArpeggioQuality } from '@/entities/exercise'
import { chordsParam } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { isInversion, noteParam, type ChordQuality, type SpelledNote } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'

const ARPEGGIO = exerciseOf('arpeggio')
const INVERSIONS = exerciseOf('inversions')

/**
 * A chord the table names, practised in the Player: its arpeggio and its inversions where the
 * exercises play it, and the
 * chord walked a semitone at a time from its root, every chord in the inversion shown.
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
  return (
    <RowGroup title={t('inPlayer')}>
      {isArpeggioQuality(quality) ? (
        <li>
          <RowLink
            title={localText(ARPEGGIO.name, locale)}
            detail={localText(ARPEGGIO.trains, locale)}
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
            detail={localText(INVERSIONS.trains, locale)}
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
      <li>
        <RowLink
          title={t('chromatic')}
          detail={t('chromaticDetail')}
          icon={Footprints}
          paint="lilac"
          render={
            <Link
              to="/play/chromatic"
              search={{
                chords: chordsParam([quality]),
                root: noteParam(root),
                ...(isInversion(inversion) ? { inversion } : {}),
                nearest: false,
              }}
            />
          }
        />
      </li>
    </RowGroup>
  )
}
