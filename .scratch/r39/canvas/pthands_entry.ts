import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { createStage } from '/home/user/piano-trainer/src/widgets/piano-hands/ui/scene/stage'
import { setPitch } from '/home/user/piano-trainer/src/widgets/piano-hands/model/camera'

// A board may not fetch: the hand models are inlined as data URLs, so they are decoded here and parsed, never loaded
// over the network (a page's connect-src can refuse even `data:`).
const load = GLTFLoader.prototype.load
GLTFLoader.prototype.load = function (url, onLoad, onProgress, onError) {
  if (typeof url === 'string' && url.startsWith('data:')) {
    try {
      const bin = atob(url.slice(url.indexOf(',') + 1))
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
      this.parse(bytes.buffer, '', onLoad, onError)
    } catch (error) {
      onError?.(error as ErrorEvent)
    }
    return
  }
  load.call(this, url, onLoad, onProgress, onError)
}
;(window as unknown as { PTHands: unknown }).PTHands = { createStage, setPitch }
