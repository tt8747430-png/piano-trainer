import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import type { Performance } from '@/shared/lib/arrangement'
import { notate } from '@/shared/lib/notation'
import { scoreLines } from '../model/score-lines'
import { ELSEWHERE, SheetLine } from './SheetLine'

/** The performance, counting how often what lies over a line reads where the music is. */
function counted(performance: Performance) {
  const reads = { count: 0 }
  const watched = new Proxy(performance, {
    get(target, key, receiver) {
      if (key === 'beatGroups') reads.count += 1
      return Reflect.get(target, key, receiver) as unknown
    },
  })
  return { watched, reads }
}

describe('SheetLine', () => {
  it('renders again only for what it shows, not for each beat of another line (R32)', async () => {
    const { watched, reads } = counted(TWO_BARS)
    const score = notate(TWO_BARS)
    const [line] = scoreLines(score, TWO_BARS)
    if (!line) throw new Error('no line')
    const props: ComponentProps<typeof SheetLine> = {
      line,
      labels: 24,
      height: 120,
      scale: 1,
      fingers: false,
      names: false,
      muted: undefined,
      staves: score.staves,
      staffNames: undefined,
      fill: 600,
      selected: undefined,
      performance: watched,
      headings: [],
      positions: false,
      chordNames: true,
      tempos: [],
      current: ELSEWHERE,
      clock: null,
      loop: null,
      playheadShown: true,
      onJump: vi.fn(),
      onPick: vi.fn(),
      onLoopChange: vi.fn(),
      onChoose: vi.fn(),
    }
    const { rerender } = render(<SheetLine {...props} />)
    await screen.findByRole('button', { name: 'Bar 2: G' })
    const drawn = reads.count
    expect(drawn).toBeGreaterThan(0)
    // The music moves on elsewhere: the parent renders, this line does not.
    rerender(<SheetLine {...props} />)
    expect(reads.count).toBe(drawn)
    // The music reaches it: it renders, its bar marked.
    rerender(
      <SheetLine {...props} current={TWO_BARS.beatGroups.findIndex((group) => group.bar === 1)} />,
    )
    expect(reads.count).toBeGreaterThan(drawn)
    expect(screen.getByRole('button', { name: 'Bar 2: G' })).toHaveAttribute('aria-current', 'step')
  })
})
