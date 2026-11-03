/**
 * The Metronome's and the drum beat's recorded sounds (A39): a woodblock, a kick, a snare and a closed
 * hi-hat from the Versilian Community Sample Library (CC0, VCSL), trimmed and levelled to 1 dB under
 * full scale, as WAV so they start on their sample with no encoder's delay. They are in the app's
 * offline cache; each is fetched and decoded once for an audio context.
 */
export const RECORDED_SOUNDS = {
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

/** The recorded sounds of each audio context: loading once, then each buffer, or none had. */
export interface RecordedSounds {
  /** Starts loading for `context` (once); resolves when every sound is in or has failed. */
  ready(context: AudioContext): Promise<void>
  /** A loaded sound's buffer; null while it loads or where it failed. */
  buffer(context: AudioContext, sound: RecordedSound): AudioBuffer | null
}

export function createRecordedSounds(load: LoadSound = fetchSound): RecordedSounds {
  const kept = new WeakMap<
    AudioContext,
    { readonly buffers: Map<RecordedSound, AudioBuffer>; readonly loaded: Promise<void> }
  >()
  const of = (context: AudioContext) => {
    const held = kept.get(context)
    if (held) return held
    const buffers = new Map<RecordedSound, AudioBuffer>()
    const loaded = Promise.all(
      (Object.entries(RECORDED_SOUNDS) as [RecordedSound, string][]).map(async ([sound, url]) => {
        const buffer = await load(context, url)
        if (buffer) buffers.set(sound, buffer)
      }),
    ).then(() => undefined)
    const made = { buffers, loaded }
    kept.set(context, made)
    return made
  }
  return {
    ready: (context) => of(context).loaded,
    buffer: (context, sound) => kept.get(context)?.buffers.get(sound) ?? null,
  }
}
