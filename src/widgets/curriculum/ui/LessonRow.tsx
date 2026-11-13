import { useRender } from '@base-ui/react/use-render'
import { Check } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { OpensMark, PAINT, ProgressRing } from '@/shared/ui'

/**
 * A lesson as a library's row, wherever Learn lists one (a level's chapter, a course, Your lessons,
 * Your course): its tile plain until learned (white, a hairline, its number or picture in ink; canvas
 * 162), grass with a check once learned, a grass arc round it as it is read, ringed in honey where
 * Continue leads; its title and one detail line, Next where Continue leads, a
 * chevron. The whole row is the link it is given (`render`), and opens it.
 */
export function LessonRow({
  render,
  mark,
  square = false,
  done,
  share,
  current = false,
  title,
  said,
  detail,
  opens = true,
}: {
  /** A router `Link` to what the row opens. */
  render: ReactElement
  /** The tile's picture or number until it is learned. */
  mark: ReactNode
  /** A check (a chord family, a scale) wears a square tile; a lesson a round one. */
  square?: boolean
  done: boolean
  /** How much of it is read, 0 to 1. */
  share: number
  current?: boolean
  title: string
  /** Said before the title to a screen reader alone: its number in a course. */
  said?: string | undefined
  detail?: string | undefined
  /** Its chevron; none where a More stands beside it (one affordance a row). */
  opens?: boolean
}) {
  const { t } = useTranslation('learn')
  const face = (
    <>
      <ProgressRing share={done || current ? 0 : share} className={PAINT.grass.ink}>
        <span
          aria-hidden
          className={cn(
            'grid size-10 shrink-0 place-items-center font-display text-lg font-semibold tabular-nums',
            square ? 'rounded-control' : 'rounded-pill',
            done
              ? cn(PAINT.grass.fill, PAINT.grass.ink)
              : 'bg-card text-foreground ring-1 ring-border ring-inset',
            current && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
          )}
        >
          {done ? <Check className="size-5" strokeWidth={3} /> : mark}
        </span>
      </ProgressRing>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold text-pretty">
          {said ? <span className="sr-only">{said}: </span> : null}
          {title}
          {/* The check and the arc say it to the eye alone. */}
          {done ? <span className="sr-only">, {t('learned')}</span> : null}
          {!done && share > 0 ? (
            <span className="sr-only">, {t('read', { percent: Math.round(share * 100) })}</span>
          ) : null}
        </span>
        {detail ? (
          <span className="text-sm text-muted-foreground tabular-nums">{detail}</span>
        ) : null}
      </span>
      {current ? (
        <span className="shrink-0 rounded-pill bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
          {t('upNext')}
        </span>
      ) : null}
      {opens ? <OpensMark /> : null}
    </>
  )
  return useRender({
    render,
    props: {
      'aria-current': current ? 'step' : undefined,
      className:
        'group flex min-h-16 items-center gap-4 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3',
      children: face,
    },
  })
}

/**
 * Lessons in their order (canvas 128): one spine runs through their tiles, with no card round them.
 * A level's chapters and a course's lessons are drawn this way; it shows the order, it locks nothing.
 */
export function LessonLine({ children }: { children: ReactNode }) {
  return <ol className="flex flex-col">{children}</ol>
}

/** One lesson on a `LessonLine`: the spine passes behind its tile. */
export function LessonStop({ children }: { children: ReactNode }) {
  return (
    <li className="relative before:absolute before:inset-y-0 before:start-8 before:w-0.5 before:-translate-x-1/2 before:bg-learned/60 rtl:before:translate-x-1/2">
      {children}
    </li>
  )
}
