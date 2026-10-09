import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TAKE_NAME_MAX, useTakesStoreApi, type Take } from '@/entities/take'
import { renameTake } from '@/features/manage-takes'
import { Input } from '@/shared/ui/primitives/input'
import { useTakeMade } from '../model/use-take-title'

/** A take's name, saved as it leaves the field or on Enter; empty, it is when the take was made. */
export function TakeNameField({ take }: { take: Take }) {
  const { t } = useTranslation('editor')
  const store = useTakesStoreApi()
  const made = useTakeMade(take)
  const [name, setName] = useState(take.name ?? '')
  return (
    <label className="flex max-w-sm flex-col gap-1">
      <span className="text-sm text-muted-foreground">{t('take.name')}</span>
      <Input
        value={name}
        maxLength={TAKE_NAME_MAX}
        placeholder={made}
        onChange={(event) => setName(event.target.value)}
        onBlur={() => renameTake(store, take.id, name)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
        className="h-12"
      />
    </label>
  )
}
