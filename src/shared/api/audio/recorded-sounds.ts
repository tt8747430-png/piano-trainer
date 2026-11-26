/**
 * The Metronome's and the drum beat's recorded sounds (A39): a woodblock, a kick, a snare and a closed
 * hi-hat from the Versilian Community Sample Library (CC0, VCSL), trimmed and levelled to 1 dB under
 * full scale, as WAV so they start on their sample with no encoder's delay. They are in the app's
 * offline cache; each is fetched and decoded once for an audio context.
 */
const RECORDED_SOUNDS = {
  click: '/sounds/woodblock.wav',
  kick: '/sounds/kick.wav',
  snare: '/sounds/snare.wav',
  hat: '/sounds/hihat.wav',
} as const

export type RecordedSound = keyof typeof RECORDED_SOUNDS

export const isRecordedSound = (voice: string): voice is RecordedSound => voice in RECORDED_SOUNDS

/** Fetches and decodes a sound; null where it cannot be had (offline before the cache, a test). */
export type LoadSound = (context: AudioContext, url: string) => Promise<AudioBuffer | null>

export const fetchSound: LoadSound = async (context, url) => {
  if (typeof fetch !== 'function' || typeof context.decodeAudioData !== 'function') return null
  try {
    const response = await fetch(url)
    return response.ok ? await context.decodeAudioData(await response.arrayBuffer()) : null
  } catch {
    return null
  }
}

/** The recorded sounds of each audio context: each loaded once, one that failed asked again. */
interface RecordedSounds {
  /** Loads for `context` what is not in yet; resolves when each is in or has failed this time. */
  ready(context: AudioContext): Promise<void>
  /** A loaded sound's buffer; null while it loads or where it failed. */
  buffer(context: AudioContext, sound: RecordedSound): AudioBuffer | null
}

export function createRecordedSounds(load: LoadSound = fetchSound): RecordedSounds {
  interface Kept {
    readonly buffers: Map<RecordedSound, AudioBuffer>
    loading: Promise<void> | null
  }
  const kept = new WeakMap<AudioContext, Kept>()
  const of = (context: AudioContext): Kept => {
    const held = kept.get(context)
    if (held) return held
    const made: Kept = { buffers: new Map(), loading: null }
    kept.set(context, made)
    return made
  }
  /** Loads the sounds not yet in; one that cannot be had now is asked again the next time. */
  const ready = (context: AudioContext): Promise<void> => {
    const held = of(context)
    if (held.loading) return held.loading
    const missing = Object.keys(RECORDED_SOUNDS)
      .filter(isRecordedSound)
      .filter((sound) => !held.buffers.has(sound))
    if (missing.length === 0) return Promise.resolve()
    held.loading = Promise.all(
      missing.map(async (sound) => {
        const buffer = await load(context, RECORDED_SOUNDS[sound])
        if (buffer) held.buffers.set(sound, buffer)
      }),
    ).then(() => {
      held.loading = null
    })
    return held.loading
  }
  return {
    ready,
    buffer: (context, sound) => kept.get(context)?.buffers.get(sound) ?? null,
  }
}
