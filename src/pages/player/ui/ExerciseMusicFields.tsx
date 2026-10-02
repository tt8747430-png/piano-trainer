import { useTranslation } from 'react-i18next'
import {
  ARPEGGIO_QUALITIES,
  exerciseRootSpelling,
  TONALITIES,
  type ExerciseChoice,
  type RuleExercise,
} from '@/entities/exercise'
import {
  chordFamily,
  noteFromParam,
  noteName,
  noteParam,
  qualitySuffix,
  SCALE_FAMILIES,
  scaleKindsIn,
  spellScale,
} from '@/shared/lib/music'
import { Dropdown, NoteDropdown, Segmented } from '@/shared/ui'
import type { ExerciseChange } from '../model/exercise-search'

/** The arpeggio types by feel's families: triads, then 7ths. */
const ARPEGGIO_GROUPS = [
  { family: 'tri', qualities: ARPEGGIO_QUALITIES.filter((q) => chordFamily(q) === 'tri') },
  { family: 'sev', qualities: ARPEGGIO_QUALITIES.filter((q) => chordFamily(q) !== 'tri') },
] as const

/** What an exercise plays on, where its rule takes it: its root or key, scale, chord, Start on, major or minor. */
export function ExerciseMusicFields({
  exercise,
  choice,
  onChange,
}: {
  exercise: RuleExercise
  choice: ExerciseChoice
  onChange: (change: ExerciseChange) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const { fields } = exercise
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <NoteDropdown
          label={fields.root === 'key' ? t('player:key') : t('player:root')}
          value={noteParam(choice.root)}
          spell={(pc) => exerciseRootSpelling(exercise, pc, choice)}
          onChange={(root) => onChange({ root: noteFromParam(root) })}
        />
        {fields.kind ? (
          <Dropdown
            label={t('player:exercise.scale')}
            value={choice.kind}
            groups={SCALE_FAMILIES.map((family) => ({
              label: t(`music:scaleFamily.${family}`),
              options: scaleKindsIn(family)
                .filter((kind) => fields.kind?.includes(kind))
                .map((kind) => ({ value: kind, label: t(`music:scaleKind.${kind}`) })),
            })).filter((group) => group.options.length > 0)}
            onChange={(kind) => onChange({ kind })}
          />
        ) : null}
        {fields.quality ? (
          <Dropdown
            label={t('player:exercise.chord')}
            value={choice.quality}
            groups={ARPEGGIO_GROUPS.map(({ family, qualities }) => ({
              label: t(`music:family.${family}`),
              options: qualities.map((quality) => ({
                value: quality,
                label: qualitySuffix(quality) || t('music:major'),
                title: t(`music:quality.${quality}`),
                detail: t(`music:quality.${quality}`),
              })),
            }))}
            onChange={(quality) => onChange({ quality })}
          />
        ) : null}
        {fields.start ? (
          <Dropdown
            label={t('player:exercise.startOn')}
            value={choice.start}
            options={spellScale(choice.root, choice.kind).map((tone, i) => ({
              value: i,
              label: noteName(tone.note),
              detail: tone.degree,
            }))}
            onChange={(start) => onChange({ start })}
          />
        ) : null}
      </div>
      {fields.tonality ? (
        <Segmented
          label={t('player:exercise.tonality')}
          value={choice.tonality}
          options={TONALITIES.map((tonality) => ({
            value: tonality,
            label: t(`player:exercise.tonalities.${tonality}`),
          }))}
          onChange={(tonality) => onChange({ tonality })}
        />
      ) : null}
    </>
  )
}
