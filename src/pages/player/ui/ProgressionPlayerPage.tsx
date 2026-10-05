import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { useViewChange, useGoBack } from '@/shared/lib'
import { numeralText } from '@/shared/lib/music'
import type { ProgressionSearch } from '../model/progression-search'
import { useProgressionPlayer } from '../model/use-progression-player'
import { PlayerLayout } from './PlayerLayout'
import { ProgressionSetup } from './ProgressionSetup'

/** A progression in the Player: numerals in any key, a chord a bar, with a song's patterns. */
export function ProgressionPlayerPage() {
  const { t } = useTranslation(['player', 'music'])
  const search = useSearch({ from: '/full-screen/play/progression' })
  const setSearch = useViewChange<ProgressionSearch>()
  const { choice, performance, player, fit, headings, changeSetup } = useProgressionPlayer(
    search,
    setSearch,
  )
  const close = useGoBack({
    to: '/practice/progressions',
    search: { p: search.p, key: search.key, size: choice.chordSize },
  })
  const keyName = useKeyName()
  const named = { numerals: choice.numerals.map(numeralText).join('–'), key: keyName(choice.key) }
  return (
    <PlayerLayout
      title={
        choice.walk
          ? t('player:progression.walking', { ...named, walk: t(`player:walking.${choice.walk}`) })
          : t('player:progression.title', named)
      }
      headings={headings}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      setup={
        <ProgressionSetup
          choice={choice}
          fit={fit}
          swing={search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
