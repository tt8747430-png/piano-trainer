import { useRouter } from '@tanstack/react-router'
import { useContext } from 'react'
import { OPEN_PLAINLY } from './open-plainly'
import { entriesOf, UpContext } from './up-context'

/**
 * Back: up to the screen's parent, never back through the history (rule 26). Where the entry before
 * is that parent the history steps back to it, so the browser's own Back does not return here and
 * nothing piles up; else the parent is pushed, opened plainly, as the learner left it (ADR 0038).
 * On a place it does nothing.
 */
export function useUp(): () => void {
  const router = useRouter()
  const findUp = useContext(UpContext)
  return () =>
    void (async () => {
      const parent = await findUp()
      if (!parent) return
      const { history } = router
      const before = entriesOf(history).get(history.location.state.__TSR_index - 1)
      if (before === router.buildLocation(parent).pathname) history.back()
      else await router.navigate({ ...parent, state: OPEN_PLAINLY })
    })()
}
