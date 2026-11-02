import { useRouter, type RouterHistory } from '@tanstack/react-router'
import { useLayoutEffect, type ReactNode } from 'react'
import { entriesOf, UpContext, type FindUp } from './up-context'

/**
 * Back as up (rule 26): the screens' parents, found by `findUp`, and the history entries seen from
 * here on, so Back knows whether the entry before is the parent.
 */
export function UpProvider({ findUp, children }: { findUp: FindUp; children: ReactNode }) {
  const { history } = useRouter()
  useLayoutEffect(() => {
    const entries = entriesOf(history)
    const note = ({ pathname, state }: RouterHistory['location']) =>
      void entries.set(state.__TSR_index, pathname)
    note(history.location)
    return history.subscribe(({ location }) => note(location))
  }, [history])
  return <UpContext value={findUp}>{children}</UpContext>
}
