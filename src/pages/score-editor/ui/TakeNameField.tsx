import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TAKE_NAME_MAX, useTakesStoreApi, type Take } from '@/entities/take'
import { renameTake } from '@/features/manage-takes'
import { NameField } from '@/shared/ui'
import { useTakeMade } from '../model/use-take-title'

/** A take's name, saved as it leaves the field or on Enter; empty, it is when the take was made. */
export function TakeNameField({ take }: { take: Take }) {
  const { t } = useTranslation('editor')
  const store = useTakesStoreApi()
  const made = useTakeMade(take)
  const [name, setName] = useState(take.name ?? '')
  return (
    <NameField
      label={t('take.name')}
      value={name}
      maxLength={TAKE_NAME_MAX}
      placeholder={made}
      onChange={(event) => setName(event.target.value)}
      onBlur={() => renameTake(store, take.id, name)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
      }}
      className="max-w-sm"
    />
  )
}
