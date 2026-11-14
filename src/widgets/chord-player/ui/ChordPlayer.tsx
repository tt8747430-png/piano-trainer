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
import { useNavigate } from '@tanstack/react-router'
import { Dices, ListMusic, Piano, Plus, Redo2, Route, Undo2 } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styleBook, styleVariations, usePatternBook } from '@/entities/pattern'
import { libraryParam, progressionMode } from '@/entities/progression-library'
import { selectChordPlayer, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import { useMediaQuery } from '@/shared/lib'
import {
  barCount,
  duplicateSection,
  duplicateChord,
  insertChord,
  moveChordAcross,
  moveSection,
  MOST_SECTIONS,
  relayMeter,
  removeChord,
  removeSection,
  resizeChord,
  sectionBars,
  sectionChords,
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
  printedNote,
  randomProgression,
  type Numeral,
} from '@/shared/lib/music'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  BackButton,
  FloatingActions,
  FloatingBar,
  FloatingBarPlay,
  FloatingBarValue,
  MoreMenu,
  NO_KEYS,
  RoundButton,
  say,
  ScreenHeader,
  Sheet,
  SheetContent,
  Stepper,
  type MenuAction,
} from '@/shared/ui'
import { SHEET_PLAYS, SHEET_TEMPO, TRANSPOSE_RANGE } from '@/entities/chord-sheet'
import type { BoxPlace } from '../model/engine'
import type { ChordSheetInHand } from '../model/use-chord-sheet'
import { useChordTransport } from '../model/use-chord-transport'
import { dropMove, readDragId, sectionDragId, landsOn } from '../model/sheet-dnd'
import { ChordDialog } from './ChordDialog'
import { ChordFace, type TileActs } from './ChordTile'
import { LibrarySheet } from './LibrarySheet'
import { SectionSheet } from './SectionSheet'
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
    sectionChords(section).map(({ chord }) => numeralOf(chord, sheet.key)),
  )
  return numerals.length > 0 && numerals.every((numeral) => numeral !== null)
    ? (numerals as Numeral[])
    : null
}

/** The dock's sheets, one open at a time. */
type DockSheet = 'key' | 'tempo' | 'plays'

/**
 * The Chord player (canvas 171): its bar (Undo, the gear, ⋯ with the sheet's files and acts), the
 * chart on its paper, the on-screen piano, and the dock (Style · Key · Tempo · Repeats, each opening
 * its sheet, and Play on Space). One
 * drag context holds the sections and their chords (memory-palaces' fix): a mouse moves a thing
 * after 8px, a finger after a quarter-second hold, the keys after Space; the thing in hand is drawn
 * in the overlay, lifted, and lands only where it may.
 */
export function ChordPlayer({
  hand,
  sheetId,
  name,
  routes,
  more,
  settings,
}: {
  hand: ChordSheetInHand
  /** One of My chord sheets (`?sheet=`), or none: the sheet in hand. */
  sheetId: string | undefined
  /** Its name: a saved sheet's, or "New chord sheet". */
  name: string
  routes: ChordPlayerRoutes
  /** The page's own acts on the sheet's file (New, Save as my chord sheet…, Share link), in ⋯. */
  more: readonly MenuAction[]
  /** The gear: the Chord player's Settings. */
  settings: ReactNode
}) {
  const navigate = useNavigate()
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
  const [dock, setDock] = useState<DockSheet | null>(null)
  /** The section whose sheet is open. */
  const [opened, setOpened] = useState<number | null>(null)
  const meter = shown.meter

  const inSection = (section: number, change: (each: Section) => Section) =>
    hand.editShown((sheet) => withSection(sheet, section, change))
  const chordAt = (place: BoxPlace) => {
    const section = shown.sections[place.section]
    return section ? sectionChords(section)[place.index] : undefined
  }
  const acts: TileActs & { add(section: number): void } = {
    open: (place, typed) => setDialog(typed === undefined ? { place } : { place, typed }),
    remove(place) {
      const gone = chordAt(place)
      if (!gone) return
      inSection(place.section, (section) => removeChord(section, place.index))
      setDialog(null)
      say(t('chordPlayer.deleted', { chord: printedChord(gone.chord) }), {
        label: t('chordPlayer.undo'),
        onClick: hand.undo,
      })
    },
    resize: (place, beats) =>
      inSection(place.section, (section) => resizeChord(section, place.index, beats)),
    add(section) {
      const held = shown.sections[section]
      const chords = held ? sectionChords(held) : []
      const last = chords.at(-1)?.chord ?? {
        root: shown.key.tonic,
        quality: shown.key.minor ? 'min' : 'maj',
      }
      inSection(section, (each) => insertChord(each, sectionChords(each).length, last, meter))
      setDialog({ place: { section, index: chords.length } })
    },
  }

  const randomize = () => {
    hand.edit((sheet) => ({
      ...sheet,
      sections: sheet.sections.map((section) => {
        const bars = barCount(section) || 4
        return {
          ...section,
          bars: randomProgression(sheet.key, bars, Math.random).map((numeral) => ({
            chords: [
              {
                chord: numeralChord(numeral, sheet.key, 'triads'),
                beats: beatsPerBar(sheet.meter),
              },
            ],
          })),
        }
      }),
    }))
    say(t('chordPlayer.randomized', { key: keyName(shown.key) }), {
      label: t('chordPlayer.undo'),
      onClick: hand.undo,
    })
  }

  const numerals = sheetNumerals(shown)
  const hasChords = shown.sections.some((section) => section.bars.length > 0)
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
      hand.editShown((sheet) => moveChordAcross(sheet, move.from, move.to))
  }
  const held = readDragId(inHand)
  const heldChord =
    held?.kind === 'chord' ? chordAt({ section: held.section, index: held.index }) : undefined
  const heldSection = held?.kind === 'section' ? shown.sections[held.section] : undefined
  /** A section deleted at once, Undo in its toast (a loss that can be undone, CLAUDE.md). */
  const deleteSection = (index: number) => {
    const section = shown.sections[index]
    if (!section) return
    setOpened(null)
    hand.edit((sheet) => removeSection(sheet, index))
    say(t('chordPlayer.sectionDeleted', { name: t(`chordPlayer.sections.${section.kind}`) }), {
      label: t('chordPlayer.undo'),
      onClick: hand.undo,
    })
  }
  const openedSection = opened === null ? undefined : shown.sections[opened]
  const dialogChord = dialog ? chordAt(dialog.place) : undefined
  /** The bar the chord in the sheet stands in, from 1. */
  const dialogBar = (() => {
    const section = dialog ? shown.sections[dialog.place.section] : undefined
    if (!dialog || !section) return 1
    const at = sectionBars(section, meter).findIndex((bar) =>
      bar.pieces.some((piece) => piece.chord === dialog.place.index),
    )
    return at + 1
  })()

  const plays = entry.settings.plays
  const transpose = entry.settings.transpose
  const shortKey = `${printedNote(shown.key.tonic)}${shown.key.minor ? 'm' : ''}`
  return (
    <div className="flex flex-col gap-4 pb-28">
      <ScreenHeader
        title={t('pages.chordPlayer')}
        back={<BackButton />}
        tools={
          <RoundButton
            label={t('chordPlayer.undo')}
            icon={Undo2}
            disabled={!hand.canUndo}
            onClick={hand.undo}
          />
        }
        settings={settings}
        more={
          <MoreMenu
            label={t('chordPlayer.more')}
            actions={[
              {
                key: 'redo',
                label: t('chordPlayer.redo'),
                icon: Redo2,
                hidden: !hand.canRedo,
                onSelect: hand.redo,
              },
              ...more,
              {
                key: 'library',
                label: t('chordPlayer.library'),
                icon: ListMusic,
                onSelect: () => setLibrary(true),
              },
              {
                key: 'randomize',
                label: t('chordPlayer.randomize'),
                icon: Dices,
                group: t('chordPlayer.chords'),
                onSelect: randomize,
              },
              {
                key: 'progressions',
                label: t('chordPlayer.inProgressions'),
                icon: Route,
                hidden: numerals === null,
                onSelect: () =>
                  void navigate({
                    to: '/practice/progressions/line',
                    search: { p: numeralsParam(numerals ?? []), key: keyParam(shown.key) },
                  }),
              },
              {
                key: 'player',
                label: t('chordPlayer.inPlayer'),
                icon: Piano,
                hidden: numerals === null,
                onSelect: () =>
                  void navigate({
                    to: '/play/progression',
                    search: { p: numeralsParam(numerals ?? []), key: keyParam(shown.key) },
                  }),
              },
            ]}
          />
        }
      />

      <DndContext
        sensors={sensors}
        collisionDetection={scopedCollision}
        onDragStart={({ active }) => setInHand(String(active.id))}
        onDragEnd={onDrop}
        onDragCancel={() => setInHand(null)}
      >
        {/* The chart, a lead sheet on its paper (canvas 171): its name, its sections, Add section. */}
        <div className="flex flex-col gap-4 rounded-[6px] bg-card px-3.5 pt-4 pb-[18px] shadow-[0_0_0_1px_var(--color-border),0_10px_24px_-18px_rgb(51_41_33/0.45)]">
          <h2 className="text-center font-display text-xl font-normal text-balance">{name}</h2>
          <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
            {shown.sections.map((section, index) => (
              <SheetSection
                key={sectionIds[index]}
                section={section}
                index={index}
                musicKey={shown.key}
                meter={meter}
                names={prefs.names}
                lit={transport.lit}
                beat={transport.beat}
                chosen={dialog?.place ?? null}
                acts={acts}
                onOpen={() => setOpened(index)}
              />
            ))}
          </SortableContext>
          {shown.sections.length < MOST_SECTIONS ? (
            <button
              type="button"
              onClick={() => hand.edit((sheet) => addSection(sheet))}
              className="-my-1 -ml-2 flex h-11 items-center gap-1 self-start rounded-control px-2 text-[15px] font-semibold text-link transition-colors duration-200 ease-out hover:bg-muted"
            >
              <Plus aria-hidden className="size-4" />
              {t('chordPlayer.addSection')}
            </button>
          ) : null}
        </div>
        {/* The thing in hand, drawn as itself and lifted (memory-palaces' cause 3). */}
        <DragOverlay dropAnimation={reduced ? null : DROP_ANIMATION}>
          {heldChord ? (
            <ChordFace chord={heldChord.chord} musicKey={shown.key} names={prefs.names} />
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

      <PinnedKeyboard shown={NO_KEYS} />

      <FloatingActions>
        <FloatingBar label={t('chordPlayer.transport')} className="md:w-[35rem]">
          <FloatingBarValue
            label={t('chordPlayer.style')}
            value={localText(style.name, locale)}
            onClick={() => setStyles(true)}
          />
          <FloatingBarValue
            label={t('chordPlayer.dock.key')}
            value={shortKey}
            spoken={keyName(shown.key)}
            onClick={() => setDock('key')}
          />
          <FloatingBarValue
            label={t('chordPlayer.tempo')}
            value={String(entry.tempo)}
            spoken={t('chordPlayer.bpm', { count: entry.tempo })}
            onClick={() => setDock('tempo')}
          />
          <FloatingBarValue
            label={t('chordPlayer.dock.plays')}
            value={plays === 0 ? '∞' : t('chordPlayer.times', { count: plays })}
            spoken={
              plays === 0
                ? t('chordPlayer.dock.untilStop')
                : t('chordPlayer.times', { count: plays })
            }
            onClick={() => setDock('plays')}
          />
          <FloatingBarPlay
            label={transport.playing ? t('chordPlayer.stop') : t('chordPlayer.play')}
            playing={transport.playing}
            disabled={!hasChords}
            onClick={toggle}
          />
        </FloatingBar>
      </FloatingActions>

      <Sheet open={dock !== null} onOpenChange={(open) => (open ? null : setDock(null))}>
        {dock === 'key' ? (
          <SheetContent title={t('chordPlayer.dock.key')}>
            <div className="flex flex-col items-center gap-3 py-2">
              <Stepper
                label={t('chordPlayer.settings.transpose')}
                value={transpose}
                min={TRANSPOSE_RANGE.min}
                max={TRANSPOSE_RANGE.max}
                format={(count) => (count > 0 ? `+${count}` : count < 0 ? `−${-count}` : '0')}
                decrease={t('chordPlayer.settings.down')}
                increase={t('chordPlayer.settings.up')}
                onChange={(next) => hand.setSettings({ transpose: next })}
              />
              <p className="text-muted-foreground" aria-live="polite">
                {t('chordPlayer.settings.transposeTo', {
                  from: keyName(hand.sheet.key),
                  to: keyName(shown.key),
                })}
              </p>
            </div>
          </SheetContent>
        ) : dock === 'tempo' ? (
          <SheetContent title={t('chordPlayer.tempo')}>
            <div className="flex justify-center py-2 [&_input]:w-20 [&_input]:text-center">
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
          </SheetContent>
        ) : dock === 'plays' ? (
          <SheetContent title={t('chordPlayer.dock.plays')}>
            <div className="flex justify-center py-2">
              <Stepper
                label={t('chordPlayer.dock.plays')}
                value={plays}
                min={0}
                max={SHEET_PLAYS}
                format={(count) =>
                  count === 0 ? t('chordPlayer.dock.untilStop') : t('chordPlayer.times', { count })
                }
                decrease={t('chordPlayer.fewer')}
                increase={t('chordPlayer.moreTimes')}
                onChange={(next) => hand.setSettings({ plays: next })}
              />
            </div>
          </SheetContent>
        ) : null}
      </Sheet>

      {dialog && dialogChord ? (
        <ChordDialog
          open
          onOpenChange={(open) => (open ? null : setDialog(null))}
          bar={dialogBar}
          chord={dialogChord.chord}
          beats={dialogChord.beats}
          musicKey={shown.key}
          typed={dialog.typed}
          onChord={(chord) =>
            inSection(dialog.place.section, (each) => setChord(each, dialog.place.index, chord))
          }
          onBeats={(beats) => acts.resize(dialog.place, beats)}
          onPlayFrom={() => {
            setDialog(null)
            transport.play(transport.looped, dialog.place)
          }}
          onDuplicate={() => {
            inSection(dialog.place.section, (each) => duplicateChord(each, dialog.place.index))
            setDialog(null)
          }}
          onRemove={() => acts.remove(dialog.place)}
        />
      ) : null}
      {opened !== null && openedSection ? (
        <SectionSheet
          open
          onOpenChange={(open) => (open ? null : setOpened(null))}
          section={openedSection}
          variations={variations}
          canDuplicate={shown.sections.length < MOST_SECTIONS}
          onChange={(change) => inSection(opened, (each) => ({ ...each, ...change }))}
          onDuplicate={() => {
            hand.edit((sheet) => duplicateSection(sheet, opened))
            setOpened(null)
          }}
          onDelete={() => deleteSection(opened)}
          looped={transport.looped === opened}
          onLoop={(on) => transport.setLoop(on ? opened : null)}
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
