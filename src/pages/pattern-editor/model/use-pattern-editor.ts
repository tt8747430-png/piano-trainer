import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  ownName,
  ownPatternId,
  patternBook,
  usePatternsStoreApi,
  type OwnPatternId,
} from '@/entities/pattern'
import { saveOwnPattern, type OwnPatternDraft } from '@/features/manage-patterns'
import { useShownKeys } from '@/features/play-example'
import { useGoBack } from '@/shared/lib'
import { usePatternSample } from '@/widgets/pattern-music'

/** The draft heard under an id of its own, in a book of its own: what it plays is its figures alone. */
const HEARD = ownPatternId(1)

/**
 * The pattern editor's visit: the draft (the screen's own; a half-made pattern is not kept), heard as
 * its figures change (never as its name is typed), Save (into the editor's place, its page) and Cancel.
 */
export function usePatternEditor(start: OwnPatternDraft, id?: OwnPatternId) {
  const store = usePatternsStoreApi()
  const navigate = useNavigate()
  const cancel = useGoBack({ to: '/practice/patterns' })
  const [draft, setDraft] = useState(start)
  const change = (part: Partial<OwnPatternDraft>) => setDraft((was) => ({ ...was, ...part }))
  const { rh, lh } = draft
  const book = useMemo(() => patternBook([{ id: HEARD, name: '', rh, lh }]), [rh, lh])
  const sample = usePatternSample(book.require(HEARD), book)
  const [shown, show] = useShownKeys(`${rh} ${lh}`, sample.shown)
  const save = () => {
    const saved = saveOwnPattern(store, draft, id)
    if (!saved) return
    void navigate({
      to: '/practice/patterns/$patternRef',
      params: { patternRef: saved },
      replace: true,
    })
  }
  return { draft, change, sample, shown, show, save, cancel, savable: ownName(draft.name) !== null }
}
