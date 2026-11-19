import { useRender } from '@base-ui/react/use-render'
import { Check } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { LessonIcon, OpensMark, PAINT, ProgressRing } from '@/shared/ui'
import { NextMark } from './NextMark'

/**
 * A lesson as a timeline's row (the canvas's PATHROW), wherever Learn lists one in order (a level's
 * chapter, a course, a piece's lessons): a 44 tile on the column's edge, plain with a soft dot until
 * learned, the lesson's book ringed in honey where Continue leads, grass with a check once learned, a
 * grass arc round it as it is read; a check (a chord family, a scale) wears a square tile with its
 * picture. Its title 16 (700 where Continue leads) 16 after the tile, one detail line, Next ringed in
 * honey, a chevron on a phone. The whole row is the link it is given (`render`); on a laptop it ends
 * where its words end (no chevron: the row is the link).
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
  /** A check's picture on its square tile; a lesson's tile draws its own state. */
  mark?: ReactNode
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
            'relative z-1 grid size-11 shrink-0 place-items-center font-sans text-[0.9375rem] font-bold [&_svg]:size-5',
            square ? 'rounded-[11px]' : 'rounded-pill',
            done
              ? cn(PAINT.grass.fill, PAINT.grass.ink)
              : current
                ? 'bg-card text-foreground ring-[2.5px] ring-primary'
                : 'bg-card text-muted-foreground ring-1 ring-border',
          )}
        >
          {done ? (
            <Check strokeWidth={2.6} />
          ) : current && !square ? (
            <LessonIcon />
          ) : square ? (
            mark
          ) : (
            <span className="size-2 rounded-pill bg-border" />
          )}
        </span>
      </ProgressRing>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 lg:flex-initial">
        <span className={cn('text-base/snug text-pretty', current ? 'font-bold' : 'font-semibold')}>
          {said ? <span className="sr-only">{said}: </span> : null}
          {title}
          {/* The check and the arc say it to the eye alone. */}
          {done ? <span className="sr-only">, {t('learned')}</span> : null}
          {!done && share > 0 ? (
            <span className="sr-only">, {t('read', { percent: Math.round(share * 100) })}</span>
          ) : null}
        </span>
        {detail ? <span className="text-sm text-muted-foreground">{detail}</span> : null}
      </span>
      {current ? <NextMark /> : null}
      {opens ? (
        <span className="lg:hidden">
          <OpensMark />
        </span>
      ) : null}
    </>
  )
  return useRender({
    render,
    props: {
      'aria-current': current ? 'step' : undefined,
      className:
        'group relative flex min-h-17 items-center gap-4 pr-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3',
      children: face,
    },
  })
}

/**
 * Lessons in their order (canvas 128): one spine runs through their tiles on a phone, with no card
 * round them; on a laptop they stand in rows of `across` (a level's three, a course's four), in
 * reading order, with no spine. A level's chapters and a course's lessons are drawn this way; it shows
 * the order, it locks nothing.
 */
export function LessonLine({ across, children }: { across: 3 | 4; children: ReactNode }) {
  return (
    <ol
      className={cn(
        'flex flex-col lg:grid lg:gap-x-8',
        across === 3
          ? 'lg:grid-cols-[repeat(auto-fill,minmax(max(13.75rem,calc((100%-4rem)/3)),1fr))]'
          : 'lg:grid-cols-[repeat(auto-fill,minmax(max(12.5rem,calc((100%-6rem)/4)),1fr))]',
      )}
    >
      {children}
    </ol>
  )
}

/**
 * One lesson on a `LessonLine`: the spine passes behind its tile, grass up to where the learner has
 * come (`reached`: learned or next) and on below a learned one (`passed`), the line's soft colour
 * after; none above the first or below the last.
 */
export function LessonStop({
  reached,
  passed,
  first,
  last,
  children,
}: {
  reached: boolean
  passed: boolean
  first: boolean
  last: boolean
  children: ReactNode
}) {
  return (
    <li
      className={cn(
        'relative min-w-0 before:absolute before:top-0 before:start-5.25 before:h-1/2 before:w-0.5 after:absolute after:start-5.25 after:top-1/2 after:h-1/2 after:w-0.5 lg:before:hidden lg:after:hidden',
        first ? 'before:hidden' : reached ? 'before:bg-paint-full-grass' : 'before:bg-border',
        last ? 'after:hidden' : passed ? 'after:bg-paint-full-grass' : 'after:bg-border',
      )}
    >
      {children}
    </li>
  )
}
