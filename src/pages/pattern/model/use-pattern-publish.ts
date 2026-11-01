import { useMemo } from 'react'
import { isOwnPatternId, type BookPattern } from '@/entities/pattern'
import { usePublish, type PublishItem } from '@/features/publish'

/**
 * A pattern's place in the Public library (ADR 0116): the learner's own may be published, its hands
 * under its name; `item` is null for a built-in one.
 */
export function usePatternPublish(pattern: BookPattern, name: string) {
  const own = isOwnPatternId(pattern.ref) ? pattern.ref : null
  const item = useMemo(
    (): PublishItem | null =>
      own === null
        ? null
        : {
            kind: 'pattern',
            sourceId: `pattern/${own}`,
            title: name,
            meta: { rh: pattern.rh, lh: pattern.lh },
            body: { name, rh: pattern.rh, lh: pattern.lh },
          },
    [own, pattern.rh, pattern.lh, name],
  )
  return { item, publishing: usePublish(item) }
}
