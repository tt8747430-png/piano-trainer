import { Link } from '@tanstack/react-router'
import { Footprints, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { useKeyName } from '@/shared/i18n'
import { KEY_WALKS, parseNumerals, type Key } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import type { InPlayer } from '../model/progressions-view'
import { walkPreview } from '../model/walk-preview'

/**
 * A progression practised in the Player, as Chords and Scales list theirs: in the key shown, and
 * through the keys, a row for each walk the Player has, saying the chords it plays first.
 */
export function ProgressionPractice({ musicKey, inPlayer }: { musicKey: Key; inPlayer: InPlayer }) {
  const { t } = useTranslation(['practice', 'music', 'player'])
  const keyName = useKeyName()
  const inKey = useFold('progressions.practice')
  const walks = useFold('progressions.walks')
  const numerals = parseNumerals(inPlayer.p) ?? []
  const size = inPlayer.chordSize ?? 'triads'
  return (
    <>
      <RowGroup title={t('practice:inPlayer')} fold={inKey}>
        <li>
          <RowLink
            title={t('music:key.in', { key: keyName(musicKey) })}
            icon={Music}
            paint="grass"
            render={<Link to="/play/progression" search={inPlayer} />}
          />
        </li>
      </RowGroup>
      <RowGroup title={t('practice:progressions.throughKeys')} fold={walks}>
        {KEY_WALKS.map((walk) => (
          <li key={walk}>
            <RowLink
              title={t(`player:keyWalk.${walk}`)}
              detail={walkPreview(numerals, musicKey, walk, size)}
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
