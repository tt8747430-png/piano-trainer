import { useTranslation } from 'react-i18next'
import type { PatternFit } from '@/entities/pattern'
import type { ProgressionChoice } from '@/features/practice'
import { keyParam } from '@/shared/lib/music'
import { ChordSizeField, KeyChoice, ToggleGrid } from '@/shared/ui'
import { PatternCard, KeyWalkField, PlayerSetup } from '@/widgets/player-setup'
import { PlayingToggles } from '@/widgets/practice-player'
import type { ProgressionChange } from '../model/progression-search'

/** A progression's Setup: its key and a walk through the keys, the pattern and figures, its chord size, and how it plays. */
export function ProgressionSetup({
  choice,
  fit,
  swing,
  onChange,
  onSwing,
}: {
  choice: ProgressionChoice
  /** What the progression, as it is played, has for its patterns. */
  fit: PatternFit
  swing: boolean
  onChange: (change: ProgressionChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  return (
    <PlayerSetup figures={choice} fit={fit} onFigures={onChange}>
      <KeyChoice value={keyParam(choice.key)} onChange={(key) => onChange({ key })} />
      <KeyWalkField value={choice.walk} onChange={(walk) => onChange({ walk })} />
      <PatternCard />
      <ChordSizeField value={choice.chordSize} onChange={(chordSize) => onChange({ chordSize })} />
      <ToggleGrid label={t('playing')}>
        <PlayingToggles swing={swing} onSwing={onSwing} />
      </ToggleGrid>
    </PlayerSetup>
  )
}
