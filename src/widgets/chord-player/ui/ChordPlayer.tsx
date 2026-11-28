import {
  closestCenter,
  DndContext,
  DragOverlay,
  pointerWithin,
  type CollisionDetection,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useNavigate } from '@tanstack/react-router'
import {
  Cable,
  Drum,
  FileText,
  Keyboard,
  KeyboardMusic,
  Music,
  Plus,
  Search,
  Undo2,
  Volume2,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectSaved,
  useChordSheets,
  useChordSheetsStoreApi,
  type ChordSheetSong,
} from '@/entities/chord-sheet'
import { styleBook, styleVariations, usePatternBook, type Style } from '@/entities/pattern'
import { OWN_PROGRESSION_NAME_MAX, usePracticeLibraryStoreApi } from '@/entities/practice-library'
import { libraryParam, progressionMode } from '@/entities/progression-library'
import { selectChordPlayer, useSettings } from '@/entities/settings'
import { LiveKeyboard } from '@/features/live-keyboard'
import { discardDraft, restoreDraft, saveDraft } from '@/features/manage-chord-sheets'
import { saveProgression } from '@/features/manage-practice-library'
import { saveOnline } from '@/features/share-chord-sheet'
import { useOpenShortcuts } from '@/features/shortcuts-help'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import {
  cn,
  downloadFile,
  fileTitle,
  LAPTOP,
  midiFileName,
  REDUCED_MOTION,
  useDragSensors,
  useLatestCallback,
  useMediaQuery,
  useRootSize,
} from '@/shared/lib'
import {
  addSection,
  duplicateChord,
  duplicateSection,
  insertChord,
  moveChordAcross,
  moveSection,
  MOST_SECTIONS,
  NO_MARKS,
  randomSheet,
  readChart,
  relayMeter,
  removeChord,
  removeSection,
  resizeChord,
  SECTION_KINDS,
  sectionBars,
  sectionChords,
  setChord,
  sheetChart,
  withSection,
  type ChordSheet,
  type ReadChart,
  type SheetSection as Section,
} from '@/shared/lib/arrangement'
import { useChordShare } from '@/shared/lib/chord-share'
import {
  keyParam,
  numeralOf,
  numeralsParam,
  parseNumerals,
  printedChord,
  type Numeral,
} from '@/shared/lib/music'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { useSearchPalette } from '@/widgets/search-palette'
import {
  ActionMenu,
  Band,
  BandButton,
  BandClose,
  BandOptions,
  BandPill,
  BandTransport,
  KeysIcon,
  PanelPopover,
  PhoneBand,
  PhoneBandButton,
  PhoneTransport,
  Rail,
  RailButton,
  RailPanel,
  RowButton,
  say,
  sayUndo,
  SettingsGroup,
  type MenuAction,
  type MetronomeMode,
} from '@/shared/ui'
import { bandMidi, type BoxPlace } from '../model/engine'
import { keyChords } from '../model/key-chords'
import { KEYS_PX } from '../model/keys-px'
import { CHORD_PLAYER_KEYS, CHORD_PLAYER_LAPTOP_KEYS, litKeys } from '../model/lit-keys'
import { dropMove, landsOn, readDragId, sectionDragId } from '../model/sheet-dnd'
import { useArrangerPlay } from '../model/use-arranger-play'
import type { ChordSheetInHand } from '../model/use-chord-sheet'
import { useOnlineSheet } from '../model/use-online-sheet'
import type { ChordPanel } from '../model/view'
import { ArrangerSheet } from './ArrangerSheet'
import { ArrangerStrip, type GenosSize } from './ArrangerStrip'
import { ChordDialog } from './ChordDialog'
import {
  AudioBody,
  ChartBody,
  FollowRow,
  KeyBody,
  MidiBody,
  PlaybackBody,
  StyleRows,
  TempoBody,
} from './ChordPlayerPanels'
import { ChordFace, type TileActs } from './ChordTile'
import { KeyChords } from './KeyChords'
import { LibrarySheet } from './LibrarySheet'
import { marksLine } from './marks-line'
import { SectionSheet } from './SectionSheet'
import { SheetSection } from './SheetSection'
import { PhoneMenu, type PhonePage } from './PhoneMenu'
import { useRecentSheets } from './use-recent-sheets'

/** The keys that lift and drop a chord or a section: Space, as a list's, and Enter to drop. */
const SHEET_KEYS = { start: ['Space'], cancel: ['Escape'], end: ['Space', 'Enter'] }
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
  /** A song from the library put in hand, its sheet and tempo. */
  openSong(song: ChordSheetSong): void
  /** A chart read from a file put in hand, under its title (else the file's name), at its tempo. */
  openChart(chart: ReadChart, name: string): void
}

/** Every chord of the sheet as a numeral in its key, or null where one is not (the Player's line). */
function sheetNumerals(sheet: ChordSheet): Numeral[] | null {
  const numerals = sheet.sections.flatMap((section) =>
    sectionChords(section).map(({ chord }) => numeralOf(chord, sheet.key)),
  )
  const known = numerals.filter((numeral) => numeral !== null)
  return numerals.length > 0 && known.length === numerals.length ? known : null
}

/** A band popover open on a laptop. */
type Popped = 'options' | 'key' | 'tempo' | 'style' | 'midi'

/** The rail's places, in its order, with their glyphs. */
const RAIL: readonly {
  readonly panel: Exclude<ChordPanel, 'none'>
  readonly icon: typeof Music
}[] = [
  { panel: 'chords', icon: Music },
  { panel: 'styles', icon: Drum },
  { panel: 'genos', icon: KeyboardMusic },
  { panel: 'audio', icon: Volume2 },
  { panel: 'chart', icon: FileText },
]

/**
 * The Chord player (canvas R77, `r58_chordplayer.py`): a screen of its own, in the Player's model.
 * On a laptop the dark band (✕; the sheet's name with Live, Draft or Saved under it, its menu of the
 * recent sheets and the file's acts; the transport: Go to start, Play with Playback options under ▾,
 * the metronome, Loop for the section; the sheet's Key, Tempo and Style as pills, each a popover; MIDI;
 * Undo and the keys at its end), under it the rail of Chords, Styles, Genos, Audio and Chart with the
 * panel open beside it (« folds it), and the chart taking the rest, the keys docked under it. While a
 * Genos is followed and another panel is open, its compact row docks over the keys. On a phone Flat's
 * header (←, the transport, the keys, ☰), the chart under it with its name, the Genos over the keys;
 * ☰ lists the sheet's places, each a page with ←, then its file acts. One drag context holds the
 * sections, their chords and the key's chords (memory-palaces' fix): a mouse moves a thing after 8px, a
 * finger after a quarter-second hold, the keys after Space.
 */

/** The foot's height, which the toasts stand clear of. */
const FOOT = { block: '--docked' }
export function ChordPlayer({
  hand,
  sheetId,
  name,
  routes,
  panel,
  onPanel,
  keysShown,
  onKeys,
  onNew,
  onSaveAs,
  onShare,
}: {
  hand: ChordSheetInHand
  /** One of My chord sheets (`?sheet=`), or none: the sheet in hand. */
  sheetId: string | undefined
  /** Its name: a saved sheet's, or "New chord sheet". */
  name: string
  routes: ChordPlayerRoutes
  /** The rail's panel open on a laptop (`?panel=`). */
  panel: ChordPanel
  onPanel(panel: ChordPanel): void
  /** The keys docked under the chart (`?keys=off` hides them). */
  keysShown: boolean
  onKeys(shown: boolean): void
  /** New sheet, from the sheet's name. */
  onNew(): void
  /** Save as my chord sheet…: the sheet in hand named and kept. */
  onSaveAs(): void
  /** Share…: live sharing with its options. */
  onShare(): void
}) {
  const navigate = useNavigate()
  const palette = useSearchPalette()
  const openShortcuts = useOpenShortcuts()
  const sheets = useChordSheetsStoreApi()
  const { t } = useTranslation(['practice', 'common'])
  const locale = useLocale()
  const keyName = useKeyName()
  const patterns = usePatternBook()
  const book = useMemo(() => styleBook(patterns), [patterns])
  const prefs = useSettings(selectChordPlayer)
  const laptop = useMediaQuery(LAPTOP)
  const { shown, entry } = hand
  const style = book.get(entry.style)
  const variations = styleVariations(style)
  // Play leads: alone, or a Genos followed (it plays the style), or the app's band standing in for one.
  const band = useArrangerPlay({
    sheet: shown,
    style,
    tempo: entry.tempo,
    settings: entry.settings,
    block: prefs.voicing === 'block',
    follow: prefs.follow,
    styleName: localText(style.name, locale),
  })
  const { playing, lit: ownLit, beat: ownBeat } = band
  // Shared live: what this copy plays goes out; while it is stopped, the chord another copy plays lights.
  const online = useOnlineSheet(sheetId, playing ? ownLit : null, playing ? ownBeat : null)
  const theirs = playing ? null : online.remote
  const lit = theirs ? { section: theirs.section, index: theirs.index } : ownLit
  const beat = theirs ? theirs.beat : ownBeat
  const link = useChordSheets(selectSaved(sheetId))?.online ?? null
  const chordShare = useChordShare()
  /** The screen's foot (the Genos row and the keys): its height is `--docked`, so a toast stands over it. */
  const [foot, setFoot] = useState<HTMLDivElement | null>(null)
  useRootSize(foot, FOOT)
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
  /** The section whose sheet is open. */
  const [opened, setOpened] = useState<number | null>(null)
  const [popped, setPopped] = useState<Popped | null>(null)
  const [page, setPage] = useState<PhonePage | null>(null)
  /** The phone's Genos row: Compact, Full or Minimized, as its own buttons set it. */
  const [phoneGenos, setPhoneGenos] = useState<GenosSize>('compact')
  const meter = shown.meter

  const inSection = (section: number, change: (each: Section) => Section) =>
    hand.editShown((sheet) => withSection(sheet, section, change))
  const chordAt = (place: BoxPlace) => {
    const section = shown.sections[place.section]
    return section ? sectionChords(section)[place.index] : undefined
  }
  /** A change made at once, said in its toast with Undo (a loss that can be undone, CLAUDE.md). */
  const undoable = (message: string) => sayUndo(message, hand.undo)
  const openAt = useLatestCallback((place: BoxPlace, typed?: string) => {
    setPicked(place)
    setDialog(typed === undefined ? { place } : { place, typed })
  })
  const removeAt = useLatestCallback((place: BoxPlace) => {
    const gone = chordAt(place)
    if (!gone) return
    inSection(place.section, (section) => removeChord(section, place.index))
    setDialog(null)
    setPicked(null)
    undoable(t('chordPlayer.deleted', { chord: printedChord(gone.chord) }))
  })
  const resizeAt = useLatestCallback((place: BoxPlace, beats: number) =>
    inSection(place.section, (section) => resizeChord(section, place.index, beats)),
  )
  const addTo = useLatestCallback((section: number) => {
    const held = shown.sections[section]
    const chords = held ? sectionChords(held) : []
    const last = chords.at(-1)?.chord ?? {
      root: shown.key.tonic,
      quality: shown.key.minor ? 'min' : 'maj',
    }
    inSection(section, (each) => insertChord(each, sectionChords(each).length, last, meter))
    setDialog({ place: { section, index: chords.length } })
  })
  // Held for good, so the sheet's sections and chords render again only for what they show.
  const acts = useMemo<TileActs & { add(section: number): void }>(
    () => ({ open: openAt, select: setPicked, remove: removeAt, resize: resizeAt, add: addTo }),
    [openAt, setPicked, removeAt, resizeAt, addTo],
  )
  const changeSection = useLatestCallback(
    (index: number, change: Partial<Pick<Section, 'repeats' | 'variation'>>) =>
      inSection(index, (each) => ({ ...each, ...change })),
  )

  const numerals = sheetNumerals(shown)
  const hasChords = shown.sections.some((section) => section.bars.length > 0)
  const toggle = () => band.toggle(picked && chordAt(picked) ? picked : undefined)
  const first: BoxPlace = { section: 0, index: 0 }
  /** Go to start: the first chord chosen; playing, it plays on from there. */
  const toStart = () => {
    setPicked(first)
    if (playing) band.playFrom(first)
  }
  /** Loop: the section of the chord chosen (else the one sounding, else the first) again and again. */
  const loopSection = picked?.section ?? lit?.section ?? 0
  const toggleLoop = () => band.setLoop(band.looped === null ? loopSection : null)
  const loopName = (index: number) =>
    t(`chordPlayer.sections.${shown.sections[index]?.kind ?? 'verse'}`)
  const metronome: MetronomeMode = entry.settings.click
    ? 'on'
    : entry.settings.countIn > 0
      ? 'count-in'
      : 'off'
  /** The metronome's next mode, one press each (Flat's): Count-in, then On (a click every beat), then Off. */
  const nextMetronome = () => {
    const next: MetronomeMode =
      metronome === 'off' ? 'count-in' : metronome === 'count-in' ? 'on' : 'off'
    hand.setSettings(
      next === 'count-in'
        ? { countIn: 1 }
        : next === 'on'
          ? { click: true }
          : { countIn: 0, click: false },
    )
    say(t(`chordPlayer.metronome.${next}`))
  }

  useShortcuts(t('chordPlayer.shortcuts.group'), [
    { label: t('chordPlayer.shortcuts.playStop'), combo: { key: ' ' }, run: toggle },
    { label: t('chordPlayer.shortcuts.undo'), combo: { code: 'KeyZ', mod: true }, run: hand.undo },
    {
      label: t('chordPlayer.shortcuts.redo'),
      combo: { code: 'KeyZ', mod: true, shift: true },
      run: hand.redo,
    },
  ])

  const sensors = useDragSensors(SHEET_KEYS)
  const sectionIds = useMemo(
    () => Array.from({ length: shown.sections.length }, (_, i) => sectionDragId(i)),
    [shown.sections.length],
  )
  const tiles = keyChords(shown.key)
  /** A style chosen: its tempo with it, the sheet laid out again in its time where that differs. */
  const chooseStyle = (chosen: Style) => {
    hand.setEntry({ style: chosen.id, tempo: chosen.tempo })
    if (chosen.meter !== hand.sheet.meter) {
      hand.edit((sheet) => relayMeter(sheet, chosen.meter))
      undoable(t('chordPlayer.laidOut', { meter: chosen.meter }))
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
  /** A key's chord tapped: in the chosen chord's place, keeping its length; with none, after the last. */
  const addKeyChord = (chord: (typeof tiles)[number]) => {
    if (picked && chordAt(picked)) {
      inSection(picked.section, (each) => setChord(each, picked.index, chord))
      return
    }
    const last = shown.sections.length - 1
    if (!shown.sections[last]) return
    inSection(last, (each) => insertChord(each, sectionChords(each).length, chord, meter))
  }
  const held = readDragId(inHand)
  const heldChord =
    held?.kind === 'chord' ? chordAt({ section: held.section, index: held.index }) : undefined
  const heldSection = held?.kind === 'section' ? shown.sections[held.section] : undefined
  const heldKey = held?.kind === 'key' ? tiles[held.index] : undefined
  /** A section deleted at once, Undo in its toast (a loss that can be undone, CLAUDE.md). */
  const deleteSection = useLatestCallback((index: number) => {
    const section = shown.sections[index]
    if (!section) return
    setOpened(null)
    hand.edit((sheet) => removeSection(sheet, index))
    undoable(t('chordPlayer.sectionDeleted', { name: t(`chordPlayer.sections.${section.kind}`) }))
  })
  const openedSection = opened === null ? undefined : shown.sections[opened]
  const dialogChord = dialog ? chordAt(dialog.place) : undefined

  /** Import chart's file picker, the system's. */
  const chartPicker = useRef<HTMLInputElement>(null)
  const practiceLibrary = usePracticeLibraryStoreApi()
  const styleName = localText(style.name, locale)
  const playLabel = playing ? t('chordPlayer.stop') : t('chordPlayer.play')
  const keyHead = t('chordPlayer.keyChords', { key: keyName(shown.key) })
  /** What the sheet is, under its name: a draft, shared live, saved, or not saved yet. */
  const state = hand.draft
    ? t('chordPlayer.draft.label')
    : online.live
      ? t('chordPlayer.live')
      : sheetId === undefined
        ? t('chordPlayer.unsaved')
        : t('chordPlayer.saved')

  const exportMidi = () =>
    downloadFile(
      bandMidi(
        {
          sheet: shown,
          style,
          tempo: entry.tempo,
          settings: entry.settings,
          block: prefs.voicing === 'block',
        },
        name,
        {
          piano: t('chordPlayer.settings.piano'),
          bass: t('chordPlayer.settings.bass'),
          drums: t('chordPlayer.settings.drums'),
        },
      ),
      midiFileName(name, entry.tempo),
      'audio/midi',
    )
  const exportChart = () =>
    downloadFile(
      new TextEncoder().encode(
        sheetChart(shown, { title: name, tempo: entry.tempo }, (kind) =>
          t(`chordPlayer.sections.${kind}`),
        ),
      ),
      `${fileTitle(name)}.txt`,
      'text/plain;charset=utf-8',
    )
  const toProgressions = () => {
    if (!numerals) return
    saveProgression(practiceLibrary, {
      name: name.slice(0, OWN_PROGRESSION_NAME_MAX),
      line: numeralsParam(numerals),
      minor: shown.key.minor,
    })
    say(t('chordPlayer.savedToProgressions'))
  }
  const inProgressions = () =>
    void navigate({
      to: '/practice/progressions/line',
      search: { p: numeralsParam(numerals ?? []), key: keyParam(shown.key) },
    })
  const randomize = () => {
    hand.edit((sheet) => randomSheet(sheet, Math.random))
    undoable(t('chordPlayer.randomized', { key: keyName(shown.key) }))
  }

  /** The recent sheets, the open one checked, then New sheet and All chord sheets (R76). */
  const recent = useRecentSheets(sheetId, routes.openSheet)
  const sheetActs: MenuAction[] = [
    ...recent,
    {
      key: 'new',
      group: 'sheets',
      unnamed: true,
      label: t('chordPlayer.sheets.new'),
      onSelect: onNew,
    },
    {
      key: 'all',
      group: 'sheets',
      unnamed: true,
      label: t('chordPlayer.sheets.all'),
      onSelect: () => setLibrary(true),
    },
  ]
  /** The file's acts (the board's `_fileacts`): on a laptop in the name's menu, on a phone in ☰. */
  const fileActs: MenuAction[] = [
    {
      key: 'share',
      group: 'file',
      unnamed: true,
      label: t('chordPlayer.shareMenu'),
      onSelect: onShare,
    },
    {
      key: 'export',
      group: 'file',
      unnamed: true,
      label: t('chordPlayer.exportMenu.label'),
      onSelect: () => undefined,
      items: [
        { key: 'export-midi', label: t('chordPlayer.exportMenu.midi'), onSelect: exportMidi },
        { key: 'export-chart', label: t('chordPlayer.exportMenu.chart'), onSelect: exportChart },
      ],
    },
    {
      key: 'import-chart',
      group: 'file',
      unnamed: true,
      label: t('chordPlayer.import.action'),
      onSelect: () => chartPicker.current?.click(),
    },
    {
      key: 'randomize',
      group: 'file',
      unnamed: true,
      label: t('chordPlayer.randomize'),
      onSelect: randomize,
    },
    {
      key: 'to-progressions',
      group: 'file',
      unnamed: true,
      label: t('chordPlayer.toProgressions'),
      hidden: numerals === null,
      onSelect: toProgressions,
    },
    {
      key: 'progressions',
      group: 'file',
      unnamed: true,
      label: t('chordPlayer.inProgressions'),
      hidden: numerals === null,
      onSelect: inProgressions,
    },
  ]
  /** Save (the draft kept, or the sheet in hand named) and Discard draft, last. */
  const draftActs: MenuAction[] = [
    {
      key: 'save-as',
      group: 'draft',
      unnamed: true,
      label: t('chordPlayer.saveAs'),
      hidden: sheetId !== undefined,
      onSelect: onSaveAs,
    },
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
      destructive: true,
      label: t('chordPlayer.draft.discard'),
      hidden: !hand.draft || sheetId === undefined,
      onSelect: () => {
        if (sheetId === undefined) return
        const kept = discardDraft(sheets, sheetId)
        sayUndo(
          t('chordPlayer.draft.discarded'),
          () => kept !== null && restoreDraft(sheets, sheetId, kept),
        )
      },
    },
  ]
  /** A chart file chosen: read, put in hand, or said to have no chords. */
  const importChart = async (file: File) => {
    const chart = readChart(
      await file.text(),
      (named) =>
        SECTION_KINDS.find(
          (kind) => t(`chordPlayer.sections.${kind}`).toLowerCase() === named.toLowerCase(),
        ) ?? null,
    )
    if (!chart) return say(t('chordPlayer.import.failed', { name: file.name }))
    routes.openChart(chart, chart.title ?? file.name.replace(/\.[^.]+$/, ''))
  }

  const genosOn = prefs.follow
  const genosStrip = (size: GenosSize, where: 'panel' | 'dock' | 'phone') => (
    <ArrangerStrip
      panel={band.panel}
      device={band.device}
      size={size}
      wide={where === 'dock'}
      flat={where === 'panel'}
      onSize={(next) => {
        if (where === 'phone') return setPhoneGenos(next)
        // The dock's ⌃ opens the Genos panel in full.
        if (next === 'full') onPanel('genos')
      }}
    />
  )

  const chart = (
    <DndContext
      sensors={sensors}
      collisionDetection={scopedCollision}
      onDragStart={({ active }) => setInHand(String(active.id))}
      onDragEnd={onDrop}
      onDragCancel={() => setInHand(null)}
    >
      {/* A toast centres on the chart (`toast-over`): beside the rail alone, or the rail and its panel. */}
      <div
        data-toast-over={laptop ? (panel === 'none' ? 'rail' : 'panel') : undefined}
        className="flex min-h-0 flex-1 flex-col lg:flex-row"
      >
        {laptop ? (
          <>
            <Rail
              label={t('common:panels')}
              foot={
                <>
                  <RailButton
                    label={t('chordPlayer.rail.search')}
                    icon={Search}
                    tab={false}
                    tip={`${t('chordPlayer.rail.search')} · ⌘K`}
                    onClick={() => palette.open()}
                  />
                  <RailButton
                    label={t('chordPlayer.rail.shortcuts')}
                    icon={Keyboard}
                    tab={false}
                    tip={`${t('chordPlayer.rail.shortcuts')} · ?`}
                    onClick={openShortcuts}
                  />
                </>
              }
            >
              {RAIL.map((each) => (
                <RailButton
                  key={each.panel}
                  label={t(`chordPlayer.rail.${each.panel}`)}
                  icon={each.icon}
                  selected={panel === each.panel}
                  onClick={() => onPanel(panel === each.panel ? 'none' : each.panel)}
                />
              ))}
            </Rail>
            {panel === 'none' ? null : (
              <RailPanel
                title={panel === 'chords' ? keyHead : t(`chordPlayer.rail.${panel}`)}
                onFold={() => onPanel('none')}
              >
                {panel === 'chords' ? (
                  <KeyChords chords={tiles} onAdd={addKeyChord} />
                ) : panel === 'styles' ? (
                  <StyleRows book={book} value={style.id} onChoose={chooseStyle} />
                ) : panel === 'genos' ? (
                  <>
                    {genosOn ? genosStrip('full', 'panel') : null}
                    <FollowRow />
                  </>
                ) : panel === 'audio' ? (
                  <AudioBody hand={hand} style={style} />
                ) : (
                  <ChartBody hand={hand} />
                )}
              </RailPanel>
            )}
          </>
        ) : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <main
            className={cn(
              // Its parts keep their height and the chart scrolls: a long chart squeezed Add section's card to nothing.
              'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto *:shrink-0',
              // The chart's first section level with the panel's title (22), 40 in, as the board's.
              laptop ? 'px-10 pt-5.5 pb-6' : 'px-4 pt-4 pb-6',
            )}
          >
            {laptop ? null : (
              <div className="flex min-w-0 items-center gap-2">
                <ActionMenu
                  label={t('chordPlayer.sheets.menu')}
                  wide
                  render={
                    <button
                      type="button"
                      aria-label={t('chordPlayer.sheets.open', { name })}
                      className="-my-1.5 flex h-11 min-w-0 items-center gap-1 rounded-control text-foreground"
                    />
                  }
                  trigger={
                    <>
                      <span className="min-w-0 truncate font-sans text-2xl font-semibold">
                        {name}
                      </span>
                      <ChevronGlyph />
                    </>
                  }
                  actions={[...sheetActs, ...draftActs]}
                />
                <span className="shrink-0 text-footnote font-semibold text-muted-foreground">
                  {state}
                </span>
              </div>
            )}
            <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
              {shown.sections.map((section, index) => (
                <SheetSection
                  key={sectionIds[index]}
                  section={section}
                  index={index}
                  musicKey={shown.key}
                  meter={meter}
                  names={prefs.names}
                  lit={lit?.section === index ? lit.index : null}
                  beat={lit?.section === index ? beat : null}
                  tag={prefs.follow ? marksLine(section.marks, t) : null}
                  onTag={setTagged}
                  // While a chord sounds, its ring is the only one.
                  selected={!lit && picked?.section === index ? picked.index : null}
                  variations={variations.length}
                  acts={acts}
                  onOpen={setOpened}
                  onChange={changeSection}
                  onDelete={deleteSection}
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
          </main>
          {/* The Genos docked over the keys while another panel is open (the board's GDOCK77); on a
              phone its row stands over the keys always. */}
          <div ref={setFoot} className="shrink-0">
            {genosOn && laptop && panel !== 'genos' ? (
              <div className="flex shrink-0 justify-center px-4 pb-3">
                <div className="w-full max-w-140">{genosStrip('compact', 'dock')}</div>
              </div>
            ) : null}
            {genosOn && !laptop ? (
              // Wider than a phone (an iPad upright) the row keeps the dock's 560, centred, nothing stranded.
              <div
                className={cn(
                  'mx-4 my-2 shrink-0 sm:mx-auto sm:w-full sm:max-w-140',
                  phoneGenos === 'minimized' && 'flex',
                )}
              >
                {genosStrip(phoneGenos, 'phone')}
              </div>
            ) : null}
            {keysShown ? (
              <div className="shrink-0 overflow-hidden shadow-[0_-1px_0_var(--color-border)]">
                <LiveKeyboard
                  range={laptop ? CHORD_PLAYER_LAPTOP_KEYS : CHORD_PLAYER_KEYS}
                  marks={litKeys(lit ? chordAt(lit)?.chord : undefined).marks}
                  spotlight
                  fitInView
                  height={KEYS_PX[laptop ? 'laptop' : 'phone']}
                  // Space is Play here, as the Player's: the pedal is a MIDI keyboard's.
                  spacePedal={false}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={reduced ? null : DROP_ANIMATION}>
        {heldKey ? (
          <ChordFace chord={heldKey} musicKey={shown.key} names={prefs.names} />
        ) : heldChord ? (
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
  )

  // A band's popover stands 8 under the band (the board's POPOVER at 72), its 40 trigger 12 above the band's foot.
  const pop = (which: Popped) => ({
    open: popped === which,
    onOpenChange: (open: boolean) => setPopped(open ? which : null),
    sideOffset: 20,
  })
  const keysLabel = t('common:pianoKeys')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <input
        ref={chartPicker}
        type="file"
        accept=".txt,text/plain"
        hidden
        tabIndex={-1}
        onChange={(event) => {
          const [file] = event.target.files ?? []
          // Cleared, so the same file chosen again is read again.
          event.target.value = ''
          if (file) void importChart(file)
        }}
      />
      {laptop ? (
        <Band label={t('pages.chordPlayer')}>
          <BandClose />
          <ActionMenu
            label={t('chordPlayer.sheets.menu')}
            wide
            render={
              <button
                type="button"
                aria-label={t('chordPlayer.sheets.open', { name })}
                className="flex h-12 max-w-80 min-w-30 shrink cursor-pointer items-center gap-2 rounded-xl pr-2 pl-3 text-left text-on-band hover:bg-on-band/10 data-popup-open:bg-on-band/14"
              />
            }
            trigger={
              <>
                <span className="flex min-w-0 flex-col">
                  <h1 className="truncate font-sans text-[1.0625rem]/5 font-semibold">{name}</h1>
                  <span className="text-[0.8125rem]/4 whitespace-nowrap text-on-band-soft">
                    {state}
                  </span>
                </span>
                <ChevronGlyph className="text-on-band-soft" />
              </>
            }
            actions={[...sheetActs, ...fileActs, ...draftActs]}
          />
          <BandTransport
            playing={playing}
            playLabel={playLabel}
            canPlay={hasChords}
            onStart={toStart}
            onPlay={toggle}
            options={
              <PanelPopover
                title={t('common:playbackOptions')}
                {...pop('options')}
                trigger={<BandOptions open={popped === 'options'} />}
                align="start"
                className="w-80"
              >
                <PlaybackBody hand={hand} />
              </PanelPopover>
            }
            metronome={metronome}
            metronomeLabel={t(`chordPlayer.metronome.${metronome}`)}
            onMetronome={nextMetronome}
            loop={band.looped !== null}
            loopLabel={
              band.looped !== null
                ? t('chordPlayer.looping', { name: loopName(band.looped) })
                : t('chordPlayer.loop')
            }
            onLoop={toggleLoop}
          >
            <PanelPopover
              title={t('chordPlayer.dock.key')}
              {...pop('key')}
              trigger={
                <BandPill
                  label={t('chordPlayer.dock.key')}
                  value={keyName(shown.key)}
                  aria-label={`${t('chordPlayer.dock.key')}: ${keyName(shown.key)}`}
                  aria-expanded={popped === 'key'}
                />
              }
              align="start"
              className="w-80"
            >
              <KeyBody hand={hand} />
            </PanelPopover>
            <PanelPopover
              title={t('chordPlayer.tempo')}
              {...pop('tempo')}
              trigger={
                <BandPill
                  label={t('chordPlayer.tempo')}
                  value={t('chordPlayer.bpm', { count: entry.tempo })}
                  aria-label={`${t('chordPlayer.tempo')}: ${t('chordPlayer.bpm', { count: entry.tempo })}`}
                  aria-expanded={popped === 'tempo'}
                />
              }
              align="start"
              className="w-80"
            >
              <TempoBody hand={hand} />
            </PanelPopover>
            <PanelPopover
              title={t('chordPlayer.style')}
              {...pop('style')}
              trigger={
                <BandPill
                  label={t('chordPlayer.style')}
                  value={styleName}
                  aria-label={`${t('chordPlayer.style')}: ${styleName}`}
                  aria-expanded={popped === 'style'}
                />
              }
              align="start"
              className="w-80"
            >
              <StyleRows
                book={book}
                value={style.id}
                onChoose={(chosen) => {
                  setPopped(null)
                  chooseStyle(chosen)
                }}
              />
            </PanelPopover>
            <PanelPopover
              title={t('chordPlayer.settings.midi')}
              {...pop('midi')}
              trigger={
                <BandButton
                  label={t('common:midi.label')}
                  open={popped === 'midi'}
                  aria-haspopup="dialog"
                >
                  <Cable aria-hidden className="size-5" strokeWidth={2} />
                </BandButton>
              }
              align="start"
              className="w-90"
            >
              <MidiBody />
            </PanelPopover>
          </BandTransport>
          <span className="flex-1" />
          <BandButton label={t('chordPlayer.undo')} disabled={!hand.canUndo} onClick={hand.undo}>
            <Undo2 aria-hidden className="size-5" strokeWidth={2} />
          </BandButton>
          <BandButton
            label={keysLabel}
            open={keysShown}
            aria-pressed={keysShown}
            onClick={() => onKeys(!keysShown)}
          >
            <KeysIcon aria-hidden className="size-5" />
          </BandButton>
        </Band>
      ) : (
        <PhoneBand label={t('pages.chordPlayer')}>
          <PhoneTransport
            playing={playing}
            playLabel={playLabel}
            canPlay={hasChords}
            onStart={toStart}
            onPlay={toggle}
            loop={band.looped !== null}
            loopLabel={t('chordPlayer.loop')}
            onLoop={toggleLoop}
            optionsOpen={page === 'repeats'}
            onOptions={() => setPage('repeats')}
          />
          <PhoneBandButton
            label={keysLabel}
            on={keysShown}
            className="min-[440px]:ml-auto"
            aria-pressed={keysShown}
            onClick={() => onKeys(!keysShown)}
          >
            <KeysIcon aria-hidden className="size-6" />
          </PhoneBandButton>
          <PhoneMenu
            page={page}
            onPage={setPage}
            name={name}
            rows={{
              styleName,
              keyName: keyName(shown.key),
              tempo: t('chordPlayer.bpm', { count: entry.tempo }),
              repeats:
                entry.settings.plays === 0
                  ? t('chordPlayer.dock.untilStop')
                  : t('chordPlayer.times', { count: entry.settings.plays }),
              chart: t(`chordPlayer.settings.names.${prefs.names}`),
            }}
            fileActs={fileActs.filter((act) => !act.hidden)}
            bodies={{
              chords: <KeyChords chords={tiles} onAdd={addKeyChord} />,
              chordsTitle: keyHead,
              style: (
                <StyleRows
                  book={book}
                  value={style.id}
                  onChoose={(chosen) => {
                    setPage(null)
                    chooseStyle(chosen)
                  }}
                />
              ),
              key: <KeyBody hand={hand} />,
              tempo: <TempoBody hand={hand} />,
              repeats: <PlaybackBody hand={hand} metronome />,
              audio: <AudioBody hand={hand} style={style} />,
              chart: <ChartBody hand={hand} />,
              midi: <MidiBody />,
              export: (
                <SettingsGroup flush>
                  <RowButton title={t('chordPlayer.exportMenu.midi')} onClick={exportMidi} />
                  <RowButton title={t('chordPlayer.exportMenu.chart')} onClick={exportChart} />
                </SettingsGroup>
              ),
            }}
          />
        </PhoneBand>
      )}
      {chart}

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
            band.playFrom(dialog.place)
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
          canDuplicate={shown.sections.length < MOST_SECTIONS}
          onChange={(change) => inSection(opened, (each) => ({ ...each, ...change }))}
          onDuplicate={() => {
            hand.edit((sheet) => duplicateSection(sheet, opened))
            setOpened(null)
          }}
          looped={band.looped === opened}
          onLoop={(on) => band.setLoop(on ? opened : null)}
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
        onOpenSong={(song) => {
          setLibrary(false)
          routes.openSong(song)
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
    </div>
  )
}

/** A menu's chevron after a name. */
function ChevronGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('size-5 shrink-0 text-muted-foreground', className)}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
