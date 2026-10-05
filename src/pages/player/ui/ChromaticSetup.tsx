import { useTranslation } from 'react-i18next'
import { CHROMATIC, CHROMATIC_DIRECTIONS, type ChromaticChoice } from '@/features/practice'
import {
  CHORD_FAMILIES,
  noteParam,
  qualitiesIn,
  qualitySuffix,
} from '@/shared/lib/music'
import { MultiDropdown, NoteChoice, Segmented, ToggleGrid } from '@/shared/ui'
import { PatternCard, PlayerSetup } from '@/widgets/player-setup'
import { PlayingToggles } from '@/widgets/practice-player'
import type { ChromaticChange } from '../model/chromatic-search'

/** The chromatic walk's Setup: its chord qualities, root and direction, the pattern and figures, and how it plays. */
export function ChromaticSetup({
  choice,
  swing,
  onChange,
  onSwing,
}: {
  choice: ChromaticChoice
  swing: boolean
  onChange: (change: ChromaticChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  return (
    <PlayerSetup figures={choice} fit={CHROMATIC.fit} onFigures={onChange}>
      <MultiDropdown
        label={t('player:qualities')}
        value={choice.chords}
        groups={CHORD_FAMILIES.map((family) => ({
          label: t(`music:family.${family}`),
          options: qualitiesIn(family).map((quality) => ({
            value: quality,
            label: qualitySuffix(quality) || t('music:major'),
            title: t(`music:quality.${quality}`),
            detail: t(`music:quality.${quality}`),
          })),
        }))}
        onChange={([checked, ...others]) => {
          // Unchecking the last one leaves it checked: the walk always has a chord.
          if (checked) onChange({ chords: [checked, ...others] })
        }}
      />
      <NoteChoice
        label={t('player:root')}
        value={noteParam(choice.root)}

        onChange={(root) => onChange({ root })}
      />
      <Segmented
        label={t('player:direction')}
        value={choice.direction}
        options={CHROMATIC_DIRECTIONS.map((direction) => ({
          value: direction,
          label: t(`player:directions.${direction}`),
        }))}
        onChange={(direction) => onChange({ direction })}
      />
      <PatternCard />
      <ToggleGrid label={t('playing')}>
        <PlayingToggles swing={swing} onSwing={onSwing} />
      </ToggleGrid>
    </PlayerSetup>
  )
}
