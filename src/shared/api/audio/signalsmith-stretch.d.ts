/** Signalsmith Stretch for Web Audio (signalsmith-stretch 1.3, MIT), which ships no types of its own. */
declare module 'signalsmith-stretch' {
  /** A change scheduled at `output` on the audio clock, as its README sets out. */
  export interface StretchChange {
    readonly output?: number
    readonly active?: boolean
    readonly input?: number
    readonly rate?: number
    readonly semitones?: number
  }

  /** The node: an AudioNode with its own scheduling, fed whole buffers, one array a channel. */
  export interface StretchNode extends AudioNode {
    schedule(change: StretchChange): Promise<void>
    addBuffers(channels: readonly Float32Array[]): Promise<number>
    configure(options: {
      readonly blockMs: null
      readonly preset: 'default' | 'cheaper'
    }): Promise<void>
  }

  export default function SignalsmithStretch(
    context: BaseAudioContext,
    options?: AudioWorkletNodeOptions,
  ): Promise<StretchNode>
}
