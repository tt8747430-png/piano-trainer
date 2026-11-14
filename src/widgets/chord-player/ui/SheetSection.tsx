import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn, useMediaQuery } from '@/shared/lib'
import {
  sectionBars,
  sectionChords,
  SECTION_REPEATS,
  type SheetMeter,
  type SheetSection as Section,
} from '@/shared/lib/arrangement'
import { beatsPerBar, type Key } from '@/shared/lib/music'
import type { BoxPlace } from '../model/engine'
import { chordDragId, endDragId, sectionDragId } from '../model/sheet-dnd'
import { ChordTile, type TileActs } from './ChordTile'

/** Holds every chord's drop in place: chords of different lengths never slide under the finger. */
const STILL = () => null

/** A style's variations, Musicca's 1 to 4. */
const VARIATIONS = [1, 2, 3, 4] as const

/** A laptop's sheet holds four bars a row, a phone's two (canvas 173). */
const WIDE = '(min-width: 64rem)'

/** One of the head's values (canvas 173): its fill 36 tall in a 44 target. */
const PILL =
  'relative flex h-9 min-w-0 shrink-0 items-center rounded-[8px] bg-muted px-3 text-[15px] whitespace-nowrap tabular-nums transition-colors duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[""] hover:brightness-95 focus-visible:outline-3 focus-visible:outline-ring'

/**
 * A section of the chord sheet as Musicca's (canvas 173): its head (its name, opening its sheet;
 * × n and Variation n, each a tap to the next; Delete, at once with Undo; the grip at its end), its
 * Genos marks under it while an arranger is followed, then its chords as boxes as wide as their
 * beats, two bars a row on a phone and four on a laptop, a + box after the last that adds a chord
 * and takes one dropped at the end.
 */
export function SheetSection({
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
  lit: BoxPlace | null
  /** The beat of the lit chord's bar sounding now. */
  beat: number | null
  /** The chord selected: Play starts from it. */
  selected: BoxPlace | null
  /** How many variations its style has: none shown but one. */
  variations: number
  acts: TileActs & { add(section: number): void }
  /** Its sheet opened: name, times, variation, loop, duplicate, delete. */
  onOpen(): void
  onChange(change: Partial<Pick<Section, 'repeats' | 'variation'>>): void
  onDelete(): void
  /** What it has a followed arranger play, in a line (empty: nothing set), or null when none is followed. */
  tag: string | null
  /** Its arranger sheet opened. */
  onTag(): void
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  const bars = sectionBars(section, meter)
  const perBar = beatsPerBar(meter)
  const columns = perBar * (useMediaQuery(WIDE) ? 4 : 2)
  const chords = sectionChords(section)
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionDragId(index) })
  const end = useDroppable({ id: endDragId(index) })
  const ids = chords.map((_, at) => chordDragId(index, at))
  const same = (place: BoxPlace | null, at: number) =>
    place !== null && place.section === index && place.index === at
  return (
    <section
      ref={setNodeRef}
      aria-label={name}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('flex min-w-0 flex-col gap-2', isDragging && 'opacity-0')}
    >
      <div className="flex min-h-11 items-center gap-1.5">
        <button
          type="button"
          onClick={onOpen}
          aria-label={t('chordPlayer.sectionOpen', { name, count: section.repeats })}
          title={t('chordPlayer.sectionOpen', { name, count: section.repeats })}
          className={cn(PILL, 'max-w-40 flex-[0_1_10rem] justify-start font-semibold')}
        >
          <span className="truncate">{name}</span>
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({
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
              if (next !== undefined) onChange({ variation: next })
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
          onClick={onDelete}
          aria-label={t('chordPlayer.deleteSection')}
          title={t('chordPlayer.deleteSection')}
          className="grid size-11 shrink-0 place-items-center rounded-control text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted"
        >
          <Trash2 aria-hidden className="size-[18px]" />
        </button>
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={t('chordPlayer.drag', { name })}
          title={t('chordPlayer.drag', { name })}
          className="-mr-3 ml-auto grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-control text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden className="size-[18px]" />
        </button>
      </div>
      {tag !== null ? (
        <button
          type="button"
          onClick={onTag}
          aria-label={t('chordPlayer.arranger.tag', {
            name,
            marks: tag || t('chordPlayer.arranger.unset'),
          })}
          title={t('chordPlayer.arranger.tag', {
            name,
            marks: tag || t('chordPlayer.arranger.unset'),
          })}
          className={cn(
            'relative -mt-1.5 h-[30px] max-w-full self-start truncate rounded-[8px] px-2.5 text-[13px] font-semibold shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-[7px] before:content-[""] hover:bg-muted',
            !tag && 'text-muted-foreground',
          )}
        >
          {tag || t('chordPlayer.arranger.unset')}
        </button>
      ) : null}
      <SortableContext items={ids} strategy={STILL}>
        <ol
          aria-label={t('chordPlayer.chordsOf', { name })}
          className="grid gap-1 lg:gap-1.5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {bars.flatMap((bar, at) =>
            bar.pieces.map((piece, p) => {
              const chord = chords[piece.chord]
              if (!chord) return null
              const now = same(lit, piece.chord)
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
                  selected={same(selected, piece.chord)}
                  wrong={
                    bar.wrong && p === bar.pieces.length - 1 && first
                      ? {
                          label: t('chordPlayer.wrongBar', {
                            bar: at + 1,
                            count: bar.beats,
                            beats: perBar,
                          }),
                          open: { section: index, index: first.chord },
                        }
                      : null
                  }
                  place={{ section: index, index: piece.chord }}
                  acts={acts}
                />
              )
            }),
          )}
          <li
            ref={end.setNodeRef}
            className="flex min-w-11"
            style={{ gridColumn: `span ${Math.min(2, columns)}` }}
          >
            <button
              type="button"
              aria-label={t('chordPlayer.addChord', { name })}
              title={t('chordPlayer.addChord', { name })}
              onClick={() => acts.add(index)}
              className={cn(
                'grid h-[60px] flex-1 place-items-center rounded-[6px] text-muted-foreground shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-200 ease-out hover:bg-muted lg:h-[76px]',
                end.isOver && 'bg-primary/35',
              )}
            >
              <Plus aria-hidden className="size-6" />
            </button>
          </li>
        </ol>
      </SortableContext>
    </section>
  )
}
