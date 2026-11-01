import { ChevronDown, Minus, Plus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'

/** An instrument's row: its name, how many the score has, and its − and + (none: greyed). */
export interface InstrumentRow {
  readonly key: string
  readonly name: string
  readonly count: number
  readonly onFewer?: (() => void) | undefined
  readonly onMore?: (() => void) | undefined
}

/** A family of instruments under its name (Flat's Vocals, Keyboards). */
export interface InstrumentFamily {
  readonly key: string
  readonly title: string
  readonly rows: readonly InstrumentRow[]
}

/** A family's instruments under its name, folded open or shut by its header (Flat's). */
function Family({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <section className="flex flex-col card">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex min-h-14 items-center gap-3 rounded-3xl px-4 text-start font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <span className="min-w-0 flex-1">{title}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            'size-5 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open ? <ul className="flex flex-col border-t border-border">{children}</ul> : null}
    </section>
  )
}

/** One instrument's row: its name, and how many with − and +; a change the score cannot take, greyed. */
function Row({ name, count, onFewer, onMore }: InstrumentRow) {
  const { t } = useTranslation('songs')
  return (
    <li
      className={cn(
        'flex min-h-14 items-center gap-2 py-1 pr-2 pl-4 first:pt-1 last:rounded-b-3xl',
        count > 0 && 'bg-chosen/60',
      )}
    >
      <span className={cn('min-w-0 flex-1', count > 0 && 'font-semibold')}>{name}</span>
      {count > 0 ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-full"
            aria-label={t('setup.fewer', { staff: name })}
            title={t('setup.fewer', { staff: name })}
            disabled={!onFewer}
            onClick={onFewer}
          >
            <Minus aria-hidden />
          </Button>
          <output
            aria-label={t('setup.count', { staff: name, count })}
            className="w-5 text-center font-semibold tabular-nums"
          >
            {count}
          </output>
        </>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 rounded-full text-link"
        aria-label={t('setup.more', { staff: name })}
        title={t('setup.more', { staff: name })}
        disabled={!onMore}
        onClick={onMore}
      >
        <Plus aria-hidden />
      </Button>
    </li>
  )
}

/**
 * A score's instruments by family, as Flat lists them (round 27, 28): each family a card folded open
 * or shut by its header, each instrument a row with how many the score has and its − and +. New song
 * chooses a new score's with it; the score's Settings change a score's.
 */
export function InstrumentList({ families }: { families: readonly InstrumentFamily[] }) {
  return (
    <>
      {families.map((family) => (
        <Family key={family.key} title={family.title}>
          {family.rows.map((row) => (
            <Row {...row} key={row.key} />
          ))}
        </Family>
      ))}
    </>
  )
}
