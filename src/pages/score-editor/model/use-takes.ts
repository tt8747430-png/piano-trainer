import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
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
import { useRecorder, type RecorderState } from '@/features/record-take'
import { barAt, barsOf, takeParts, type EditorStore, type TakeInto } from '@/features/score-editor'
import { downloadFile, IN_PLACE } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { ticksOf, type Duration } from '@/shared/lib/notation'

/** How a take is written into the score: where, split at which key, and snapped to which value. */
export interface WriteChoice {
  readonly into: TakeInto
  readonly split: Midi
  readonly grid: Duration
}

/** How the last take ended, while the takes show it: kept, or with nothing played. */
type Ended = 'kept' | 'nothing'

export interface TakesValue {
  /** Whose takes: the piece's id. */
  readonly pieceId: string
  readonly recorder: RecorderState
  /** Whether the takes' sheet is open. */
  readonly open: boolean
  readonly setOpen: (open: boolean) => void
  readonly ended: Ended | null
  /** Records a take from the caret's bar, to the song's tempo and meter. */
  readonly record: () => void
  readonly stop: () => void
  readonly write: (take: Take, choice: WriteChoice) => void
  readonly download: (take: Take) => void
  readonly remove: (id: TakeId) => void
}

/**
 * The score editor's takes (ADR 0028): the recorder over the caret's bar, each take kept as it ends
 * and the takes shown on it; a take written into the score, downloaded or deleted. The sheet opens
 * on arrival where the URL says so (Make and record).
 */
export function useTakes(pieceId: string, store: EditorStore, title: string): TakesValue {
  const takes = useTakesStoreApi()
  const settings = useSettingsStoreApi()
  const search = useSearch({ from: '/full-screen/edit/$pieceId' })
  const navigate = useNavigate({ from: '/edit/$pieceId' })
  const [open, setOpenState] = useState(search.record)
  const [ended, setEnded] = useState<Ended | null>(null)
  const recorder = useRecorder((played, plan) => {
    if (played.notes.length > 0) {
      saveTake(takes, { pieceId, made: Date.now(), tempo: plan.tempo, meter: plan.meter }, played)
    }
    // Shown once the screen is still there: a take kept as the screen goes is only saved.
    setEnded(played.notes.length > 0 ? 'kept' : 'nothing')
    setOpenState(true)
  })

  const setOpen = (next: boolean) => {
    setOpenState(next)
    if (next) return
    setEnded(null)
    if (search.record) void navigate({ search: { record: false }, ...IN_PLACE })
  }

  const record = () => {
    const { draft, caret } = store.getState()
    const first = barAt(draft, caret)
    setOpen(false)
    recorder.start({
      barTicks: barsOf(draft)
        .slice(first.index)
        .map(({ bar }) => bar.ticks),
      meter: draft.meter,
      tempo: draft.tempo,
      click: settings.getState().recorder.click,
      room: selectRoomLeft(takes.getState()),
    })
  }

  const write = (take: Take, { into, split, grid }: WriteChoice) => {
    const notes = quantise(take, ticksOf(grid, store.getState().draft.meter))
    store.dispatch({ type: 'take', parts: takeParts(notes, into, split) })
    setOpen(false)
  }

  return {
    pieceId,
    recorder: recorder.state,
    open,
    setOpen,
    ended,
    record,
    stop: recorder.stop,
    write,
    download: (take) => downloadFile(midiFile(take), takeFileName(title, take.made), 'audio/midi'),
    remove: (id) => deleteTake(takes, id),
  }
}
