import { useEffect, useRef } from 'react'
import { useServices } from '@/shared/lib/services'

/**
 * The line where the take is heard now, moved every frame from the audio clock into a transform (no
 * render a frame); gone past the take's end.
 */
export function RollPlayhead({
  playing,
  length,
  pxPerMs,
}: {
  /** When on the audio clock the take started, and from where in it (ms). */
  playing: { readonly at: number; readonly fromMs: number }
  /** The roll's length (ms). */
  length: number
  pxPerMs: number
}) {
  const { audio } = useServices()
  const line = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const follow = () => {
      const ms = playing.fromMs + Math.max(0, audio.now() - playing.at) * 1000
      const shown = line.current
      if (!shown) return
      shown.style.transform = `translateX(${ms * pxPerMs}px)`
      shown.hidden = ms > length
      if (ms <= length) frame = requestAnimationFrame(follow)
    }
    follow()
    return () => cancelAnimationFrame(frame)
  }, [audio, playing, length, pxPerMs])
  return (
    <div
      ref={line}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-px bg-primary"
    />
  )
}
