import { useTranslation } from 'react-i18next'
import { CHURCH_MODES, type ChurchMode } from '@/shared/lib/music'
import { Dropdown, Labelled } from '@/shared/ui'
import type { ProgressionsView } from '../model/progressions-view'

/** The Mode pop-up's values: the key's own major or minor, then the church modes. */
type ModeChoice = 'key' | ChurchMode
const MODE_CHOICES: readonly ModeChoice[] = ['key', ...CHURCH_MODES]

/**
 * The mode a typed line's numerals are read in (ADR 0112): the key's major or minor, or a church mode
 * on its tonic. A library progression's numerals already say their mode, so it is offered only for a
 * line the learner typed (R30, A42). How the row is written and voiced is Progressions' Settings.
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
  return (
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
  )
}
