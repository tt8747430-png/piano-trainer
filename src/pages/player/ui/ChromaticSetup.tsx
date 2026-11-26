import { useTranslation } from 'react-i18next'
import { CHROMATIC, CHROMATIC_DIRECTIONS, type ChromaticChoice } from '@/features/practice'
import {
  CHORD_FAMILIES,
  noteParam,
  printedSymbol,
  qualitiesIn,
  qualitySuffix,
} from '@/shared/lib/music'
import { Labelled, MultiDropdown, RootGrid, Segmented } from '@/shared/ui'
import { PatternCard, PlayerSetup } from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'
import type { ChromaticChange } from '../model/chromatic-search'
import type { SwingFeel } from '@/shared/lib/schedule'

/**
 * The chromatic walk's Setup, over the run as it opens (the run boards' `PVSET`): its chord types
 * (each by its suffix, printed as the sheets print a chord), its root and its direction, sections 24
 * apart, each heading 8 over its control.
 */
export function ChromaticSetup({
  choice,
  onChange,
}: {
  choice: ChromaticChoice
  onChange: (change: ChromaticChange) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  return (
    <>
      <Labelled label={t('player:qualities')}>
        <MultiDropdown
          label={t('player:qualities')}
          value={choice.chords}
          groups={CHORD_FAMILIES.map((family) => ({
            label: t(`music:family.${family}`),
            options: qualitiesIn(family).map((quality) => ({
              value: quality,
              label: printedSymbol(qualitySuffix(quality)) || t('music:major'),
              title: t(`music:quality.${quality}`),
              detail: t(`music:quality.${quality}`),
            })),
          }))}
          onChange={([checked, ...others]) => {
            // Unchecking the last one leaves it checked: the walk always has a chord.
            if (checked) onChange({ chords: [checked, ...others] })
          }}
        />
      </Labelled>
      <Labelled label={t('player:root')}>
        <RootGrid
          label={t('player:root')}
          value={choice.root}
          onChange={(root) => onChange({ root: noteParam(root) })}
        />
      </Labelled>
      <Labelled label={t('player:direction')}>
        <Segmented
          label={t('player:direction')}
          value={choice.direction}
          options={CHROMATIC_DIRECTIONS.map((direction) => ({
            value: direction,
            label: t(`player:directions.${direction}`),
          }))}
          onChange={(direction) => onChange({ direction })}
        />
      </Labelled>
    </>
  )
}

/** The chromatic walk's gear: its pattern and figures, and how it plays. */
export function ChromaticSettings({
  choice,
  swing,
  onChange,
  onSwing,
}: {
  choice: ChromaticChoice
  swing: SwingFeel
  onChange: (change: ChromaticChange) => void
  onSwing: (feel: SwingFeel) => void
}) {
  return (
    <PlayerSetup figures={choice} fit={CHROMATIC.fit} onFigures={onChange}>
      <PatternCard />
      <PlayingSection swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
