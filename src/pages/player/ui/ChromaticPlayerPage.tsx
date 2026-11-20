import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useUp, useSetSearch } from '@/shared/lib'
import { pitchClassOf, printedChord, qualityRootSpelling } from '@/shared/lib/music'
import type { ChromaticSearch } from '../model/chromatic-search'
import { useChromaticPlayer } from '../model/use-chromatic-player'
import { ChromaticSettings, ChromaticSetup } from './ChromaticSetup'
import { RunLayout } from './RunLayout'

/**
 * The chromatic walk in the run view: the chosen chord qualities root by root, a semitone at a time,
 * with a song's patterns; titled by its chords on its root, printed as the sheets print them.
 */
export function ChromaticPlayerPage() {
  const { t } = useTranslation('player')
  const search = useSearch({ from: '/shell/play/chromatic' })
  const close = useUp()
  const setSearch = useSetSearch<ChromaticSearch>()
  const { choice, performance, player, changeSetup } = useChromaticPlayer(search, setSearch)
  const from = pitchClassOf(choice.root)
  const chords = choice.chords
    .map((quality) => printedChord({ root: qualityRootSpelling(from, quality), quality }))
    .join(' · ')
  return (
    <RunLayout
      title={t(choice.direction === 'fifths' ? 'chromatic.fifths' : 'chromatic.title', { chords })}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      keys={Math.round(performance.chords.length / Math.max(1, choice.chords.length))}
      setup={<ChromaticSetup choice={choice} onChange={changeSetup} />}
      settings={
        <ChromaticSettings
          choice={choice}
          swing={search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
