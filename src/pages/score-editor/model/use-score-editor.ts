import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import {
  entryTitles,
  selectHasVersion,
  selectOwnSong,
  usePieces,
  usePiecesStoreApi,
} from '@/entities/piece'
import { useMidiKeyDown } from '@/features/connect-midi'
import { renameSong, saveMusic } from '@/features/edit-piece'
import {
  barAt,
  createEditorStore,
  isHandLayer,
  readDraft,
  writeDraft,
  type EditorAction,
} from '@/features/score-editor'
import { useLocale } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { audibleHands, schedule } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { arrangeDraft, playedInBar } from './arrange-draft'
import type { ScoreEditorValue } from './editor-context'
import { savingTo, type EditorTarget } from './editor-target'
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
  const toStudies = useGoBack({ to: '/practice/studies/$pieceId', params })
  return target.kind === 'version' && target.entry.kind === 'study' ? toStudies : toSongs
}

/**
 * The score editor's visit (spec §6): its store over the target's draft, saving each change; keys from
 * the keyboard, the computer keyboard and MIDI written at the caret; the shortcuts; Play; Write out;
 * and the takes (ADR 0028): while one records, its keys write nothing and Space or Escape stops it.
 */
export function useScoreEditor(target: EditorTarget): ScoreEditorValue {
  const pieces = usePiecesStoreApi()
  const locale = useLocale()
  const [store] = useState(() =>
    createEditorStore(readDraft(target.music), (draft) =>
      saveMusic(pieces, savingTo(target), writeDraft(draft)),
    ),
  )
  const playback = usePlayback<'piece'>()
  const chordField = useRef<HTMLInputElement | null>(null)
  const chordFieldRef = useCallback((field: HTMLInputElement | null) => {
    chordField.current = field
  }, [])
  const close = useCloseTo(target)
  const hasVersion = usePieces(
    (state) => target.kind === 'version' && selectHasVersion(state, target.id),
  )
  const songTitle = usePieces((state) =>
    target.kind === 'song' ? selectOwnSong(state, target.id)?.title : undefined,
  )
  const title =
    target.kind === 'song' ? (songTitle ?? target.title) : entryTitles(target.entry, locale).primary

  const takes = useEditorTakes(target.id, store, title)
  const recording = takes.stage !== 'idle'

  const dispatch = useCallback((action: EditorAction) => store.dispatch(action), [store])
  const play = useCallback(
    (key: Midi) => {
      if (!recording) store.dispatch({ type: 'key', key, time: performance.now() })
    },
    [store, recording],
  )
  useMidiKeyDown(play)

  const togglePlay = () =>
    playback.toggle('piece', () => {
      const { draft, caret } = store.getState()
      return schedule(arrangeDraft(draft), {
        tempo: draft.tempo,
        hands: audibleHands('both'),
        fromTick: barAt(draft, caret).start,
      }).sounds
    })

  const rename = (text: string) => {
    if (target.kind === 'song') renameSong(pieces, target.id, text)
  }

  const writeOut = () => {
    const { draft, caret, layer } = store.getState()
    if (!isHandLayer(layer)) return
    const played = playedInBar(arrangeDraft(draft), layer, barAt(draft, caret))
    store.dispatch({ type: 'writeOut', played })
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
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
      chordField.current?.focus()
      return
    }
    event.preventDefault()
    store.dispatch(shortcut)
  })
  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return {
    store,
    takes,
    actions: { dispatch, play, togglePlay, writeOut, close, rename },
    meta: {
      title,
      hasVersion,
      playing: playback.playing === 'piece',
      kind: target.kind,
      chordFieldRef,
    },
  }
}
