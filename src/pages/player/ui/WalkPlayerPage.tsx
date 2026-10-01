import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { useWalkPlayer } from '../model/use-walk-player'
import type { WalkSearch } from '../model/walk-search'
import { PlayerLayout } from './PlayerLayout'
import { WalkSetup } from './WalkSetup'

/** Walk the chords in the Player: a scale's chords up to the tonic's octave and back, with a song's patterns. */
export function WalkPlayerPage() {
  const { t } = useTranslation('player')
  const scaleName = useScaleName()
  const search = useSearch({ from: '/full-screen/play/walk' })
  const navigate = useNavigate({ from: '/play/walk' })
  const close = useGoBack({
    to: '/learn/scales',
    search: { root: search.root, kind: search.kind, show: 'chords' },
  })
  const setSearch = (patch: Partial<WalkSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useWalkPlayer(search, setSearch)
  return (
    <PlayerLayout
      title={t('walk.title', { scale: scaleName(choice.root, choice.kind) })}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      setup={
        <WalkSetup
          choice={choice}
          swing={search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
