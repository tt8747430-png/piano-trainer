import { notFound, useParams, useSearch } from '@tanstack/react-router'
import {
  isOwnProgressionId,
  selectOwnProgression,
  usePracticeLibrary,
  usePracticeLibraryStoreApi,
  type OwnProgression,
} from '@/entities/practice-library'
import { progressionById, type LibraryProgression } from '@/entities/progression-library'
import { saveProgression } from '@/features/manage-practice-library'
import { useSetSearch } from '@/shared/lib'
import { keyFromParam } from '@/shared/lib/music'
import {
  keptView,
  libraryView,
  progressionSearch,
  type ProgressionSearch,
} from '@/widgets/progression-explorer'
import { ProgressionScreen } from './ProgressionScreen'

/**
 * A library progression's or the learner's own's page (`/practice/progressions/$progressionId`,
 * R30-4): its line the progression's own, the key, the chord size and the rest the URL's. The
 * learner's own line changed on its page is kept in Mine.
 */
export function ProgressionPage() {
  const { progressionId } = useParams({ from: '/shell/practice/progressions/$progressionId' })
  const own = usePracticeLibrary((state) =>
    isOwnProgressionId(progressionId) ? selectOwnProgression(progressionId)(state) : undefined,
  )
  const library = progressionById(progressionId)
  if (own) return <OwnPage progression={own} />
  if (library) return <LibraryPage progression={library} />
  throw notFound()
}

function LibraryPage({ progression }: { progression: LibraryProgression }) {
  const search = useSearch({ from: '/shell/practice/progressions/$progressionId' })
  const set = useSetSearch<ProgressionSearch>()
  return (
    <ProgressionScreen
      shown={{ kind: 'library', progression }}
      view={libraryView(search, progression)}
      onChange={(view) => set(progressionSearch(view))}
    />
  )
}

function OwnPage({ progression }: { progression: OwnProgression }) {
  const search = useSearch({ from: '/shell/practice/progressions/$progressionId' })
  const set = useSetSearch<ProgressionSearch>()
  const store = usePracticeLibraryStoreApi()
  const view = keptView(search, progression)
  return (
    <ProgressionScreen
      shown={{ kind: 'own', progression }}
      view={view}
      onChange={(next) => {
        const minor = keyFromParam(next.key).minor
        if (next.p !== view.p || next.mode !== view.mode || minor !== progression.minor) {
          const { id, ...kept } = progression
          const { mode: _mode, ...plain } = kept
          saveProgression(
            store,
            { ...plain, line: next.p, minor, ...(next.mode ? { mode: next.mode } : {}) },
            id,
          )
        }
        set(progressionSearch(next))
      }}
    />
  )
}
