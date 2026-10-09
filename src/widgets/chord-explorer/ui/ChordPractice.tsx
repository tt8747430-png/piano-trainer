import { Link } from '@tanstack/react-router'
import { AudioWaveform, Footprints } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { exerciseOf, isArpeggioQuality } from '@/entities/exercise'
import { chordsParam } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { noteParam, type ChordQuality, type SpelledNote } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'

const ARPEGGIO = exerciseOf('arpeggio')

/**
 * A chord the table names, practised in the Player: its arpeggio where the exercise plays it, and the
 * chord walked a semitone at a time from its root.
 */
export function ChordPractice({ root, quality }: { root: SpelledNote; quality: ChordQuality }) {
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
      <li>
        <RowLink
          title={t('chromatic')}
          detail={t('chromaticDetail')}
          icon={Footprints}
          paint="lilac"
          render={
            <Link
              to="/play/chromatic"
              search={{ chords: chordsParam([quality]), root: noteParam(root) }}
            />
          }
        />
      </li>
    </RowGroup>
  )
}
