import { useStore } from 'zustand'
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import {
  entryTitles,
  sameMusic,
  selectHasVersion,
  selectOwnSong,
  usePieces,
  usePiecesStoreApi,
} from '@/entities/piece'
import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { useMidiKeyDown } from '@/features/connect-midi'
import { renameSong, saveMusic } from '@/features/edit-piece'
import { setScoreView } from '@/features/set-preference'
import {
  barAt,
  barsOf,
  createEditorStore,
  readDraft,
  musicToSave,
  rowShown,
  topStaff,
  type EditorAction,
} from '@/features/score-editor'
import { useLocale } from '@/shared/i18n'
import { useGoBack, useViewChange, useWakeLock, type SheetView } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { audibleHands, schedule } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { inPopUp, isTyping } from '@/shared/lib/shortcuts'
import { speedTempo } from '@/widgets/practice-player'
import { arrangeDraft } from './arrange-draft'
import type { ScoreEditorValue } from './editor-context'
import type { EditSearch } from './edit-search'
import { savedMusic, savingTo, type EditorTarget } from './editor-target'
import { shortcutOf } from './shortcuts'
import { useEditorTakes } from './use-editor-takes'

/** Where every key press is the field's or the open popup's own, not the editor's. */
const OWN_KEYS =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"], [role="listbox"], [role="menu"]'
/** Where the arrows, Home and End move the control's own choice or focus (the segments, a slider, the keys). */
const OWN_ARROWS = '[role="radiogroup"], [role="slider"], [data-slot="keys-scroller"]'
const ARROWS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'])
/** Where Enter presses what has the focus. */
const PRESSED = 'button, a'
/** The keys that stop a take: everything else waits until it has stopped. */
const STOPS_A_TAKE = new Set([' ', 'Escape'])

/** Close: back where the editor was opened from, or to the piece's page on its shelf. */
function useCloseTo(target: EditorTarget): () => void {
  const params = { pieceId: target.id }
  const toSongs = useGoBack({ to: '/songs/$pieceId', params })
  const toStudies = useGoBack({ to: '/practice/accompaniment/studies/$pieceId', params })
  return target.kind === 'version' && target.entry.kind === 'study' ? toStudies : toSongs
}

/**
 * The score editor's visit (spec §6): its store over the target's draft, saving each change; keys from
 * the keyboard, the computer keyboard and MIDI written at the caret; the shortcuts; Play; and the
 * takes (ADR 0028): while one records, its keys write nothing and Space or Escape stops it.
 * Opened at `bar` (as printed), the caret starts there.
 */
export function useScoreEditor(target: EditorTarget, bar?: number): ScoreEditorValue {
  // The screen stays on while this screen is open: a phone on the stand does not lock mid-song.
  useWakeLock()
  const pieces = usePiecesStoreApi()
  const locale = useLocale()
  // How the score is laid out is the learner's way of working, kept for every song, and the
  // Player's too: the music stands still between Practise and Edit (ADR 0090).
  const settings = useSettingsStoreApi()
  const layout = useSettings((state) => selectScoreView(state).layout)
  const setLayout = (next: SheetView) => setScoreView(settings, { layout: next })
  // The words shown or hidden as in the Player (ADR 0093).
  const lyrics = useSettings((state) => selectScoreView(state).lyrics)
  const setLyrics = (shown: boolean) => setScoreView(settings, { lyrics: shown })
  // The Lyrics field, on the verse it writes, while the learner has it open.
  const [lyricsVerse, openLyrics] = useState<number | null>(null)
  const [settingsOpen, openSettings] = useState(false)
  /** The music last saved here, or read: what the store holds unless another tab saved since. */
  const [saved] = useState(() => ({ music: target.music }))
  const [store] = useState(() =>
    createEditorStore(readDraft(target.music), (draft) => {
      const music = musicToSave(draft)
      if (!music) return
      saved.music = music
      saveMusic(pieces, savingTo(target), music)
    }),
  )
  // The same music changed in another tab: the editor opens on it, so its next change does not
  // write over what was written there.
  useEffect(
    () =>
      pieces.subscribe((state) => {
        const now = savedMusic(state, target)
        if (!now || sameMusic(now, saved.music)) return
        saved.music = now
        store.replace(readDraft(now))
      }),
    [pieces, store, target, saved],
  )
  // Opened at a bar (Edit from the Player's cursor, ADR 0090): the caret goes to its start, once,
  // and the URL forgets it.
  const setSearch = useViewChange<EditSearch>()
  const openAt = useEffectEvent((printed: number) => {
    const placed = barsOf(store.getState().draft)[printed - 1]
    if (placed) store.dispatch({ type: 'place', tick: placed.start, layer: store.getState().layer })
    setSearch({ bar: undefined })
  })
  useEffect(() => {
    if (bar !== undefined) openAt(bar)
  }, [bar])
  const playback = usePlayback<'piece'>()
  // The learner's speed for Play, a share of the song's tempo: this visit's, never saved.
  const [speed, setSpeed] = useState(1)
  const chordField = useRef<HTMLInputElement | null>(null)
  const chordFieldRef = useCallback((field: HTMLInputElement | null) => {
    chordField.current = field
  }, [])
  const [chordFieldAsked, askChordField] = useState(0)
  const close = useCloseTo(target)
  const hasVersion = usePieces(
    (state) => target.kind === 'version' && selectHasVersion(state, target.id),
  )
  const songTitle = usePieces((state) =>
    target.kind === 'song' ? selectOwnSong(state, target.id)?.title : undefined,
  )
  const title =
    target.kind === 'song' ? (songTitle ?? target.title) : entryTitles(target.entry, locale).primary

  // The chord names shown unless the song hides them (ADR 0072).
  const chordNames = useStore(store, (state) => rowShown(state.draft, 'chords'))
  const takes = useEditorTakes(target.id, store, title)
  const recording = takes.stage !== 'idle'

  const dispatch = useCallback((action: EditorAction) => store.dispatch(action), [store])
  const play = useCallback(
    (key: Midi) => {
      // A MIDI key writes only where the computer's keys would: never into the music behind an open
      // sheet, or while a field (a chord typed, a name) has the focus.
      const focus = document.activeElement
      if (recording || isTyping(focus) || inPopUp(focus)) return
      store.dispatch({ type: 'key', key, time: performance.now() })
    },
    [store, recording],
  )
  useMidiKeyDown(play)

  const togglePlay = () =>
    playback.toggle('piece', () => {
      const { draft, caret } = store.getState()
      return schedule(arrangeDraft(draft), {
        tempo: speedTempo(draft.tempo, speed),
        hands: audibleHands('both'),
        fromTick: barAt(draft, caret).start,
      }).sounds
    })

  const rename = (text: string) => {
    if (target.kind === 'song') renameSong(pieces, target.id, text)
  }

  // The editor reads its keys layer by layer (`shortcutOf`), and lists them for the sheet
  // (`useEditorShortcutList`); a key another listener took, or one an IME is composing, is not its.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing) return
    if (recording) {
      if (!STOPS_A_TAKE.has(event.key)) return
      event.preventDefault()
      takes.stop()
      return
    }
    if (!(event.target instanceof Element)) return
    if (event.target.closest(OWN_KEYS)) return
    if (ARROWS.has(event.key) && event.target.closest(OWN_ARROWS)) return
    const shortcut = shortcutOf(event, store.getState().layer)
    if (!shortcut) return
    if (shortcut.type === 'chordField') {
      if (event.target.closest(PRESSED)) return
      event.preventDefault()
      if (chordField.current) chordField.current.focus()
      else askChordField((asked) => asked + 1)
      return
    }
    // Escape with nothing chosen is the screen's (a sheet's, a menu's), not the editor's.
    if (shortcut.type === 'deselect') {
      const { selection, chordNote } = store.getState()
      if (selection === null && chordNote === null) return
    }
    event.preventDefault()
    store.dispatch(shortcut)
  })
  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  // With no chord row there is no chord to write: the caret goes to the top staff (the tune's, or
  // the right hand's), now and whenever a step undone or redone would bring it back to the chords.
  useEffect(() => {
    if (chordNames) return
    const toTune = () => {
      const { layer, draft } = store.getState()
      if (layer === 'chords') store.dispatch({ type: 'layer', layer: topStaff(draft) })
    }
    toTune()
    return store.subscribe(toTune)
  }, [store, chordNames])

  return {
    store,
    takes,
    actions: { dispatch, play, togglePlay, close, rename },
    view: {
      chordNames,
      lyrics,
      setLyrics,
      lyricsVerse,
      openLyrics,
      settingsOpen,
      openSettings,
      speed,
      setSpeed,
      layout,
      setLayout,
    },
    meta: {
      id: target.id,
      title,
      hasVersion,
      playing: playback.playing === 'piece',
      kind: target.kind,
      chordFieldRef,
      chordFieldAsked,
    },
  }
}
