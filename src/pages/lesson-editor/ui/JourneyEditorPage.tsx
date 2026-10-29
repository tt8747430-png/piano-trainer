import { Link, useParams } from '@tanstack/react-router'
import { journeyById } from '@/entities/lesson'
import { BackButton } from '@/shared/ui'
import { JourneyEditor } from './JourneyEditor'

/** A journey in the journey editor, an editor's (content as data, ADR 0116). */
export function JourneyEditorPage() {
  const { journeyId } = useParams({ from: '/shell/journeys/$journeyId/edit' })
  const journey = journeyById(journeyId)
  // The route finds no journey that is not there.
  if (!journey) return null
  const lessons = { to: '/', search: { view: 'lessons', journey: journeyId } } as const
  return (
    <JourneyEditor
      key={journeyId}
      journey={journey}
      back={<BackButton fallback={lessons} />}
      toLessons={<Link {...lessons} />}
    />
  )
}
