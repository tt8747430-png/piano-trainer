import { useTranslation } from 'react-i18next'
import { CHORD_SIZES, type ChordSize } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'

/** How much of each chord a progression plays: Triads · 7ths · 9ths. */
export function ChordSizeField({
  value,
  onChange,
}: {
  value: ChordSize
  onChange: (size: ChordSize) => void
}) {
  const { t } = useTranslation('player')
  return (
    <Segmented
      label={t('chordSize')}
      value={value}
      options={CHORD_SIZES.map((size) => ({ value: size, label: t(`chordSizes.${size}`) }))}
      onChange={onChange}
    />
  )
}
