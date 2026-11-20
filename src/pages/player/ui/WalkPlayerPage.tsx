import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { useUp, useSetSearch } from '@/shared/lib'
import { useWalkPlayer } from '../model/use-walk-player'
import type { WalkSearch } from '../model/walk-search'
import { RunLayout } from './RunLayout'
import { WalkSettings, WalkSetup } from './WalkSetup'

/** Walk the chords in the run view: a scale's chords up to the tonic's octave and back, in one key. */
export function WalkPlayerPage() {
  const { t } = useTranslation('player')
  const scaleName = useScaleName()
  const search = useSearch({ from: '/shell/play/walk' })
  const close = useUp()
  const setSearch = useSetSearch<WalkSearch>()
  const { choice, performance, player, changeSetup } = useWalkPlayer(search, setSearch)
  return (
    <RunLayout
      title={t('walk.title', { scale: scaleName(choice.root, choice.kind) })}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      keys={1}
      setup={<WalkSetup choice={choice} onChange={changeSetup} />}
      settings={
        <WalkSettings
          choice={choice}
          swing={search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
