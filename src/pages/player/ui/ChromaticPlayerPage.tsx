import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chordsParam, chromaticRoot } from '@/features/practice'
import { useGoBack } from '@/shared/lib'
import { chordSymbol, pitchClassOf } from '@/shared/lib/music'
import type { ChromaticSearch } from '../model/chromatic-search'
import { useChromaticPlayer } from '../model/use-chromatic-player'
import { ChromaticSetup } from './ChromaticSetup'
import { PlayerLayout } from './PlayerLayout'

/** A chromatic walk has one section and names none. */
const NO_HEADINGS: readonly string[] = []

/** The chromatic walk in the Player: the chosen chord types root by root, a semitone at a time, with a song's patterns. */
export function ChromaticPlayerPage() {
  const { t } = useTranslation('player')
  const search = useSearch({ from: '/full-screen/play/chromatic' })
  const navigate = useNavigate({ from: '/play/chromatic' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useGoBack({ to: '/practice' })
  const setSearch = (patch: Partial<ChromaticSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useChromaticPlayer(search, setSearch)
  const from = pitchClassOf(choice.root)
  const chords = choice.chords
    .map((quality) => chordSymbol({ root: chromaticRoot(from, quality), quality }))
    .join(' · ')
  return (
    <>
      <PlayerLayout
        title={t('chromatic.title', { chords })}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        headings={NO_HEADINGS}
        onSetup={() => setSetupOpen(true)}
      />
      <ChromaticSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        choice={choice}
        swing={search.swing}
        onChords={(next) => setSearch({ chords: chordsParam(next) })}
        onRoot={(root) => setSearch({ root })}
        onDirection={(direction) => setSearch({ direction })}
        onChange={changeSetup}
        onSwing={player.setSwing}
      />
    </>
  )
}
