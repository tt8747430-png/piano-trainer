/**
 * A stat tile (`RS_TILE`), the same three rows in every tile: the figure (its unit quieter), one line
 * of context, the label; 16 inset, rows closer than the inset.
 */
export function StatTile({
  figure,
  unit,
  sub,
  label,
}: {
  figure: string
  unit?: string
  /** One line of context; a run's figures each carry one, a quiz's none. */
  sub?: string
  label: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 card p-4">
      <dt className="order-3 pt-1.5 text-footnote leading-[normal] font-semibold text-muted-foreground">
        {label}
      </dt>
      <dd className="order-1 text-[1.5rem] leading-[normal] font-bold tracking-[-0.01em] whitespace-nowrap tabular-nums">
        {figure}
        {unit ? (
          <span className="text-subhead font-semibold tracking-normal text-muted-foreground">
            {' '}
            {unit}
          </span>
        ) : null}
      </dd>
      {sub ? (
        <dd className="order-2 truncate text-footnote leading-[normal] text-muted-foreground tabular-nums">
          {sub}
        </dd>
      ) : null}
    </div>
  )
}
