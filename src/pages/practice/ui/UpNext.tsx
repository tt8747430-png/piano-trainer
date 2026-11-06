import { useRender } from '@base-ui/react/use-render'
import { Link } from '@tanstack/react-router'
import { ListChecks } from 'lucide-react'
import { useId, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { EXERCISES } from '@/entities/exercise'
import { dateOfDay, localDay } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { OpensMark, PAINT, PAGE_TILES, type Tile } from '@/shared/ui'
import { PRACTICE_PAGES, usePageWords } from '@/widgets/practice-pages'
import type { UpNextCard } from '../model/up-next'

/** A card's face: its tile, why it is next, what it opens. */
interface Face {
  readonly key: string
  readonly tile: Tile
  readonly why: string
  readonly title: string
  readonly link: ReactElement
}

/** The day a thing was last done, as a sentence says it: today, yesterday, or its date. */
function useWhen(): (day: string) => string {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const today = new Date()
  return (day) => {
    if (day === localDay(today)) return t('upNext.today')
    if (day === localDay(dateOfDay(localDay(today), -1))) return t('upNext.yesterday')
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(dateOfDay(day))
  }
}

/**
 * Practice's Up next (R32): up to three cards, each saying why it is next and opening it, a row on a
 * laptop; Start here for a new learner. The first card is drawn as the one to take.
 */
export function UpNext({ cards }: { cards: readonly UpNextCard[] }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const words = usePageWords()
  const when = useWhen()
  const id = useId()
  const exercise = (exerciseId: string) => EXERCISES.find((each) => each.id === exerciseId)
  const exerciseLink = (exerciseId: string) => (
    <Link to="/practice/exercises/$exerciseId" params={{ exerciseId }} state={OPEN_PLAINLY} />
  )
  const faces = cards.flatMap((card): Face[] => {
    switch (card.kind) {
      case 'review':
        return [
          {
            key: 'review',
            tile: { icon: ListChecks, paint: 'lilac' },
            why: t('upNext.review.why', { count: card.count }),
            title: t('upNext.review.title'),
            link: <Link to="/practice/quiz/$trainerId" params={{ trainerId: 'gaps' }} />,
          },
        ]
      case 'exercise':
      case 'firstExercise': {
        const found = exercise(card.id)
        if (!found) return []
        return [
          {
            key: `exercise-${card.id}`,
            tile: PAGE_TILES.exercises,
            why:
              card.kind === 'exercise'
                ? t('upNext.exercise', { when: when(card.day) })
                : t('upNext.firstExercise'),
            title: localText(found.name, locale),
            link: exerciseLink(card.id),
          },
        ]
      }
      case 'page':
      case 'firstPage': {
        const { to, tile } = PRACTICE_PAGES[card.page]
        return [
          {
            key: `page-${card.page}`,
            tile,
            why: card.kind === 'page' ? t('upNext.page') : t('upNext.firstPage'),
            title: words(card.page).title,
            link: <Link to={to} state={OPEN_PLAINLY} />,
          },
        ]
      }
    }
  })
  const fresh = cards.every((card) => card.kind === 'firstExercise' || card.kind === 'firstPage')
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {fresh ? t('upNext.start') : t('upNext.title')}
      </h2>
      <ul className="grid gap-3 lg:grid-cols-3">
        {faces.map((face, at) => (
          <li key={face.key} className="flex">
            <UpNextLink face={face} first={at === 0} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function UpNextLink({ face, first }: { face: Face; first: boolean }) {
  const Icon = face.tile.icon
  return useRender({
    defaultTagName: 'a',
    render: face.link,
    props: {
      className: cn(
        'group flex min-h-19 w-full items-center gap-3 card px-4 py-3 transition-colors duration-200 ease-out hover:border-input',
        first && 'bg-gradient-to-b from-secondary/60 to-card',
      ),
      children: (
        <>
          <span
            aria-hidden
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-control',
              PAINT[face.tile.paint].fill,
              PAINT[face.tile.paint].ink,
            )}
          >
            <Icon className="size-5" />
          </span>
          {/* Its title read first, its reason shown above it. */}
          <span className="flex min-w-0 flex-1 flex-col-reverse">
            <span className="font-display text-lg leading-tight font-semibold text-balance">
              {face.title}
            </span>
            <span className="text-sm text-muted-foreground">{face.why}</span>
          </span>
          <OpensMark />
        </>
      ),
    },
  })
}
