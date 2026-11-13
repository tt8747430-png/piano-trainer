import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Dices, Plus, Repeat, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styleBook, styleVariations, usePatternBook } from '@/entities/pattern'
import { libraryParam, progressionMode } from '@/entities/progression-library'
import { selectChordPlayer, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import { cn, useMediaQuery } from '@/shared/lib'
import {
  barCount,
  duplicateSection,
  insertChord,
  moveChord,
  moveSection,
  MOST_SECTIONS,
  relayMeter,
  removeChord,
  removeSection,
  resizeChord,
  sectionBars,
  setChord,
  withSection,
  addSection,
  type ChordSheet,
  type SheetSection as Section,
} from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  keyParam,
  numeralChord,
  numeralOf,
  numeralsParam,
  parseNumerals,
  printedChord,
  randomProgression,
  type Chord,
  type Numeral,
} from '@/shared/lib/music'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  ButtonLink,
  confirm,
  FloatingActions,
  FloatingBar,
  FloatingBarButton,
  FloatingBarPlay,
  NO_KEYS,
  say,
  Stepper,
  OpensMark,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SHEET_TEMPO } from '@/entities/chord-sheet'
import type { BoxPlace } from '../model/engine'
import type { ChordSheetInHand } from '../model/use-chord-sheet'
import { useChordTransport } from '../model/use-chord-transport'
import { dropMove, readDragId, sectionDragId, landsOn } from '../model/sheet-dnd'
import { ChordDialog } from './ChordDialog'
import { ChordFace, type TileActs } from './ChordTile'
import { LibrarySheet } from './LibrarySheet'
import { SheetSection } from './SheetSection'
import { StyleSheet } from './StyleSheet'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
/** How a dropped tile settles into its place: the app's one ease-out (DESIGN.md, Motion). */
const DROP_ANIMATION = { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }

/**
 * What a drop may land on (memory-palaces' `useSortableBlock`): only what the thing in hand may land
 * among (a section among the sections, a chord among its own section's), the one under the pointer
 * first, else the nearest.
 */
const scopedCollision: CollisionDetection = (args) => {
  const active = readDragId(args.active.id)
  const scoped = {
    ...args,
    droppableContainers: args.droppableContainers.filter((container) => {
      const over = readDragId(container.id)
      return active !== null && over !== null && landsOn(active, over)
    }),
  }
  const under = pointerWithin(scoped)
  return under.length > 0 ? under : closestCenter(scoped)
}

/** Where the Chord player's links go: a saved sheet opened, the sheet in hand, a progression put in hand. */
export interface ChordPlayerRoutes {
  /** One of My chord sheets opened (its id), or the sheet in hand (none). */
  openSheet(id: string | undefined): void
  /** A progression from the library put in hand as one Verse: its numerals, in a major or minor key. */
  openLine(numerals: readonly Numeral[], minor: boolean, name: string): void
}

/** Every chord of the sheet as a numeral in its key, or null where one is not (the Player's line). */
function sheetNumerals(sheet: ChordSheet): Numeral[] | null {
  const numerals = sheet.sections.flatMap((section) =>
    section.chords.map(({ chord }) => numeralOf(chord, sheet.key)),
  )
  return numerals.length > 0 && numerals.every((numeral) => numeral !== null)
    ? (numerals as Numeral[])
    : null
}

/**
 * The Chord player (R29 CP1–CP6, R32): the head (the sheet's name opening the Library, its Style,
 * Tempo and key), the sheet's sections of equal chord tiles, Add section and Randomize at its foot,
 * the on-screen piano, and the floating transport (Play on Space, Loop, Practise in the Player). One
 * drag context holds the sections and their chords (memory-palaces' fix): a mouse moves a thing
 * after 8px, a finger after a quarter-second hold, the keys after Space; the thing in hand is drawn
 * in the overlay, lifted, and lands only where it may.
 */
export function ChordPlayer({
  hand,
  sheetId,
  name,
  routes,
}: {
  hand: ChordSheetInHand
  /** One of My chord sheets (`?sheet=`), or none: the sheet in hand. */
  sheetId: string | undefined
  /** Its name: a saved sheet's, or "New chord sheet". */
  name: string
  routes: ChordPlayerRoutes
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const keyName = useKeyName()
  const patterns = usePatternBook()
  const book = useMemo(() => styleBook(patterns), [patterns])
  const prefs = useSettings(selectChordPlayer)
  const { shown, entry } = hand
  const style = book.get(entry.style)
  const variations = styleVariations(style)
  const transport = useChordTransport({
    sheet: shown,
    style,
    tempo: entry.tempo,
    settings: entry.settings,
    block: prefs.voicing === 'block',
  })
  const [dialog, setDialog] = useState<{ place: BoxPlace; typed?: string } | null>(null)
  const [inHand, setInHand] = useState<string | null>(null)
  const reduced = useMediaQuery(REDUCED_MOTION)
  const [library, setLibrary] = useState(false)
  const [styles, setStyles] = useState(false)
  const meter = shown.meter

  const inSection = (section: number, change: (each: Section) => Section) =>
    hand.editShown((sheet) => withSection(sheet, section, change))
  const chordAt = (place: BoxPlace) => shown.sections[place.section]?.chords[place.index]
  const acts: TileActs & { add(section: number): void } = {
    open: (place, typed) => setDialog(typed === undefined ? { place } : { place, typed }),
    remove(place) {
      const gone = chordAt(place)
      if (!gone) return
      inSection(place.section, (section) => removeChord(section, place.index, meter))
      setDialog(null)
      say(t('chordPlayer.deleted', { chord: printedChord(gone.chord) }), {
        label: t('chordPlayer.undo'),
        onClick: hand.undo,
      })
    },
    resize: (place, beats) =>
      inSection(place.section, (section) => resizeChord(section, place.index, beats)),
    add(section) {
      const chords = shown.sections[section]?.chords ?? []
      const last = chords.at(-1)?.chord ?? {
        root: shown.key.tonic,
        quality: shown.key.minor ? 'min' : 'maj',
      }
      inSection(section, (each) => insertChord(each, each.chords.length, last, meter))
      setDialog({ place: { section, index: chords.length } })
    },
  }

  const randomize = () => {
    hand.edit((sheet) => ({
      ...sheet,
      sections: sheet.sections.map((section) => {
        const bars = barCount(section, sheet.meter) || 4
        return {
          ...section,
          chords: randomProgression(sheet.key, bars, Math.random).map((numeral) => ({
            chord: numeralChord(numeral, sheet.key, 'triads'),
            beats: beatsPerBar(sheet.meter),
          })),
        }
      }),
    }))
    say(t('chordPlayer.randomized', { key: keyName(shown.key) }), {
      label: t('chordPlayer.undo'),
      onClick: hand.undo,
    })
  }

  const loopSection = transport.lit?.section ?? dialog?.place.section ?? 0
  const loopName = t(`chordPlayer.sections.${shown.sections[loopSection]?.kind ?? 'verse'}`)
  const numerals = sheetNumerals(shown)
  const hasChords = shown.sections.some((section) => section.chords.length > 0)
  const toggle = () => (transport.playing ? transport.stop() : transport.play())

  useShortcuts(t('chordPlayer.shortcuts.group'), [
    { label: t('chordPlayer.shortcuts.playStop'), combo: { key: ' ' }, run: toggle },
    { label: t('chordPlayer.shortcuts.undo'), combo: { code: 'KeyZ', mod: true }, run: hand.undo },
    {
      label: t('chordPlayer.shortcuts.redo'),
      combo: { code: 'KeyZ', mod: true, shift: true },
      run: hand.redo,
    },
  ])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space', 'Enter'] },
    }),
  )
  const sectionIds = shown.sections.map((_, i) => sectionDragId(i))
  const onDrop = ({ active, over }: DragEndEvent) => {
    setInHand(null)
    const move = dropMove(active.id, over?.id)
    if (move?.kind === 'section') hand.edit((sheet) => moveSection(sheet, move.from, move.to))
    else if (move?.kind === 'chord')
      inSection(move.section, (each) => moveChord(each, move.from, move.to))
  }
  const held = readDragId(inHand)
  const heldChord =
    held?.kind === 'chord' ? shown.sections[held.section]?.chords[held.index] : undefined
  const heldSection = held?.kind === 'section' ? shown.sections[held.section] : undefined
  const askDelete = async (index: number) => {
    const section = shown.sections[index]
    if (!section) return
    const named = t(`chordPlayer.sections.${section.kind}`)
    const yes =
      section.chords.length === 0 ||
      (await confirm({
        title: t('chordPlayer.deleteSection.title', { name: named }),
        body: t('chordPlayer.deleteSection.body'),
        action: t('chordPlayer.deleteSection.action'),
        destructive: true,
      }))
    if (yes) hand.edit((sheet) => removeSection(sheet, index))
  }
  const dialogChord = dialog ? chordAt(dialog.place) : undefined
  const dialogNext = dialog
    ? (shown.sections[dialog.place.section]?.chords[dialog.place.index + 1]?.chord ?? null)
    : null

  return (
    <div className="flex flex-col gap-5 pb-28">
      {/* The head: one row on a laptop, two on a phone. */}
      <div className="flex flex-col gap-3 rounded-card bg-card p-3 elevation-1 md:flex-row md:flex-wrap md:items-center md:gap-4">
        <HeadButton
          label={t('chordPlayer.libraryOf', { name })}
          onClick={() => setLibrary(true)}
          className="font-display text-2xl"
        >
          {name}
        </HeadButton>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <HeadButton
            label={t('chordPlayer.styleOf', { style: localText(style.name, locale) })}
            onClick={() => setStyles(true)}
            icon={<SlidersHorizontal aria-hidden className="size-4" />}
          >
            {localText(style.name, locale)}
          </HeadButton>
          <div className="flex items-center gap-2 [&_input]:w-16 [&_input]:px-2 [&_input]:text-center">
            <span className="text-sm text-muted-foreground">{t('chordPlayer.tempo')}</span>
            <Stepper
              label={t('chordPlayer.tempo')}
              value={entry.tempo}
              min={SHEET_TEMPO.min}
              max={SHEET_TEMPO.max}
              typed
              format={(count) => t('chordPlayer.bpm', { count })}
              decrease={t('chordPlayer.slower')}
              increase={t('chordPlayer.faster')}
              onChange={(tempo) => hand.setEntry({ tempo })}
            />
          </div>
          <Link
            to="/practice/chord-player/settings"
            search={sheetId === undefined ? {} : { sheet: sheetId }}
            aria-label={t('chordPlayer.keyLink', { key: keyName(shown.key) })}
            className="flex min-h-11 items-center gap-1 rounded-control px-2 font-semibold hover:bg-muted"
          >
            {t('chordPlayer.key', { key: keyName(shown.key) })}
            <OpensMark className="size-4 text-current" />
          </Link>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={scopedCollision}
        onDragStart={({ active }) => setInHand(String(active.id))}
        onDragEnd={onDrop}
        onDragCancel={() => setInHand(null)}
      >
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {shown.sections.map((section, index) => (
              <SheetSection
                key={sectionIds[index]}
                section={section}
                index={index}
                musicKey={shown.key}
                meter={meter}
                names={prefs.names}
                variations={variations}
                lit={transport.lit}
                acts={acts}
                onChange={(change) => inSection(index, (each) => ({ ...each, ...change }))}
                onDuplicate={() => hand.edit((sheet) => duplicateSection(sheet, index))}
                onDelete={() => void askDelete(index)}
                canDuplicate={shown.sections.length < MOST_SECTIONS}
              />
            ))}
          </div>
        </SortableContext>
        {/* The thing in hand, drawn as itself and lifted (memory-palaces' cause 3). */}
        <DragOverlay dropAnimation={reduced ? null : DROP_ANIMATION}>
          {heldChord ? (
            <ChordFace
              chord={heldChord.chord}
              beats={heldChord.beats}
              musicKey={shown.key}
              names={prefs.names}
              lifted
            />
          ) : heldSection ? (
            <div className="flex min-h-14 items-center gap-3 card px-4 elevation-3">
              <span className="font-semibold">{t(`chordPlayer.sections.${heldSection.kind}`)}</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {t('chordPlayer.bars', { count: sectionBars(heldSection, meter).length })}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="flex flex-wrap gap-2">
        {shown.sections.length < MOST_SECTIONS ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => hand.edit((sheet) => addSection(sheet))}
          >
            <Plus aria-hidden />
            {t('chordPlayer.addSection')}
          </Button>
        ) : null}
        <Button variant="outline" size="lg" onClick={randomize}>
          <Dices aria-hidden />
          {t('chordPlayer.randomize')}
        </Button>
        {numerals ? (
          <ButtonLink
            variant="outline"
            size="lg"
            render={
              <Link
                to="/practice/progressions/line"
                search={{ p: numeralsParam(numerals), key: keyParam(shown.key) }}
              />
            }
          >
            {t('chordPlayer.inProgressions')}
          </ButtonLink>
        ) : null}
      </div>

      <PinnedKeyboard shown={NO_KEYS} />

      <FloatingActions>
        <FloatingBar label={t('chordPlayer.transport')}>
          <FloatingBarPlay
            label={transport.playing ? t('chordPlayer.stop') : t('chordPlayer.play')}
            playing={transport.playing}
            named
            disabled={!hasChords}
            onClick={toggle}
          />
          <FloatingBarButton
            label={
              transport.looped === null
                ? t('chordPlayer.loop', { section: loopName })
                : t('chordPlayer.loopOff', {
                    section: t(
                      `chordPlayer.sections.${shown.sections[transport.looped]?.kind ?? 'verse'}`,
                    ),
                  })
            }
            aria-pressed={transport.looped !== null}
            className={cn(transport.looped !== null && 'bg-muted text-link')}
            onClick={() => transport.setLoop(transport.looped === null ? loopSection : null)}
          >
            <Repeat aria-hidden />
          </FloatingBarButton>
          {numerals ? (
            <FloatingBarButton
              label={t('chordPlayer.inPlayer')}
              render={
                <Link
                  to="/play/progression"
                  search={{ p: numeralsParam(numerals), key: keyParam(shown.key) }}
                />
              }
            >
              <ChevronDown aria-hidden className="-rotate-90" />
            </FloatingBarButton>
          ) : null}
        </FloatingBar>
      </FloatingActions>

      {dialog && dialogChord ? (
        <ChordDialog
          open
          onOpenChange={(open) => (open ? null : setDialog(null))}
          chord={dialogChord.chord}
          beats={dialogChord.beats}
          next={dialogNext}
          musicKey={shown.key}
          typed={dialog.typed}
          onChord={(chord) =>
            inSection(dialog.place.section, (each) => setChord(each, dialog.place.index, chord))
          }
          onBeats={(beats) => acts.resize(dialog.place, beats)}
          onInsert={(chords: readonly Chord[]) => {
            inSection(dialog.place.section, (each) =>
              chords.reduce(
                (section, chord, i) =>
                  insertChord(section, dialog.place.index + 1 + i, chord, meter),
                each,
              ),
            )
            setDialog(null)
          }}
          onRemove={() => acts.remove(dialog.place)}
        />
      ) : null}
      <LibrarySheet
        open={library}
        onOpenChange={setLibrary}
        current={sheetId}
        minor={shown.key.minor}
        onOpenSaved={(sheet) => {
          setLibrary(false)
          routes.openSheet(sheet.id)
        }}
        onOpenProgression={(progression) => {
          setLibrary(false)
          const minor = progressionMode(progression, shown.key.minor)
          routes.openLine(
            parseNumerals(libraryParam(progression, minor)) ?? [],
            minor,
            localText(progression.name, locale),
          )
        }}
      />
      <StyleSheet
        open={styles}
        onOpenChange={setStyles}
        book={book}
        value={style.id}
        onChoose={(chosen) => {
          setStyles(false)
          hand.setEntry({ style: chosen.id, tempo: chosen.tempo })
          if (chosen.meter !== hand.sheet.meter) {
            hand.edit((sheet) => relayMeter(sheet, chosen.meter))
            say(t('chordPlayer.laidOut', { meter: chosen.meter }), {
              label: t('chordPlayer.undo'),
              onClick: hand.undo,
            })
          }
        }}
      />
    </div>
  )
}

/** A head's value that opens its sheet: the value, a chevron. */
function HeadButton({
  label,
  onClick,
  icon,
  className,
  children,
}: {
  label: string
  onClick(): void
  icon?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex min-h-11 min-w-0 items-center gap-2 rounded-control px-2 text-left font-semibold text-pretty hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring',
        className,
      )}
    >
      {icon}
      <span className="min-w-0">{children}</span>
      <ChevronDown aria-hidden className="size-4 shrink-0" />
    </button>
  )
}
