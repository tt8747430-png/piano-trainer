import { usePageHeading } from '@/shared/ui'

/**
 * The song's title in the Player's bar (loop round 24, owner: "the titles ... should be in the
 * headers"): beside Close, the page's heading, one line cut short where the bar is narrow, who wrote
 * it in a quiet line under it.
 */
export function BarTitle({ title, credit }: { title: string; credit: string }) {
  const heading = usePageHeading<HTMLHeadingElement>(title)
  return (
    <div className="flex min-w-0 flex-col justify-center">
      <h1
        {...heading}
        title={title}
        className="truncate font-sans text-base leading-tight font-semibold outline-none sm:text-[1.0625rem]"
      >
        {title}
      </h1>
      {credit ? (
        <p className="truncate text-xs leading-snug text-muted-foreground">{credit}</p>
      ) : null}
    </div>
  )
}
