import { describe, expect, it } from 'vitest'
import {
  armedSide,
  clampSwipeOffset,
  dragFrame,
  resolveSwipeRelease,
  type SwipeGeometry,
  wasCanceled,
} from './gestures'

const geo: SwipeGeometry = {
  hasLeading: true,
  hasTrailing: true,
  leadingWidth: 60,
  trailingWidth: 120,
  leadingCommit: 124,
  trailingCommit: 184,
}

const trailingOnly: SwipeGeometry = { ...geo, hasLeading: false }

describe('clampSwipeOffset', () => {
  it('passes travel through up to each commit point', () => {
    expect(clampSwipeOffset(80, geo)).toBe(80)
    expect(clampSwipeOffset(-150, geo)).toBe(-150)
  })

  it('rubber-bands past the commit point (0.35 resistance)', () => {
    expect(clampSwipeOffset(224, geo)).toBeCloseTo(124 + 100 * 0.35)
    expect(clampSwipeOffset(-284, geo)).toBeCloseTo(-(184 + 100 * 0.35))
  })

  it('softly damps a drag against an absent tray (0.12)', () => {
    expect(clampSwipeOffset(100, trailingOnly)).toBeCloseTo(12)
  })
})

describe('armedSide', () => {
  it('arms an edge only once its commit point is cleared', () => {
    expect(armedSide(-183, geo)).toBeNull()
    expect(armedSide(-184, geo)).toBe('trailing')
    expect(armedSide(124, geo)).toBe('leading')
    expect(armedSide(123, geo)).toBeNull()
  })

  it('never arms a side that has no tray', () => {
    expect(armedSide(200, trailingOnly)).toBeNull()
  })
})

describe('resolveSwipeRelease', () => {
  it('commits the edge action past the commit point', () => {
    expect(resolveSwipeRelease(-184, geo)).toEqual({ kind: 'commit-trailing' })
    expect(resolveSwipeRelease(124, geo)).toEqual({ kind: 'commit-leading' })
  })

  it('opens the tray past half its reveal width', () => {
    expect(resolveSwipeRelease(-70, geo)).toEqual({ kind: 'open-trailing', settleTo: -120 })
    expect(resolveSwipeRelease(40, geo)).toEqual({ kind: 'open-leading', settleTo: 60 })
  })

  it('snaps closed below the open threshold', () => {
    expect(resolveSwipeRelease(-30, geo)).toEqual({ kind: 'close', settleTo: 0 })
    expect(resolveSwipeRelease(20, geo)).toEqual({ kind: 'close', settleTo: 0 })
  })
})

describe('wasCanceled', () => {
  it('tells a gesture the platform took away from one the learner released', () => {
    expect(wasCanceled(new Event('pointercancel'))).toBe(true)
    expect(wasCanceled(new Event('touchcancel'))).toBe(true)
    expect(wasCanceled(new Event('pointerup'))).toBe(false)
    expect(wasCanceled(undefined)).toBe(false)
  })
})

describe('dragFrame', () => {
  const released = new Event('pointerup')

  it('calls a frame that has not ended a move', () => {
    expect(dragFrame({ tap: false, last: false, event: released })).toBe('moving')
  })

  it('calls a lift a release and a cancel its own thing', () => {
    expect(dragFrame({ tap: false, last: true, event: released })).toBe('released')
    expect(dragFrame({ tap: false, last: true, event: new Event('pointercancel') })).toBe(
      'canceled',
    )
  })

  it('calls a tap a tap however it ended', () => {
    expect(dragFrame({ tap: true, last: true, event: new Event('pointercancel') })).toBe('tap')
  })
})
