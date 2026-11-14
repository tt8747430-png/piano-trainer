import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, Ellipsis, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ProgressionNames } from '@/entities/settings'
import { cn } from '@/shared/lib'
import {
  SECTION_KINDS,
  SECTION_REPEATS,
  sectionBars,
  sectionChords,
  type SheetMeter,
  type SheetSection as Section,
  type Variation,
} from '@/shared/lib/arrangement'
import type { Key } from '@/shared/lib/music'
import { ActionMenu, MenuPicker, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { BoxPlace } from '../model/engine'
import { chordDragId, sectionDragId } from '../model/sheet-dnd'
import { ChordTile, type TileActs } from './ChordTile'

/** Every repeat a section takes, as its pop-up lists them. */
const REPEATS = Array.from(
  { length: SECTION_REPEATS.max - SECTION_REPEATS.min + 1 },
  (_, at) => SECTION_REPEATS.min + at,
)

/**
 * A section of the chord sheet (R29 CP2, R32) as a card: its head (its handle, its name, Repeat,
 * Variation where the style has more than one, ⋯), then its chords as equal tiles in a row that
 * wraps, Apple's way: a tap opens a chord's sheet, a held finger or a mouse dragged moves it among
 * its section's tiles, + adds one. The sheet's one drag context (`ChordPlayer`) holds both the
 * sections and the chords, so a section's handle and a chord never answer the same pointer.
 */
export function SheetSection({
  section,
  index,
  musicKey,
  meter,
  names,
  variations,
  lit,
  acts,
  onChange,
  onDuplicate,
  onDelete,
  canDuplicate,
}: {
  section: Section
  index: number
  musicKey: Key
  meter: SheetMeter
  names: ProgressionNames
  /** The style's variations: none drawn but one. */
  variations: readonly Variation[]
  lit: BoxPlace | null
  acts: TileActs & { add(section: number): void }
  onChange(change: Partial<Section>): void
  onDuplicate(): void
  onDelete(): void
  canDuplicate: boolean
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  const bars = sectionBars(section, meter).length
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionDragId(index) })
  const ids = sectionChords(section).map((_, at) => chordDragId(index, at))
  return (
    <section
      ref={setNodeRef}
      aria-label={name}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: transition,
      }}
      className={cn('flex min-w-0 flex-col gap-3 card p-3', isDragging && 'opacity-0')}
    >
      <div className="flex items-center gap-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={t('chordPlayer.drag', { name })}
          title={t('chordPlayer.drag', { name })}
          className="grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-control text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden className="size-5" />
        </button>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <MenuPicker
            label={t('chordPlayer.section')}
            bare
            value={section.kind}
            options={SECTION_KINDS.map((kind) => ({
              value: kind,
              label: t(`chordPlayer.sections.${kind}`),
            }))}
            onChange={(kind) => onChange({ kind })}
          />
          <MenuPicker
            label={t('chordPlayer.repeat')}
            value={section.repeats}
            options={REPEATS.map((count) => ({
              value: count,
              label: t('chordPlayer.times', { count }),
            }))}
            onChange={(repeats) => onChange({ repeats })}
          />
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
          <span className="text-sm text-muted-foreground tabular-nums">
            {t('chordPlayer.bars', { count: bars })}
          </span>
        </div>
        <ActionMenu
          label={t('chordPlayer.sectionMenu', { name })}
          align="end"
          trigger={<Ellipsis aria-hidden />}
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-11 shrink-0"
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
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <ol
          aria-label={t('chordPlayer.chordsOf', { name })}
          className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2"
        >
          {sectionChords(section).map((chord, at) => {
            const place = { section: index, index: at }
            return (
              <li key={ids[at]} className="flex">
                <ChordTile
                  id={ids[at] ?? ''}
                  chord={chord.chord}
                  beats={chord.beats}
                  musicKey={musicKey}
                  names={names}
                  lit={lit !== null && lit.section === index && lit.index === at}
                  place={place}
                  acts={acts}
                />
              </li>
            )
          })}
          <li className="flex">
            <button
              type="button"
              aria-label={t('chordPlayer.addChord', { name })}
              title={t('chordPlayer.addChord', { name })}
              onClick={() => acts.add(index)}
              className="grid min-h-21 flex-1 place-items-center rounded-control border border-dashed border-input text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted"
            >
              <Plus aria-hidden className="size-5" />
            </button>
          </li>
        </ol>
      </SortableContext>
    </section>
  )
}
