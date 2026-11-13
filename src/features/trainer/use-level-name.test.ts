// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TRAINER_IDS } from './trainer-view'
import { LADDERS, ladderOf } from './trainers'
import { useLevelName } from './use-level-name'

describe('useLevelName', () => {
  it('names every level of every trainer, none by its id', () => {
    const { result } = renderHook(() => useLevelName())
    for (const id of TRAINER_IDS) {
      const ladder = ladderOf(id)
      if (!ladder) continue
      for (const level of LADDERS[ladder]) expect(result.current(id, level)).not.toBe(level)
    }
  })
})
