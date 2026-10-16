import { flushSync } from 'react-dom'

/**
 * Makes a change to the screen inside a view transition, so an element named alike before and after
 * (`view-transition-name`) morphs from its old place and shape into its new one: the folded keys'
 * button into the keys. While it runs the page's root names the way it goes (`data-morph`), so the
 * motion can follow it (`theme.css`). At once where the browser has none, or the learner asks for
 * less motion.
 */
export function morph(change: () => void, way?: string): void {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!('startViewTransition' in document) || still) {
    change()
    return
  }
  const root = document.documentElement
  if (way) root.dataset['morph'] = way
  const transition = document.startViewTransition(() => flushSync(change))
  void transition.finished.finally(() => {
    if (root.dataset['morph'] === way) delete root.dataset['morph']
  })
}
