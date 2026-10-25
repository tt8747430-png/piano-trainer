import { onTestFinished } from 'vitest'

/**
 * A signal that aborts once the test is over. The window and the document outlive every test of a
 * worker (its files share them, `isolate: false`), and a listener left there holds what it closes
 * over for the rest of the run: what listens there with this signal stops, and lets go, at the end.
 */
export function untilTestEnds(): AbortSignal {
  const testOver = new AbortController()
  onTestFinished(() => testOver.abort())
  return testOver.signal
}

/**
 * `make()`, and what it set listening on the window and the document taken off again once `signal`
 * aborts: for what listens there with no way to stop. TanStack Router's scroll restoration hears the
 * page for as long as it lives, each of its listeners holding its router and the app that ran on it.
 */
export function heardUntil<T>(signal: AbortSignal, make: () => T): T {
  const heard: (() => void)[] = []
  const restore = [window, document].map((target: EventTarget) => {
    const own = Object.hasOwn(target, 'addEventListener')
    const add = target.addEventListener
    target.addEventListener = (type, listener, options) => {
      heard.push(() => target.removeEventListener(type, listener, options))
      add.call(target, type, listener, options)
    }
    return () => {
      if (own) target.addEventListener = add
      else Reflect.deleteProperty(target, 'addEventListener')
    }
  })
  try {
    return make()
  } finally {
    for (const undo of restore) undo()
    signal.addEventListener('abort', () => {
      for (const remove of heard) remove()
    })
  }
}
