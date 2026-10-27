import { useSearch } from '@tanstack/react-router'
import { useEffect, useEffectEvent, useState } from 'react'
import { isOwnSongId, selectOwnSong, usePiecesStoreApi, type PieceId } from '@/entities/piece'
import { selectRecorder, useSettings, useSettingsStoreApi } from '@/entities/settings'
import {
  midiFile,
  quantise,
  selectRoomLeft,
  takeFileName,
  useTakesStoreApi,
  type Take,
  type TakeId,
} from '@/entities/take'
import { deleteTake, saveTake } from '@/features/manage-takes'
import {
  useRecorder,
  type Along,
  type RecorderProgressSource,
  type RecorderStage,
} from '@/features/record-take'
import {
  barAt,
  barsOf,
  takeParts,
  type Draft,
  type EditorStore,
  type TakeInto,
} from '@/features/score-editor'
import { downloadFile, useViewChange } from '@/shared/lib'
import { TICKS_PER_BEAT, type Midi } from '@/shared/lib/music'
import type { Duration } from '@/shared/lib/notation'
import type { GridBar } from '@/shared/lib/schedule'
import type { EditSearch } from './edit-search'
import { hasTune, tuneOf } from './tune'

/** How a take is written into the score: where, split at which key, and snapped to which value. */
export interface WriteChoice {
  readonly into: TakeInto
  readonly split: Midi
  readonly grid: Duration
}

/**
 * The takes' sheet's page (CODE_STYLE §3, one value): the takes, saying so when the take that just
 * ended had nothing played, or one take's form to write it into the score.
 */
export type TakesPage =
  | { readonly kind: 'takes'; readonly nothingPlayed: boolean }
  | { readonly kind: 'write'; readonly id: TakeId }

export const TAKES_PAGE: TakesPage = { kind: 'takes', nothingPlayed: false }

export interface EditorTakes {
  /** Whose takes: the piece's id. */
  readonly pieceId: PieceId
  /** Whether a take records: the screen's tools give way while it does. */
  readonly stage: RecorderStage
  /** Where the take is, for the recording strip alone. */
  readonly progress: RecorderProgressSource
  /** The bar the take records from, from 1: the caret's when Record was pressed. */
  readonly fromBar: number
  /** Whether the takes' sheet is open: the URL's `takes`. */
  readonly open: boolean
  /** The sheet's page: the one it shows, kept as it closes. */
  readonly page: TakesPage
  /** Opens the sheet on a page, or closes it (null). */
  readonly show: (page: TakesPage | null) => void
  /** Whether Record was pressed as the editor opened (New song's Record): the URL's `record`. */
  readonly asked: boolean
  /** Forgets that Record was asked for, once it is pressed: the URL says nothing of it any more. */
  readonly answered: () => void
  /**
   * Records a take from the caret's bar, to the song's tempo and meter, the click and the tune under
   * it as Settings › Recording says (and as the recording strip's settings change it while it records).
   */
  readonly record: () => void
  readonly stop: () => void
  readonly write: (take: Take, choice: WriteChoice) => void
  readonly download: (take: Take) => void
  readonly remove: (id: TakeId) => void
}

/** The draft's bars on the meter's grid, each in its section's (ADR 0097), as the click follows them. */
const gridBars = (draft: Draft): GridBar[] =>
  barsOf(draft).map(({ start, bar, section }) => {
    const meter = draft.sections[section]?.heading.meter
    return { startTick: start, beats: bar.ticks / TICKS_PER_BEAT, ...(meter ? { meter } : {}) }
  })

/**
 * The score editor's takes (ADR 0028, 0096): the recorder over the caret's bar, each take kept as it
 * ends and the takes' sheet opened on it while the screen is there; a take written into the score,
 * downloaded or deleted. Whether the sheet is open is the URL's, and so is Record pressed as the
 * editor opens (New song's Record). The click and the tune under a take follow the saved settings
 * while it records.
 */
export function useEditorTakes(pieceId: PieceId, store: EditorStore, title: string): EditorTakes {
  const takes = useTakesStoreApi()
  const pieces = usePiecesStoreApi()
  const settings = useSettingsStoreApi()
  const { takes: open, record: asked } = useSearch({ from: '/full-screen/edit/$pieceId' })
  const changeView = useViewChange<EditSearch>()
  const [shown, setShown] = useState<TakesPage>(TAKES_PAGE)
  const [fromBar, setFromBar] = useState(1)

  const show = (page: TakesPage | null) => {
    if (page) setShown(page)
    if (open !== (page !== null)) changeView({ takes: page !== null })
  }

  const recorder = useRecorder((played, plan, ending) => {
    const nothingPlayed = played.notes.length === 0
    // An own song deleted in another tab keeps no takes: one saved for it would be no one's.
    const songGone = isOwnSongId(pieceId) && !selectOwnSong(pieces.getState(), pieceId)
    if (!nothingPlayed && !songGone) {
      saveTake(takes, {
        pieceId,
        made: Date.now(),
        tempo: plan.tempo,
        meter: plan.meter,
        fromBar: plan.from + 1,
        ...played,
      })
    }
    // A take kept as the screen goes is only saved: there is no sheet to show it on.
    if (ending === 'stopped') show({ kind: 'takes', nothingPlayed })
  })

  // The metronome or the tune turned on or off while a take records sound so from the next beat.
  const along = useSettings(selectRecorder)
  const follow = useEffectEvent((next: Along) => recorder.along(next))
  useEffect(() => follow(along), [along])

  const record = () => {
    const { draft, caret } = store.getState()
    const from = barAt(draft, caret).index
    show(null)
    setFromBar(from + 1)
    recorder.start({
      bars: gridBars(draft),
      meter: draft.meter,
      from,
      tempo: draft.tempo,
      room: selectRoomLeft(takes.getState()),
      // The song's tune whether it plays or not: it may be turned on while the take records.
      tune: hasTune(draft) ? tuneOf(draft, from) : [],
      along: settings.getState().recorder,
    })
  }

  const write = (take: Take, { into, split, grid }: WriteChoice) => {
    store.dispatch({ type: 'take', parts: takeParts(quantise(take, grid), into, split) })
    show(null)
  }

  return {
    pieceId,
    stage: recorder.stage,
    progress: recorder.progress,
    fromBar,
    open,
    page: shown,
    show,
    asked,
    answered: () => changeView({ record: false }),
    record,
    stop: recorder.stop,
    write,
    download: (take) => downloadFile(midiFile(take), takeFileName(title, take.made), 'audio/midi'),
    remove: (id) => deleteTake(takes, id),
  }
}
