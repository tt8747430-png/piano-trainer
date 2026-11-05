import { Check } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { OpensMark, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** One choice of a list sheet: its value, its name, and what it is on C where it shows (Cm7, m3). */
export interface ListOption {
  readonly value: string
  readonly label: string
  /** An example in the musician's notation, printed at the row's end. */
  readonly example?: string
}

/** A list sheet's group: its heading (none for a list of one group) and its choices. */
export interface ListGroup {
  readonly label?: string
  readonly options: readonly ListOption[]
}

/** A choice's check box at the row's start: filled in ink while included, an empty square while not. */
function CheckBox({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-control border transition-colors duration-200 ease-out',
        on ? 'border-foreground bg-foreground text-background' : 'border-input',
      )}
    >
      {on ? <Check className="size-4" strokeWidth={3} /> : null}
    </span>
  )
}

/**
 * A list a drill asks from, as a row of its setup: its name and how many of all are included,
 * opening a sheet that says what is included and why (R32): a summary first ("8 of 27 included ·
 * Recommended set", or "· Custom selection" once changed), with Select all, Clear and Restore
 * recommended; then each group with its count and All or None; each row a check box at its start, its
 * name, and an example at its end (Cm7, m3 · 3 semitones). The last one included stays included: a
 * run always asks something.
 */
export function ListSheetRow({
  label,
  groups,
  value,
  recommended,
  onChange,
}: {
  label: string
  groups: readonly ListGroup[]
  value: readonly string[]
  /** What the drill asks before the learner changes it. */
  recommended: readonly string[]
  onChange: (value: string[]) => void
}) {
  const { t } = useTranslation('quiz')
  const summaryId = useId()
  const all = groups.flatMap((group) => group.options.map((option) => option.value))
  const chosen = new Set(value)
  const write = (next: ReadonlySet<string>) => {
    // At least one stays: Clear leaves the first of the list.
    const kept = all.filter((option) => next.has(option))
    onChange(kept.length > 0 ? kept : all.slice(0, 1))
  }
  const turn = (option: string) => {
    const next = new Set(chosen)
    if (next.has(option)) next.delete(option)
    else next.add(option)
    if (next.size > 0) write(next)
  }
  const setGroup = (group: ListGroup, on: boolean) => {
    const next = new Set(chosen)
    for (const option of group.options)
      if (on) next.add(option.value)
      else next.delete(option.value)
    write(next)
  }
  const isRecommended =
    recommended.length === chosen.size && recommended.every((option) => chosen.has(option))
  return (
    // Its own box in a list of rows: the list's hairline is drawn under it, the button's hover inside.
    <div>
      <Sheet>
        <SheetTrigger
          render={
            <button
              type="button"
              className="-mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-control px-2 text-left transition-colors duration-200 ease-out hover:bg-muted"
            />
          }
        >
          <span className="min-w-0 text-foreground">{label}</span>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground tabular-nums">
            {t('choice.chosen', { count: chosen.size, total: all.length })}
            <OpensMark />
          </span>
        </SheetTrigger>
        <SheetContent title={label}>
          <div className="flex flex-col gap-4">
            <section
              aria-labelledby={summaryId}
              className="flex flex-col gap-1 rounded-card bg-muted px-4 py-3"
            >
              <p id={summaryId} className="font-semibold tabular-nums">
                {t('choice.included', { count: chosen.size, total: all.length })} ·{' '}
                {isRecommended ? t('choice.recommended') : t('choice.custom')}
              </p>
              <div className="-mx-3 flex flex-wrap">
                <Button
                  variant="link"
                  disabled={chosen.size === all.length}
                  onClick={() => write(new Set(all))}
                >
                  {t('choice.selectAll')}
                </Button>
                <Button
                  variant="link"
                  disabled={chosen.size <= 1}
                  title={chosen.size <= 1 ? t('choice.lastStays') : undefined}
                  onClick={() => write(new Set())}
                >
                  {t('choice.clear')}
                </Button>
                {isRecommended ? null : (
                  <Button variant="link" onClick={() => write(new Set(recommended))}>
                    {t('choice.restore')}
                  </Button>
                )}
              </div>
            </section>
            {groups.map((group, index) => {
              const count = group.options.filter((option) => chosen.has(option.value)).length
              const full = count === group.options.length
              const name = group.label ?? label
              return (
                <section
                  key={group.label ?? index}
                  aria-label={name}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-3 px-1">
                    <h3 className="font-sans text-sm font-semibold text-muted-foreground tabular-nums">
                      {t('choice.groupCount', { group: name, count, total: group.options.length })}
                    </h3>
                    <Button
                      variant="link"
                      aria-label={t(full ? 'choice.excludeGroup' : 'choice.includeGroup', {
                        group: name,
                      })}
                      onClick={() => setGroup(group, !full)}
                    >
                      {full ? t('choice.none') : t('choice.all')}
                    </Button>
                  </div>
                  <ul className="card divide-y divide-hairline overflow-hidden">
                    {group.options.map((option) => {
                      const on = chosen.has(option.value)
                      return (
                        <li key={option.value}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            aria-label={option.label}
                            onClick={() => turn(option.value)}
                            className="flex min-h-12 w-full items-center gap-3 px-4 text-left transition-colors duration-200 ease-out hover:bg-muted"
                          >
                            <CheckBox on={on} />
                            <span
                              className={cn(
                                'min-w-0 flex-1',
                                on ? 'text-foreground' : 'text-muted-foreground',
                              )}
                            >
                              {option.label}
                            </span>
                            {option.example ? (
                              <span className="shrink-0 font-display font-semibold text-muted-foreground">
                                {option.example}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
