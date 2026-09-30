import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Midi } from '@/shared/lib/music'

/** A key a hand plays stays down at least this long, so a tap as light as a trackpad's still shows. */
export const SHORTEST_PRESS_MS = 150

/** One key held down: its own object, so the same key pressed twice is two presses. */
type Press = object

const NOTHING: ReadonlyMap<Press, Midi> = new Map()
const NONE: ReadonlySet<Midi> = new Set()

/**
 * The keys a hand holds down, each under the id of what holds it (a pointer, a physical key, a MIDI
 * key): `press` puts a key down (letting go of whatever that id held before), `release` lets it up.
 * A press let go before the shortest press is up stays down until it is, so a tap always shows.
 */
export function usePresses<Id>(): {
  keys: ReadonlySet<Midi>
  press: (id: Id, key: Midi) => void
  release: (id: Id) => void
  releaseAll: () => void
} {
  /** Every press drawn down, and its key. */
  const [down, setDown] = useState(NOTHING)
  /** The press each id holds. */
  const held = useRef(new Map<Id, Press>())
  /** Presses younger than the shortest press: the timer that ends it, and whether they are let go. */
  const young = useRef(new Map<Press, { timer: ReturnType<typeof setTimeout>; letGo: boolean }>())

  useEffect(() => {
    const pending = young.current
    return () => pending.forEach(({ timer }) => clearTimeout(timer))
  }, [])

  const end = useCallback(
    (press: Press) =>
      setDown((presses) => {
        if (!presses.has(press)) return presses
        const rest = new Map(presses)
        rest.delete(press)
        return rest.size === 0 ? NOTHING : rest
      }),
    [],
  )

  const release = useCallback(
    (id: Id) => {
      const press = held.current.get(id)
      if (press === undefined) return
      held.current.delete(id)
      const youth = young.current.get(press)
      if (youth) youth.letGo = true
      else end(press)
    },
    [end],
  )

  const press = useCallback(
    (id: Id, key: Midi) => {
      release(id)
      const press: Press = {}
      held.current.set(id, press)
      setDown((presses) => new Map(presses).set(press, key))
      const timer = setTimeout(() => {
        const letGo = young.current.get(press)?.letGo
        young.current.delete(press)
        if (letGo) end(press)
      }, SHORTEST_PRESS_MS)
      young.current.set(press, { timer, letGo: false })
    },
    [release, end],
  )

  const releaseAll = useCallback(() => {
    for (const id of [...held.current.keys()]) release(id)
  }, [release])

  const keys = useMemo(() => (down.size === 0 ? NONE : new Set(down.values())), [down])
  return { keys, press, release, releaseAll }
}
