import { pitchClass, plainSpelling, writtenName, type Midi } from '@/shared/lib/music'

/** A key as the MIDI log names it: by its letter, a sharp where it has one, and its octave (C♯4). */
export const logKeyName = (key: Midi): string =>
  writtenName(key, plainSpelling(pitchClass(key), true)).replace('#', '♯')

const pad = (value: number, length = 2) => String(value).padStart(length, '0')

/** A moment (milliseconds since 1970) as the MIDI log times it: the hour, to the millisecond. */
export function logClock(epoch: number): string {
  const at = new Date(epoch)
  return `${pad(at.getHours())}:${pad(at.getMinutes())}:${pad(at.getSeconds())}.${pad(at.getMilliseconds(), 3)}`
}

/** A pedal sends down from the middle of its travel up, as the app reads it. */
export const pedalDown = (value: number): boolean => value >= 64
