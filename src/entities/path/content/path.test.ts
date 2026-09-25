import { describe, expect, it } from 'vitest'
import { COLLECTIONS, PIECES, entryById, isPiece } from '@/entities/piece'
import { CHORD_FAMILIES, SCALE_KINDS } from '@/shared/lib/music'
import { pathSteps } from '../model/selectors'
import { LEVELS } from '../model/types'
import { PATH } from './path'

const steps = pathSteps()

describe('the path', () => {
  it('names only pieces that exist, never a listing', () => {
    for (const { step } of steps) {
      if (step.kind !== 'piece') continue
      const entry = entryById(step.pieceId)
      expect(entry, step.pieceId).toBeDefined()
      expect(entry && isPiece(entry), step.pieceId).toBe(true)
    }
  })

  it('holds every piece exactly once', () => {
    const pieceIds = steps.flatMap(({ step }) => (step.kind === 'piece' ? [step.pieceId] : []))
    expect([...pieceIds].sort()).toEqual(PIECES.map((piece) => piece.id).sort())
    const listings = COLLECTIONS.flatMap((c) => c.entries).filter((entry) => !isPiece(entry))
    for (const listing of listings) expect(pieceIds).not.toContain(listing.id)
  })

  it('has a step for every chord family and scale kind', () => {
    expect(steps.flatMap(({ step }) => (step.kind === 'chords' ? [step.family] : []))).toEqual([
      ...CHORD_FAMILIES,
    ])
    expect(steps.flatMap(({ step }) => (step.kind === 'scale' ? [step.scale] : []))).toEqual([
      ...SCALE_KINDS,
    ])
  })

  it('gives each step one id', () => {
    const ids = steps.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // ADR 0005: levels live on the path. Phase 4 levels the path for real and turns this on.
  it.skip('puts at least one step on every level (ADR 0005, from Phase 4)', () => {
    for (const level of LEVELS) expect(PATH[level].length, `level ${level}`).toBeGreaterThan(0)
  })
})
