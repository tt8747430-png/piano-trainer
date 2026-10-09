import { useTranslation } from 'react-i18next'
import { CHORD_SIZES, type ChordSize } from '@/shared/lib/music'
import { Segmented } from './Segmented'

/** How much of each chord a progression plays: Triads · 7ths · 9ths; `disabled` where no chord grows. */
export function ChordSizeField({
  value,
  disabled = false,
  onChange,
}: {
  value: ChordSize
  disabled?: boolean
  onChange: (size: ChordSize) => void
}) {
  const { t } = useTranslation('music')
  return (
    <Segmented
      label={t('chordSize.label')}
      value={value}
      disabled={disabled}
      options={CHORD_SIZES.map((size) => ({ value: size, label: t(`chordSize.${size}`) }))}
      onChange={onChange}
    />
  )
}
