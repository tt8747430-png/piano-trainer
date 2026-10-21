import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import type { BarRange } from '@/features/practice'
import { stubBox, stubScrolling } from '@/shared/test/layout'
import { SheetMusic } from './SheetMusic'

function renderSheet({
  current = 0,
  loop = null,
  shown,
}: {
  current?: number
  loop?: BarRange | null
  shown?: ComponentProps<typeof SheetMusic>['view']
} = {}) {
  const onJump = vi.fn()
  const onLoopChange = vi.fn()
  const view = render(
    <SheetMusic
      performance={TWO_BARS}
      headings={['Verse']}
      current={current}
      loop={loop}
      fingers={false}
      names={false}
      positions={false}
      muted={undefined}
      onJump={onJump}
      onLoopChange={onLoopChange}
      {...(shown ? { view: shown } : {})}
    />,
  )
  return { ...view, onJump, onLoopChange }
}

describe('SheetMusic', () => {
  it('lays the score out in the chart’s lines, each with its bars, the chord names hidden where asked', async () => {
    renderSheet({
      current: 5,
      shown: { layout: 'scroll', chordNames: false, melodyStaff: true, hidden: ['bass'] },
    })
    expect(await screen.findByRole('button', { name: 'Bar 2: G' })).toHaveAttribute(
      'aria-current',
      'step',
    )
    expect(screen.queryByText('G', { selector: 'span' })).not.toBeInTheDocument()
  })

  it('names each bar by its chords, the cursor’s marked', async () => {
    renderSheet({ current: 5 })
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 1: C' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('button', { name: 'Bar 2: G' })).toHaveAttribute('aria-current', 'step')
  })

  it('jumps to a bar’s first beat group from the keyboard, and to the nearest one under a tap', async () => {
    const user = userEvent.setup()
    const { onJump } = renderSheet()
    const second = await screen.findByRole('button', { name: 'Bar 2: G' })
    second.focus()
    await user.keyboard('{Enter}')
    expect(onJump).toHaveBeenLastCalledWith(4)
    stubBox(second, { left: 0, width: 400, height: 200 })
    fireEvent.click(second, { detail: 1, clientX: 9999 })
    expect(onJump).toHaveBeenLastCalledWith(7)
  })

  it('moves the loop’s ends with the arrow keys, never past each other', async () => {
    const user = userEvent.setup()
    const { onLoopChange } = renderSheet({ loop: { first: 0, last: 0 } })
    const end = await screen.findByRole('slider', { name: 'Loop end' })
    expect(end).toHaveAttribute('aria-valuetext', 'Bar 1')
    end.focus()
    await user.keyboard('{ArrowRight}')
    expect(onLoopChange).toHaveBeenLastCalledWith({ first: 0, last: 1 })
    screen.getByRole('slider', { name: 'Loop start' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onLoopChange).toHaveBeenCalledTimes(1)
  })

  it('scrolls to keep the cursor in sight', async () => {
    const { scrolls } = stubScrolling({ clientWidth: 100, scrollWidth: 2000 })
    const { rerender, onJump, onLoopChange } = renderSheet({ current: 0 })
    await screen.findByRole('button', { name: 'Bar 2: G' })
    act(() =>
      rerender(
        <SheetMusic
          performance={TWO_BARS}
          headings={['Verse']}
          current={7}
          loop={null}
          fingers={false}
          names={false}
          positions={false}
          muted={undefined}
          onJump={onJump}
          onLoopChange={onLoopChange}
        />,
      ),
    )
    expect(scrolls.at(-1)).toBeGreaterThan(0)
  })
})
