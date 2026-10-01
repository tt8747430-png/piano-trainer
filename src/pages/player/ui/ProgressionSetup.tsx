import { PROGRESSION, walkingFit, type ProgressionChoice } from '@/features/practice'
import { keyParam } from '@/shared/lib/music'
import { ChordSizeField, KeyDropdown } from '@/shared/ui'
import { FigureRows, KeyWalkField, PlayerSetup } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'
import type { ProgressionChange } from '../model/progression-search'

/** A progression's Setup: its key and a walk through the keys, the pattern and figures, its chord size, and how it plays. */
export function ProgressionSetup({
  choice,
  swing,
  onChange,
  onSwing,
}: {
  choice: ProgressionChoice
  swing: boolean
  onChange: (change: ProgressionChange) => void
  onSwing: (on: boolean) => void
}) {
  return (
    <PlayerSetup
      figures={choice}
      fit={walkingFit(PROGRESSION.fit, choice.walk)}
      onFigures={onChange}
    >
      <KeyDropdown value={keyParam(choice.key)} onChange={(key) => onChange({ key })} />
      <KeyWalkField value={choice.walk} onChange={(walk) => onChange({ walk })} />
      <FigureRows />
      <ChordSizeField value={choice.chordSize} onChange={(chordSize) => onChange({ chordSize })} />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
