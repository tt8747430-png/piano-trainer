import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn } from '@/shared/lib'
import { CHORD_BEATS } from '@/shared/lib/arrangement'
import { chordSymbol, printedSymbol, type Chord, type Key } from '@/shared/lib/music'
import { boxName } from '../model/box-name'
import type { BoxPlace } from '../model/engine'
import { ChordName } from './ChordName'

/** What a chord's tile asks of the sheet. */
export interface TileActs {
  /** Its chord sheet opened; with a letter typed on the tile, the symbol starts with it. */
  open(place: BoxPlace, typed?: string): void
  /** It selected: Play starts from it. */
  select(place: BoxPlace): void
  remove(place: BoxPlace): void
  resize(place: BoxPlace, beats: number): void
}

/**
 * A chord as its box shows it (canvas 173), drawn lifted on a shadow while it is in hand
 * (memory-palaces': the overlay is the thing itself).
 */
export function ChordFace({
  chord,
  musicKey,
  names,
}: {
  chord: Chord
  musicKey: Key
  names: ProgressionNames
}) {
  return (
    <span className="grid min-h-[60px] min-w-16 place-items-start rounded-[6px] bg-card px-2 pt-1 text-[21px] font-medium whitespace-nowrap text-foreground elevation-3">
      <ChordName text={boxName(chord, musicKey, names)} />
    </span>
  )
}

/** A second tap within this many milliseconds is a double tap: the chord's sheet opens. */
const DOUBLE_TAP_MS = 350

/**
 * A chord as Musicca's box (canvas 173): as many of its row's beat columns wide as its beats, its name
 * large at its top left with its extension raised, a tick for each beat along its foot (the beat
 * sounding taller, in ink). One tap selects it (Play then starts there), a double tap opens its sheet.
 * Selected or sounding it wears the honey ring, sounding on the honey wash too. Selected, its right
 * edge carries Musicca's handle: dragged, it sets its length in whole beats, nothing else retimed.
 * Held a quarter of a second by a finger, or dragged by a mouse, it lifts and lands before any chord
 * of any section, or at a section's end; from the keys, Space picks it up and the arrows move it,
 * Enter opens it, a letter starts a new symbol in its sheet, Backspace deletes it, Shift and the
 * arrows change its length. The last chord of a bar whose beats are not the meter's carries the !.
 */
export function ChordTile({
  id,
  chord,
  beats,
  columns,
  musicKey,
  names,
  lit,
  litBeat,
  selected,
  wrong,
  place,
  acts,
}: {
  id: string
  chord: Chord
  beats: number
  /** Its row's beat columns: a longer chord takes the whole row. */
  columns: number
  musicKey: Key
  names: ProgressionNames
  lit: boolean
  /** The beat of it sounding now, from 0, while it sounds. */
  litBeat: number | null
  selected: boolean
  /** Its bar's !: what it says, and the chord it opens; null where the bar adds up. */
  wrong: { label: string; open: BoxPlace } | null
  place: BoxPlace
  acts: TileActs
}) {
  const { t } = useTranslation('practice')
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })
  const symbol = printedSymbol(chordSymbol(chord))
  const lastTap = useRef(0)
  /** Its length while its handle is dragged: shown at once, saved on letting go. */
  const [stretch, setStretch] = useState<number | null>(null)
  const shown = stretch ?? beats
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    listeners?.onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (/^[a-g]$/i.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()
      acts.open(place, event.key.toUpperCase())
    } else if (event.key === 'Enter') {
      event.preventDefault()
      acts.open(place)
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      acts.remove(place)
    } else if (event.shiftKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault()
      acts.resize(place, beats + (event.key === 'ArrowRight' ? 1 : -1))
    }
  }
  const onTap = () => {
    const now = performance.now()
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0
      acts.open(place)
    } else {
      lastTap.current = now
      acts.select(place)
    }
  }
  /** Musicca's handle: the pointer's travel in beat widths, from the box's own width. */
  const onStretch = (event: PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    event.preventDefault()
    const box = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!box) return
    const perBeat = box.width / Math.max(1, Math.min(beats, columns))
    const from = event.clientX
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    let next = beats
    const move = (moved: globalThis.PointerEvent) => {
      next = Math.min(
        CHORD_BEATS.max,
        Math.max(CHORD_BEATS.min, beats + Math.round((moved.clientX - from) / perBeat)),
      )
      setStretch(next)
    }
    const up = () => {
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', up)
      handle.removeEventListener('pointercancel', up)
      setStretch(null)
      if (next !== beats) acts.resize(place, next)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', up)
    handle.addEventListener('pointercancel', up)
  }
  return (
    <li
      ref={setNodeRef}
      className={cn('relative flex min-w-0', isDragging && 'opacity-30')}
      style={{
        gridColumn: `span ${Math.min(shown, columns)}`,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <div
        {...attributes}
        {...listeners}
        role="button"
        tabIndex={0}
        aria-roledescription={t('chordPlayer.tile')}
        aria-label={t('chordPlayer.box', { chord: symbol, count: shown })}
        aria-current={lit ? 'true' : undefined}
        aria-pressed={selected}
        title={t('chordPlayer.boxHint')}
        onClick={onTap}
        onKeyDown={onKeyDown}
        className={cn(
          'relative flex h-[60px] min-w-0 flex-1 cursor-grab touch-manipulation items-start overflow-hidden rounded-[6px] px-2 pt-1 select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing lg:h-[76px]',
          lit ? 'bg-primary/35' : 'bg-card',
          lit || selected
            ? 'shadow-[0_0_0_2px_var(--color-honey-ring)]'
            : 'shadow-[0_0_0_1px_var(--color-border)]',
        )}
      >
        <span className="max-w-full truncate text-[21px] leading-[1.25] font-medium text-foreground lg:text-[28px]">
          <ChordName text={boxName(chord, musicKey, names)} />
        </span>
        <span aria-hidden className="absolute inset-x-0 bottom-0 flex h-2.5">
          {Array.from({ length: shown }, (_, tick) => (
            <span key={tick} className="flex flex-1 items-end justify-center">
              <span
                className={cn(
                  'w-[1.5px]',
                  litBeat === tick ? 'h-2.5 bg-foreground' : 'h-1.5 bg-muted-foreground/45',
                )}
              />
            </span>
          ))}
        </span>
      </div>
      {selected ? (
        <span
          role="separator"
          aria-orientation="vertical"
          aria-label={t('chordPlayer.resize')}
          title={t('chordPlayer.resize')}
          onPointerDown={onStretch}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          className="absolute inset-y-0 -right-2.5 z-10 flex w-6 cursor-ew-resize touch-none items-center justify-center"
        >
          <span className="h-[55%] w-1 rounded-full bg-foreground" />
        </span>
      ) : null}
      {wrong ? (
        <button
          type="button"
          aria-label={wrong.label}
          title={wrong.label}
          onClick={() => acts.open(wrong.open)}
          className="absolute -top-5 -right-5 z-10 grid size-11 place-items-center"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden>
            <circle cx="12" cy="12" r="11" className="fill-destructive" />
            <path
              d="M12 6.5v7M12 17.2v.3"
              className="stroke-white"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </li>
  )
}
