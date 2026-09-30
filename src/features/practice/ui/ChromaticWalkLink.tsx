import { Link } from '@tanstack/react-router'
import { Footprints } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { noteParam, type ChordQuality, type SpelledNote } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import { chordsParam } from '../chromatic-choice'

/** A chord the table names, walked in the Player a semitone at a time from its root. */
export function ChromaticWalkLink({ root, quality }: { root: SpelledNote; quality: ChordQuality }) {
  const { t } = useTranslation('practice')
  return (
    <RowGroup title={t('inPlayer')}>
      <li>
        <RowLink
          title={t('chromatic')}
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
