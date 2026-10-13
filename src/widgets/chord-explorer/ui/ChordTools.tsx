import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { keyListParam } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { PAGE_TILES, RowGroup, RowLink } from '@/shared/ui'

/**
 * A chord's tool, opened on what the page shows (ADR 0044): the Chord finder on the chord's own keys,
 * which names it and says what else the keys can be called.
 */
export function ChordTools({ keys }: { keys: readonly Midi[] }) {
  const { t } = useTranslation('practice')
  return (
    <RowGroup title={t('groups.tools')}>
      <li>
        <RowLink
          title={t('pages.chordFinder')}
          detail={t('theseKeys')}
          {...PAGE_TILES.chordFinder}
          render={<Link to="/practice/chord-finder" search={{ keys: keyListParam(keys) }} />}
        />
      </li>
    </RowGroup>
  )
}
