/** The score's title in its bar (R29, Flat's): beside Close, cut short with … where the bar is narrow. */
export function BarTitle({ title }: { title: string }) {
  return (
    <span className="min-w-0 truncate font-display text-base font-semibold" title={title}>
      {title}
    </span>
  )
}
