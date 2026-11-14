import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn } from '@/shared/lib'
import {
  sectionBars,
  sectionChords,
  type SheetMeter,
  type SheetSection as Section,
} from '@/shared/lib/arrangement'
import { beatsPerBar, type Key } from '@/shared/lib/music'
import type { BoxPlace } from '../model/engine'
import { chordDragId, endDragId, sectionDragId } from '../model/sheet-dnd'
import { ChordTile, type TileActs } from './ChordTile'

/** Holds every chord's drop in place: chords of different lengths never slide under the finger. */
const STILL = () => null

/** A section's letter on its head, as a lead sheet marks it: A, B, C. */
export const sectionLetter = (index: number) => String.fromCharCode(65 + (index % 26))

/**
 * A section of the chord sheet (canvas 171), as a lead sheet writes it: its head (a grip, its
 * letter boxed, its name and × times, opening its sheet), then its bars four to a row between bar
 * lines (the last closing its row), each bar's chords as wide as their beats over a tick per beat, the beat sounding in ink
 * while it plays. A bar whose beats are not the meter's is kept as written and marked !, opening
 * its first chord. A + after the last bar adds a chord, and takes a chord dropped at the end.
 */
export function SheetSection({
  section,
  index,
  musicKey,
  meter,
  names,
  lit,
  beat,
  chosen,
  acts,
  onOpen,
}: {
  section: Section
  index: number
  musicKey: Key
  meter: SheetMeter
  names: ProgressionNames
  lit: BoxPlace | null
  /** The beat of the lit chord's bar sounding now. */
  beat: number | null
  /** The chord whose sheet is open: its bar shaded. */
  chosen: BoxPlace | null
  acts: TileActs & { add(section: number): void }
  /** Its sheet opened: name, times, variation, duplicate, delete. */
  onOpen(): void
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  const bars = sectionBars(section, meter)
  const perBar = beatsPerBar(meter)
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
  const holds = (place: BoxPlace | null, bar: (typeof bars)[number]) =>
    place !== null &&
    place.section === index &&
    bar.pieces.some((piece) => piece.chord === place.index)
  return (
    <section
      ref={setNodeRef}
      aria-label={name}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('flex min-w-0 flex-col gap-1', isDragging && 'opacity-0')}
    >
      <div className="flex min-h-11 items-center gap-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={t('chordPlayer.drag', { name })}
          title={t('chordPlayer.drag', { name })}
          className="-ml-3.5 grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-control text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={onOpen}
          aria-label={t('chordPlayer.sectionOpen', { name, count: section.repeats })}
          title={t('chordPlayer.sectionOpen', { name, count: section.repeats })}
          className="-ml-2 flex min-h-11 min-w-0 items-center gap-2 rounded-control px-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
        >
          <span
            aria-hidden
            className="grid size-[22px] shrink-0 place-items-center border-[1.5px] border-foreground text-[13px] font-bold"
          >
            {sectionLetter(index)}
          </span>
          <span className="truncate text-[15px] font-semibold">{name}</span>
          <span className="text-[13px] text-muted-foreground tabular-nums">
            {t('chordPlayer.times', { count: section.repeats })}
          </span>
        </button>
      </div>
      <SortableContext items={ids} strategy={STILL}>
        <ol aria-label={t('chordPlayer.chordsOf', { name })} className="grid grid-cols-4">
          {bars.map((bar, at) => {
            const now = holds(lit, bar)
            return (
              <li
                key={`bar-${at}`}
                aria-label={t('chordPlayer.bar', { count: at + 1 })}
                className={cn(
                  'relative flex h-[54px] min-w-0 flex-col border-r border-foreground md:h-[68px]',
                  (at % 4 === 3 || at === bars.length - 1) && 'border-r-2',
                  at % 4 === 0 && 'border-l-2',
                  now
                    ? 'bg-primary text-primary-foreground'
                    : holds(chosen, bar) && 'bg-primary/35',
                )}
              >
                <div className="flex min-h-0 flex-1 items-stretch">
                  {bar.pieces.map((piece) => {
                    const chord = chords[piece.chord]
                    if (!chord) return null
                    return (
                      <ChordTile
                        key={ids[piece.chord]}
                        id={ids[piece.chord] ?? ''}
                        chord={chord.chord}
                        beats={chord.beats}
                        musicKey={musicKey}
                        names={names}
                        lit={lit?.section === index && lit.index === piece.chord}
                        place={{ section: index, index: piece.chord }}
                        acts={acts}
                      />
                    )
                  })}
                </div>
                <div aria-hidden className="flex h-[9px] flex-none items-center gap-[3px] px-1.5">
                  {Array.from({ length: Math.max(bar.beats, 1) }, (_, tick) => (
                    <span
                      key={tick}
                      className={cn(
                        'h-[3px] flex-1 rounded-[2px]',
                        now && tick === beat ? 'bg-foreground' : 'bg-muted-foreground/45',
                      )}
                    />
                  ))}
                </div>
                {bar.wrong ? (
                  <button
                    type="button"
                    aria-label={t('chordPlayer.wrongBar', {
                      bar: at + 1,
                      count: bar.beats,
                      beats: perBar,
                    })}
                    title={t('chordPlayer.wrongBar', {
                      bar: at + 1,
                      count: bar.beats,
                      beats: perBar,
                    })}
                    onClick={() => {
                      const first = bar.pieces[0]
                      if (first) acts.open({ section: index, index: first.chord })
                    }}
                    className="absolute -top-[18px] -right-[22px] z-10 grid size-11 place-items-center"
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
          })}
          <li ref={end.setNodeRef} className="flex">
            <button
              type="button"
              aria-label={t('chordPlayer.addChord', { name })}
              title={t('chordPlayer.addChord', { name })}
              onClick={() => acts.add(index)}
              className={cn(
                'grid h-[54px] flex-1 place-items-center text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted md:h-[68px]',
                end.isOver && 'bg-primary/35',
              )}
            >
              <Plus aria-hidden className="size-5" />
            </button>
          </li>
        </ol>
      </SortableContext>
    </section>
  )
}
