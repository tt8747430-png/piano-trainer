import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, Play } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * A page's ways into the Player, the canvas's PRACTISE value for value: a 14px heading, then one card
 * (16 round, the sheet, a hairline ring) of rows, each opening the Player on what it says.
 */
export function PractiseRows({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="ms-1 font-sans text-sm font-semibold text-foreground">{title}</h3>
      <ul className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">{children}</ul>
    </section>
  )
}

/**
 * One way into the Player: a honey circle with Play, the drill's name over the music it plays, and a
 * chevron; 60 high at least, 8 16 inside, a hairline under it. `render` is its link.
 */
export function PractiseRow({
  title,
  detail,
  render,
}: {
  title: string
  detail: string
  render: useRender.RenderProp
}) {
  const row = useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className:
          'flex min-h-15 items-center gap-3 px-4 py-2 text-foreground no-underline shadow-[inset_0_-1px_0_var(--color-border)] hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
      },
      {
        children: (
          <>
            <span className="grid size-9 flex-none place-items-center rounded-full bg-primary text-primary-foreground">
              <Play aria-hidden className="size-3.5 fill-current" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-base font-semibold">{title}</span>
              <span className="text-[0.8125rem] text-muted-foreground">{detail}</span>
            </span>
            <ChevronRight aria-hidden className="size-5 flex-none text-muted-foreground" />
          </>
        ),
      },
    ),
  })
  return <li>{row}</li>
}
