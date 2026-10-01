import { useTranslation } from 'react-i18next'
import { CHROMATIC, CHROMATIC_DIRECTIONS, type ChromaticChoice } from '@/features/practice'
import {
  CHORD_FAMILIES,
  noteParam,
  qualitiesIn,
  qualityRootSpelling,
  qualitySuffix,
} from '@/shared/lib/music'
import { MultiDropdown, NoteDropdown, Segmented } from '@/shared/ui'
import { FigureRows, PlayerSetup } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'
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
  const [first] = choice.chords
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
      <NoteDropdown
        label={t('player:root')}
        value={noteParam(choice.root)}
        spell={(pc) => qualityRootSpelling(pc, first)}
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
      <FigureRows />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
