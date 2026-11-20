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
import { Plus, Undo2 } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectSaved, useChordSheets, useChordSheetsStoreApi } from '@/entities/chord-sheet'
import { styleBook, styleVariations, usePatternBook, type Style } from '@/entities/pattern'
import { OWN_PROGRESSION_NAME_MAX, usePracticeLibraryStoreApi } from '@/entities/practice-library'
import { discardDraft, restoreDraft, saveDraft } from '@/features/manage-chord-sheets'
import { saveProgression } from '@/features/manage-practice-library'
import { saveOnline } from '@/features/share-chord-sheet'
import { useChordShare } from '@/shared/lib/chord-share'
import { libraryParam, progressionMode } from '@/entities/progression-library'
import { selectChordPlayer, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import { cn, LAPTOP, useMediaQuery, useRootSize, WIDE } from '@/shared/lib'
import {
  barCount,
  duplicateSection,
  duplicateChord,
  insertChord,
  moveChordAcross,
  moveSection,
  MOST_SECTIONS,
  NO_MARKS,
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
  FloatingBar,
  FloatingBarPlay,
  FloatingBarValue,
  MoreMenu,
  RoundButton,
  say,
  ScreenHeader,
  Sheet,
  SheetContent,
  Stepper,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SHEET_PLAYS, SHEET_TEMPO, TRANSPOSE_RANGE } from '@/entities/chord-sheet'
import type { BoxPlace } from '../model/engine'
import type { ChordSheetInHand } from '../model/use-chord-sheet'
import { keyChords } from '../model/key-chords'
import { CHORD_PLAYER_KEYS, CHORD_PLAYER_LAPTOP_KEYS, litKeys } from '../model/lit-keys'
import { useArrangerFollow } from '../model/use-arranger-follow'
import { useChordLayout, useResetChordLayout, type ChordPanel } from '../model/use-chord-layout'
import { LayoutEditContext, useLayoutEdit } from '../model/use-layout-edit'
import { useOnlineSheet } from '../model/use-online-sheet'
import { useChordTransport } from '../model/use-chord-transport'
import { dropMove, readDragId, sectionDragId, landsOn } from '../model/sheet-dnd'
import { ArrangerSheet, marksLine } from './ArrangerSheet'
import { ArrangerStrip, type GenosSize } from './ArrangerStrip'
import { ChordDialog } from './ChordDialog'
import { ChordFace, type TileActs } from './ChordTile'
import { KeysGrab, KEYS_PX } from './KeysGrab'
import { HiddenTray, LayoutZones } from './LayoutZones'
import { LibrarySheet } from './LibrarySheet'
import { PanelTag } from './PanelTag'
import { SectionSheet } from './SectionSheet'
import { SheetSection } from './SheetSection'
import { SheetsMenu } from './SheetsMenu'
import { KeyChords } from './KeyChords'
import { StyleSheet } from './StyleSheet'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
/** How a dropped tile settles into its place: the app's one ease-out (DESIGN.md, Motion). */
const DROP_ANIMATION = { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
/** The height of what floats over the keys, which the chord sounding keeps clear of. */
const OVER_FOOT = { block: '--over-foot' }

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
  const known = numerals.filter((numeral) => numeral !== null)
  return numerals.length > 0 && known.length === numerals.length ? known : null
}

/** The dock's sheets, one open at a time. */
type DockSheet = 'key' | 'tempo' | 'plays'

/** The page's panels, in the order the tray lists them. */
const PANELS: readonly ChordPanel[] = ['keys', 'dock', 'genos', 'chords']

/**
 * A laptop's grid: the chart's column, and a column beside it on each side a panel stands in, all
 * 320 (Narrow) or 420 (Wide) as the board's sideW.
 */
const COLUMNS: Readonly<Record<string, { readonly narrow: string; readonly wide: string }>> = {
  '': { narrow: 'xl:grid-cols-[minmax(0,1fr)]', wide: 'xl:grid-cols-[minmax(0,1fr)]' },
  L: { narrow: 'xl:grid-cols-[320px_minmax(0,1fr)]', wide: 'xl:grid-cols-[420px_minmax(0,1fr)]' },
  R: { narrow: 'xl:grid-cols-[minmax(0,1fr)_320px]', wide: 'xl:grid-cols-[minmax(0,1fr)_420px]' },
  LR: {
    narrow: 'xl:grid-cols-[320px_minmax(0,1fr)_320px]',
    wide: 'xl:grid-cols-[420px_minmax(0,1fr)_420px]',
  },
}
const NO_COLUMNS = { narrow: 'xl:grid-cols-[minmax(0,1fr)]', wide: 'xl:grid-cols-[minmax(0,1fr)]' }

/**
 * The Chord player (canvas R76): its bar (Undo, the gear, ⋯ a menu at its button), the sheet's name
 * as a menu of the recent sheets, the chart on its paper, and the page's panels, each where the
 * learner put it (`useChordLayout`): the Keys (Top or Bottom; Small, Medium, Large), the Controls
 * (Style · Key · Tempo · Repeats · Play, floating over the keys or at the top; Full or Play only), the
 * Genos while it is followed (Top, Floating, Bottom, and on a laptop Left or Right; Full, Compact,
 * Minimized) and a laptop's key Chords (Left or Right; Narrow or Wide). Edit layout outlines each
 * with its tag, the bar holding Reset and Done. One drag context holds the sections and their chords
 * (memory-palaces' fix): a mouse moves a thing after 8px, a finger after a quarter-second hold, the
 * keys after Space; the thing in hand is drawn in the overlay, lifted, and lands only where it may.
 */
export function ChordPlayer({
  hand,
  sheetId,
  name,
  routes,
  more,
  settings,
  editing,
  onEditing,
  onNew,
}: {
  hand: ChordSheetInHand
  /** One of My chord sheets (`?sheet=`), or none: the sheet in hand. */
  sheetId: string | undefined
  /** Its name: a saved sheet's, or "New chord sheet". */
  name: string
  routes: ChordPlayerRoutes
  /** The page's own acts on the sheet's file (Save as my chord sheet…, Share…), in ⋯. */
  more: readonly MenuAction[]
  /** The gear: the Chord player's Settings. */
  settings: ReactNode
  /** Edit layout on (`?layout=edit`). */
  editing: boolean
  onEditing(on: boolean): void
  /** New sheet, from the sheet's name. */
  onNew(): void
}) {
  const navigate = useNavigate()
  const sheets = useChordSheetsStoreApi()
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const keyName = useKeyName()
  const patterns = usePatternBook()
  const book = useMemo(() => styleBook(patterns), [patterns])
  const prefs = useSettings(selectChordPlayer)
  // Columns beside the chart from 80rem, as Settings and Songs: below it the chart takes the width.
  const wideSide = useMediaQuery(WIDE)
  // The keys' heights step up from 64rem, as every page's keys.
  const laptop = useMediaQuery(LAPTOP)
  const layout = useChordLayout(wideSide)
  const layoutEdit = useLayoutEdit(editing, wideSide, layout)
  const resetLayout = useResetChordLayout()
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
  // Following a MIDI arranger (a Genos): its clock lights the sheet, its Start/Stop is Play.
  const follow = useArrangerFollow(shown, prefs.follow)
  const device = follow.status?.state === 'connected' ? follow.status.device : 'Genos'
  // The arranger leads only while one is connected: with Follow on and none there, the sheet plays itself.
  const led = prefs.follow && follow.status?.state === 'connected'
  const playing = led ? follow.running : transport.playing
  const ownLit = led ? follow.lit : transport.lit
  const ownBeat = led ? follow.beat : transport.beat
  // Shared live: what this copy plays goes out; while it is stopped, the chord another copy plays lights.
  const online = useOnlineSheet(sheetId, playing ? ownLit : null, playing ? ownBeat : null)
  const theirs = playing ? null : online.remote
  const lit = theirs ? { section: theirs.section, index: theirs.index } : ownLit
  const beat = theirs ? theirs.beat : ownBeat
  const link = useChordSheets(selectSaved(sheetId))?.online ?? null
  const chordShare = useChordShare()
  /** The section whose arranger sheet is open. */
  const [tagged, setTagged] = useState<number | null>(null)
  const [dialog, setDialog] = useState<{ place: BoxPlace; typed?: string } | null>(null)
  /** The chord selected by a tap: Play starts from it (Musicca's). */
  const [picked, setPicked] = useState<BoxPlace | null>(null)
  // The selection follows the chord this copy plays (Musicca's): the chord Play started from lets go
  // of it, and on Stop it stays on the last chord played, where Play goes on from.
  if (playing && ownLit && (ownLit.section !== picked?.section || ownLit.index !== picked.index))
    setPicked(ownLit)
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
    open: (place, typed) => {
      setPicked(place)
      setDialog(typed === undefined ? { place } : { place, typed })
    },
    select: setPicked,
    remove(place) {
      const gone = chordAt(place)
      if (!gone) return
      inSection(place.section, (section) => removeChord(section, place.index))
      setDialog(null)
      setPicked(null)
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
  const toggle = () =>
    led
      ? follow.toggle()
      : transport.playing
        ? transport.stop()
        : transport.play(transport.looped, picked && chordAt(picked) ? picked : undefined)

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
  const tiles = keyChords(shown.key)
  /** A style chosen: its tempo with it, the sheet laid out again in its time where that differs. */
  const chooseStyle = (chosen: Style) => {
    hand.setEntry({ style: chosen.id, tempo: chosen.tempo })
    if (chosen.meter !== hand.sheet.meter) {
      hand.edit((sheet) => relayMeter(sheet, chosen.meter))
      say(t('chordPlayer.laidOut', { meter: chosen.meter }), {
        label: t('chordPlayer.undo'),
        onClick: hand.undo,
      })
    }
  }
  const onDrop = ({ active, over }: DragEndEvent) => {
    setInHand(null)
    const move = dropMove(active.id, over?.id)
    if (move?.kind === 'section') hand.edit((sheet) => moveSection(sheet, move.from, move.to))
    else if (move?.kind === 'chord')
      hand.editShown((sheet) => moveChordAcross(sheet, move.from, move.to))
    else if (move?.kind === 'key') {
      const chord = tiles[move.key]
      if (chord)
        inSection(move.to.section, (each) =>
          insertChord(each, Math.min(move.to.index, sectionChords(each).length), chord, meter),
        )
    }
  }
  const held = readDragId(inHand)
  const heldChord =
    held?.kind === 'chord' ? chordAt({ section: held.section, index: held.index }) : undefined
  const heldSection = held?.kind === 'section' ? shown.sections[held.section] : undefined
  const heldKey = held?.kind === 'key' ? tiles[held.index] : undefined
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

  /** The sheet's column, measured: the laptop's dock floats centred over it. */
  const column = useRef<HTMLDivElement>(null)
  /** What floats over the keys (the dock, the Genos strip): its height is `--over-foot`, which the
      chord sounding keeps clear of as the sheet follows it. */
  const [floating, setFloating] = useState<HTMLDivElement | null>(null)
  useRootSize(floating, OVER_FOOT)
  const [over, setOver] = useState<{ left: number; width: number } | null>(null)
  useLayoutEffect(() => {
    const element = column.current
    if (!element) return
    const measure = () => {
      const box = element.getBoundingClientRect()
      setOver({ left: box.left, width: box.width })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])
  const plays = entry.settings.plays
  const transpose = entry.settings.transpose
  const shortKey = `${printedNote(shown.key.tonic)}${shown.key.minor ? 'm' : ''}`
  const practiceLibrary = usePracticeLibraryStoreApi()

  // The page's panels where the learner put them (R76).
  const keysOn = layout.shown('keys')
  const keysTop = layout.place('keys') === 'top'
  const keysSize = layout.panels.keys.size
  const keysPx = KEYS_PX[laptop ? 'laptop' : 'phone']
  const dockOn = layout.shown('dock')
  const dockTop = layout.place('dock') === 'top'
  const dockFull = layout.panels.dock.size === 'full'
  const genosOn = prefs.follow && layout.shown('genos')
  const genosPlace = layout.place('genos')
  const genosSize: GenosSize =
    layout.panels.genos.size === 'full'
      ? 'full'
      : layout.panels.genos.size === 'minimized'
        ? 'minimized'
        : 'compact'
  const chordsOn = wideSide && layout.shown('chords')
  const chordsPlace = layout.place('chords')
  const sideWide = layout.panels.chords.size === 'wide'
  const inColumn = (side: 'left' | 'right') =>
    (chordsOn && chordsPlace === side) || (genosOn && genosPlace === side)
  const columns =
    COLUMNS[`${inColumn('left') ? 'L' : ''}${inColumn('right') ? 'R' : ''}`] ?? NO_COLUMNS
  const hiddenPanels = PANELS.filter(
    (panel) =>
      !layout.shown(panel) &&
      (panel !== 'genos' || prefs.follow) &&
      (panel !== 'chords' || wideSide),
  )

  /** The Genos panel, in its size; its tag on its full and compact cards (the pill has none). */
  const genosPanel = (where: 'over' | 'side') => (
    <ArrangerStrip
      follow={follow}
      device={device}
      size={genosSize}
      wide={wideSide && where === 'over'}
      flat={where === 'side'}
      onSize={(size) => layout.set('genos', { size })}
    >
      {genosSize === 'minimized' ? null : (
        <PanelTag panel="genos" className="-top-[22px] right-2" />
      )}
    </ArrangerStrip>
  )
  const playButton = (
    <FloatingBarPlay
      label={playing ? t('chordPlayer.stop') : t('chordPlayer.play')}
      playing={playing}
      disabled={!hasChords}
      onClick={toggle}
    />
  )
  /** The Controls: Style, Key, Tempo, Repeats and Play (Full), or Play alone (Play only). */
  const controls = (top: boolean) =>
    dockFull ? (
      <div className="relative mx-auto w-full md:w-[35rem]">
        <FloatingBar label={t('chordPlayer.transport')} className="w-full">
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
            value={String(follow.tempo ?? entry.tempo)}
            spoken={t('chordPlayer.bpm', { count: follow.tempo ?? entry.tempo })}
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
          {playButton}
        </FloatingBar>
        <PanelTag panel="dock" className={top ? 'top-3 left-2' : '-top-[26px] left-2'} />
      </div>
    ) : (
      <div className="relative self-end">
        <FloatingBar label={t('chordPlayer.transport')} className="p-2">
          {playButton}
        </FloatingBar>
        <PanelTag panel="dock" className="-top-[50px] right-0" />
      </div>
    )
  /** A column beside the chart, on a laptop: the key's Chords and the Genos, where they were put. */
  const side = (where: 'left' | 'right') =>
    inColumn(where) ? (
      <aside
        className={cn(
          // Its head 8 under the bar, as the board's column (the chart lifts its own 12).
          'hidden min-w-0 flex-col gap-6 pt-1 pb-6 xl:-mt-4 xl:flex focus-mode:hidden',
          where === 'left' && 'xl:order-first',
        )}
      >
        {chordsOn && chordsPlace === where ? (
          <div className="relative flex flex-col gap-4 pt-1">
            <KeyChords
              musicKey={shown.key}
              chords={tiles}
              onAdd={(chord) => {
                // A tap puts it in the chosen chord's place, keeping that chord's length; with
                // none chosen, after the last chord.
                if (picked && chordAt(picked)) {
                  inSection(picked.section, (each) => setChord(each, picked.index, chord))
                  return
                }
                const last = shown.sections.length - 1
                const held = shown.sections[last]
                if (!held) return
                inSection(last, (each) =>
                  insertChord(each, sectionChords(each).length, chord, meter),
                )
              }}
            />
            <PanelTag panel="chords" className="-top-2 right-0" />
          </div>
        ) : null}
        {genosOn && genosPlace === where ? genosPanel('side') : null}
      </aside>
    ) : null
  const keys = (top: boolean) => (
    <PinnedKeyboard
      shown={litKeys(lit ? chordAt(lit)?.chord : undefined)}
      range={laptop ? CHORD_PLAYER_LAPTOP_KEYS : CHORD_PLAYER_KEYS}
      fitInView
      sized={keysPx[keysSize] ?? keysPx.medium}
      place={top ? 'top' : undefined}
    >
      <KeysGrab top={top} size={keysSize} heights={keysPx} />
      <PanelTag panel="keys" className={top ? 'bottom-2 left-2' : 'top-2 left-2'} />
    </PinnedKeyboard>
  )
  const moreActions: MenuAction[] = [
    {
      key: 'save-draft',
      label: t('chordPlayer.draft.save'),
      group: 'draft',
      unnamed: true,
      // A view-only link's draft stays here: Save as my chord sheet keeps it.
      hidden:
        !hand.draft || sheetId === undefined || (link !== null && !link.mine && !link.canEdit),
      onSelect: () => {
        if (sheetId === undefined) return
        if (!link) {
          saveDraft(sheets, sheetId)
          say(t('chordPlayer.draft.saved', { name }))
          return
        }
        void saveOnline(chordShare, sheets, sheetId).then((sent) =>
          say(t(sent.ok ? 'chordPlayer.online.sent' : 'chordPlayer.online.unsent')),
        )
      },
    },
    {
      key: 'discard-draft',
      group: 'draft',
      unnamed: true,
      label: t('chordPlayer.draft.discard'),
      hidden: !hand.draft || sheetId === undefined,
      onSelect: () => {
        if (sheetId === undefined) return
        const kept = discardDraft(sheets, sheetId)
        say(t('chordPlayer.draft.discarded'), {
          label: t('chordPlayer.undo'),
          onClick: () => kept !== null && restoreDraft(sheets, sheetId, kept),
        })
      },
    },
    ...more,
    { key: 'layout', label: t('chordPlayer.layout.edit'), onSelect: () => onEditing(true) },
    {
      key: 'to-progressions',
      label: t('chordPlayer.toProgressions'),
      hidden: numerals === null,
      onSelect: () => {
        if (!numerals) return
        saveProgression(practiceLibrary, {
          name: name.slice(0, OWN_PROGRESSION_NAME_MAX),
          line: numeralsParam(numerals),
          minor: shown.key.minor,
        })
        say(t('chordPlayer.savedToProgressions'))
      },
    },
    {
      key: 'progressions',
      label: t('chordPlayer.inProgressions'),
      hidden: numerals === null,
      onSelect: () =>
        void navigate({
          to: '/practice/progressions/line',
          search: { p: numeralsParam(numerals ?? []), key: keyParam(shown.key) },
        }),
    },
    { key: 'randomize', label: t('chordPlayer.randomize'), onSelect: randomize },
  ]
  return (
    <LayoutEditContext value={layoutEdit}>
      <div className="flex flex-col gap-4">
        <ScreenHeader
          title={t('pages.chordPlayer')}
          titleOnPage
          back={<BackButton />}
          tools={
            editing ? (
              <>
                <Button variant="bar" className="shrink-0 px-4" onClick={resetLayout}>
                  {t('chordPlayer.layout.reset')}
                </Button>
                <Button variant="bar" className="shrink-0 px-4" onClick={() => onEditing(false)}>
                  {t('chordPlayer.layout.done')}
                </Button>
              </>
            ) : (
              <RoundButton
                label={t('chordPlayer.undo')}
                icon={Undo2}
                disabled={!hand.canUndo}
                onClick={hand.undo}
              />
            )
          }
          settings={editing ? null : settings}
          more={editing ? null : <MoreMenu label={t('chordPlayer.more')} actions={moreActions} />}
        />
        <HiddenTray panels={hiddenPanels} />
        {keysOn && keysTop ? keys(true) : null}
        {dockOn && dockTop ? controls(true) : null}
        {genosOn && genosPlace === 'top' ? genosPanel('over') : null}

        <DndContext
          sensors={sensors}
          collisionDetection={scopedCollision}
          onDragStart={({ active }) => setInHand(String(active.id))}
          onDragEnd={onDrop}
          onDragCancel={() => setInHand(null)}
        >
          {/* From 80rem the chart's column and, beside it, the columns the panels were put in. */}
          <div
            className={cn(
              // 40 from the window's trailing edge, as the board's (the page keeps 56).
              'flex flex-col gap-4 xl:-mr-4 xl:grid xl:items-start xl:gap-10 focus-mode:grid-cols-1',
              sideWide ? columns.wide : columns.narrow,
            )}
          >
            <div
              ref={column}
              // The chart 4 in from its column, as the board's scroll pads it.
              className="flex min-w-0 flex-col gap-4 xl:px-1"
              style={{ paddingBottom: 'calc(var(--over-foot, 0px) + 1.5rem)' }}
            >
              {/* The chart, a lead sheet on its paper: its name, its sections, Add section; its name 4
                  under the bar, as the board's. */}
              <div className="-mt-3 flex flex-col gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <SheetsMenu
                    name={name}
                    sheetId={sheetId}
                    onOpen={routes.openSheet}
                    onNew={onNew}
                    onAll={() => setLibrary(true)}
                  />
                  {hand.draft ? (
                    <span className="shrink-0 text-[13px] font-semibold text-honey-ink">
                      {t('chordPlayer.draft.label')}
                    </span>
                  ) : null}
                  {online.live ? (
                    <span
                      className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-muted-foreground"
                      title={t('chordPlayer.online.liveLabel')}
                    >
                      <span
                        aria-hidden
                        className={cn('size-2 rounded-full', theirs ? 'bg-primary' : 'bg-learned')}
                      />
                      {t('chordPlayer.online.live')}
                      {link && !link.mine && !link.canEdit ? (
                        <span className="sr-only">{t('chordPlayer.online.viewOnlyNote')}</span>
                      ) : null}
                    </span>
                  ) : null}
                </div>
                <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                  {shown.sections.map((section, index) => (
                    <SheetSection
                      key={sectionIds[index]}
                      section={section}
                      index={index}
                      musicKey={shown.key}
                      meter={meter}
                      names={prefs.names}
                      lit={lit}
                      beat={beat}
                      tag={prefs.follow ? marksLine(section.marks, t) : null}
                      onTag={() => setTagged(index)}
                      // While a chord sounds, its ring is the only one.
                      selected={lit ? null : picked}
                      variations={variations.length}
                      acts={acts}
                      onOpen={() => setOpened(index)}
                      onChange={(change) => inSection(index, (each) => ({ ...each, ...change }))}
                      onDelete={() => deleteSection(index)}
                    />
                  ))}
                </SortableContext>
                {/* Add section alone in its card, the kit's ADDCARD: a 56 row, a 36 sand circle with
                    its +, the words in the link colour. */}
                {shown.sections.length < MOST_SECTIONS ? (
                  <div className="card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => hand.edit((sheet) => addSection(sheet))}
                      className="flex min-h-14 w-full items-center gap-3 px-4 text-left text-base font-semibold text-link transition-colors duration-150 ease-out hover:bg-muted/60 focus-visible:-outline-offset-3"
                    >
                      <span
                        aria-hidden
                        className="grid size-9 shrink-0 place-items-center rounded-pill bg-muted"
                      >
                        <Plus className="size-5" strokeWidth={2.2} />
                      </span>
                      {t('chordPlayer.addSection')}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            {side('left')}
            {side('right')}
          </div>
          <DragOverlay dropAnimation={reduced ? null : DROP_ANIMATION}>
            {heldKey ? (
              <ChordFace chord={heldKey} musicKey={shown.key} names={prefs.names} />
            ) : heldChord ? (
              <ChordFace chord={heldChord.chord} musicKey={shown.key} names={prefs.names} />
            ) : heldSection ? (
              <div className="flex min-h-14 items-center gap-3 card px-4 elevation-3">
                <span className="font-semibold">
                  {t(`chordPlayer.sections.${heldSection.kind}`)}
                </span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {t('chordPlayer.bars', { count: sectionBars(heldSection, meter).length })}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {keysOn && !keysTop ? keys(false) : null}

        {/* What floats over the chart's column just above the keys: the Genos floating, the
            Controls, the Genos at the foot (canvas R76), on a phone and a laptop alike. */}
        {over ? (
          <div
            ref={setFloating}
            className="pointer-events-none fixed z-30 flex flex-col items-center gap-2"
            style={{
              left: over.left,
              width: over.width,
              bottom: 'calc(var(--nav-bar) + var(--docked, 0px) + 12px)',
            }}
          >
            {genosOn && genosPlace === 'float' ? (
              <div
                className={cn(
                  'pointer-events-auto w-full max-w-[47.5rem]',
                  genosSize === 'minimized' && 'flex',
                )}
              >
                {genosPanel('over')}
              </div>
            ) : null}
            {dockOn && !dockTop ? (
              <div className="pointer-events-auto flex w-full flex-col">{controls(false)}</div>
            ) : null}
            {genosOn && genosPlace === 'bottom' ? (
              <div
                className={cn(
                  'pointer-events-auto w-full max-w-[47.5rem]',
                  genosSize === 'minimized' && 'flex',
                )}
              >
                {genosPanel('over')}
              </div>
            ) : null}
          </div>
        ) : null}
        <LayoutZones />
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
                    count === 0
                      ? t('chordPlayer.dock.untilStop')
                      : t('chordPlayer.times', { count })
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
              // A connected arranger keeps the time: the chord is only picked; elsewhere the band plays from it.
              if (led) setPicked(dialog.place)
              else transport.play(transport.looped, dialog.place)
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
        {tagged !== null && shown.sections[tagged] ? (
          <ArrangerSheet
            open
            onOpenChange={(open) => (open ? null : setTagged(null))}
            name={t(`chordPlayer.sections.${shown.sections[tagged]?.kind ?? 'verse'}`)}
            marks={shown.sections[tagged]?.marks ?? NO_MARKS}
            repeats={shown.sections[tagged]?.repeats ?? 1}
            first={tagged === 0}
            last={tagged === shown.sections.length - 1}
            onChange={(marks) => inSection(tagged, (each) => ({ ...each, marks }))}
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
            chooseStyle(chosen)
          }}
        />
      </div>
    </LayoutEditContext>
  )
}
