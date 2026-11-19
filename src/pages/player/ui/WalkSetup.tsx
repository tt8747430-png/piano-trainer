import { useTranslation } from 'react-i18next'
import { WALK, type WalkChoice } from '@/features/practice'
import { noteParam } from '@/shared/lib/music'
import { ChordSizeField, Labelled, RootGrid } from '@/shared/ui'
import { PatternCard, PlayerSetup } from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'
import type { WalkChange } from '../model/walk-search'
import type { SwingFeel } from '@/shared/lib/schedule'

/** The walk's Setup, over the run as it opens (the run boards' `PVSET`): its root and its chord size. */
export function WalkSetup({
  choice,
  onChange,
}: {
  choice: WalkChoice
  onChange: (change: WalkChange) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  return (
    <>
      <Labelled label={t('root')}>
        <RootGrid
          label={t('root')}
          value={choice.root}
          onChange={(root) => onChange({ root: noteParam(root) })}
        />
      </Labelled>
      <Labelled label={t('music:chordSize.label')}>
        <ChordSizeField
          value={choice.chordSize}
          onChange={(chordSize) => onChange({ chordSize })}
        />
      </Labelled>
    </>
  )
}

/** The walk's gear: its pattern and figures, and how it plays. */
export function WalkSettings({
  choice,
  swing,
  onChange,
  onSwing,
}: {
  choice: WalkChoice
  swing: SwingFeel
  onChange: (change: WalkChange) => void
  onSwing: (feel: SwingFeel) => void
}) {
  return (
    <PlayerSetup figures={choice} fit={WALK.fit} onFigures={onChange}>
      <PatternCard />
      <PlayingSection swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
