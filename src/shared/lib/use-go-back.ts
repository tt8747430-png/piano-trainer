import {
  useCanGoBack,
  useRouter,
  type RegisteredRouter,
  type ValidateNavigateOptions,
} from '@tanstack/react-router'

/**
 * Leaves a screen the way the learner came in: back through the history, or, opened directly, to
 * `fallback` in the screen's place, so going back from there never returns to it.
 */
export function useGoBack<TOptions>(
  fallback: ValidateNavigateOptions<RegisteredRouter, TOptions>,
): () => void
export function useGoBack(fallback: ValidateNavigateOptions): () => void {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  return () =>
    canGoBack ? router.history.back() : void router.navigate({ ...fallback, replace: true })
}
