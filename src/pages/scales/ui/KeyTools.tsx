import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { keyParam, type Key } from '@/shared/lib/music'
import { PAGE_TILES, RowGroup, RowLink } from '@/shared/ui'

/** A key's tool, opened on the key (ADR 0044): Reharmonise, the chords that hold a melody note in it. */
export function KeyTools({ musicKey }: { musicKey: Key }) {
  const { t } = useTranslation(['practice', 'music'])
  const keyName = useKeyName()
  return (
    <RowGroup title={t('practice:groups.tools')}>
      <li>
        <RowLink
          title={t('practice:pages.reharmonise')}
          detail={t('music:key.in', { key: keyName(musicKey) })}
          {...PAGE_TILES.reharmonise}
          render={<Link to="/practice/reharmonise" search={{ key: keyParam(musicKey) }} />}
        />
      </li>
    </RowGroup>
  )
}
