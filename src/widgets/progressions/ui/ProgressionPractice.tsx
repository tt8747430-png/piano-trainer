import { Link } from '@tanstack/react-router'
import { Footprints, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { KEY_WALKS, type Key } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import type { InPlayer } from '../model/progressions-view'

/**
 * A progression practised in the Player, as Chords and Scales list theirs: in the key shown, and
 * through the keys, a row for each walk the Player has.
 */
export function ProgressionPractice({ musicKey, inPlayer }: { musicKey: Key; inPlayer: InPlayer }) {
  const { t } = useTranslation(['practice', 'learn', 'player'])
  const keyName = useKeyName()
  return (
    <>
      <RowGroup title={t('practice:inPlayer')}>
        <li>
          <RowLink
            title={t('learn:progressions.inKey', { key: keyName(musicKey) })}
            icon={Music}
            paint="grass"
            render={<Link to="/play/progression" search={inPlayer} />}
          />
        </li>
      </RowGroup>
      <RowGroup title={t('learn:progressions.throughKeys')}>
        {KEY_WALKS.map((walk) => (
          <li key={walk}>
            <RowLink
              title={t(`player:keyWalk.${walk}`)}
              icon={Footprints}
              paint="lilac"
              render={<Link to="/play/progression" search={{ ...inPlayer, walk }} />}
            />
          </li>
        ))}
      </RowGroup>
    </>
  )
}
