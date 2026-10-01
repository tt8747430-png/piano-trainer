import { useTranslation } from 'react-i18next'
import { WALK, type WalkChoice } from '@/features/practice'
import { noteParam, scaleRootSpelling } from '@/shared/lib/music'
import { ChordSizeField, NoteDropdown } from '@/shared/ui'
import { FigureRows, PlayerSetup } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'
import type { WalkChange } from '../model/walk-search'

/** The walk's Setup: its root, the pattern and figures, its chord size, and how it plays. */
export function WalkSetup({
  choice,
  swing,
  onChange,
  onSwing,
}: {
  choice: WalkChoice
  swing: boolean
  onChange: (change: WalkChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  return (
    <PlayerSetup figures={choice} fit={WALK.fit} onFigures={onChange}>
      <NoteDropdown
        label={t('root')}
        value={noteParam(choice.root)}
        spell={(pc) => scaleRootSpelling(pc, choice.kind)}
        onChange={(root) => onChange({ root })}
      />
      <FigureRows />
      <ChordSizeField value={choice.chordSize} onChange={(chordSize) => onChange({ chordSize })} />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
