import { PerspectiveCamera, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { followed, frame, PITCH, VIEW, type Framing, type ViewSize } from './camera'
import { KEY, keyX } from './keys'

/** The camera the scene builds from a framing, and where a point lands in its view (−1 to 1 each way). */
function shot(framing: Framing, size: ViewSize) {
  const camera = new PerspectiveCamera((VIEW.fov * 180) / Math.PI, size.width / size.height)
  camera.position.set(framing.x, framing.y, framing.z)
  camera.rotation.x = -PITCH.seat
  camera.updateMatrixWorld()
  return (x: number, y: number, z: number) => new Vector3(x, y, z).project(camera)
}

const LAPTOP: ViewSize = { width: 1280, height: 300 }
const PHONE: ViewSize = { width: 390, height: 220 }

describe('frame (R36, the camera over the keys)', () => {
  it('shows the keys from their back end, the bottom edge across the back of the hand', () => {
    const framing = frame(LAPTOP, { low: midi(60), high: midi(72) }, 0)
    const at = shot(framing, LAPTOP)
    expect(at(0, VIEW.top.y, VIEW.top.z).y).toBeCloseTo(1, 6)
    expect(at(0, VIEW.bottom.y, VIEW.bottom.z).y).toBeCloseTo(-1, 6)
    // The keys' front edge, where the fingers play, a little below the middle.
    expect(at(0, 0, 0).y).toBeLessThan(0)
    expect(at(0, 0, 0).y).toBeGreaterThan(-0.6)
  })

  it('stands over the middle of music it shows whole, and does not move', () => {
    const framing = frame(LAPTOP, { low: midi(48), high: midi(72) }, 0)
    expect(framing.follow).toBeNull()
    expect(framing.x).toBeCloseTo((keyX(midi(48)) + keyX(midi(72))) / 2, 9)
    expect(followed(framing, 1)).toBe(framing.x)
  })

  it('stands back for a wider range, keeping its outer keys and the hands’ room in view', () => {
    const near = frame(LAPTOP, { low: midi(48), high: midi(72) }, 0)
    const range = { low: midi(29), high: midi(96) }
    const framing = frame(LAPTOP, range, 0)
    expect(framing.y).toBeGreaterThan(near.y)
    expect(framing.follow).toBeNull()
    const at = shot(framing, LAPTOP)
    expect(at(keyX(range.low) - KEY.width / 2, 0, 0).x).toBeGreaterThanOrEqual(-1 - 1e-6)
    expect(at(keyX(range.high) + KEY.width / 2, 0, 0).x).toBeLessThanOrEqual(1 + 1e-6)
    // Still held at the bottom: only the top edge goes further back.
    expect(at(framing.x, VIEW.bottom.y, VIEW.bottom.z).y).toBeCloseTo(-1, 6)
  })

  it('follows the hands where the whole range would shrink the keys past the smallest', () => {
    const range = { low: midi(21), high: midi(108) }
    const framing = frame(PHONE, range, 0)
    expect(framing.follow).not.toBeNull()
    const at = shot(framing, PHONE)
    const key = (at(KEY.width, 0, 0).x - at(0, 0, 0).x) * (PHONE.width / 2)
    expect(key).toBeGreaterThanOrEqual(VIEW.minKey - 0.01)
    // Over the hands, never past the range's ends.
    expect(followed(framing, keyX(midi(60)))).toBeCloseTo(keyX(midi(60)), 9)
    // At the lowest key the camera stops with the range's end on its left edge.
    const lowest = followed(framing, keyX(midi(21)))
    const end = keyX(midi(21)) - KEY.width / 2 - VIEW.margin
    expect(at(end - lowest + framing.x, 0, 0).x).toBeCloseTo(-1, 6)
  })

  it('moves off the piano’s end where the music lies near it, as far as its outer keys allow', () => {
    const size: ViewSize = { width: 1280, height: 256 }
    const range = { low: midi(24), high: midi(71) }
    const framing = frame(size, range, 0)
    expect(framing.follow).toBeNull()
    expect(framing.x).toBeGreaterThan((keyX(range.low) + keyX(range.high)) / 2)
    const at = shot(framing, size)
    const low = at(keyX(range.low) - KEY.width / 2, 0, 0).x
    const high = at(keyX(range.high) + KEY.width / 2, 0, 0).x
    expect(low).toBeGreaterThanOrEqual(-1 - 1e-6)
    expect(high).toBeLessThanOrEqual(1 + 1e-6)
    // A0's outer edge past the view's widest part, at the keys' back end, or the music's lowest key
    // on the view's left edge, as far as the camera may go.
    const end = at(keyX(midi(21)) - KEY.width / 2, VIEW.top.y, VIEW.top.z).x
    expect(end <= -1 + 1e-6 || Math.abs(low + 1) < 1e-6).toBe(true)
  })

  it('keeps a view far from the ends where the music is', () => {
    const range = { low: midi(55), high: midi(79) }
    const framing = frame(LAPTOP, range, 0)
    const span = { from: keyX(range.low) - KEY.width * 1.5, to: keyX(range.high) + KEY.width * 1.5 }
    expect(framing.x).toBeCloseTo((span.from + span.to) / 2, 9)
  })

  it('stands over the piano’s middle where the view is wider than the whole keyboard', () => {
    const framing = frame({ width: 2400, height: 150 }, null, 0)
    const middle = (keyX(midi(21)) + keyX(midi(108))) / 2
    expect(framing.x).toBeCloseTo(middle, 9)
  })

  it('draws the keys smaller, down to the least, to keep in view two hands playing far apart', () => {
    const range = { low: midi(24), high: midi(83) }
    const key = (framing: Framing) => {
      const at = shot(framing, PHONE)
      return (at(KEY.width, 0, 0).x - at(0, 0, 0).x) * (PHONE.width / 2)
    }
    expect(key(frame(PHONE, range, 0))).toBeCloseTo(VIEW.minKey, 6)
    // Hands two octaves apart: their room fills the width.
    const apart = 14 * KEY.width
    const wide = frame(PHONE, range, apart)
    expect(key(wide)).toBeCloseTo((PHONE.width * KEY.width) / (apart + 2 * VIEW.hand), 6)
    expect(key(wide)).toBeLessThan(VIEW.minKey)
    // Never smaller than the least, however far apart.
    expect(key(frame(PHONE, range, 1))).toBeCloseTo(VIEW.leastKey, 6)
  })

  it('shows the octaves either side of middle C without music', () => {
    const framing = frame(LAPTOP, null, 0)
    expect(framing.x).toBeCloseTo(0, 9)
    expect(framing.follow).toBeNull()
  })
})
