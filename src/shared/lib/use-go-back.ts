import { useCanGoBack, useRouter } from '@tanstack/react-router'

/** Leaves a screen the way the learner came in: back through the history, or, opened directly, `fallback`. */
export function useGoBack(fallback: () => void): () => void {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  return () => (canGoBack ? router.history.back() : fallback())
}
