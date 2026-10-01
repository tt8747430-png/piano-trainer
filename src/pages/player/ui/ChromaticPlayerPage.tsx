import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { chordSymbol, pitchClassOf, qualityRootSpelling } from '@/shared/lib/music'
import type { ChromaticSearch } from '../model/chromatic-search'
import { useChromaticPlayer } from '../model/use-chromatic-player'
import { ChromaticSetup } from './ChromaticSetup'
import { PlayerLayout } from './PlayerLayout'

/** The chromatic walk in the Player: the chosen chord qualities root by root, a semitone at a time, with a song's patterns. */
export function ChromaticPlayerPage() {
  const { t } = useTranslation('player')
  const search = useSearch({ from: '/full-screen/play/chromatic' })
  const navigate = useNavigate({ from: '/play/chromatic' })
  const close = useGoBack({ to: '/practice' })
  const setSearch = (patch: Partial<ChromaticSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useChromaticPlayer(search, setSearch)
  const from = pitchClassOf(choice.root)
  const chords = choice.chords
    .map((quality) => chordSymbol({ root: qualityRootSpelling(from, quality), quality }))
    .join(' · ')
  return (
    <PlayerLayout
      title={t('chromatic.title', { chords })}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      setup={
        <ChromaticSetup
          choice={choice}
          swing={search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
