import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import type { Midi } from '@/shared/lib/music'
import type { KeyPlace, Stage, StageInput } from './scene/stage'

/** A tag over a key's far end (Chords' stage): its note's name on its chord tone's colour. */
export interface KeyTag {
  readonly key: Midi
  readonly black: boolean
  readonly label: string
  /** A CSS colour: the tone's paint. */
  readonly colour: string
}

/** A tag's width at least, and how much each letter adds to it, as the canvas measures them. */
const TAG_LEAST = 22
const TAG_PER_LETTER = 8

/**
 * The tags over the keys, the canvas's labels over the 3D keys value for value: each a 22px round
 * tag of its colour, 12px bold ink, a ring of ink at 55%, over its key's far end; neighbours moved
 * apart until neither covers the other; one whose key is out of sight hidden, never cut at the edge.
 */
function placeTags(layer: HTMLElement, tags: readonly KeyTag[], place: KeyPlace) {
  while (layer.children.length > tags.length) layer.lastChild?.remove()
  const width = layer.clientWidth
  const height = layer.clientHeight
  const placed = tags.map((tag, at) => {
    let element = layer.children[at] as HTMLElement | undefined
    if (!element) {
      element = layer.ownerDocument.createElement('span')
      element.className =
        'absolute flex h-5.5 min-w-5.5 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full px-1.25 text-xs font-extrabold whitespace-nowrap text-primary-foreground shadow-[0_0_0_1.5px_rgb(51_41_33/0.55),0_1px_3px_rgb(51_41_33/0.3)]'
      layer.append(element)
    }
    const [x, y] = place(tag.key, tag.black)
    element.textContent = tag.label
    element.style.background = tag.colour
    element.style.top = `${Math.max(26, y * height - 3).toFixed(1)}px`
    return { element, x: x * width, w: Math.max(TAG_LEAST, tag.label.length * TAG_PER_LETTER + 10) }
  })
  const across = [...placed].sort((a, b) => a.x - b.x)
  for (let i = 1; i < across.length; i += 1) {
    const left = across[i - 1]
    const right = across[i]
    if (!left || !right) continue
    const need = (left.w + right.w) / 2 + 3 - (right.x - left.x)
    if (need > 0) {
      left.x -= need / 2
      right.x += need / 2
    }
  }
  for (const each of placed) {
    each.element.style.left = `${each.x.toFixed(1)}px`
    each.element.style.visibility =
      each.x - each.w / 2 < 4 || each.x + each.w / 2 > width - 4 ? 'hidden' : 'visible'
  }
}

export interface PianoHandsProps extends StageInput {
  /** Tags over the keys' far ends, where no hand covers them (Chords' stage). */
  readonly tags?: readonly KeyTag[]
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
export function PianoHands({ height, onShowKeys, tags = [], ...input }: PianoHandsProps) {
  const { t } = useTranslation('player')
  const box = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const stage = useRef<Stage | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)
  const describedBy = useId()
  const current = useEffectEvent(() => input)
  const layer = useRef<HTMLDivElement>(null)
  const shownTags = useRef(tags)

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
            onDrawn: (place) => {
              if (layer.current) placeTags(layer.current, shownTags.current, place)
            },
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
    shownTags.current = tags
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
      <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0" />
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
