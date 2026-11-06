import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import type { Stage, StageInput } from './scene/stage'

export interface PianoHandsProps extends StageInput {
  /** Its height from the keys' place; else its own, wider on a wider screen. */
  readonly height: number | undefined
  /** Where the hands cannot be drawn: the keys in their place instead. */
  readonly onShowKeys: () => void
}

type Status = 'loading' | 'ready' | 'unsupported' | 'failed'

/** As tall as the keys' place allows, on a phone a little more than the keys, on a laptop a band. */
const OWN_HEIGHT = 'clamp(min(56px, var(--keys-most)), 12vw + 150px, var(--keys-most))'

/**
 * The hands at the keys (R36), in the keys' place: a piano seen from the seat, two hands playing the
 * music, each note pressed by its finger, as flowkey films a pianist's hands. Watched, never tapped:
 * a piano or the keys are played. Its 3D (three.js) loads only once it is shown; the keys stand
 * while the hands load, and a device that cannot draw 3D says so and offers the keys.
 */
export function PianoHands({ height, onShowKeys, ...input }: PianoHandsProps) {
  const { t } = useTranslation('player')
  const box = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const stage = useRef<Stage | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)
  const describedBy = useId()
  const current = useEffectEvent(() => input)

  useEffect(() => {
    const node = canvas.current
    const frame = box.current
    if (!node || !frame) return
    let gone = false
    let observer: ResizeObserver | null = null
    setStatus('loading')
    import('./scene/stage').then(
      ({ createStage }) => {
        if (gone) return
        try {
          stage.current = createStage(node, current(), {
            onLoaded: () => setStatus('ready'),
            onFailed: () => setStatus('failed'),
          })
        } catch {
          setStatus('unsupported')
          return
        }
        const resize = () => stage.current?.resize(frame.clientWidth, frame.clientHeight)
        observer = new ResizeObserver(resize)
        observer.observe(frame)
        resize()
      },
      () => {
        if (!gone) setStatus('failed')
      },
    )
    return () => {
      gone = true
      observer?.disconnect()
      stage.current?.dispose()
      stage.current = null
    }
  }, [attempt])

  // Every change of the music, the time or the learner's keys reaches the stage, which draws it.
  useEffect(() => {
    stage.current?.update(input)
  })

  const trouble = status === 'unsupported' || status === 'failed'
  return (
    <figure
      ref={box}
      aria-label={t('handsAtKeys.label')}
      aria-describedby={describedBy}
      aria-busy={status === 'loading'}
      className="relative m-0 overflow-hidden bg-key-bed"
      style={{ height: height === undefined ? OWN_HEIGHT : `${height}px` }}
    >
      <span id={describedBy} className="sr-only">
        {status === 'loading' ? t('handsAtKeys.loading') : t('handsAtKeys.description')}
      </span>
      <canvas ref={canvas} aria-hidden className="block size-full" />
      {trouble ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t(status === 'unsupported' ? 'handsAtKeys.unsupported' : 'handsAtKeys.failed')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {status === 'failed' ? (
              <Button variant="outline" onClick={() => setAttempt((n) => n + 1)}>
                {t('handsAtKeys.retry')}
              </Button>
            ) : null}
            <Button onClick={onShowKeys}>{t('handsAtKeys.showKeys')}</Button>
          </div>
        </div>
      ) : null}
    </figure>
  )
}
