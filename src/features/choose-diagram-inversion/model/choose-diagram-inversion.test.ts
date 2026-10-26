// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createDiagramInversionsStore } from '@/entities/diagram-inversion'
import { createMemoryStorage } from '@/shared/lib'
import { chooseDiagramInversion } from './choose-diagram-inversion'

const store = () =>
  createDiagramInversionsStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })

describe('chooseDiagramInversion', () => {
  it('keeps the inversion chosen for a chord of a piece', () => {
    const inversions = store()
    // D minor folds F3 A3 D4, its 1st inversion; set to A–D–F, its 2nd.
    chooseDiagramInversion(inversions, 'bz5', 'Dm', { chosen: 2, folded: 1 })
    expect(inversions.getState().pieces).toEqual({ bz5: { Dm: 2 } })
  })

  it('forgets the choice where the fold’s inversion is chosen again', () => {
    const inversions = store()
    chooseDiagramInversion(inversions, 'bz5', 'Dm', { chosen: 2, folded: 1 })
    chooseDiagramInversion(inversions, 'bz5', 'Dm', { chosen: 1, folded: 1 })
    expect(inversions.getState().pieces).toEqual({})
  })

  it('writes nothing where the fold’s is chosen and none was kept', () => {
    const inversions = store()
    const before = inversions.getState()
    chooseDiagramInversion(inversions, 'bz5', 'Dm', { chosen: 1, folded: 1 })
    expect(inversions.getState()).toBe(before)
  })
})
