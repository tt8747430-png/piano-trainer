import { useTranslation } from 'react-i18next'
import {
  CHORD_TONES,
  HANON_TRAINS,
  VOICINGS,
  type ExerciseChoice,
  type Exercise,
} from '@/entities/exercise'
import { localText, useLocale } from '@/shared/i18n'
import { HANON_NUMBERS } from '@/shared/lib/exercise'
import { fingeringsOf, isInversion, spellChord } from '@/shared/lib/music'
import { Dropdown, InversionChoice, NamedSegmented, Segmented } from '@/shared/ui'
import type { ExerciseChange } from '../model/exercise-search'

/**
 * How an exercise's line goes, where its rule takes it: Hanon's number (each with what it works), the
 * fingering, an inversion, octaves, a sequence's figure, close or drop 2, the chord tone it starts on.
 */
export function ExerciseWayFields({
  exercise: { fields },
  choice,
  onChange,
}: {
  exercise: Exercise
  choice: ExerciseChoice
  onChange: (change: ExerciseChange) => void
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const fingerings = fingeringsOf(choice.kind, choice.start)
  return (
    <>
      {fields.hanon ? (
        <Dropdown
          label={t('exercise.hanon.label')}
          value={choice.hanon}
          options={HANON_NUMBERS.map((number) => ({
            value: number,
            label: t('exercise.hanon.number', { number }),
            detail: localText(HANON_TRAINS[number], locale),
          }))}
          onChange={(hanon) => onChange({ hanon })}
        />
      ) : null}
      {fields.fingering && fingerings.length > 1 ? (
        <Segmented
          label={t('exercise.fingering')}
          value={choice.fingering}
          options={fingerings.map((value) => ({
            value,
            label: t(`exercise.fingerings.${value}`),
          }))}
          onChange={(fingering) => onChange({ fingering })}
        />
      ) : null}
      {fields.inversion ? (
        <InversionChoice
          // The chord's notes where it is chosen; else as many as the inversions the rule allows.
          notes={
            fields.quality
              ? spellChord(choice.root, choice.quality).length
              : fields.inversion.length
          }
          value={choice.inversion}
          onChange={(inversion) => {
            if (isInversion(inversion)) onChange({ inversion })
          }}
        />
      ) : null}
      {fields.octaves && fields.octaves.length > 1 ? (
        // Bare numbers: the name on screen says what they count.
        <NamedSegmented
          label={t('exercise.octaves')}
          value={choice.octaves}
          options={fields.octaves.map((octaves) => ({ value: octaves, label: String(octaves) }))}
          onChange={(octaves) => onChange({ octaves })}
        />
      ) : null}
      {fields.figure ? (
        <NamedSegmented
          label={t('exercise.figure')}
          value={choice.figure}
          options={fields.figure.map((figure) => ({ value: figure, label: [...figure].join('-') }))}
          onChange={(figure) => onChange({ figure })}
        />
      ) : null}
      {fields.voicing ? (
        <Segmented
          label={t('exercise.voicing')}
          value={choice.voicing}
          options={VOICINGS.map((voicing) => ({
            value: voicing,
            label: t(`exercise.voicings.${voicing}`),
          }))}
          onChange={(voicing) => onChange({ voicing })}
        />
      ) : null}
      {fields.from ? (
        <Segmented
          label={t('exercise.from')}
          value={choice.from}
          options={CHORD_TONES.map((from) => ({
            value: from,
            label: t(`exercise.chordTones.${from}`),
          }))}
          onChange={(from) => onChange({ from })}
        />
      ) : null}
    </>
  )
}
