import { PIECE_TEMPO } from '@/entities/piece'
import { selectMetronome, selectRecorder, useSettingsStoreApi } from '@/entities/settings'
import { selectRoomLeft, useTakesStoreApi, type TakeId } from '@/entities/take'
import { saveFreeTake } from '@/features/manage-takes'
import { beatsPerBar } from '@/shared/lib/music'
import { parseMeter } from '@/shared/lib/schedule'
import { useRecorder, type RecorderProgressSource, type RecorderStage } from './use-recorder'

/** The Recorder of no song (R29 B11): what records, and how it went. */
export interface FreeRecorder {
  readonly stage: RecorderStage
  readonly progress: RecorderProgressSource
  /** Records from a connected piano to the Metronome's tempo and time; nothing without one. */
  record(): void
  stop(): void
}

/**
 * The Recorder away from a song (R29 B11): a take from the MIDI keyboard as the editor's takes are,
 * counted in and clicked at the Metronome's tempo in its time (the click and tune as the Recorder's
 * settings say), kept as a free recording when it holds a note. `onSaved` hears its id.
 */
export function useFreeRecorder(onSaved?: (id: TakeId) => void): FreeRecorder {
  const takes = useTakesStoreApi()
  const settings = useSettingsStoreApi()
  const recorder = useRecorder((played, plan) => {
    if (played.notes.length === 0) return
    const id = saveFreeTake(takes, {
      made: Date.now(),
      tempo: plan.tempo,
      meter: plan.meter,
      ...played,
    })
    onSaved?.(id)
  })
  return {
    stage: recorder.stage,
    progress: recorder.progress,
    record() {
      const state = settings.getState()
      const metronome = selectMetronome(state)
      const meter = parseMeter(metronome.meter) ?? '4/4'
      recorder.start({
        bars: [{ startTick: 0, beats: beatsPerBar(meter) }],
        meter,
        from: 0,
        tempo: Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, metronome.bpm)),
        room: selectRoomLeft(takes.getState()),
        tune: [],
        along: selectRecorder(state),
      })
    },
    stop: recorder.stop,
  }
}
