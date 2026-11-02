import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { sameKey, type Key } from '@/shared/lib/music'
import { Button } from '../primitives/button'
import { KeyCircle } from './KeyCircle'
import { PickerShell } from './PickerShell'

/**
 * A key (a progression's, an example's, the Chord finder's): its name with ⌃⌄, opening the circle of
 * fifths (Ultimate Piano's), majors outside and relative minors inside, the keys written two ways
 * split; a wedge's tap takes it, "Select: D♭ major" confirms and closes.
 */
export function KeyPicker({
  value,
  onChange,
  label,
  bare,
  className,
}: {
  value: Key
  onChange: (key: Key) => void
  label?: string
  bare?: boolean
  className?: string
}) {
  const { t } = useTranslation(['common', 'music'])
  const name = useKeyName()
  const title = label ?? t('music:key.label')
  return (
    <PickerShell
      label={title}
      value={name(value)}
      spoken={name(value)}
      bare={bare}
      wide
      className={className}
    >
      {({ close, start }) => (
        <KeyChooser
          label={title}
          value={value}
          start={start}
          onSelect={(key) => {
            close()
            if (!sameKey(key, value)) onChange(key)
          }}
          select={(key) => t('common:picker.select', { key: name(key) })}
        />
      )}
    </PickerShell>
  )
}

/** The circle, the key it has taken, and Select to confirm it. */
function KeyChooser({
  label,
  value,
  start,
  onSelect,
  select,
}: {
  label: string
  value: Key
  start: { readonly 'data-picker-start': string }
  onSelect: (key: Key) => void
  select: (key: Key) => string
}) {
  const [taken, take] = useState(value)
  return (
    <div className="flex flex-col gap-3">
      <KeyCircle label={label} value={taken} onChoose={take} start={start} />
      <Button className="self-stretch" onClick={() => onSelect(taken)}>
        {select(taken)}
      </Button>
    </div>
  )
}
