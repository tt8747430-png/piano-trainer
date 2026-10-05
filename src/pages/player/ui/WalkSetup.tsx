import { useTranslation } from 'react-i18next'
import { WALK, type WalkChoice } from '@/features/practice'
import { noteParam, scaleRootSpelling } from '@/shared/lib/music'
import { ChordSizeField, NotePicker, ToggleGrid } from '@/shared/ui'
import { PatternCard, PlayerSetup } from '@/widgets/player-setup'
import { PlayingToggles } from '@/widgets/practice-player'
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
      <NotePicker
        label={t('root')}
        value={noteParam(choice.root)}
        spell={(pc) => scaleRootSpelling(pc, choice.kind)}
        onChange={(root) => onChange({ root })}
      />
      <PatternCard />
      <ChordSizeField value={choice.chordSize} onChange={(chordSize) => onChange({ chordSize })} />
      <ToggleGrid label={t('playing')}>
        <PlayingToggles swing={swing} onSwing={onSwing} />
      </ToggleGrid>
    </PlayerSetup>
  )
}
