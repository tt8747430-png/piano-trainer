import { useStore } from 'zustand'
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { entryTitles, sameMusic, usePiecesStoreApi } from '@/entities/piece'
import { selectScoreView, useSettings } from '@/entities/settings'
import { useMidiKeyDown } from '@/features/connect-midi'
import { saveMusic } from '@/features/edit-piece'
import {
  barAt,
  barsOf,
  createEditorStore,
  readDraft,
  musicToSave,
  type EditorAction,
} from '@/features/score-editor'
import { useLocale } from '@/shared/i18n'
import { useGoBack, useViewChange, useWakeLock } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { audibleHands, schedule, type Scheduled } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { inPopUp, isTyping } from '@/shared/lib/shortcuts'
import { speedTempo } from '@/widgets/practice-player'
import { arrangeDraft } from './arrange-draft'
import type { ScoreEditorValue } from './editor-context'
import type { EditSearch } from './edit-search'
import { savedMusic, savingTo, type EditorTarget } from './editor-target'
import { layerInSight, rowsInSight } from './seen-draft'
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
  // How the score is shown is the View's, the Player's too (ADR 0090, 0094): its layout (the music
  // stands still between Practise and Edit), its words (ADR 0093), staves and chord symbols.
  const shown = useSettings(selectScoreView)
  // The Lyrics field, on the verse it writes, while the learner has it open.
  const [lyricsVerse, openLyrics] = useState<number | null>(null)
  /** The music last saved here, or read: what the store holds unless another tab saved since. */
  const [saved] = useState(() => ({ music: target.music }))
  // A change the song's music cannot be written with: said so, the music last saved kept, until a
  // change saves or the notice is closed.
  const [unsaved, setUnsaved] = useState(false)
  const [store] = useState(() =>
    createEditorStore(readDraft(target.music), (draft) => {
      const music = musicToSave(draft)
      setUnsaved(music === null)
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
  // The learner's own title, saved with the music (ADR 0094); else the catalog's, in their language.
  const title =
    useStore(store, (state) => state.draft.title) ??
    (target.kind === 'song' ? target.music.title : entryTitles(target.entry, locale).primary)

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

  // What Play plays, kept while it sounds: the playhead follows it, apart from the caret (ADR 0096).
  const [pass, setPass] = useState<Scheduled | null>(null)
  const togglePlay = () =>
    playback.toggle('piece', () => {
      const { draft, caret } = store.getState()
      const played = schedule(arrangeDraft(draft), {
        tempo: speedTempo(draft.tempo, speed),
        hands: audibleHands('both'),
        fromTick: barAt(draft, caret).start,
      })
      setPass(played)
      return played.sounds
    })
  const { handle } = playback
  const heard = useMemo(() => (handle && pass ? { handle, pass } : null), [handle, pass])

  // The editor reads its keys layer by layer (`shortcutOf`), and lists them for the sheet
  // (`useEditorShortcutList`); a key another listener took, or one an IME is composing, is not its.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing) return
    if (recording) {
      // The recording strip's settings keep their own keys: Escape closes them, Space turns a switch.
      if (event.target instanceof Element && event.target.closest(OWN_KEYS)) return
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

  // The caret writes only in a row in sight (ADR 0094): a row the View hides (the chord symbols, the
  // tune's staff) is stepped over the way the caret was going, else it stays; a row put
  // out of sight under it sends it to the staff under it. Now, and whenever a step, an Undo or a Redo
  // would bring it back there.
  useEffect(() => {
    let from = store.getState().layer
    const keepInSight = () => {
      const { layer, draft } = store.getState()
      const to = layerInSight(rowsInSight(draft, shown), from, layer)
      from = to
      if (to !== layer) store.dispatch({ type: 'layer', layer: to })
    }
    keepInSight()
    return store.subscribe(keepInSight)
  }, [store, shown])

  return {
    store,
    takes,
    heard,
    actions: { dispatch, play, togglePlay, close, dismissUnsaved: () => setUnsaved(false) },
    view: {
      // The chord symbols shown or not are the View's (ADR 0094).
      chordNames: shown.chordNames,
      lyrics: shown.lyrics,
      lyricsVerse,
      openLyrics,
      speed,
      setSpeed,
      layout: shown.layout,
    },
    meta: {
      id: target.id,
      title,
      playing: playback.playing === 'piece',
      kind: target.kind,
      chordFieldRef,
      chordFieldAsked,
      unsaved,
    },
  }
}
