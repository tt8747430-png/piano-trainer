import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { sameKey, type Key } from '@/shared/lib/music'
import { KeySignaturePicker } from './KeySignaturePicker'
import { PickerShell } from './PickerShell'

/**
 * A key (a progression's, an example's, the Chord finder's): its name with ⌃⌄, opening the key
 * signature grid (Flat's, R29-P2): Major · Minor, sharps over flats, each cell the signs and its key's
 * name; a tap takes the key and closes. The same grid as the score editor's and New song's.
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
  const { t } = useTranslation('music')
  const name = useKeyName()
  const title = label ?? t('key.label')
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
        <div className="flex flex-col gap-3" {...start}>
          <KeySignaturePicker
            value={value}
            onChange={(key) => {
              // A mode changed keeps the picker open (the grid then names that mode's keys); a cell
              // taken closes it.
              if (key.minor !== value.minor && sameKey({ ...key, minor: value.minor }, value)) {
                onChange(key)
                return
              }
              close()
              if (!sameKey(key, value)) onChange(key)
            }}
          />
        </div>
      )}
    </PickerShell>
  )
}
