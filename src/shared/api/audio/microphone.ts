/**
 * The microphone, read a stretch at a time (R29 B8, the Tuner): its rate, the latest samples, and a
 * way to let it go.
 */
export interface Microphone {
  readonly sampleRate: number
  /** Fills `into` with the latest samples heard. */
  read(into: Float32Array<ArrayBuffer>): void
  close(): void
}

/** Opens the microphone: what the browser grants, or a refusal (no microphone, or not allowed). */
export type OpenMicrophone = () => Promise<Microphone>

/**
 * The audio session while a microphone listens, and after: recording, then the browser's own choice
 * again once none does. Left recording (iOS), the app's sound would go on at the earpiece's quiet
 * level after the Tuner closes.
 */
let listening = 0
const listen = () => {
  listening += 1
  if (navigator.audioSession) navigator.audioSession.type = 'play-and-record'
}
/** A microphone let go: the session goes back once none listens. */
const stopListening = () => {
  listening -= 1
  if (listening === 0 && navigator.audioSession) navigator.audioSession.type = 'auto'
}

/** The browser's microphone through Web Audio's analyser; its echo and noise cancelling off. */
export const openBrowserMicrophone: OpenMicrophone = async () => {
  listen()
  const stream = await navigator.mediaDevices
    .getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    })
    .catch((refused: unknown) => {
      stopListening()
      throw refused
    })
  const context = new AudioContext()
  const source = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()
  analyser.fftSize = 8192
  source.connect(analyser)
  // Closed once: a second close would let the session go while another microphone listens.
  let closed = false
  return {
    sampleRate: context.sampleRate,
    read: (into) => analyser.getFloatTimeDomainData(into),
    close: () => {
      if (closed) return
      closed = true
      source.disconnect()
      for (const track of stream.getTracks()) track.stop()
      void context.close()
      stopListening()
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
