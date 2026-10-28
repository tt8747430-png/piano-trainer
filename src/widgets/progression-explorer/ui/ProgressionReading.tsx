import { useTranslation } from 'react-i18next'
import { CHURCH_MODES, type ChurchMode } from '@/shared/lib/music'
import { Dropdown, Labelled, Segmented } from '@/shared/ui'
import {
  PROGRESSION_NAMES,
  type ProgressionNames,
  type ProgressionsView,
} from '../model/progressions-view'

/** The Mode pop-up's values: the key's own major or minor, then the church modes. */
type ModeChoice = 'key' | ChurchMode
const MODE_CHOICES: readonly ModeChoice[] = ['key', ...CHURCH_MODES]

const VOICINGS = ['led', 'block'] as const

/**
 * How the row is read and played, as a progression player's own switches (ADR 0112): the mode its
 * numerals are read in (the key's major or minor, or a church mode on its tonic); how its chords are
 * named (numerals, Nashville numbers, or the chords alone); and voice-led or as root-position blocks,
 * the one switch that sets the same chords both ways against each other.
 */
export function ProgressionReading({
  view,
  onChange,
}: {
  view: ProgressionsView
  onChange: (change: Partial<ProgressionsView>) => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  const modeName = (mode: ModeChoice) =>
    mode === 'key' ? t('music:key.mode') : t(`music:scaleKind.${mode}`)
  const names: ProgressionNames = view.names ?? 'numerals'
  return (
    <>
      <Labelled
        label={t('practice:progressions.mode.label')}
        info={t('practice:progressions.mode.info')}
      >
        <Dropdown<ModeChoice>
          label={t('practice:progressions.mode.label')}
          value={view.mode ?? 'key'}
          onChange={(mode) => onChange({ mode: mode === 'key' ? undefined : mode })}
          options={MODE_CHOICES.map((mode) => ({ value: mode, label: modeName(mode) }))}
          bare
        />
      </Labelled>
      <Labelled
        label={t('practice:progressions.names.label')}
        info={t('practice:progressions.names.info')}
      >
        <Segmented
          label={t('practice:progressions.names.label')}
          value={names}
          options={PROGRESSION_NAMES.map((each) => ({
            value: each,
            label: t(`practice:progressions.names.${each}`),
          }))}
          onChange={(each) => onChange({ names: each === 'numerals' ? undefined : each })}
        />
      </Labelled>
      <Labelled
        label={t('practice:progressions.voicing.label')}
        info={t('practice:progressions.voicing.info')}
      >
        <Segmented
          label={t('practice:progressions.voicing.label')}
          value={view.block ? 'block' : 'led'}
          options={VOICINGS.map((each) => ({
            value: each,
            label: t(`practice:progressions.voicing.${each}`),
          }))}
          onChange={(each) => onChange({ block: each === 'block' ? true : undefined })}
        />
      </Labelled>
    </>
  )
}
