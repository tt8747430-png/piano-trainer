import { useEffect, useState } from 'react'
import type { PublishStanding } from '@/features/publish'
import type { ContentKind } from '@/shared/api/content'
import { useContentEditing } from '@/shared/lib/content-editing'

/**
 * Where an item stands for its Publish page and its Settings' Publish… row (R29 B6): whether learners
 * have it (asked of the server; null until it answers), and with the draft, not published,
 * published, or changed since.
 */
export function useStanding(
  kind: ContentKind,
  id: string,
  draft: { readonly drafted: boolean; readonly opened: number },
) {
  const editing = useContentEditing()
  const [published, setPublished] = useState<boolean | null>(null)
  useEffect(() => {
    let current = true
    void editing.published(kind, id).then((result) => {
      if (current) setPublished(result.ok)
    })
    return () => {
      current = false
    }
  }, [editing, kind, id, draft.opened])
  const standing: PublishStanding = !published
    ? 'unpublished'
    : draft.drafted
      ? 'changed'
      : 'published'
  return { published, setPublished, standing }
}
