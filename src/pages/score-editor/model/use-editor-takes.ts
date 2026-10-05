import { useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import type { PieceId } from '@/entities/piece'
import { useSettingsStoreApi } from '@/entities/settings'
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
  /** Whether the takes' sheet is open: the URL's `record`. */
  readonly open: boolean
  /** The sheet's page: the one it shows, kept as it closes. */
  readonly page: TakesPage
  /** Opens the sheet on a page, or closes it (null). */
  readonly show: (page: TakesPage | null) => void
  /** Records a take from the caret's bar, to the song's tempo and meter. */
  readonly record: () => void
  readonly stop: () => void
  readonly write: (take: Take, choice: WriteChoice) => void
  readonly download: (take: Take) => void
  readonly remove: (id: TakeId) => void
}

/** The draft's bars on the meter's grid, as the click follows them. */
const gridBars = (draft: Draft): GridBar[] =>
  barsOf(draft).map(({ start, bar }) => ({ startTick: start, beats: bar.ticks / TICKS_PER_BEAT }))

/**
 * The score editor's takes (ADR 0028): the recorder over the caret's bar, each take kept as it ends
 * and the sheet opened on it while the screen is there; a take written into the score, downloaded or
 * deleted. Whether the sheet is open is the URL's (New song's Record arrives with it open).
 */
export function useEditorTakes(pieceId: PieceId, store: EditorStore, title: string): EditorTakes {
  const takes = useTakesStoreApi()
  const settings = useSettingsStoreApi()
  const { record: open } = useSearch({ from: '/full-screen/edit/$pieceId' })
  const changeView = useViewChange<EditSearch>()
  const [shown, setShown] = useState<TakesPage>(TAKES_PAGE)
  const [fromBar, setFromBar] = useState(1)

  const show = (page: TakesPage | null) => {
    if (page) setShown(page)
    if (open !== (page !== null)) changeView({ record: page !== null })
  }

  const recorder = useRecorder((played, plan, ending) => {
    const nothingPlayed = played.notes.length === 0
    if (!nothingPlayed) {
      saveTake(takes, {
        pieceId,
        made: Date.now(),
        tempo: plan.tempo,
        meter: plan.meter,
        ...played,
      })
    }
    // A take kept as the screen goes is only saved: there is no sheet to show it on.
    if (ending === 'stopped') show({ kind: 'takes', nothingPlayed })
  })

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
      click: settings.getState().recorder.click,
      room: selectRoomLeft(takes.getState()),
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
    record,
    stop: recorder.stop,
    write,
    download: (take) => downloadFile(midiFile(take), takeFileName(title, take.made), 'audio/midi'),
    remove: (id) => deleteTake(takes, id),
  }
}
