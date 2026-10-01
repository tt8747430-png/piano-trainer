import { useTranslation } from 'react-i18next'
import { lastInversion } from '@/shared/lib/music'
import { Segmented } from './Segmented'

/** Each inversion's name on screen, root position first. */
const INVERSION_NAMES = ['root', 'first', 'second', 'third'] as const

/** A chord of `notes` notes in root position or one of its inversions, at most the third. */
export function InversionChoice({
  notes,
  value,
  onChange,
}: {
  notes: number
  value: number
  onChange: (inversion: number) => void
}) {
  const { t } = useTranslation('music')
  return (
    <Segmented
      label={t('inversion.label')}
      value={value}
      options={INVERSION_NAMES.slice(0, lastInversion(notes) + 1).map((name, inversion) => ({
        value: inversion,
        label: t(`inversion.${name}`),
      }))}
      onChange={onChange}
    />
  )
}
