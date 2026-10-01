import { Check } from 'lucide-react'
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** One choice of a list: what it shows, whether it is the one chosen, and what choosing it does. */
export interface ListboxOption {
  readonly key: string
  readonly selected: boolean
  /** Closed to what is shown: it stays in the list, reachable, and choosing it does nothing. */
  readonly disabled?: boolean
  readonly content: ReactNode
  onChoose(): void
}

/** Options under a name, or none. */
export interface ListboxGroup {
  readonly label?: string
  readonly options: readonly ListboxOption[]
}

/** Where the arrows, Home and End take the focus among `count` options from `index`. */
const MOVES: Readonly<Partial<Record<string, (index: number, count: number) => number>>> = {
  ArrowDown: (index, count) => Math.min(count - 1, index + 1),
  ArrowUp: (index) => Math.max(0, index - 1),
  Home: () => 0,
  End: (_, count) => count - 1,
}

/**
 * One choice of several, in a list (a Setup page's patterns, the tempo and hands popovers): the chosen
 * option selected and checked in umber, one tab stop, the arrows, Home and End moving among the
 * options, Enter, Space or a tap choosing one. A closed option is reached and heard, never chosen.
 */
export function Listbox({
  label,
  groups,
  className,
  optionClassName,
}: {
  label: string
  groups: readonly ListboxGroup[]
  className?: string
  optionClassName?: string
}) {
  const id = useId()
  const options = groups.flatMap((group) => group.options)
  const [active, setActive] = useState<string | null>(null)
  const tabStop =
    options.find((option) => option.key === active)?.key ??
    options.find((option) => option.selected)?.key ??
    options[0]?.key

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = MOVES[event.key]
    if (!move) return
    event.preventDefault()
    const elements = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')]
    const from = elements.findIndex((element) => element === document.activeElement)
    elements[move(Math.max(from, 0), elements.length)]?.focus()
  }

  const choose = (option: ListboxOption) => {
    if (!option.disabled) option.onChoose()
  }

  return (
    <div
      role="listbox"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex flex-col', className)}
    >
      {groups.map((group, g) => (
        <div
          key={group.label ?? g}
          role="group"
          aria-labelledby={group.label ? `${id}-${g}` : undefined}
          className="flex flex-col"
        >
          {group.label ? (
            <p id={`${id}-${g}`} className="text-sm font-semibold text-muted-foreground">
              {group.label}
            </p>
          ) : null}
          {group.options.map((option) => (
            <div
              key={option.key}
              role="option"
              aria-selected={option.selected}
              aria-disabled={option.disabled ? true : undefined}
              tabIndex={option.key === tabStop ? 0 : -1}
              onFocus={() => setActive(option.key)}
              onClick={() => choose(option)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                choose(option)
              }}
              className={cn(
                'flex w-full cursor-default items-center gap-3 text-left transition-colors duration-200 ease-out outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset aria-disabled:opacity-50 aria-disabled:hover:bg-transparent',
                optionClassName,
              )}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">{option.content}</span>
              {option.selected ? <Check aria-hidden className="size-5 text-selected" /> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
