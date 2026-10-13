import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { keyFromParam } from '@/shared/lib/music'
import { PAGE_TILES, RowGroup, RowLink } from '@/shared/ui'
import { passingBetween, type ProgressionsView } from '../model/progressions-view'

/**
 * A progression's tools, each opened on what the page shows (ADR 0044): Passing chords between its
 * first two chords, where it has two, and Reharmonise, both in its key.
 */
export function ProgressionTools({ view }: { view: ProgressionsView }) {
  const { t } = useTranslation(['practice', 'music'])
  const keyName = useKeyName()
  const between = passingBetween(view)
  return (
    <RowGroup title={t('practice:groups.tools')}>
      {between ? (
        <li>
          <RowLink
            title={t('practice:pages.passingChords')}
            detail={`${between.from} → ${between.to}`}
            {...PAGE_TILES.passingChords}
            render={<Link to="/practice/passing-chords" search={between} />}
          />
        </li>
      ) : null}
      <li>
        <RowLink
          title={t('practice:pages.reharmonise')}
          detail={t('music:key.in', { key: keyName(keyFromParam(view.key)) })}
          {...PAGE_TILES.reharmonise}
          render={<Link to="/practice/reharmonise" search={{ key: view.key }} />}
        />
      </li>
    </RowGroup>
  )
}
