import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@/shared/lib'
import { pickedOption, toggleValue, type Option, type OptionValue } from './option'
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'

/** One choice of many in a row that scrolls sideways past the screen's edge. */
export function ChipRow<V extends OptionValue>({
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
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const row = useRef<HTMLDivElement>(null)
  const arrived = useRef(false)

  // The chosen chip is in view when the row appears and after every choice; the row scrolls itself,
  // never the page around it.
  useEffect(() => {
    const element = row.current
    const chosen = element?.querySelector<HTMLElement>('[data-pressed]')
    const instant = !arrived.current || reduceMotion
    arrived.current = true
    if (!element || !chosen || element.scrollWidth <= element.clientWidth) return
    element.scrollTo({
      left: chosen.offsetLeft - (element.clientWidth - chosen.offsetWidth) / 2,
      behavior: instant ? 'auto' : 'smooth',
    })
  }, [value, reduceMotion])

  return (
    <ToggleGroup
      ref={row}
      aria-label={label}
      value={[toggleValue(value)]}
      onValueChange={(pressed) => {
        const picked = pickedOption(options, value, pressed)
        if (picked) onChange(picked.value)
      }}
      variant="chip"
      spacing={2}
      className="relative -mx-4 flex w-auto snap-x scroll-px-4 overflow-x-auto px-4 pb-1 scrollbar-none"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={toggleValue(option.value)}
          value={toggleValue(option.value)}
          aria-label={option.title}
          className="snap-start"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
