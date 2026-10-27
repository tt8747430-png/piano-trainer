import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { PIECE_TEMPO } from '@/entities/piece'
import { cn } from '@/shared/lib'
import {
  beatUnit,
  tempoMark,
  tempoUnitsFor,
  unitNote,
  type Meter,
  type TempoUnit,
} from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { TEMPO_WORDS, tempoWord } from '../model/tempo-words'
import { PickerActions, SignPicker } from './SignPicker'

/** How far a finger or the mouse moves the mark: a beat a minute for every few px. */
const PX_PER_BEAT = 4
/** How far a press moves before it is a drag, the screen filled with the ruler. */
const DRAG_FROM = 4
/** How long a digit typed waits for the next, in ms. */
const TYPED = 900
/** The mouse wheel's travel that steps the mark once. */
const WHEEL_STEP = 40

/** The marks a piece's tempo may be written at in a unit: 40 to 160 of the song's beats a minute. */
function markRange(unit: TempoUnit, meter: Meter) {
  return {
    low: Math.ceil(tempoMark(PIECE_TEMPO.min, unit, meter)),
    high: Math.floor(tempoMark(PIECE_TEMPO.max, unit, meter)),
  }
}

/**
 * The ruler the screen fills with while the mark is dragged (ADR 0114, as notation apps' tempo
 * dials): the accent from edge to edge, the mark large in the middle, a tick for every beat a minute
 * down the left edge moving under the finger, the mark's own longer, and the tempo words at theirs.
 */
function TempoRuler({
  mark,
  low,
  high,
  name,
}: {
  mark: number
  low: number
  high: number
  name: (word: (typeof TEMPO_WORDS)[number][0]) => string
}) {
  const at = (value: number) => `calc(50% + ${(mark - value) * PX_PER_BEAT}px)`
  return createPortal(
    <div
      aria-hidden
      data-slot="tempo-ruler"
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden bg-link text-background"
    >
      {Array.from({ length: high - low + 1 }, (_, i) => low + i).map((value) => (
        <span
          key={value}
          className={cn(
            'absolute left-0 h-0.5 rounded-full bg-current',
            value % 10 === 0 ? 'w-3 opacity-60' : 'w-1.5 opacity-40',
          )}
          style={{ top: at(value) }}
        />
      ))}
      <span className="absolute top-1/2 left-0 h-0.5 w-6 rounded-full bg-current" />
      {TEMPO_WORDS.filter(([, bpm]) => bpm >= low && bpm <= high).map(([word, bpm]) => (
        <span
          key={word}
          className="absolute left-6 -translate-y-1/2 text-sm font-bold tracking-wider uppercase transition-opacity duration-150 motion-reduce:transition-none"
          // A word by the mark's number fades, so the number stands alone.
          style={{ top: at(bpm), opacity: Math.abs(mark - bpm) * PX_PER_BEAT < 48 ? 0.15 : 0.6 }}
        >
          {name(word)}
        </span>
      ))}
      <span className="absolute inset-0 grid place-items-center text-8xl font-light tabular-nums">
        {mark}
      </span>
    </div>,
    document.body,
  )
}

/**
 * The tempo mark's picker (ADR 0094, 0114, after notation apps' tempo dials): the mark large in an
 * accent circle, its tempo word under it; held and swiped up or down (or dragged with the mouse, or
 * the wheel turned) it changes a beat a minute every few px, the screen filled with its ruler while it
 * moves; with the focus a spin button, ↑ ↓ a beat a minute, Page Up and Page Down ten, Home and End its
 * ends, the number typed. Under it the notes the mark may count, the meter's beat first (♩ ♩. ♪ ♪. 𝅘𝅥𝅯;
 * 𝅗𝅥 𝅗𝅥. ♩ in 2/2), the one chosen ringed; another keeps the number. Nothing changes until ✓ (Enter), one
 * step Undo takes back; ✗ (Escape) leaves it.
 */
function TempoPicker({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  const wasUnit = useEditorState((state) => state.draft.tempoUnit ?? beatUnit(state.draft.meter))
  const wasMark = useEditorState((state) =>
    tempoMark(state.draft.tempo, wasUnit, state.draft.meter),
  )
  const [unit, setUnit] = useState<TempoUnit>(wasUnit)
  const [mark, setMark] = useState(wasMark)
  const [dragging, setDragging] = useState(false)
  const { low, high } = markRange(unit, meter)
  const kept = (value: number) => Math.min(high, Math.max(low, Math.round(value)))
  const word = (each: (typeof TEMPO_WORDS)[number][0]) => t(`song.tempos.${each}`)
  const press = useRef<{ y: number; mark: number; moved: boolean } | null>(null)
  const typed = useRef({ text: '', at: 0 })
  const wheel = useRef(0)
  const circle = useRef<HTMLDivElement>(null)

  // The mouse wheel, kept from scrolling the page while it turns the mark.
  useEffect(() => {
    const element = circle.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      wheel.current += event.deltaY
      const steps = Math.trunc(wheel.current / WHEEL_STEP)
      if (steps === 0) return
      wheel.current -= steps * WHEEL_STEP
      setMark((now) => Math.min(high, Math.max(low, now - steps)))
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [low, high])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    press.current = { y: event.clientY, mark, moved: false }
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const held = press.current
    if (!held) return
    const dy = held.y - event.clientY
    if (!held.moved && Math.abs(dy) < DRAG_FROM) return
    held.moved = true
    setDragging(true)
    setMark(kept(held.mark + dy / PX_PER_BEAT))
  }
  const onPointerUp = () => {
    press.current = null
    setDragging(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const by = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[event.key]
    if (by !== undefined) {
      event.preventDefault()
      setMark((now) => kept(now + by))
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setMark(event.key === 'Home' ? low : high)
      return
    }
    if (!/^\d$/.test(event.key)) return
    event.preventDefault()
    const now = event.timeStamp
    const text = (now - typed.current.at < TYPED ? typed.current.text : '') + event.key
    typed.current = { text, at: now }
    const value = Number(text)
    if (value >= low && value <= high) setMark(value)
  }

  const changed = unit !== wasUnit || mark !== wasMark
  const apply = () => {
    if (!changed) return
    actions.dispatch({ type: 'tempo', mark, unit })
    onDone()
  }
  const name = word(tempoWord(mark))
  return (
    <div
      className="flex flex-col items-center gap-6"
      onKeyDown={(event) => {
        if (event.key !== 'Enter' || event.target instanceof HTMLButtonElement) return
        event.preventDefault()
        apply()
      }}
    >
      <div
        ref={circle}
        role="spinbutton"
        tabIndex={0}
        aria-label={t('tempo.mark')}
        aria-valuenow={mark}
        aria-valuemin={low}
        aria-valuemax={high}
        aria-valuetext={t('tempo.value', { mark, word: name })}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="mt-2 grid size-44 cursor-ns-resize touch-none place-items-center rounded-full bg-link text-background shadow-md outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring landscape-phone:size-36"
      >
        <span className="flex flex-col items-center gap-1">
          <span className="text-6xl leading-none font-light tabular-nums">{mark}</span>
          <span className="text-sm font-medium tracking-wider uppercase">{name}</span>
        </span>
      </div>
      <div role="radiogroup" aria-label={t('tempo.unit')} className="flex items-center gap-3">
        {tempoUnitsFor(meter).map((each) => (
          <button
            key={each}
            type="button"
            role="radio"
            aria-checked={each === unit}
            aria-label={t(`tempo.units.${each}`)}
            title={t(`tempo.units.${each}`)}
            onClick={() => {
              setUnit(each)
              const range = markRange(each, meter)
              setMark((now) => Math.min(range.high, Math.max(range.low, now)))
            }}
            className="relative grid size-12 place-items-center rounded-full font-music text-2xl leading-none text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:outline-3 focus-visible:outline-ring aria-checked:text-link aria-checked:ring-2 aria-checked:ring-border motion-reduce:transition-none"
          >
            {unitNote(each)}
            {each === unit ? (
              <span
                aria-hidden
                className="absolute -bottom-0.5 size-0 border-x-4 border-b-4 border-x-transparent border-b-muted-foreground"
              />
            ) : null}
          </button>
        ))}
      </div>
      <div className="self-stretch">
        <PickerActions onCancel={onDone} onApply={apply} changed={changed} />
      </div>
      {dragging ? <TempoRuler mark={mark} low={low} high={high} name={word} /> : null}
    </div>
  )
}

/**
 * The tempo mark's picker where the mark is printed (ADR 0094, 0114): the song's own tempo and the
 * note it counts, saved with its music; how to slide it behind the ⓘ by its title.
 */
export function TempoPopover({ trigger }: { trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPicker title={t('song.tempo')} info={t('tempo.markInfo')} trigger={trigger}>
      {(close) => <TempoPicker onDone={close} />}
    </SignPicker>
  )
}
