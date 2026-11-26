import { useSearch } from '@tanstack/react-router'
import { useSetSearch } from '@/shared/lib'
import { OwnLibrary, type OwnLibraryView } from '@/widgets/curriculum'

/** Made by you (the canvas's LearnYours), opened from Learn's See all: the learner's own as a library. */
export function YoursPage() {
  const view = useSearch({ from: '/shell/your-lessons' })
  const show = useSetSearch<OwnLibraryView>()
  return <OwnLibrary view={view} onView={show} />
}
