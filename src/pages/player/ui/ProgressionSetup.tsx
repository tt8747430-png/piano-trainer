import { useTranslation } from 'react-i18next'
import type { PatternFit } from '@/entities/pattern'
import type { ProgressionChoice } from '@/features/practice'
import { KEY_WALKS, type KeyWalk } from '@/shared/lib/music'
import { ChoiceChips, ChordSizeField, Labelled } from '@/shared/ui'
import { PatternCard, PlayerSetup } from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'
import type { ProgressionChange } from '../model/progression-search'
import type { SwingFeel } from '@/shared/lib/schedule'

/** In the key alone: no walk. */
const ONE_KEY = 'one'

/**
 * A progression's Setup, over the run as it opens (the run boards' `PVSET`): its chord size, and the
 * keys it is played in, one or walked through them and home, as wrapping chips; its key is its page's.
 */
export function ProgressionSetup({
  choice,
  onChange,
}: {
  choice: ProgressionChoice
  onChange: (change: ProgressionChange) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  return (
    <>
      <Labelled label={t('music:chordSize.label')}>
        <ChordSizeField
          value={choice.chordSize}
          onChange={(chordSize) => onChange({ chordSize })}
        />
      </Labelled>
      <Labelled label={t('player:keyWalk.label')}>
        <ChoiceChips<KeyWalk | typeof ONE_KEY>
          label={t('player:keyWalk.label')}
          value={choice.walk ?? ONE_KEY}
          options={[
            { value: ONE_KEY, label: t('player:keyWalk.one') },
            ...KEY_WALKS.map((walk) => ({ value: walk, label: t(`player:keyWalk.${walk}`) })),
          ]}
          onChange={(next) => onChange({ walk: next === ONE_KEY ? undefined : next })}
        />
      </Labelled>
    </>
  )
}

/** A progression's gear: its pattern and figures, and how it plays. */
export function ProgressionSettings({
  choice,
  fit,
  swing,
  onChange,
  onSwing,
}: {
  choice: ProgressionChoice
  /** What the progression, as it is played, has for its patterns. */
  fit: PatternFit
  swing: SwingFeel
  onChange: (change: ProgressionChange) => void
  onSwing: (feel: SwingFeel) => void
}) {
  return (
    <PlayerSetup figures={choice} fit={fit} onFigures={onChange}>
      <PatternCard />
      <PlayingSection swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
