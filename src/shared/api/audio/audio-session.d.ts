/**
 * The W3C Audio Session API (Safari 16.4 and later): how the page's audio sits with the rest of the
 * device's, the microphone's recording among it. Missing where the browser has none.
 */
type AudioSessionType =
  'auto' | 'playback' | 'transient' | 'transient-solo' | 'ambient' | 'play-and-record'

interface AudioSession {
  type: AudioSessionType
}

interface Navigator {
  readonly audioSession?: AudioSession
}
