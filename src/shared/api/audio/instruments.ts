import type { Midi } from '@/shared/lib/music'
import type { KitPiece, PitchedInstrument, Sound } from '@/shared/lib/schedule'
import type { SampleLoader } from './sample-loader'
import { createSampler, pianoRelease, type Sampler, type SamplerVoice } from './sampler'

/** Each recorded set's folder under `public/samples/` (R29 SND). */
export const SAMPLE_SETS = {
  piano: 'piano',
  pianoLight: 'piano-light',
  bassElectric: 'bass-electric',
  bassUpright: 'bass-upright',
  drums: 'drums',
} as const

/** How loud each set plays against the grand: each set's files are levelled to its own loudest. */
const LEVEL = { piano: 1, pianoLight: 0.5, bass: 0.8, drums: 0.7 } as const

/** The bass's damper: a hand muting the string. */
const BASS_RELEASE = 0.12

/** The grand's roots decoded as the app's audio opens: its mp layer, C2 to C7, middle C first. */
const WARM_RANGE = { low: 36, high: 96 } as const
const MIDDLE_C = 60

/**
 * The recorded instruments of one audio context (R29 SND, A27), over one loader: the grand, the light
 * piano that plays while the grand's notes load (and offline before its download), the two basses and
 * the kit. Each `play` is null where its set has nothing loaded for it: the caller plays its stand-in.
 */
export interface Instruments {
  /**
   * A piano key from the grand, else from the light piano; `through` a node of its own on its way out
   * (the soft pedal's darker tone), else straight out.
   */
  piano(
    key: Midi,
    velocity: number,
    at: number,
    gain: number,
    through?: AudioNode,
  ): SamplerVoice | null
  /** A bass note from its set. */
  bass(
    instrument: Exclude<PitchedInstrument, 'piano'>,
    key: Midi,
    velocity: number,
    at: number,
    gain: number,
  ): SamplerVoice | null
  /** A stroke on the kit. */
  drum(piece: KitPiece, velocity: number, at: number, gain: number): SamplerVoice | null
  /** Starts loading what `sounds` will strike, so it is in by the time they sound. */
  need(sounds: readonly Sound[]): void
  /**
   * Loads what the first notes need: the light piano whole, then the grand's mp layer from middle C
   * outwards; then fetches the grand's other files into the cache, one at a time, decoding none.
   * Once: asked again, the same.
   */
  warm(): Promise<void>
}

export function createInstruments(
  context: BaseAudioContext,
  loader: SampleLoader,
  destination: AudioNode,
): Instruments {
  const grand = createSampler(context, loader, SAMPLE_SETS.piano, { release: pianoRelease })
  const light = createSampler(context, loader, SAMPLE_SETS.pianoLight, { release: pianoRelease })
  const basses: Record<Exclude<PitchedInstrument, 'piano'>, Sampler | undefined> = {
    bassElectric: undefined,
    bassUpright: undefined,
  }
  let kit: Sampler | undefined
  let warmed: Promise<void> | undefined
  // A band's sets are read only when a band first plays.
  const bassOf = (instrument: Exclude<PitchedInstrument, 'piano'>) =>
    (basses[instrument] ??= createSampler(context, loader, SAMPLE_SETS[instrument], {
      release: () => BASS_RELEASE,
    }))
  const kitOf = () =>
    (kit ??= createSampler(context, loader, SAMPLE_SETS.drums, {
      oneVoiceAKey: false,
      chokes: { hatClosed: ['hatOpen'], hatPedal: ['hatOpen'] },
    }))

  return {
    piano: (key, velocity, at, gain, through = destination) =>
      grand.start(key, velocity, at, gain * LEVEL.piano, through) ??
      light.start(key, velocity, at, gain * LEVEL.pianoLight, through),
    bass: (instrument, key, velocity, at, gain) =>
      bassOf(instrument).start(key, velocity, at, gain * LEVEL.bass, destination),
    drum: (piece, velocity, at, gain) =>
      kitOf().start(piece, velocity, at, gain * LEVEL.drums, destination),
    need(sounds) {
      for (const sound of sounds) {
        if (sound.kind === 'drum') void kitOf().need(sound.piece, sound.velocity)
        if (sound.kind !== 'note') continue
        const instrument = sound.instrument ?? 'piano'
        void (instrument === 'piano' ? grand : bassOf(instrument)).need(sound.midi, sound.velocity)
      }
    },
    warm: () => (warmed ??= warmUp()),
  }

  async function warmUp() {
    const manifest = await loader.manifest(SAMPLE_SETS.pianoLight)
    await Promise.all(
      (manifest?.samples ?? []).map((sample) =>
        loader.load(loader.urlOf(SAMPLE_SETS.pianoLight, sample.file)),
      ),
    )
    const grandSet = await loader.manifest(SAMPLE_SETS.piano)
    if (!grandSet) return
    const fromMiddle = grandSet.samples.toSorted(
      (a, b) => Math.abs((a.midi ?? 0) - MIDDLE_C) - Math.abs((b.midi ?? 0) - MIDDLE_C),
    )
    for (const sample of fromMiddle) {
      const midi = sample.midi ?? 0
      if (sample.layer === 'mp' && midi >= WARM_RANGE.low && midi <= WARM_RANGE.high)
        await loader.load(loader.urlOf(SAMPLE_SETS.piano, sample.file))
    }
    await loader.prefetch(fromMiddle.map((sample) => loader.urlOf(SAMPLE_SETS.piano, sample.file)))
  }
}
