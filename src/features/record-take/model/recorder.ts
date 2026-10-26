import { LONGEST_TAKE_MS, type Played } from '@/entities/take'
import { PLAY_DELAY, type AudioOutput } from '@/shared/api/audio'
import type { MidiPort } from '@/shared/api/midi'
import { recorderClicks, type ClickPlan, type NoteSound } from '@/shared/lib/schedule'
import { isKept, takeOf, type Heard } from './take-of'

/** How often the recorder looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

/**
 * What sounds with a take besides its count-in (ADR 0028, 0096): the click after the count-in, and
 * the song's tune under it; either may be turned on or off while the take records.
 */
export interface Along {
  readonly click: boolean
  readonly tune: boolean
}

/**
 * What a take is recorded to: the piece's bars and the one it starts at, the meter and tempo, the
 * notes the takes have room for, the song's tune, and what sounds along with it as it starts.
 */
export interface RecorderPlan extends Omit<ClickPlan, 'longest' | 'click'> {
  readonly room: number
  /** The song's tune from the take's downbeat (seconds from it); empty where it has none. */
  readonly tune: readonly NoteSound[]
  readonly along: Along
}

/** A take recording: Stop, and what sounds along with it changed from now on. */
export interface RecorderSession {
  /** Stops the take: kept from its downbeat, or nothing where it stopped in its count-in. */
  readonly stop: () => void
  /** The click and the tune on or off from the next beat on; the count-in always counts. */
  readonly along: (along: Along) => void
}

/** A sound this close after the moment asked for still sounds. */
const EARLY = 1e-6

/** Where a take is: in its count-in (the beat, from 1), or recording (the bar from its first, from 0, and whole seconds). */
export type RecorderProgress =
  | { readonly stage: 'counting'; readonly beat: number }
  | { readonly stage: 'recording'; readonly bar: number; readonly seconds: number }

interface RecorderEvents {
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
 * Records a take (ADR 0028): the count-in and the click on the audio clock from just after now, the
 * tune under it from its downbeat, and every key and pedal on the MIDI keyboard, each placed where it
 * was heard. The click and the tune can be turned on or off while it records (ADR 0096). It stops
 * itself at the longest take or when the takes have no more room. Returns the session: its Stop, and
 * what sounds along with it.
 */
export function startRecorder(
  audio: AudioOutput,
  midi: MidiPort,
  plan: RecorderPlan,
  on: RecorderEvents,
): RecorderSession {
  const longest = LONGEST_TAKE_MS / 1000
  // Every click, the count-in's and the metronome's after it, kept or left out as `along` says.
  const clicks = recorderClicks({ ...plan, click: true, longest })
  let along = plan.along
  // What sounds stops first: nothing plays under a take.
  audio.stop()
  const start = audio.now() + PLAY_DELAY
  const downbeat = start + clicks.downbeat
  const timing = { downbeat, tempo: plan.tempo, barLines: clicks.barStarts }
  const beat = 60 / plan.tempo
  const heardNow = () => audio.audioTimeAt(performance.now())
  /** Plays what sounds along with the take from `from` on the audio clock on. */
  const accompany = (from: number) => {
    const counted = clicks.sounds.filter(
      (click) =>
        start + click.at >= from - EARLY && (along.click || click.at < clicks.downbeat - EARLY),
    )
    if (counted.length > 0) audio.play(counted, start)
    const tune = along.tune ? plan.tune.filter((note) => downbeat + note.at >= from - EARLY) : []
    if (tune.length > 0) audio.play(tune, downbeat)
  }
  accompany(start)

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
  // A pedal already held as Record is pressed holds from the take's start.
  for (const pedal of midi.pedalsDown())
    heard.push({ kind: 'pedal', pedal, down: true, at: heardNow() })
  const stopPedal = midi.onPedal((event) => {
    heard.push({
      kind: 'pedal',
      pedal: event.pedal,
      down: event.down,
      at: audio.audioTimeAt(event.time),
    })
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

  return {
    stop,
    along: (next) => {
      if (stopped || (next.click === along.click && next.tune === along.tune)) return
      along = next
      // What was asked to sound is let go, and sounds again as now asked from just after now.
      audio.stop()
      accompany(audio.now() + PLAY_DELAY)
    },
  }
}
