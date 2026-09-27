import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { useWalkPlayer } from '../model/use-walk-player'
import type { WalkSearch } from '../model/walk-search'
import { PlayerLayout } from './PlayerLayout'
import { WalkSetup } from './WalkSetup'

/** A walk has one section and names none. */
const NO_HEADINGS: readonly string[] = []

/** Walk the chords in the Player: a scale's chords up to the tonic's octave and back, with a song's patterns. */
export function WalkPlayerPage() {
  const { t } = useTranslation('player')
  const scaleName = useScaleName()
  const search = useSearch({ from: '/full-screen/play/walk' })
  const navigate = useNavigate({ from: '/play/walk' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useGoBack({
    to: '/learn/scales',
    search: { root: search.root, kind: search.kind, show: 'chords' },
  })
  const setSearch = (patch: Partial<WalkSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useWalkPlayer(search, setSearch)
  return (
    <>
      <PlayerLayout
        title={t('walk.title', { scale: scaleName(choice.root, choice.kind) })}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        headings={NO_HEADINGS}
        onSetup={() => setSetupOpen(true)}
      />
      <WalkSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        choice={choice}
        swing={search.swing}
        onRoot={(root) => setSearch({ root })}
        onChange={changeSetup}
        onSwing={player.setSwing}
      />
    </>
  )
}
