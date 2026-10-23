import { describe, expect, it } from 'vitest'
import { keepsLoop } from './keeps-loop'

describe('keepsLoop', () => {
  const loop = { first: 2, last: 4 }

  it('keeps the loop for a note clicked inside it, its first and last bars too', () => {
    expect([2, 3, 4].map((bar) => keepsLoop(loop, bar))).toEqual([true, true, true])
  })

  it('lets it go for a note outside it, or one in no bar', () => {
    expect([1, 5, undefined].map((bar) => keepsLoop(loop, bar))).toEqual([false, false, false])
  })
})
