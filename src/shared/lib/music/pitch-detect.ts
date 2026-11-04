/** The YIN threshold: a dip of the difference function this low is taken as the period. */
const THRESHOLD = 0.12
/** The lowest and highest pitches the tuner listens for: A0 to C8. */
const LOWEST = 27.5
const HIGHEST = 4186
/** Below this loudness (root mean square) the input is taken as silence. */
const SILENCE = 0.01

/**
 * The pitch of a stretch of sound, in Hz, by YIN (de Cheveigné and Kawahara, 2002): the cumulative
 * mean normalised difference function's first dip under the threshold, refined by a parabola through
 * its neighbours; null in silence or where no period is clear.
 */
export function detectPitch(samples: Float32Array, sampleRate: number): number | null {
  let power = 0
  for (const sample of samples) power += sample * sample
  if (Math.sqrt(power / samples.length) < SILENCE) return null
  const maxLag = Math.min(Math.floor(sampleRate / LOWEST), Math.floor(samples.length / 2))
  const minLag = Math.max(2, Math.floor(sampleRate / HIGHEST))
  const window = samples.length - maxLag
  const difference = new Float32Array(maxLag + 1)
  for (let lag = 1; lag <= maxLag; lag++) {
    let sum = 0
    for (let i = 0; i < window; i++) {
      const delta = (samples[i] ?? 0) - (samples[i + lag] ?? 0)
      sum += delta * delta
    }
    difference[lag] = sum
  }
  // Cumulative mean normalised difference.
  const normalised = new Float32Array(maxLag + 1)
  normalised[0] = 1
  let running = 0
  for (let lag = 1; lag <= maxLag; lag++) {
    running += difference[lag] ?? 0
    normalised[lag] = running === 0 ? 1 : ((difference[lag] ?? 0) * lag) / running
  }
  let period = -1
  for (let lag = minLag; lag <= maxLag; lag++) {
    if ((normalised[lag] ?? 1) < THRESHOLD) {
      while (lag + 1 <= maxLag && (normalised[lag + 1] ?? 1) < (normalised[lag] ?? 1)) lag++
      period = lag
      break
    }
  }
  if (period < 0) return null
  // A parabola through the dip and its neighbours finds the period between samples.
  const before = normalised[period - 1] ?? 1
  const at = normalised[period] ?? 1
  const after = normalised[period + 1] ?? 1
  const bend = before + after - 2 * at
  const shift = bend === 0 ? 0 : (before - after) / (2 * bend)
  return sampleRate / (period + shift)
}

/** The key (MIDI number) nearest a frequency, A4 (69) at `a4` Hz. */
export const nearestNote = (frequency: number, a4 = 440): number =>
  Math.round(69 + 12 * Math.log2(frequency / a4))

/** How far a frequency is from a key, in cents: sharp above 0, flat below. */
export const centsOff = (frequency: number, key: number, a4 = 440): number =>
  1200 * Math.log2(frequency / (a4 * 2 ** ((key - 69) / 12)))
