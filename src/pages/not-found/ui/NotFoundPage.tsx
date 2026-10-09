import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ButtonLink, NotFound } from '@/shared/ui'

/** The place a page that is not there belongs to, and the way back to it. */
const WAYS = {
  path: { to: '/', label: 'notFound.toPath' },
  songs: { to: '/songs', label: 'notFound.toSongs' },
  learn: { to: '/learn', label: 'notFound.toLearn' },
  quiz: { to: '/practice/quiz', label: 'notFound.toQuiz' },
  scales: { to: '/practice/scales', label: 'notFound.toScales' },
  accompaniment: { to: '/practice/accompaniment', label: 'notFound.toAccompaniment' },
  exercises: { to: '/practice/exercises', label: 'notFound.toExercises' },
} as const
export type NotFoundWay = keyof typeof WAYS

/** A page that is not there: its one line, and the way back to the place it belongs to. */
export function NotFoundPage({ way }: { way: NotFoundWay }) {
  const { t } = useTranslation('common')
  const { to, label } = WAYS[way]
  return (
    <NotFound>
      <ButtonLink render={<Link to={to} />}>{t(label)}</ButtonLink>
    </NotFound>
  )
}
