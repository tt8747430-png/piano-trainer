import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import type { BarRange } from '@/features/practice'
import { stubBox, stubScrolling } from '@/shared/test/layout'
import { HOLD_MS } from '@/shared/ui/score'
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
      title="Morning"
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
      shown: {
        layout: 'scroll',
        chordNames: false,
        lyrics: true,
        melodyStaff: true,
        hidden: ['bass'],
      },
    })
    expect(await screen.findByRole('button', { name: 'Bar 2: G' })).toHaveAttribute(
      'aria-current',
      'step',
    )
    expect(screen.queryByText('G', { selector: 'span' })).not.toBeInTheDocument()
  })

  it.each(['horizontal', 'scroll', 'pages'] as const)(
    'prints the title at the sheet’s head as the page’s heading, %s (ADR 0094)',
    async (layout) => {
      renderSheet({
        shown: { layout, chordNames: true, lyrics: true, melodyStaff: false, hidden: [] },
      })
      const sheet = await screen.findByRole('region', { name: 'Sheet music' })
      expect(within(sheet).getByRole('heading', { level: 1, name: 'Morning' })).toHaveAttribute(
        'data-slot',
        'sheet-title',
      )
      expect(document.title).toBe('Morning · Piano Trainer')
    },
  )

  it('names each bar by its chords, the cursor’s marked', async () => {
    renderSheet({ current: 5 })
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 1: C' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('button', { name: 'Bar 2: G' })).toHaveAttribute('aria-current', 'step')
  })

  it('jumps to a bar’s first beat group from the keyboard, and nowhere at a tap on empty staff (ADR 0088)', async () => {
    const user = userEvent.setup()
    const { onJump, onLoopChange } = renderSheet({ loop: { first: 0, last: 1 } })
    const second = await screen.findByRole('button', { name: 'Bar 2: G' })
    second.focus()
    await user.keyboard('{Enter}')
    expect(onJump).toHaveBeenLastCalledWith(4)
    vi.spyOn(second, 'offsetWidth', 'get').mockReturnValue(400)
    stubBox(second, { left: 0, width: 400, height: 200 })
    // Far over the staff, past every head: nothing is chosen, the loop stays.
    fireEvent.click(second, { detail: 1, clientX: 399, clientY: 1 })
    expect(onJump).toHaveBeenCalledTimes(1)
    expect(onLoopChange).not.toHaveBeenCalled()
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

  it('chooses exactly the bars from the cursor’s to the one Shift-clicked as the loop, jumping nowhere', async () => {
    const { onLoopChange, onJump } = renderSheet({ current: 0 })
    const second = await screen.findByRole('button', { name: 'Bar 2: G' })
    fireEvent.click(second, { detail: 1, shiftKey: true })
    expect(onLoopChange).toHaveBeenLastCalledWith({ first: 0, last: 1 })
    expect(onJump).not.toHaveBeenCalled()
  })

  it('chooses bars as the loop by a finger held on one and dragged to another', async () => {
    const { onLoopChange } = renderSheet({ current: 0 })
    const first = await screen.findByRole('button', { name: 'Bar 1: C' })
    const second = screen.getByRole('button', { name: 'Bar 2: G' })
    vi.useFakeTimers()
    try {
      const touch = { pointerId: 1, pointerType: 'touch', clientX: 10, clientY: 10 }
      fireEvent.pointerDown(first, touch)
      act(() => vi.advanceTimersByTime(HOLD_MS))
      // Held on empty staff: nothing chosen yet; dragged on, the bars from the cursor's.
      expect(onLoopChange).not.toHaveBeenCalled()
      document.elementFromPoint = () => second
      fireEvent.pointerMove(first, { ...touch, clientX: 300 })
      expect(onLoopChange).toHaveBeenLastCalledWith({ first: 0, last: 1 })
      fireEvent.pointerUp(first, touch)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(['horizontal', 'scroll', 'pages'] as const)(
    'draws the cursor and the loop as the editor draws its caret and bars chosen, %s',
    async (layout) => {
      renderSheet({
        current: 5,
        loop: { first: 1, last: 1 },
        shown: { layout, chordNames: true, lyrics: true, melodyStaff: false, hidden: [] },
      })
      await screen.findByRole('button', { name: 'Bar 2: G' })
      // The loop as one box; the cursor stands aside while it stands chosen (ADR 0088).
      expect(document.querySelectorAll('[data-mark="range"]')).toHaveLength(1)
      expect(document.querySelector('[data-mark="note"]')).toBeNull()
      // The loop's notes in the selection's colour, as the editor's chosen notes are.
      await waitFor(() => expect(document.querySelector('.note-chosen')).toBeInTheDocument())
    },
  )

  it('marks no cursor while the loop stands chosen and nothing moves, then where it is stepped to (ADR 0088)', async () => {
    const sheet = (current: number) => (
      <SheetMusic
        title="Morning"
        performance={TWO_BARS}
        headings={['Verse']}
        current={current}
        loop={{ first: 1, last: 1 }}
        fingers={false}
        names={false}
        positions={false}
        muted={undefined}
        onJump={vi.fn()}
        onLoopChange={vi.fn()}
      />
    )
    const { rerender } = render(sheet(4))
    await screen.findByRole('button', { name: 'Bar 2: G' })
    expect(document.querySelectorAll('[data-mark="range"]')).toHaveLength(1)
    expect(document.querySelector('[data-mark="note"]')).toBeNull()
    rerender(sheet(5))
    expect(document.querySelectorAll('[data-mark="note"]')).toHaveLength(1)
  })

  it('scrolls to keep the cursor in sight', async () => {
    const { scrolls } = stubScrolling({ clientWidth: 100, scrollWidth: 2000 })
    const { rerender, onJump, onLoopChange } = renderSheet({ current: 0 })
    await screen.findByRole('button', { name: 'Bar 2: G' })
    act(() =>
      rerender(
        <SheetMusic
          title="Morning"
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
