import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import {
  circleKey,
  keyFromParam,
  keyParam,
  keySymbol,
  PITCH_CLASSES,
  type Key,
  type KeyParam,
} from '@/shared/lib/music'

const MODES = [false, true] as const
/** The 24 keys, each under the one name the circle of fifths gives it: the major keys, then the minor. */
const KEYS: readonly (readonly Key[])[] = MODES.map((minor) =>
  PITCH_CLASSES.map((pc) => circleKey(pc, minor)),
)

/**
 * One of the 24 keys, all in sight and a tap away: the major keys over the minor keys, each written
 * as a chart writes it (D♭, C♯m), so a key has one name and the picker never relabels itself. Six
 * across, twelve where its own width holds them.
 */
export function KeyPicker({
  value,
  onChange,
}: {
  value: KeyParam
  onChange: (key: KeyParam) => void
}) {
  const { t } = useTranslation('music')
  const keyName = useKeyName()
  return (
    <div className="@container flex min-w-0 flex-col gap-2">
      <p aria-hidden className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">{t('key.label')}</span>
        <span className="font-semibold">{keyName(keyFromParam(value))}</span>
      </p>
      <RadioGroup
        aria-label={t('key.label')}
        value={value}
        onValueChange={(next) => {
          const picked = KEYS.flat().find((key) => keyParam(key) === next)
          if (picked && keyParam(picked) !== value) onChange(keyParam(picked))
        }}
        className="flex flex-col gap-1 rounded-2xl bg-muted p-1"
      >
        {KEYS.map((row, minor) => (
          <div key={minor} className="grid grid-cols-6 gap-1 @xl:grid-cols-12">
            {row.map((key) => (
              <Radio.Root
                key={keyParam(key)}
                value={keyParam(key)}
                aria-label={keyName(key)}
                className="inline-flex h-11 cursor-default items-center justify-center rounded-lg border border-transparent text-base font-semibold text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground data-checked:border-input data-checked:bg-card data-checked:text-foreground"
              >
                {keySymbol(key)}
              </Radio.Root>
            ))}
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
