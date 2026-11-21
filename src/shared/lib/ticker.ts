/** Starts a clock that calls `onTick` every so often; returns what stops it. */
export type Ticker = (onTick: () => void) => () => void

/** The page's own timer, every `ms`: a hidden tab may slow it to once a second. */
export const pageTicker =
  (ms: number): Ticker =>
  (onTick) => {
    const timer = setInterval(onTick, ms)
    return () => clearInterval(timer)
  }

/** A timer in a Worker, every `ms`: a hidden tab slows a page's timers, never a worker's. */
export const workerTicker =
  (ms: number): Ticker =>
  (onTick) => {
    const url = URL.createObjectURL(
      new Blob([`setInterval(() => postMessage(0), ${ms})`], { type: 'text/javascript' }),
    )
    const worker = new Worker(url)
    worker.onmessage = () => onTick()
    return () => {
      worker.terminate()
      URL.revokeObjectURL(url)
    }
  }

/**
 * The clock music is scheduled by, every `ms`: a worker's, so a transport keeps time in a hidden tab;
 * the page's where there are no workers (a test's document).
 */
export const steadyTicker = (ms: number): Ticker =>
  typeof Worker === 'function' ? workerTicker(ms) : pageTicker(ms)
