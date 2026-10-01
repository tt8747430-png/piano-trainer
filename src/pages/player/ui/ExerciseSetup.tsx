import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  ARPEGGIO_QUALITIES,
  CHORD_TONES,
  isExerciseInversion,
  TONALITIES,
  VOICINGS,
  type ExerciseChoice,
  type RuleExercise,
} from '@/entities/exercise'
import {
  chordFamily,
  fingeringsOf,
  noteFromParam,
  noteName,
  noteParam,
  qualityRootSpelling,
  qualitySuffix,
  SCALE_FAMILIES,
  scaleKindsIn,
  scaleRootSpelling,
  spellChord,
  spellScale,
  tonicSpelling,
  type PitchClass,
} from '@/shared/lib/music'
import {
  Dropdown,
  InversionChoice,
  NoteDropdown,
  RoundButton,
  Segmented,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui'
import { PlayingFields } from '@/widgets/practice-player'
import type { ExerciseChange } from '../model/exercise-search'

/** The arpeggio types by feel's families: triads, then 7ths. */
const ARPEGGIO_GROUPS = [
  { family: 'tri', qualities: ARPEGGIO_QUALITIES.filter((q) => chordFamily(q) === 'tri') },
  { family: 'sev', qualities: ARPEGGIO_QUALITIES.filter((q) => chordFamily(q) !== 'tri') },
] as const

/**
 * An exercise's Setup: its button, and the sheet of the choices its rule takes (each only where the
 * exercise has it), then how the Player plays.
 */
export function ExerciseSetup({
  exercise,
  choice,
  swing,
  onChange,
  onSwing,
}: {
  exercise: RuleExercise
  choice: ExerciseChoice
  swing: boolean
  onChange: (change: ExerciseChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const { fields } = exercise
  const spell = (pc: PitchClass) =>
    fields.root === 'scale'
      ? scaleRootSpelling(pc, choice.kind)
      : fields.root === 'chord'
        ? qualityRootSpelling(pc, choice.quality)
        : tonicSpelling(pc, choice.tonality === 'minor')
  const fingerings = fingeringsOf(choice.kind, choice.start)
  return (
    <Sheet>
      <SheetTrigger render={<RoundButton label={t('player:setup')} icon={SlidersHorizontal} />} />
      <SheetContent title={t('player:setup')}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <NoteDropdown
              label={fields.root === 'key' ? t('player:key') : t('player:root')}
              value={noteParam(choice.root)}
              spell={spell}
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
          {fields.fingering && fingerings.length > 1 ? (
            <Segmented
              label={t('player:exercise.fingering')}
              value={choice.fingering}
              options={fingerings.map((value) => ({
                value,
                label: t(`player:exercise.fingerings.${value}`),
              }))}
              onChange={(fingering) => onChange({ fingering })}
            />
          ) : null}
          {fields.inversion ? (
            <InversionChoice
              notes={fields.quality ? spellChord(choice.root, choice.quality).length : 4}
              value={choice.inversion}
              onChange={(inversion) => {
                if (isExerciseInversion(inversion)) onChange({ inversion })
              }}
            />
          ) : null}
          {fields.octaves && fields.octaves.length > 1 ? (
            <Segmented
              label={t('player:exercise.octaves')}
              value={choice.octaves}
              options={fields.octaves.map((octaves) => ({
                value: octaves,
                label: String(octaves),
              }))}
              onChange={(octaves) => onChange({ octaves })}
            />
          ) : null}
          {fields.figure ? (
            <Segmented
              label={t('player:exercise.figure')}
              value={choice.figure}
              options={fields.figure.map((figure) => ({
                value: figure,
                label: [...figure].join('-'),
              }))}
              onChange={(figure) => onChange({ figure })}
            />
          ) : null}
          {fields.voicing ? (
            <Segmented
              label={t('player:exercise.voicing')}
              value={choice.voicing}
              options={VOICINGS.map((voicing) => ({
                value: voicing,
                label: t(`player:exercise.voicings.${voicing}`),
              }))}
              onChange={(voicing) => onChange({ voicing })}
            />
          ) : null}
          {fields.from ? (
            <Segmented
              label={t('player:exercise.from')}
              value={choice.from}
              options={CHORD_TONES.map((from) => ({
                value: from,
                label: t(`player:exercise.chordTones.${from}`),
              }))}
              onChange={(from) => onChange({ from })}
            />
          ) : null}
          <PlayingFields swing={swing} onSwing={onSwing} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
