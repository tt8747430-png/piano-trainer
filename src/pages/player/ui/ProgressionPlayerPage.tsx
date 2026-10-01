import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { numeralText } from '@/shared/lib/music'
import type { ProgressionSearch } from '../model/progression-search'
import { useProgressionPlayer } from '../model/use-progression-player'
import { PlayerLayout } from './PlayerLayout'
import { ProgressionSetup } from './ProgressionSetup'

/** A progression in the Player: numerals in any key, a chord a bar, with a song's patterns. */
export function ProgressionPlayerPage() {
  const { t } = useTranslation(['player', 'music'])
  const search = useSearch({ from: '/full-screen/play/progression' })
  const navigate = useNavigate({ from: '/play/progression' })
  const setSearch = (patch: Partial<ProgressionSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useProgressionPlayer(search, setSearch)
  const close = useGoBack({
    to: '/learn/progressions',
    search: { p: search.p, key: search.key, size: choice.chordSize },
  })
  const keyName = useKeyName()
  return (
    <PlayerLayout
      title={t('player:progression.title', {
        numerals: choice.numerals.map(numeralText).join('–'),
        key: keyName(choice.key),
      })}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      setup={
        <ProgressionSetup
          choice={choice}
          swing={search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
