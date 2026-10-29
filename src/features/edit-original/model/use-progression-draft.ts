import { useMemo } from 'react'
import {
  isProgressionDraft,
  readsAsProgression,
  type LibraryProgression,
} from '@/entities/progression-library'
import { useContentDraft, type DraftSpec } from './use-content-draft'

/**
 * An editor's draft of a progression of the library (content as data, ADR 0116), kept whole: read
 * with words or lines missing, published once it reads as a progression (`readsAsProgression`).
 */
export function useProgressionDraft(progression: LibraryProgression) {
  const spec = useMemo<DraftSpec<LibraryProgression>>(
    () => ({
      kind: 'progression',
      id: progression.id,
      read: (body) => (isProgressionDraft(progression.id, body) ? body : undefined),
      publishable: (value) => readsAsProgression(progression.id, value),
      write: (value) => ({ body: value, meta: { title: value.name } }),
      fallback: progression,
    }),
    [progression],
  )
  return useContentDraft(spec)
}
