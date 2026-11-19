import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, Play } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * A page's ways into the Player, the canvas's PRACTISE value for value: a 14px heading, then one card
 * (14 round, the sheet, a hairline ring) of rows, each opening the Player on what it says.
 */
export function PractiseRows({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-sans text-sm font-semibold text-foreground">{title}</h3>
      <ul className="overflow-hidden rounded-card bg-card ring-1 ring-border">{children}</ul>
    </section>
  )
}

/**
 * One way into the Player: a sand circle with Play (the floating Play stays the one honey act), the drill's name over the music it plays, and a
 * chevron; 76 high at least (the board's 60 inside its 8 16 padding), a hairline under it. `render` is its link.
 */
export function PractiseRow(props: {
  title: string
  detail: string
  render: useRender.RenderProp
}) {
  return (
    <li>
      <PlayRow {...props} />
    </li>
  )
}

/**
 * The same row, its card's item without the list item: a link into the Player, or with `here` a button
 * that plays on this page (Passing chords, the board's BETWEEN62), with no chevron and its line wrapping.
 */
export function PlayRow({
  title,
  detail,
  render,
  here = false,
}: {
  title: string
  detail: string
  render: useRender.RenderProp
  here?: boolean
}) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className:
          'flex min-h-19 w-full items-center gap-3 px-4 py-2 text-start text-foreground no-underline shadow-[inset_0_-1px_0_var(--color-border)] hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
      },
      {
        children: (
          <>
            <span className="grid size-9 flex-none place-items-center rounded-full bg-muted text-foreground">
              <Play aria-hidden className="size-3.5 fill-current" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-base leading-[normal] font-semibold">{title}</span>
              <span
                className={
                  here
                    ? 'text-sm leading-snug text-pretty text-muted-foreground'
                    : 'truncate text-sm leading-[normal] text-muted-foreground'
                }
              >
                {detail}
              </span>
            </span>
            {here ? null : (
              <ChevronRight aria-hidden className="size-5 flex-none text-muted-foreground" />
            )}
          </>
        ),
      },
    ),
  })
}
