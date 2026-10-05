import { LONGEST_TAKE_MS, type Played } from '@/entities/take'
import { PLAY_DELAY, type AudioOutput } from '@/shared/api/audio'
import type { MidiInput } from '@/shared/api/midi'
import { recorderClicks, type ClickPlan } from '@/shared/lib/schedule'
import { isKept, takeOf, type Heard } from './take-of'

/** How often the recorder looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

/** What a take is recorded to: the piece's bars and the one it starts at, the meter, tempo and click, and the notes the takes have room for. */
export interface RecorderPlan extends Omit<ClickPlan, 'longest'> {
  readonly room: number
}

/** Where a take is: in its count-in (the beat, from 1), or recording (the bar from its first, from 0, and whole seconds). */
export type RecorderProgress =
  | { readonly stage: 'counting'; readonly beat: number }
  | { readonly stage: 'recording'; readonly bar: number; readonly seconds: number }

export interface RecorderEvents {
  /** Where the take is, each time it changes. */
  readonly progress: (progress: RecorderProgress) => void
  /** Once, when it stops: what was played from the downbeat, or null where it stopped in the count-in. */
  readonly ended: (played: Played | null) => void
}

function sameProgress(a: RecorderProgress | null, b: RecorderProgress): boolean {
  if (a?.stage === 'counting' && b.stage === 'counting') return a.beat === b.beat
  if (a?.stage === 'recording' && b.stage === 'recording') {
    return a.bar === b.bar && a.seconds === b.seconds
  }
  return false
}

/**
 * Records a take (ADR 0028): the count-in and the click on the audio clock from just after now, and
 * every key and the pedal on the MIDI keyboard, each placed where it was heard. It stops itself at
 * the longest take or when the takes have no more room. Returns the function that stops it.
 */
export function startRecorder(
  audio: AudioOutput,
  midi: MidiInput,
  plan: RecorderPlan,
  on: RecorderEvents,
): () => void {
  const longest = LONGEST_TAKE_MS / 1000
  const clicks = recorderClicks({ ...plan, longest })
  // What sounds stops first: nothing plays under a take.
  audio.stop()
  const start = audio.now() + PLAY_DELAY
  const downbeat = start + clicks.downbeat
  const timing = { downbeat, tempo: plan.tempo }
  const beat = 60 / plan.tempo
  const heardNow = () => audio.audioTimeAt(performance.now())
  audio.play(clicks.sounds, start)

  const heard: Heard[] = []
  let struck = 0
  let reported: RecorderProgress | null = null
  let stopped = false

  const stop = () => {
    if (stopped) return
    stopped = true
    clearInterval(timer)
    stopNotes()
    stopPedal()
    audio.stop()
    const at = Math.min(heardNow(), downbeat + longest)
    on.ended(at > downbeat ? takeOf(heard, { ...timing, stop: at }) : null)
  }

  const stopNotes = midi.onNote((event) => {
    const at = audio.audioTimeAt(event.time)
    heard.push({ kind: 'note', midi: event.midi, on: event.on, velocity: event.velocity, at })
    if (event.on && isKept(event.midi, at, timing) && ++struck >= plan.room) stop()
  })
  const stopPedal = midi.onPedal((event) => {
    heard.push({ kind: 'pedal', down: event.down, at: audio.audioTimeAt(event.time) })
  })

  const follow = () => {
    const now = heardNow()
    const elapsed = now - downbeat
    if (elapsed >= longest) {
      stop()
      return
    }
    const progress: RecorderProgress =
      elapsed < 0
        ? { stage: 'counting', beat: Math.max(1, Math.floor((now - start) / beat) + 1) }
        : {
            stage: 'recording',
            bar: clicks.barStarts.findLastIndex((barStart) => barStart <= elapsed),
            seconds: Math.floor(elapsed),
          }
    if (sameProgress(reported, progress)) return
    reported = progress
    on.progress(progress)
  }
  const timer = setInterval(follow, FOLLOW_INTERVAL_MS)

  return stop
}
