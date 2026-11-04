import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, Ellipsis, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn } from '@/shared/lib'
import {
  SECTION_KINDS,
  SECTION_REPEATS,
  sectionBars,
  type SheetMeter,
  type SheetSection,
  type Variation,
} from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  chordRole,
  chordSymbol,
  numeralOf,
  numeralText,
  printedSymbol,
  type Chord,
  type Key,
} from '@/shared/lib/music'
import { ActionMenu, MenuPicker, PAINT, ROLE_PAINT, Segmented, Stepper } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { boxName } from '../model/box-name'
import type { BoxPlace } from '../model/engine'

/** A box's id among the sortable ones of its section. */
const boxId = (section: number, index: number) => `box-${section}-${index}`

/** What a section's box asks of the sheet. */
export interface BoxActs {
  /** A box's chord typed: its text, read by the caller (false where it does not read). */
  type(place: BoxPlace, text: string): boolean
  open(place: BoxPlace): void
  remove(place: BoxPlace): void
  resize(place: BoxPlace, beats: number): void
  move(section: number, from: number, to: number): void
  add(section: number): void
}

/**
 * A section of the chord sheet (R29 CP2) as a card: its head (its name, Repeat, Variation, ⋯), its
 * bars in an even grid, each bar's chords as boxes spanning their beats, dragged to reorder (a held
 * finger on a phone; Space, the arrows and Space again on a keyboard), resized by their right edge,
 * typed into, a double tap or Enter opening the chord's choices.
 */
export function SheetSection({
  section,
  index,
  musicKey,
  meter,
  names,
  variations,
  lit,
  typing,
  onTyping,
  acts,
  onChange,
  onDuplicate,
  onDelete,
  canDuplicate,
  sortId,
}: {
  section: SheetSection
  index: number
  musicKey: Key
  meter: SheetMeter
  names: ProgressionNames
  /** The style's variations: none drawn but one. */
  variations: readonly Variation[]
  lit: BoxPlace | null
  /** The box being typed into, and what it holds so far. */
  typing: { readonly place: BoxPlace; readonly text: string } | null
  onTyping(typing: { readonly place: BoxPlace; readonly text: string } | null): void
  acts: BoxActs
  onChange(change: Partial<SheetSection>): void
  onDuplicate(): void
  onDelete(): void
  canDuplicate: boolean
  /** Its id among the sections, sortable by its handle. */
  sortId: string
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  const bars = sectionBars(section, meter)
  const perBar = beatsPerBar(meter)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] },
    }),
  )
  const ids = section.chords.map((_, i) => boxId(index, i))
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    acts.move(index, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
  }
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortId })
  const filled = bars.at(-1)?.filled ?? perBar
  return (
    <section
      ref={setNodeRef}
      aria-label={name}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-card bg-card p-3 elevation-1',
        isDragging && 'relative z-10',
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={t('chordPlayer.drag', { name })}
          title={t('chordPlayer.drag', { name })}
          className="grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-control text-muted-foreground hover:bg-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden className="size-4" />
        </button>
        <MenuPicker
          label={t('chordPlayer.section')}
          value={section.kind}
          options={SECTION_KINDS.map((kind) => ({
            value: kind,
            label: t(`chordPlayer.sections.${kind}`),
          }))}
          onChange={(kind) => onChange({ kind })}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('chordPlayer.repeat')}</span>
          <Stepper
            label={t('chordPlayer.repeat')}
            value={section.repeats}
            min={SECTION_REPEATS.min}
            max={SECTION_REPEATS.max}
            format={(count) => t('chordPlayer.times', { count })}
            decrease={t('chordPlayer.fewer')}
            increase={t('chordPlayer.moreTimes')}
            onChange={(repeats) => onChange({ repeats })}
          />
        </div>
        {variations.length > 1 ? (
          <div className="w-44 shrink-0">
            <Segmented
              label={t('chordPlayer.variation')}
              value={Math.min(section.variation, variations.length) as Variation}
              options={variations.map((value) => ({ value, label: String(value) }))}
              onChange={(variation) => onChange({ variation })}
            />
          </div>
        ) : null}
        <div className="ms-auto">
          <ActionMenu
            label={t('chordPlayer.sectionMenu', { name })}
            align="end"
            trigger={<Ellipsis aria-hidden />}
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-11"
                aria-label={t('chordPlayer.sectionMenu', { name })}
                title={t('chordPlayer.sectionMenu', { name })}
              />
            }
            actions={[
              ...(canDuplicate
                ? [
                    {
                      key: 'duplicate',
                      label: t('chordPlayer.duplicate'),
                      icon: Copy,
                      onSelect: onDuplicate,
                    },
                  ]
                : []),
              {
                key: 'delete',
                label: t('chordPlayer.delete'),
                icon: Trash2,
                destructive: true,
                onSelect: onDelete,
              },
            ]}
          />
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          {/* Even bars: two a row on a phone, four from 48rem. */}
          <ol className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {bars.map((bar, b) => (
              <li
                key={b}
                aria-label={t('chordPlayer.bar', { count: b + 1 })}
                data-bar=""
                className="relative grid min-h-24 min-w-0 gap-1 rounded-control bg-muted/50 p-1"
                style={{ gridTemplateColumns: `repeat(${perBar}, minmax(0, 1fr))` }}
              >
                <BeatTicks beats={perBar} />
                {bar.pieces.map((piece) => {
                  const chord = section.chords[piece.chord]
                  if (!chord) return null
                  const place = { section: index, index: piece.chord }
                  const style = { gridColumn: `${piece.from + 1} / span ${piece.beats}` }
                  return piece.held ? (
                    <HeldOver key={`held-${piece.chord}`} style={style} lit={sameBox(lit, place)} />
                  ) : (
                    <ChordBox
                      key={ids[piece.chord]}
                      id={ids[piece.chord] ?? ''}
                      chord={chord.chord}
                      beats={chord.beats}
                      perBar={perBar}
                      musicKey={musicKey}
                      names={names}
                      style={style}
                      lit={sameBox(lit, place)}
                      typing={sameBox(typing?.place ?? null, place) ? (typing?.text ?? '') : null}
                      onTyping={(text) => onTyping(text === null ? null : { place, text })}
                      place={place}
                      acts={acts}
                    />
                  )
                })}
                {b === bars.length - 1 && filled < perBar ? (
                  <AddBox
                    label={t('chordPlayer.addChord', { name })}
                    style={{ gridColumn: `${filled + 1} / span ${perBar - filled}` }}
                    onClick={() => acts.add(index)}
                  />
                ) : null}
              </li>
            ))}
            {filled === perBar || bars.length === 0 ? (
              <li className="grid min-h-24 rounded-control border border-dashed border-border">
                <AddBox
                  label={t('chordPlayer.addChord', { name })}
                  onClick={() => acts.add(index)}
                />
              </li>
            ) : null}
          </ol>
        </SortableContext>
      </DndContext>
    </section>
  )
}

const sameBox = (a: BoxPlace | null, b: BoxPlace) =>
  a !== null && a.section === b.section && a.index === b.index

/** A bar's beats, faint ticks along its foot: where a box's edge snaps. */
function BeatTicks({ beats }: { beats: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-1 bottom-0.5 flex">
      {Array.from({ length: beats }, (_, i) => (
        <span key={i} className="h-1.5 flex-1 border-s border-border first:border-s-0" />
      ))}
    </span>
  )
}

/** A chord held over the bar line from the bar before: its colour carried on, no box of its own. */
function HeldOver({ style, lit }: { style: CSSProperties; lit: boolean }) {
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        'rounded-control border-2 border-dashed',
        lit ? 'border-primary' : 'border-border',
      )}
    />
  )
}

function AddBox({
  label,
  style,
  onClick,
}: {
  label: string
  style?: CSSProperties
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      style={style}
      onClick={onClick}
      className="grid min-h-11 place-items-center rounded-control text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
    >
      <Plus aria-hidden className="size-5" />
    </button>
  )
}

/**
 * A chord's box: its name large, its numeral and role under it in its role's paint (D14), lit while
 * it sounds. Focused, a letter types a new chord into it (the piano's keys stay quiet while a field
 * has the focus), Enter opens its choices, Backspace deletes it, Shift+← and Shift+→ change its
 * length; its right edge dragged does too, a beat at a time.
 */
function ChordBox({
  id,
  chord,
  beats,
  perBar,
  musicKey,
  names,
  style,
  lit,
  typing,
  onTyping,
  place,
  acts,
}: {
  id: string
  chord: Chord
  beats: number
  perBar: number
  musicKey: Key
  names: ProgressionNames
  style: CSSProperties
  lit: boolean
  typing: string | null
  onTyping(text: string | null): void
  place: BoxPlace
  acts: BoxActs
}) {
  const { t } = useTranslation(['practice', 'music'])
  const sortable = useSortable({ id })
  const symbol = printedSymbol(chordSymbol(chord))
  const numeral = numeralOf(chord, musicKey)
  const role = numeral ? chordRole(numeral, musicKey.minor) : null
  const look = role ? PAINT[ROLE_PAINT[role.role]] : null
  const [stretch, setStretch] = useState<number | null>(null)
  const drag = useRef<{ x: number; beat: number } | null>(null)
  const shown = stretch ?? beats

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (/^[a-g]$/i.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()
      onTyping(event.key.toUpperCase())
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
  const onEdgeDown = (event: PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    event.preventDefault()
    const bar = event.currentTarget.closest('[data-bar]')
    const width = bar?.getBoundingClientRect().width ?? 0
    if (width <= 0) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    drag.current = { x: event.clientX, beat: width / perBar }
  }
  const onEdgeMove = (event: PointerEvent<HTMLSpanElement>) => {
    const from = drag.current
    if (!from) return
    setStretch(Math.max(1, beats + Math.round((event.clientX - from.x) / from.beat)))
  }
  const onEdgeUp = () => {
    if (!drag.current) return
    drag.current = null
    if (stretch !== null && stretch !== beats) acts.resize(place, stretch)
    setStretch(null)
  }
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-roledescription={t('practice:chordPlayer.typeChord')}
      aria-label={t('practice:chordPlayer.box', { chord: symbol, count: shown })}
      aria-current={lit ? 'true' : undefined}
      title={t('practice:chordPlayer.boxHint')}
      data-box={`${place.section}-${place.index}`}
      onKeyDown={onKeyDown}
      onDoubleClick={() => acts.open(place)}
      style={{
        ...style,
        ...(stretch === null
          ? {}
          : {
              gridColumn: `${String(style.gridColumn).split(' ')[0]} / span ${Math.min(stretch, perBar)}`,
            }),
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(
        'relative flex min-h-20 min-w-0 cursor-grab touch-manipulation flex-col items-center justify-center rounded-control px-1 py-1 leading-tight transition-colors duration-150 ease-out select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring',
        lit && look
          ? cn(look.full, 'text-on-paint-full')
          : look
            ? cn(look.fill, look.ink)
            : 'bg-raised',
        lit && 'ring-2 ring-primary',
        isDragging && 'z-10 elevation-2',
      )}
    >
      {typing !== null ? (
        <TypedChord
          text={typing}
          onText={(text) => onTyping(text)}
          onDone={(commit, leaving) => {
            const set = commit && acts.type(place, typing)
            if (!commit || set || leaving) onTyping(null)
          }}
        />
      ) : (
        <>
          <span
            className={cn(
              'max-w-full font-display font-semibold break-all',
              shown >= 2 ? 'text-xl' : 'text-base',
            )}
          >
            {boxName(chord, musicKey, names)}
          </span>
          {role ? (
            <span className="max-w-full text-center text-xs font-semibold text-balance break-words">
              {names === 'chords' && numeral ? `${numeralText(numeral)} · ` : ''}
              {t(`music:harmony.role.${role.role}`)}
            </span>
          ) : null}
        </>
      )}
      <span
        aria-hidden
        title={t('practice:chordPlayer.edge', { chord: symbol })}
        onPointerDown={onEdgeDown}
        onPointerMove={onEdgeMove}
        onPointerUp={onEdgeUp}
        onPointerCancel={onEdgeUp}
        data-edge=""
        className="absolute inset-y-1 end-0 w-3 cursor-ew-resize touch-none rounded-e-control hover:bg-foreground/10"
      />
    </div>
  )
}

/** A chord being typed into its box: Enter or Tab sets it, Escape leaves it as it was. */
function TypedChord({
  text,
  onText,
  onDone,
}: {
  text: string
  onText(text: string): void
  /** Set (`commit`), or left as it was; `leaving`, the field lost the focus, done either way. */
  onDone(commit: boolean, leaving?: boolean): void
}) {
  const { t } = useTranslation('practice')
  return (
    <input
      // The box was typed into: its field takes the keys from here.
      autoFocus
      aria-label={t('chordPlayer.typeChord')}
      value={text}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      enterKeyHint="done"
      onChange={(event) => onText(event.target.value.slice(0, 12))}
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        event.stopPropagation()
        if (event.key === 'Enter' || event.key === 'Tab') {
          if (event.key === 'Enter') event.preventDefault()
          onDone(true)
        } else if (event.key === 'Escape') {
          event.preventDefault()
          onDone(false)
        }
      }}
      onBlur={() => onDone(true, true)}
      className="w-full min-w-0 rounded-control bg-background px-1 py-1 text-center font-display text-lg font-semibold outline-none ring-2 ring-ring"
    />
  )
}
