import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useScrollMotion } from '@/shared/lib'
import { optionName, type Option, type OptionValue } from './option'

/**
 * One choice of many in a row that scrolls, with ‹ › to step through it with one thumb, as the
 * reference app browses a root or a scale's kind: the chosen option in strong ink and kept in sight,
 * the others muted. An option that cannot be chosen (its `reason`) is greyed, never hidden, saying
 * why. A radio group: the arrow keys move along it too. ‹ and › stop at the ends.
 */
export function StepStrip<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: V
  options: readonly Option<V>[]
  onChange: (value: V) => void
}) {
  const { t } = useTranslation('common')
  const id = useId()
  const track = useRef<HTMLDivElement>(null)
  const behavior = useScrollMotion()
  const at = options.findIndex((option) => option.value === value)
  const open = (from: number, step: -1 | 1): Option<V> | undefined => {
    for (let index = from + step; index >= 0 && index < options.length; index += step) {
      const option = options[index]
      if (option && option.reason === undefined) return option
    }
    return undefined
  }
  const previous = open(at, -1)
  const next = open(at, 1)

  // The chosen option scrolled to the middle of the strip, the page itself left where it is.
  useEffect(() => {
    const strip = track.current
    const chosen = strip?.querySelector<HTMLElement>('[data-checked]')
    if (!strip || !chosen) return
    strip.scrollTo({
      left: chosen.offsetLeft - (strip.clientWidth - chosen.offsetWidth) / 2,
      behavior,
    })
  }, [value, behavior])

  const stepper = (option: Option<V> | undefined, name: string, Icon: typeof ChevronLeft) => (
    <button
      type="button"
      aria-label={name}
      disabled={option === undefined}
      onClick={() => option && onChange(option.value)}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-background/60 disabled:opacity-35 disabled:hover:bg-transparent"
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )

  return (
    <div className="flex min-w-0 items-center gap-0.5 rounded-2xl bg-muted p-1">
      {stepper(previous, t('step.previous', { what: label }), ChevronLeft)}
      <RadioGroup
        ref={track}
        aria-label={label}
        value={value}
        onValueChange={(chosen) => {
          const picked = options.find((option) => option.value === chosen)
          if (picked && picked.value !== value) onChange(picked.value)
        }}
        className="scrollbar-none flex min-w-0 flex-1 snap-x gap-1 overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,#000_0.75rem,#000_calc(100%-0.75rem),transparent)]"
      >
        {options.map((option, index) => {
          const why = option.reason ? `${id}-why-${index}` : undefined
          return (
            <Radio.Root
              key={String(option.value)}
              value={option.value}
              aria-label={optionName(option)}
              aria-describedby={why}
              title={option.reason}
              disabled={option.reason !== undefined}
              className={cn(
                'inline-flex min-h-11 min-w-11 shrink-0 cursor-default snap-center items-center justify-center rounded-lg border border-transparent px-3 text-base font-semibold whitespace-nowrap text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground data-checked:border-input data-checked:bg-chosen data-checked:text-foreground data-disabled:opacity-40 data-disabled:hover:text-muted-foreground',
              )}
            >
              {option.icon}
              {option.label}
            </Radio.Root>
          )
        })}
      </RadioGroup>
      {options.map((option, index) =>
        option.reason ? (
          <span key={String(option.value)} id={`${id}-why-${index}`} hidden>
            {option.reason}
          </span>
        ) : null,
      )}
      {stepper(next, t('step.next', { what: label }), ChevronRight)}
    </div>
  )
}
