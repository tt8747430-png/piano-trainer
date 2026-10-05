import { Link } from '@tanstack/react-router'
import { Footprints, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PatternId } from '@/entities/pattern'
import { useKeyName } from '@/shared/i18n'
import type { ChordSize, Key, KeyParam } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'

/** What the Player opens on: the progression, its key, and its chord size and pattern where it has them. */
export interface InPlayer {
  readonly p: string
  readonly key: KeyParam
  readonly chordSize?: Exclude<ChordSize, 'triads'>
  readonly pattern?: PatternId
}

/**
 * A progression practised in the Player, as Chords and Scales list theirs: in the key shown, and
 * through the keys round the circle of fifths.
 */
export function ProgressionPractice({ musicKey, inPlayer }: { musicKey: Key; inPlayer: InPlayer }) {
  const { t } = useTranslation(['practice', 'learn', 'player'])
  const keyName = useKeyName()
  return (
    <RowGroup title={t('practice:inPlayer')}>
      <li>
        <RowLink
          title={t('learn:progressions.inKey', { key: keyName(musicKey) })}
          icon={Music}
          paint="grass"
          render={<Link to="/play/progression" search={inPlayer} />}
        />
      </li>
      <li>
        <RowLink
          title={t('learn:progressions.throughKeys')}
          detail={t('player:walking.fifths')}
          icon={Footprints}
          paint="lilac"
          render={<Link to="/play/progression" search={{ ...inPlayer, walk: 'fifths' }} />}
        />
      </li>
    </RowGroup>
  )
}
