import { useTranslation } from 'react-i18next'
import type { DegreeName } from '@/shared/lib/music'

/**
 * A scale's degrees as a row of chips that wraps (R29-P10): each one's number, those that differ from
 * the major scale in the accent (marked for a screen reader too), its function's name (tonic …
 * leading tone) under it in small soft ink where the books name them.
 */
export function DegreeList({
  items,
  alteredLabel,
}: {
  items: readonly {
    readonly top: string
    readonly name?: DegreeName | undefined
    readonly altered?: boolean
  }[]
  /** What an altered degree is, to a screen reader: "Differs from major". */
  alteredLabel?: string
}) {
  const { t } = useTranslation('music')
  return (
    <ol className="flex flex-wrap gap-x-1 gap-y-2">
      {items.map(({ top, name, altered = false }, at) => (
        <li key={at} className="flex w-19 flex-col items-center">
          <span
            data-altered={altered || undefined}
            className="min-w-9 rounded-control border border-border px-2 py-0.5 text-center font-semibold tabular-nums data-altered:border-primary data-altered:bg-primary/20"
          >
            {top}
            {altered && alteredLabel ? <span className="sr-only"> ({alteredLabel})</span> : null}
          </span>
          {name ? (
            <span className="text-center text-xs leading-tight font-normal text-balance text-muted-foreground">
              {t(`degree.${name}`)}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
