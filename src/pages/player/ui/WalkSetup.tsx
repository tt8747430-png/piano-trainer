import { useTranslation } from 'react-i18next'
import type { WalkChoice } from '@/features/practice'
import {
  noteName,
  noteParam,
  PITCH_CLASSES,
  scaleRootSpelling,
  type NoteParam,
} from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import { ChordSizeField, FigureRows, PlayerSetup } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'
import type { WalkChange } from '../model/walk-search'

/** The walk's Setup: its root, the pattern and figures, its chord size, and how it plays. */
export function WalkSetup({
  open,
  onOpenChange,
  choice,
  swing,
  onRoot,
  onChange,
  onSwing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  choice: WalkChoice
  swing: boolean
  onRoot: (root: NoteParam) => void
  onChange: (change: WalkChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
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
      <Dropdown
        label={t('root')}
        value={noteParam(choice.root)}
        options={PITCH_CLASSES.map((pc) => {
          const root = scaleRootSpelling(pc, choice.kind)
          return { value: noteParam(root), label: noteName(root) }
        })}
        onChange={onRoot}
      />
      <FigureRows />
      <ChordSizeField value={choice.chordSize} onChange={(chordSize) => onChange({ chordSize })} />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
