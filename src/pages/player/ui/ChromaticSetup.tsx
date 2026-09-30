import { useTranslation } from 'react-i18next'
import {
  CHROMATIC_DIRECTIONS,
  chromaticRoot,
  type ChromaticChoice,
  type ChromaticChords,
  type ChromaticDirection,
} from '@/features/practice'
import {
  CHORD_FAMILIES,
  noteName,
  noteParam,
  PITCH_CLASSES,
  qualitiesIn,
  qualitySuffix,
  type NoteParam,
} from '@/shared/lib/music'
import { Dropdown, MultiDropdown, Segmented } from '@/shared/ui'
import { FigureRows, PlayerSetup, type FigureChange } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'

/** The chromatic walk's Setup: its chord qualities, root and direction, the pattern and figures, and how it plays. */
export function ChromaticSetup({
  open,
  onOpenChange,
  choice,
  swing,
  onChords,
  onRoot,
  onDirection,
  onChange,
  onSwing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  choice: ChromaticChoice
  swing: boolean
  onChords: (chords: ChromaticChords) => void
  onRoot: (root: NoteParam) => void
  onDirection: (direction: ChromaticDirection) => void
  onChange: (change: FigureChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const [first] = choice.chords
  return (
    <PlayerSetup
      open={open}
      onOpenChange={onOpenChange}
      figures={choice}
      methods={false}
      melody={false}
      keyed={false}
      compound={false}
      onFigures={onChange}
    >
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
          if (checked) onChords([checked, ...others])
        }}
      />
      <Dropdown
        label={t('player:root')}
        value={noteParam(choice.root)}
        options={PITCH_CLASSES.map((pc) => {
          const root = chromaticRoot(pc, first)
          return { value: noteParam(root), label: noteName(root) }
        })}
        onChange={onRoot}
      />
      <Segmented
        label={t('player:direction')}
        value={choice.direction}
        options={CHROMATIC_DIRECTIONS.map((direction) => ({
          value: direction,
          label: t(`player:directions.${direction}`),
        }))}
        onChange={onDirection}
      />
      <FigureRows />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
