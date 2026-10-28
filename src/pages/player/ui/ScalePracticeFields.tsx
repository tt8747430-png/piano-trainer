import { useTranslation } from 'react-i18next'
import type { ExerciseChoice } from '@/entities/exercise'
import { noteName, type Hand } from '@/shared/lib/music'
import { handOctaves, ownHandOctaves } from '@/shared/lib/exercise'
import { TEMPO_RANGE, type Hands } from '@/shared/lib/schedule'
import { Labelled, Segmented, StepStrip, SwitchRow } from '@/shared/ui'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import type { PracticePlayer } from '@/widgets/practice-player'
import type { ExerciseChange } from '../model/exercise-search'

/** The rests a loop may take before each repeat, in beats: none to a bar of four. */
const RESTS = [0, 1, 2, 3, 4] as const

/** The hands in the order they sit at the keys, the left first. */
const HANDS = ['lh', 'rh'] as const satisfies readonly Hand[]

/** Each hand's choice of start octave in the choice, by its field. */
const OCTAVE_FIELD = { rh: 'rhOctave', lh: 'lhOctave' } as const

/**
 * A scale's practice set up as the reference app's Practice Scale sheet: one hand or two; the octave
 * each hand playing starts in, those whose run would leave the keyboard greyed with the reason; the
 * tempo; the metronome; and beats of clicks before each repeat of the loop.
 */
export function ScalePracticeFields({
  choice,
  player,
  hands,
  onChange,
}: {
  choice: ExerciseChoice
  player: PracticePlayer
  hands: Hands
  onChange: (change: ExerciseChange) => void
}) {
  const { t } = useTranslation(['player', 'common', 'music'])
  const run = choice
  const own = ownHandOctaves(run)
  const octaves = handOctaves(run)
  const playing = HANDS.filter((hand) => hands === 'both' || hands === hand)
  return (
    <>
      <Labelled label={t('player:scalePractice.hands')}>
        <Segmented
          label={t('player:scalePractice.hands')}
          value={hands}
          options={(['rh', 'lh', 'both'] as const).map((value) => ({
            value,
            label: t(`common:handsShort.${value}`),
          }))}
          onChange={player.setHands}
        />
      </Labelled>
      {playing.map((hand) => {
        const asked = choice[OCTAVE_FIELD[hand]]
        const fits = octaves.find((each) => each.octave === asked)?.out === undefined
        const label = t(`player:scalePractice.startsOn.${hand}`)
        return (
          <Labelled key={hand} label={label}>
            <StepStrip
              label={label}
              value={asked !== undefined && fits ? asked : own[hand]}
              options={octaves.map(({ octave, out }) => ({
                value: octave,
                label: `${noteName(choice.root)}${octave}`,
                reason: out ? t(`player:scalePractice.out.${out}`) : undefined,
              }))}
              onChange={(octave) =>
                onChange({ [OCTAVE_FIELD[hand]]: octave === own[hand] ? undefined : octave })
              }
            />
          </Labelled>
        )
      })}
      <Slider
        min={TEMPO_RANGE.min}
        max={TEMPO_RANGE.max}
        step={4}
        value={player.tempo}
        onValueChange={player.setTempo}
        className="flex flex-col gap-3"
      >
        <div className="flex justify-between">
          <SliderLabel>{t('player:scalePractice.tempo')}</SliderLabel>
          <span className="font-semibold tabular-nums">
            {t('music:bpm', { tempo: player.tempo })}
          </span>
        </div>
      </Slider>
      <SwitchRow
        label={t('player:scalePractice.metronome')}
        checked={player.click}
        onCheckedChange={player.setClick}
      />
      <Labelled
        label={t('player:scalePractice.rest.label')}
        info={t('player:scalePractice.rest.info')}
      >
        <Segmented
          label={t('player:scalePractice.rest.label')}
          value={player.rest}
          options={RESTS.map((beats) => ({
            value: beats,
            label: beats === 0 ? t('player:scalePractice.rest.none') : String(beats),
          }))}
          onChange={player.setRest}
        />
      </Labelled>
    </>
  )
}
