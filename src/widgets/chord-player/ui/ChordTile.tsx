import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn } from '@/shared/lib'
import { chordSymbol, printedSymbol, type Chord, type Key } from '@/shared/lib/music'
import { boxName } from '../model/box-name'
import type { BoxPlace } from '../model/engine'

/** What a chord's tile asks of the sheet. */
export interface TileActs {
  /** Its chord sheet opened; with a letter typed on the tile, the symbol starts with it. */
  open(place: BoxPlace, typed?: string): void
  remove(place: BoxPlace): void
  resize(place: BoxPlace, beats: number): void
}

/**
 * A chord as the board writes it in its bar: its name in the book serif, bold. Drawn lifted, on a
 * card with a shadow, while it is in hand (memory-palaces': the overlay is the thing itself).
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
    <span className="grid min-h-11 min-w-14 place-items-center rounded-control bg-card px-3 font-display text-[17px] font-bold whitespace-nowrap text-foreground elevation-3">
      {boxName(chord, musicKey, names)}
    </span>
  )
}

/**
 * A chord in its bar (canvas 171), as wide as its beats: a tap opens its chord sheet; held a quarter
 * of a second by a finger, or dragged by a mouse, it lifts and lands before any chord of any section,
 * or at a section's end; from the keys, Space picks it up and the arrows move it, Enter opens it, a letter
 * starts a new symbol in its sheet, Backspace deletes it, Shift and the arrows change its length.
 */
export function ChordTile({
  id,
  chord,
  beats,
  musicKey,
  names,
  lit,
  place,
  acts,
}: {
  id: string
  chord: Chord
  beats: number
  musicKey: Key
  names: ProgressionNames
  lit: boolean
  place: BoxPlace
  acts: TileActs
}) {
  const { t } = useTranslation('practice')
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })
  const symbol = printedSymbol(chordSymbol(chord))
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
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-roledescription={t('chordPlayer.tile')}
      aria-label={t('chordPlayer.box', { chord: symbol, count: beats })}
      aria-current={lit ? 'true' : undefined}
      title={t('chordPlayer.boxHint')}
      onClick={() => acts.open(place)}
      onKeyDown={onKeyDown}
      className={cn(
        'flex min-w-10 cursor-grab touch-manipulation items-center justify-center px-0.5 font-display text-[17px] font-bold whitespace-nowrap select-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ring active:cursor-grabbing md:text-[22px]',
        isDragging && 'opacity-30',
      )}
      style={{ flex: `${beats} 1 0`, transform: CSS.Translate.toString(transform), transition }}
    >
      {boxName(chord, musicKey, names)}
    </div>
  )
}
