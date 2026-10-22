import { engraveMei, loadToolkit, type EngraveOptions } from './toolkit'

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

/** The engraver started, so the first staff a screen shows need not wait on it to load. */
export function warmEngraver(): void {
  if (typeof Worker === 'undefined') void loadToolkit()
  else workerOf().postMessage({ warm: true })
}

/**
 * A score's MEI engraved by Verovio (ADR 0078): in a Web Worker, so a long score never holds the page
 * back; where there is none (tests), here. Its pages' SVG, a line's one page.
 */
export function engrave(mei: string, options: EngraveOptions): Promise<string[]> {
  if (typeof Worker === 'undefined') return engraveMei(mei, options)
  const id = nextId++
  return new Promise((resolve, reject) => {
    waiting.set(id, (reply) =>
      'error' in reply ? reject(new Error(reply.error)) : resolve(reply.pages),
    )
    workerOf().postMessage({ id, mei, options })
  })
}
