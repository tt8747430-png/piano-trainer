import { useTranslation } from 'react-i18next'
import { KEY_WALKS, type KeyWalk } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'

/** In the key alone: no walk. */
const ONE_KEY = 'one'

/** Through the keys: a progression in its key alone, or walked through the keys and home. */
export function KeyWalkField({
  value,
  onChange,
}: {
  value: KeyWalk | null
  onChange: (walk: KeyWalk | undefined) => void
}) {
  const { t } = useTranslation('player')
  return (
    <Dropdown<KeyWalk | typeof ONE_KEY>
      label={t('keyWalk.label')}
      value={value ?? ONE_KEY}
      options={[
        { value: ONE_KEY, label: t('keyWalk.one') },
        ...KEY_WALKS.map((walk) => ({ value: walk, label: t(`keyWalk.${walk}`) })),
      ]}
      onChange={(next) => onChange(next === ONE_KEY ? undefined : next)}
    />
  )
}
