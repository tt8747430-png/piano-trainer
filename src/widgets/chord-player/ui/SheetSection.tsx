import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2 } from 'lucide-react'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn, useMediaQuery, LAPTOP } from '@/shared/lib'
import { DragHandle } from '@/shared/ui'
import {
  sectionBars,
  sectionChords,
  SECTION_REPEATS,
  type SheetMeter,
  type SheetSection as Section,
} from '@/shared/lib/arrangement'
import { beatsPerBar, type Key } from '@/shared/lib/music'
import { chordDragId, endDragId, sectionDragId } from '../model/sheet-dnd'
import { ChordTile, type TileActs } from './ChordTile'

/** Holds every chord's drop in place: chords of different lengths never slide under the finger. */
const STILL = () => null

/** A style's variations, Musicca's 1 to 4. */
const VARIATIONS = [1, 2, 3, 4] as const

/** One of the head's values (canvas 173): its fill 36 tall in a 44 target. */
const PILL =
  'relative flex h-9 min-w-0 shrink-0 items-center rounded-tile bg-muted px-3 text-[15px] whitespace-nowrap tabular-nums transition-colors duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[""] hover:brightness-95 focus-visible:outline-3 focus-visible:outline-ring'

/**
 * A section of the chord sheet as Musicca's (canvas 173): its head (its name, opening its sheet;
 * × n and Variation n, each a tap to the next; Delete, at once with Undo; the grip at its end), its
 * Genos marks under it while an arranger is followed, then its chords as boxes as wide as their
 * beats, two bars a row on a phone and four on a laptop, a + box after the last that adds a chord
 * and takes one dropped at the end.
 */
export const SheetSection = memo(function SheetSection({
  section,
  index,
  musicKey,
  meter,
  names,
  lit,
  beat,
  selected,
  variations,
  acts,
  onOpen,
  onChange,
  onDelete,
  tag,
  onTag,
}: {
  section: Section
  index: number
  musicKey: Key
  meter: SheetMeter
  names: ProgressionNames
  /** Its chord sounding, by its index, while it plays one. */
  lit: number | null
  /** The beat of the lit chord's bar sounding now. */
  beat: number | null
  /** Its chord selected, by its index: Play starts from it. */
  selected: number | null
  /** How many variations its style has: none shown but one. */
  variations: number
  /**
   * The acts and handlers below are held for good by the sheet, each told the section's index: a
   * section renders again only for what it shows, so a beat redraws the lit chord's alone.
   */
  acts: TileActs & { add(section: number): void }
  /** Its sheet opened: name, times, variation, loop, duplicate, delete. */
  onOpen(index: number): void
  onChange(index: number, change: Partial<Pick<Section, 'repeats' | 'variation'>>): void
  onDelete(index: number): void
  /** What it has a followed arranger play, in a line (empty: nothing set), or null when none is followed. */
  tag: string | null
  /** Its arranger sheet opened. */
  onTag(index: number): void
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  const bars = useMemo(() => sectionBars(section, meter), [section, meter])
  const perBar = beatsPerBar(meter)
  const wide = useMediaQuery(LAPTOP)
  const columns = perBar * (wide ? 4 : 2)
  const chords = useMemo(() => sectionChords(section), [section])
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionDragId(index) })
  const { setNodeRef: endDrop, isOver: overEnd } = useDroppable({ id: endDragId(index) })
  // One list while the chords stay: a new one would redraw every chord of the section.
  const ids = useMemo(
    () => Array.from({ length: chords.length }, (_, at) => chordDragId(index, at)),
    [chords.length, index],
  )
  return (
    <section
      ref={setNodeRef}
      aria-label={name}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('flex min-w-0 flex-col gap-2', isDragging && 'opacity-0')}
    >
      <div className="flex min-h-11 items-center gap-2">
        <button
          type="button"
          onClick={() => onOpen(index)}
          aria-label={t('chordPlayer.sectionOpen', { name, count: section.repeats })}
          title={t('chordPlayer.sectionOpen', { name, count: section.repeats })}
          className={cn(PILL, 'max-w-40 flex-[0_1_10rem] justify-start font-semibold')}
        >
          <span className="truncate">{name}</span>
        </button>
        <button
          type="button"
          onClick={() =>
            onChange(index, {
              repeats:
                section.repeats >= SECTION_REPEATS.max ? SECTION_REPEATS.min : section.repeats + 1,
            })
          }
          aria-label={t('chordPlayer.repeat')}
          title={t('chordPlayer.repeat')}
          className={PILL}
        >
          {t('chordPlayer.times', { count: section.repeats })}
        </button>
        {variations > 1 ? (
          <button
            type="button"
            onClick={() => {
              const order = VARIATIONS.filter((each) => each <= variations)
              const next = order[(order.indexOf(section.variation) + 1) % order.length]
              if (next !== undefined) onChange(index, { variation: next })
            }}
            aria-label={t('chordPlayer.variation')}
            title={t('chordPlayer.variation')}
            className={PILL}
          >
            {t('chordPlayer.variationN', { n: section.variation })}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onDelete(index)}
          aria-label={t('chordPlayer.deleteSection')}
          title={t('chordPlayer.deleteSection')}
          className="grid size-11 shrink-0 place-items-center rounded-control text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted"
        >
          <Trash2 aria-hidden className="size-[18px]" />
        </button>
        {/* A spacer, then the grip on the row's edge, as the board's head: the name shrinks before the grip moves. */}
        <span aria-hidden className="flex-1" />
        <DragHandle
          label={t('chordPlayer.drag', { name })}
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        />
      </div>
      {tag !== null ? (
        <button
          type="button"
          onClick={() => onTag(index)}
          aria-label={t('chordPlayer.arranger.tag', {
            name,
            marks: tag || t('chordPlayer.arranger.unset'),
          })}
          title={t('chordPlayer.arranger.tag', {
            name,
            marks: tag || t('chordPlayer.arranger.unset'),
          })}
          className={cn(
            'relative -mt-1.5 h-[30px] max-w-full self-start truncate rounded-tile px-2.5 text-[13px] font-semibold shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-[7px] before:content-[""] hover:bg-muted',
            !tag && 'text-muted-foreground',
          )}
        >
          {tag || t('chordPlayer.arranger.unset')}
        </button>
      ) : null}
      <SortableContext items={ids} strategy={STILL}>
        <ol
          aria-label={t('chordPlayer.chordsOf', { name })}
          className="grid gap-2 lg:gap-1.5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {bars.flatMap((bar, at) =>
            bar.pieces.map((piece, p) => {
              const chord = chords[piece.chord]
              if (!chord) return null
              const now = lit === piece.chord
              const first = bar.pieces[0]
              return (
                <ChordTile
                  key={ids[piece.chord]}
                  id={ids[piece.chord] ?? ''}
                  chord={chord.chord}
                  beats={chord.beats}
                  columns={columns}
                  musicKey={musicKey}
                  names={names}
                  lit={now}
                  litBeat={now && beat !== null ? beat - piece.from : null}
                  selected={selected === piece.chord}
                  wrong={
                    bar.wrong && p === bar.pieces.length - 1 && first
                      ? t('chordPlayer.wrongBar', { bar: at + 1, count: bar.beats, beats: perBar })
                      : null
                  }
                  wrongAt={first?.chord ?? 0}
                  section={index}
                  index={piece.chord}
                  acts={acts}
                />
              )
            }),
          )}
          <li
            ref={endDrop}
            className="flex min-w-11"
            style={{ gridColumn: `span ${wide ? 1 : 2}` }}
          >
            <button
              type="button"
              aria-label={t('chordPlayer.addChord', { name })}
              title={t('chordPlayer.addChord', { name })}
              onClick={() => acts.add(index)}
              className={cn(
                'grid h-[60px] flex-1 place-items-center rounded-tile text-muted-foreground shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-200 ease-out hover:bg-muted lg:h-[76px]',
                overEnd && 'bg-primary/35',
              )}
            >
              <Plus aria-hidden className="size-6" />
            </button>
          </li>
        </ol>
      </SortableContext>
    </section>
  )
})
