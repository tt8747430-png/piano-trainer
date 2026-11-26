import { flushSync } from 'react-dom'
import { motionReduced } from './use-media-query'

/**
 * Makes a change to the screen inside a view transition, so an element named alike before and after
 * (`view-transition-name`) morphs from its old place and shape into its new one: the folded keys'
 * button into the keys. While it runs the page's root says so (`data-morphing`), and only then do the
 * parts that morph carry their names (`theme.css`): a named element is its own backdrop root, so at
 * rest the glass over it would blur nothing. The root also names the way it goes (`data-morph`), so
 * the motion can follow it. At once where the browser has none, or the learner asks for less motion.
 */
export function morph(change: () => void, way?: string): void {
  if (!('startViewTransition' in document) || motionReduced()) {
    change()
    return
  }
  const root = document.documentElement
  if (way) root.dataset['morph'] = way
  root.dataset['morphing'] = ''
  const transition = document.startViewTransition(() => flushSync(change))
  void transition.finished.finally(() => {
    delete root.dataset['morphing']
    if (root.dataset['morph'] === way) delete root.dataset['morph']
  })
}
