import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { CIRCLE_OF_FIFTHS, keyParam, type Key, type KeyParam } from '@/shared/lib/music'
import { Dropdown } from './Dropdown'

/** One of the 24 keys behind a pop-up button: the major keys, then the minor, round the circle of fifths. */
export function KeyDropdown({
  value,
  onChange,
}: {
  value: KeyParam
  onChange: (key: KeyParam) => void
}) {
  const { t } = useTranslation('music')
  const keyName = useKeyName()
  const option = (key: Key) => ({ value: keyParam(key), label: keyName(key) })
  return (
    <Dropdown
      label={t('key.label')}
      value={value}
      groups={[
        { label: t('key.majors'), options: CIRCLE_OF_FIFTHS.map((place) => option(place.major)) },
        { label: t('key.minors'), options: CIRCLE_OF_FIFTHS.map((place) => option(place.minor)) },
      ]}
      onChange={onChange}
    />
  )
}
