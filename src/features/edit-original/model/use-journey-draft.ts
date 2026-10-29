import { useMemo } from 'react'
import { updatesJourney, type Journey } from '@/entities/lesson'
import { useContentDraft, type DraftSpec } from './use-content-draft'

const written = ({ en, ru }: { en: string; ru: string }) => en.trim() !== '' && ru.trim() !== ''

/**
 * An editor's draft of a journey (content as data, ADR 0116), kept whole: its title and goal, its
 * chapters in order with their steps. Published once the title, the goal and every chapter's name
 * have words in both languages.
 */
export function useJourneyDraft(journey: Journey) {
  const spec = useMemo<DraftSpec<Journey>>(
    () => ({
      kind: 'journey',
      id: journey.id,
      read: (body) => (updatesJourney(journey.id, body) ? body : undefined),
      publishable: (value) =>
        written(value.title) &&
        written(value.goal) &&
        value.chapters.every((chapter) => written(chapter.title)),
      write: (value) => ({ body: value, meta: { title: value.title } }),
      fallback: journey,
    }),
    [journey],
  )
  return useContentDraft(spec)
}
