import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn } from '@/shared/lib'
import {
  chordRole,
  chordSymbol,
  numeralOf,
  numeralText,
  printedSymbol,
  type Chord,
  type Key,
} from '@/shared/lib/music'
import { PAINT, ROLE_PAINT } from '@/shared/ui'
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
 * A chord's face: its name large, its numeral and role under it in its role's paint (D14), its beats
 * as dots. Drawn on the tile and, while it is dragged, as the tile in hand (memory-palaces': the
 * overlay is the row itself, lifted by a shadow).
 */
export function ChordFace({
  chord,
  beats,
  musicKey,
  names,
  lit = false,
  lifted = false,
}: {
  chord: Chord
  beats: number
  musicKey: Key
  names: ProgressionNames
  lit?: boolean
  lifted?: boolean
}) {
  const { t } = useTranslation('music')
  const numeral = numeralOf(chord, musicKey)
  const role = numeral ? chordRole(numeral, musicKey.minor) : null
  const look = role ? PAINT[ROLE_PAINT[role.role]] : null
  return (
    <span
      className={cn(
        'flex min-h-21 w-full flex-col items-center justify-center gap-0.5 rounded-control px-1 py-2 text-center leading-tight transition-colors duration-150 ease-out',
        lit && look
          ? cn(look.full, 'text-on-paint-full')
          : look
            ? cn(look.fill, look.ink)
            : 'bg-raised',
        lit && 'ring-3 ring-primary',
        lifted && 'elevation-3',
      )}
    >
      <span className="max-w-full font-display text-xl font-semibold break-all">
        {boxName(chord, musicKey, names)}
      </span>
      {role ? (
        <span className="max-w-full text-xs font-semibold text-balance">
          {names === 'chords' && numeral ? `${numeralText(numeral)} · ` : ''}
          {t(`harmony.role.${role.role}`)}
        </span>
      ) : null}
      <span aria-hidden className="flex gap-1 pt-0.5">
        {Array.from({ length: beats }, (_, beat) => (
          <span key={beat} className="size-1.5 rounded-pill bg-current opacity-60" />
        ))}
      </span>
    </span>
  )
}

/**
 * A chord's tile (R32, Apple's way): a tap opens its chord sheet (symbol, length, bass, passing
 * chords); held a quarter of a second by a finger, or dragged by a mouse, it lifts and moves among its
 * section's tiles; from the keys, Space picks it up and the arrows move it, Enter opens it, a letter
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
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'flex flex-1 cursor-grab touch-manipulation rounded-control select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing',
        isDragging && 'opacity-0',
      )}
    >
      <ChordFace chord={chord} beats={beats} musicKey={musicKey} names={names} lit={lit} />
    </div>
  )
}
