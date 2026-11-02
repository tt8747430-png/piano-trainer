import { useTranslation } from 'react-i18next'
import type { PublicEntry } from '@/shared/api/public-library'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { itemPaint } from '@/features/publish'

/**
 * Who published an item, under its title: their initial in a round mark of their own paint, their
 * name, and how often the item is saved.
 */
export function Byline({ entry }: { entry: PublicEntry }) {
  const { t } = useTranslation('songs')
  const paint = PAINT[itemPaint(entry.authorName)]
  const initial = [...entry.authorName.trim()][0]?.toLocaleUpperCase() ?? '?'
  return (
    <div className="-mt-2 flex items-center gap-3">
      <span
        aria-hidden
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-semibold',
          paint.fill,
          paint.ink,
        )}
      >
        {initial}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-semibold">{entry.authorName}</span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {entry.saves > 0 ? t('public.saves', { count: entry.saves }) : t('public.savesNone')}
        </span>
      </span>
    </div>
  )
}

/** What its author wrote of it (Noji's About), under its byline; nothing where they wrote nothing. */
export function About({ entry }: { entry: PublicEntry }) {
  const { t } = useTranslation('songs')
  const text = entry.meta.description
  if (!text) return null
  return (
    <section aria-labelledby="public-about" className="flex flex-col gap-1.5">
      <h2 id="public-about" className="text-sm font-semibold text-muted-foreground">
        {t('public.about')}
      </h2>
      <p className="text-pretty whitespace-pre-line">{text}</p>
    </section>
  )
}

/** An item's facts in one line of chips, as a song's page has its key, time and tempo. */
export function FactChips({ facts }: { facts: readonly { name: string; value: string }[] }) {
  return (
    <dl className="flex flex-wrap items-center gap-2">
      {facts.map((fact) => (
        <div
          key={fact.name}
          className="flex h-8 items-center gap-1.5 rounded-full bg-muted/70 px-3 text-sm"
        >
          <dt className="text-muted-foreground">{fact.name}</dt>
          <dd className="font-semibold">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Grey where the item will be, while it is read; said once, to a screen reader. */
export function ReadingItem({ label }: { label: string }) {
  return (
    <div aria-busy className="flex flex-col gap-5">
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden className="-mt-2 flex items-center gap-3">
        <span className="size-11 rounded-full bg-muted motion-safe:animate-pulse" />
        <span className="flex flex-col gap-2">
          <span className="h-4 w-28 rounded-full bg-muted motion-safe:animate-pulse" />
          <span className="h-3 w-20 rounded-full bg-muted motion-safe:animate-pulse" />
        </span>
      </div>
      <div aria-hidden className="flex gap-2">
        {[16, 14, 20].map((width) => (
          <span
            key={width}
            className="h-8 rounded-full bg-muted motion-safe:animate-pulse"
            style={{ width: `${width / 4}rem` }}
          />
        ))}
      </div>
      <div aria-hidden className="h-48 rounded-3xl bg-muted motion-safe:animate-pulse" />
    </div>
  )
}
