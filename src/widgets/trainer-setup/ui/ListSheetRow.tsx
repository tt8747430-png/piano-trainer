import { Check, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui'

/** One choice of a list sheet: its value, its name, and its symbol where it has one. */
export interface ListOption {
  readonly value: string
  readonly label: string
}

/** A list sheet's group: its heading (none for a list of one group) and its choices. */
export interface ListGroup {
  readonly label?: string
  readonly options: readonly ListOption[]
}

/**
 * A list a drill asks from, as a row of its setup: its name and how many of all are chosen, opening a
 * sheet of every choice by group, each checked or not with a tap. The last one chosen stays chosen:
 * a run always asks something.
 */
export function ListSheetRow({
  label,
  groups,
  value,
  onChange,
}: {
  label: string
  groups: readonly ListGroup[]
  value: readonly string[]
  onChange: (value: string[]) => void
}) {
  const { t } = useTranslation('quiz')
  const all = groups.flatMap((group) => group.options)
  const chosen = new Set(value)
  const turn = (option: string) => {
    const next = new Set(chosen)
    if (next.has(option)) next.delete(option)
    else next.add(option)
    if (next.size > 0) onChange(all.map((o) => o.value).filter((o) => next.has(o)))
  }
  return (
    // Its own box in a list of rows: the list's hairline is drawn under it, the button's hover inside.
    <div>
      <Sheet>
        <SheetTrigger
          render={
            <button
              type="button"
              className="-mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-xl px-2 text-left transition-colors duration-200 ease-out hover:bg-muted"
            />
          }
        >
          <span className="min-w-0 text-foreground">{label}</span>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground tabular-nums">
            {t('choice.chosen', { count: chosen.size, total: all.length })}
            <ChevronRight aria-hidden className="size-4" />
          </span>
        </SheetTrigger>
        <SheetContent title={label}>
          {groups.map((group, index) => (
            <section key={group.label ?? index} className="flex flex-col gap-1 pt-2 first:pt-0">
              {group.label ? (
                <h3 className="px-1 pt-2 pb-1 text-sm font-semibold text-muted-foreground">
                  {group.label}
                </h3>
              ) : null}
              <ul className="card divide-y divide-hairline overflow-hidden">
                {group.options.map((option) => {
                  const on = chosen.has(option.value)
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => turn(option.value)}
                        className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left transition-colors duration-200 ease-out hover:bg-muted"
                      >
                        <span
                          className={cn(
                            'min-w-0',
                            on ? 'text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          {option.label}
                        </span>
                        <Check
                          aria-hidden
                          strokeWidth={3}
                          className={cn(
                            'size-5 shrink-0 text-foreground',
                            on ? 'visible' : 'invisible',
                          )}
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </SheetContent>
      </Sheet>
    </div>
  )
}
