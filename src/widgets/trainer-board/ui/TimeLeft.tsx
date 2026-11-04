import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** How often the time left is drawn again. */
const TICK_MS = 250
/** The ring's radius in its 40-unit box, and its length round. */
const RADIUS = 17
const ROUND = 2 * Math.PI * RADIUS

/**
 * A round's time limit running down: a ring emptying round the seconds left, beside the run's tally,
 * stopped where it stood once the round is answered. A new round (a new `key`) starts it full.
 */
export function TimeLeft({ seconds, running }: { seconds: number; running: boolean }) {
  const { t } = useTranslation('quiz')
  const [left, setLeft] = useState(seconds * 1000)
  // The run down goes on from where it stands; only answering stops it.
  const standing = useRef(left)
  useEffect(() => {
    if (!running) return
    const end = performance.now() + standing.current
    const timer = setInterval(() => {
      standing.current = Math.max(0, end - performance.now())
      setLeft(standing.current)
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [running])
  const shown = Math.ceil(left / 1000)
  return (
    <span className="relative grid size-10 shrink-0 place-items-center">
      <svg aria-hidden viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
        <circle cx="20" cy="20" r={RADIUS} className="fill-none stroke-muted" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={RADIUS}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-250 ease-linear"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={ROUND}
          strokeDashoffset={ROUND * (1 - left / (seconds * 1000))}
        />
      </svg>
      <span className="text-sm font-semibold tabular-nums">
        <span className="sr-only">{t('timing.left')} </span>
        {shown}
      </span>
    </span>
  )
}
