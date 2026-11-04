/**
 * The microphone, read a stretch at a time (R29 B8, the Tuner): its rate, the latest samples, and a
 * way to let it go.
 */
export interface Microphone {
  readonly sampleRate: number
  /** Fills `into` with the latest samples heard. */
  read(into: Float32Array): void
  close(): void
}

/** Opens the microphone: what the browser grants, or a refusal (no microphone, or not allowed). */
export type OpenMicrophone = () => Promise<Microphone>

/** The browser's microphone through Web Audio's analyser; its echo and noise cancelling off. */
export const openBrowserMicrophone: OpenMicrophone = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  })
  const context = new AudioContext()
  const source = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()
  analyser.fftSize = 8192
  source.connect(analyser)
  return {
    sampleRate: context.sampleRate,
    read: (into) => analyser.getFloatTimeDomainData(into as Float32Array<ArrayBuffer>),
    close: () => {
      source.disconnect()
      for (const track of stream.getTracks()) track.stop()
      void context.close()
    },
  }
}

/** A microphone in a test: it hears `samples`, over and over. */
export function createFakeMicrophone(samples: Float32Array, sampleRate = 44_100): Microphone {
  return {
    sampleRate,
    read: (into) => into.set(samples.subarray(0, into.length)),
    close: () => {},
  }
}
