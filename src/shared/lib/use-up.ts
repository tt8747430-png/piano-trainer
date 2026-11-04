import { useRouter } from '@tanstack/react-router'
import { useContext } from 'react'
import { OPEN_PLAINLY } from './open-plainly'
import { entriesOf, forgetScreens, UpContext } from './up-context'

/**
 * Back (rule 26, as iOS's Back and Android's Up and Back within an app): to the screen the learner
 * came from in the app, stepping back through the history, so a song opened from Search, a lesson
 * or the Profile returns there. Where there is none (opened from a link, a shared song, a reload or
 * a notification) it goes up to the screen's parent, opened plainly as the learner left it (ADR
 * 0038): Android's synthetic back stack, so Back never leaves the app. A view, tab, filter or step
 * replaces its entry, so Back never walks back through them. On a place it does nothing.
 */
export function useUp(): () => void {
  const router = useRouter()
  const findUp = useContext(UpContext)
  return () =>
    void (async () => {
      const parent = await findUp()
      if (!parent) return
      const { history } = router
      // The nearest screen before this one still there, stepping past any deleted since.
      const entries = entriesOf(history)
      const here = history.location.state.__TSR_index
      for (let index = here - 1; index >= 0; index -= 1) {
        const path = entries.get(index)
        if (path === undefined) break
        if (path !== null) return history.go(index - here)
      }
      // In this screen's place, as Android's synthetic back stack: Back from the parent goes on up,
      // never down again to the screen it came up from.
      await router.navigate({ ...parent, state: OPEN_PLAINLY, replace: true })
    })()
}

/** What a delete calls as it leaves its page: the deleted thing's screens are gone for Back. */
export function useForgetScreens(): (...prefixes: readonly string[]) => void {
  const { history } = useRouter()
  return (...prefixes) => forgetScreens(history, ...prefixes)
}
