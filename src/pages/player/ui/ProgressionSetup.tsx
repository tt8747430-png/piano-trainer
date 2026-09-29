import type { ProgressionChoice } from '@/features/practice'
import { keyParam, type KeyParam } from '@/shared/lib/music'
import { KeyDropdown } from '@/shared/ui'
import { ChordSizeField, FigureRows, PlayerSetup } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'
import type { ProgressionChange } from '../model/progression-search'

/** A progression's Setup: its key, the pattern and figures, its chord size, and how it plays. */
export function ProgressionSetup({
  open,
  onOpenChange,
  choice,
  swing,
  onKey,
  onChange,
  onSwing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  choice: ProgressionChoice
  swing: boolean
  onKey: (key: KeyParam) => void
  onChange: (change: ProgressionChange) => void
  onSwing: (on: boolean) => void
}) {
  return (
    <PlayerSetup
      open={open}
      onOpenChange={onOpenChange}
      figures={choice}
      methods={false}
      melody={false}
      keyed
      onFigures={onChange}
    >
      <KeyDropdown value={keyParam(choice.key)} onChange={onKey} />
      <FigureRows />
      <ChordSizeField value={choice.chordSize} onChange={(chordSize) => onChange({ chordSize })} />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
