import type { EngraveOptions } from './toolkit'

type Reply = { id: number; pages: string[] } | { id: number; error: string }

let worker: Worker | undefined
let nextId = 0
const waiting = new Map<number, (reply: Reply) => void>()

function workerOf(): Worker {
  if (worker) return worker
  worker = new Worker(new URL('./verovio.worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event: MessageEvent<Reply>) => {
    waiting.get(event.data.id)?.(event.data)
    waiting.delete(event.data.id)
  }
  return worker
}

/**
 * In a test (jsdom has no Worker) Verovio runs on the test's own thread. A build leaves that branch
 * out, and Verovio with it: the app carries it once, in the worker.
 */
const HERE = import.meta.env.MODE === 'test'

/** The engraver started, so the first staff a screen shows need not wait on it to load. */
export function warmEngraver(): void {
  if (HERE) void import('./toolkit').then((toolkit) => toolkit.loadToolkit())
  else workerOf().postMessage({ warm: true })
}

/**
 * A score's MEI engraved by Verovio (ADR 0087): in a Web Worker, so a long score never holds the page
 * back. Its pages' SVG, a line's one page.
 */
export function engrave(mei: string, options: EngraveOptions): Promise<string[]> {
  if (HERE) return import('./toolkit').then((toolkit) => toolkit.engraveMei(mei, options))
  const id = nextId++
  return new Promise((resolve, reject) => {
    waiting.set(id, (reply) =>
      'error' in reply ? reject(new Error(reply.error)) : resolve(reply.pages),
    )
    workerOf().postMessage({ id, mei, options })
  })
}
