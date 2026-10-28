import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** How often the time left is drawn again. */
const TICK_MS = 250

/**
 * A round's time limit running down: a bar emptying under the prompt and the seconds left beside it,
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
    <div className="flex items-center gap-3 landscape-phone:col-span-2">
      <div aria-hidden className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-250 ease-linear"
          style={{ width: `${(100 * left) / (seconds * 1000)}%` }}
        />
      </div>
      <span className="min-w-10 text-right text-sm text-muted-foreground tabular-nums">
        <span className="sr-only">{t('timing.left')} </span>
        {t('summary.seconds', { seconds: shown })}
      </span>
    </div>
  )
}
