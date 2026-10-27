import { useTranslation } from 'react-i18next'
import { WALK, type WalkChoice } from '@/features/practice'
import { noteParam } from '@/shared/lib/music'
import { ChordSizeField, Labelled, NoteChoice } from '@/shared/ui'
import { PatternCard, PlayerSetup } from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'
import type { WalkChange } from '../model/walk-search'
import type { SwingFeel } from '@/shared/lib/schedule'

/** The walk's Setup: its root, the pattern and figures, its chord size, and how it plays. */
export function WalkSetup({
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
  const { t } = useTranslation(['player', 'music'])
  return (
    <PlayerSetup figures={choice} fit={WALK.fit} onFigures={onChange}>
      <NoteChoice
        label={t('root')}
        value={noteParam(choice.root)}
        onChange={(root) => onChange({ root })}
      />
      <Labelled label={t('music:chordSize.label')}>
        <ChordSizeField
          value={choice.chordSize}
          onChange={(chordSize) => onChange({ chordSize })}
        />
      </Labelled>
      <PatternCard />
      <PlayingSection swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
