/**
 * The score's title in its bar (R29, Flat's): beside Close, wrapping to a second line where the bar
 * is narrow, never cut short.
 */
export function BarTitle({ title }: { title: string }) {
  return (
    <span
      className="line-clamp-2 min-w-0 font-display text-base leading-tight font-semibold break-words text-pretty"
      title={title}
    >
      {title}
    </span>
  )
}
