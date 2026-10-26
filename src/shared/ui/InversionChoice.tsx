import { useTranslation } from 'react-i18next'
import { lastInversion } from '@/shared/lib/music'
import { INVERSION_NAMES } from './inversion-names'
import { InversionGlyph } from './InversionGlyph'
import { Segmented } from './Segmented'

/**
 * A chord of `notes` notes in root position or one of its inversions, at most the third: each
 * drawn as its stack of notes over its name; one that cannot be chosen greyed with why (`greyed`).
 * `null` chooses none: a chord drawn in none of them.
 */
export function InversionChoice({
  notes,
  value,
  label,
  disabled = false,
  greyed,
  onChange,
}: {
  notes: number
  value: number | null
  /** What a screen reader calls the choice: Inversion, unless it is named otherwise. */
  label?: string
  disabled?: boolean
  /** Why an inversion cannot be chosen, where it cannot. */
  greyed?: (inversion: number) => string | undefined
  onChange: (inversion: number) => void
}) {
  const { t } = useTranslation('music')
  return (
    <Segmented
      label={label ?? t('inversion.label')}
      disabled={disabled}
      value={value}
      options={INVERSION_NAMES.slice(0, lastInversion(notes) + 1).map((name, inversion) => ({
        value: inversion,
        label: t(`inversion.${name}`),
        icon: <InversionGlyph notes={notes} inversion={inversion} />,
        reason: greyed?.(inversion),
      }))}
      onChange={onChange}
    />
  )
}
