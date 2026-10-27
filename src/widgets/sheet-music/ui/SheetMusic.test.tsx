import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TWO_BARS, TWO_BARS_UNDER_A_STAFF } from '@/features/practice/testing/performances'
import type { BarRange } from '@/features/practice'
import { arrange, parseFigure } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { stubBox, stubScrolling } from '@/shared/test/layout'
import { HOLD_MS } from '@/shared/ui/score'
import { SheetMusic } from './SheetMusic'

function renderSheet({
  current = 0,
  loop = null,
  shown,
  performance = TWO_BARS,
  staffNames,
}: {
  current?: number
  loop?: BarRange | null
  shown?: ComponentProps<typeof SheetMusic>['view']
  performance?: ComponentProps<typeof SheetMusic>['performance']
  staffNames?: readonly (string | undefined)[]
} = {}) {
  const onJump = vi.fn()
  const onLoopChange = vi.fn()
  const view = render(
    <SheetMusic
      title="Morning"
      performance={performance}
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
      {...(staffNames ? { staffNames } : {})}
    />,
  )
  return { ...view, onJump, onLoopChange }
}

describe('SheetMusic', () => {
  it('lays the score out in the chart’s lines, each with its bars, the chord names hidden where asked', async () => {
    renderSheet({
      current: 5,
      shown: {
        layout: 'vertical',
        chordNames: false,
        lyrics: true,
        hidden: ['bass'],
      },
    })
    expect(await screen.findByRole('button', { name: 'Bar 2: G' })).toHaveAttribute(
      'aria-current',
      'step',
    )
    expect(screen.queryByText('G', { selector: 'span' })).not.toBeInTheDocument()
  })

  it.each(['panorama', 'vertical', 'page'] as const)(
    'prints the title at the sheet’s head as the page’s heading, %s (ADR 0114)',
    async (layout) => {
      renderSheet({
        shown: { layout, chordNames: true, lyrics: true, hidden: [] },
      })
      const sheet = await screen.findByRole('region', { name: 'Sheet music' })
      expect(within(sheet).getByRole('heading', { level: 1, name: 'Morning' })).toHaveAttribute(
        'data-slot',
        'sheet-title',
      )
      expect(document.title).toBe('Morning · Piano Trainer')
    },
  )

  it.each(['panorama', 'vertical', 'page'] as const)(
    'names the piano’s staves at the first line’s head, %s (ADR 0114)',
    async (layout) => {
      renderSheet({
        shown: { layout, chordNames: true, lyrics: true, hidden: [] },
      })
      await waitFor(() =>
        expect(
          [...document.querySelectorAll('[data-slot="score"] g.label')].map((label) =>
            label.textContent?.trim(),
          ),
        ).toEqual(['Piano']),
      )
    },
  )

  it('names each single staff by its own name over the piano’s, a staff the View hides left out (ADR 0097)', async () => {
    const labels = () =>
      [...document.querySelectorAll('[data-slot="score"] g.label')]
        .map((label) => label.textContent?.trim())
        .sort()
    const shown = (hidden: StaffId[]) =>
      ({ layout: 'vertical', chordNames: true, lyrics: true, hidden }) as const
    const { unmount } = renderSheet({
      performance: TWO_BARS_UNDER_A_STAFF,
      staffNames: ['Voice'],
      shown: shown([]),
    })
    await waitFor(() => expect(labels()).toEqual(['Piano', 'Voice']))
    unmount()
    renderSheet({
      performance: TWO_BARS_UNDER_A_STAFF,
      staffNames: ['Voice'],
      shown: shown(['staff0']),
    })
    await waitFor(() => expect(labels()).toEqual(['Piano']))
  })

  it('names each bar by its chords, the cursor’s marked', async () => {
    renderSheet({ current: 5 })
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 1: C' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('button', { name: 'Bar 2: G' })).toHaveAttribute('aria-current', 'step')
  })

  it('jumps to a bar’s first beat group from the keyboard, and nowhere at a tap on empty staff (ADR 0096)', async () => {
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

  it('says the loop’s ends by the piece’s bars on a line after the first', async () => {
    const bar = (symbol: string) => ({
      chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
      beats: 4,
    })
    // C on the first line, G and F on the second.
    const twoLines = arrange(
      {
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        sections: [{ lines: [[bar('C')], [bar('G'), bar('F')]] }],
      },
      {
        tonic: note('C'),
        pattern: {
          id: 'beats',
          rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
          lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
        },
      },
    )
    renderSheet({
      performance: twoLines,
      loop: { first: 1, last: 2 },
      shown: { layout: 'vertical', chordNames: true, lyrics: true, hidden: [] },
    })
    const start = await screen.findByRole('slider', { name: 'Loop start' })
    expect(start).toHaveAttribute('aria-valuetext', 'Bar 2')
    expect(start).toHaveAttribute('aria-valuenow', '2')
    const end = screen.getByRole('slider', { name: 'Loop end' })
    expect(end).toHaveAttribute('aria-valuetext', 'Bar 3')
    expect(end).toHaveAttribute('aria-valuemax', '3')
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

  it.each(['panorama', 'vertical', 'page'] as const)(
    'draws the playhead as one line over every staff, the notes at it not chosen, %s (ADR 0096)',
    async (layout) => {
      const shown = { layout, chordNames: true, lyrics: true }
      const tall = async (hidden: readonly StaffId[]) => {
        const { unmount } = renderSheet({ current: 5, shown: { ...shown, hidden } })
        await screen.findByRole('button', { name: 'Bar 2: G' })
        const playheads = document.querySelectorAll<HTMLElement>('[data-slot="playhead"]')
        expect(playheads).toHaveLength(1)
        expect(playheads[0]).toHaveClass('w-0.5')
        expect(document.querySelector('.note-chosen')).toBeNull()
        const height = Number.parseFloat(playheads[0]?.style.height ?? '')
        unmount()
        return height
      }
      // From the treble's top line to the bass's foot: over both staves, more than twice one's.
      const one = await tall(['bass'])
      expect(await tall([])).toBeGreaterThan(2 * one)
    },
  )

  it.each(['panorama', 'vertical', 'page'] as const)(
    'draws the loop as one band over every staff, its notes coloured as the editor’s chosen, %s (ADR 0096)',
    async (layout) => {
      renderSheet({
        current: 5,
        loop: { first: 1, last: 1 },
        shown: { layout, chordNames: true, lyrics: true, hidden: [] },
      })
      await screen.findByRole('button', { name: 'Bar 2: G' })
      const bands = document.querySelectorAll<HTMLElement>('[data-mark="band"]')
      expect(bands).toHaveLength(1)
      expect(bands[0]).toHaveAttribute('data-slot', 'loop')
      // As tall as the playhead is over the same staves: every staff, never a box round notes.
      const playhead = document.querySelector<HTMLElement>('[data-slot="playhead"]')
      expect(Number.parseFloat(bands[0]?.style.height ?? '')).toBe(
        Number.parseFloat(playhead?.style.height ?? ''),
      )
      // Its grips at its ends, down its edges.
      expect(screen.getByRole('slider', { name: 'Loop start' })).toHaveStyle({
        top: bands[0]?.style.top,
      })
      await waitFor(() => expect(document.querySelector('g.note.note-chosen')).toBeInTheDocument())
    },
  )

  it('keeps the playhead out of sight while the loop stands chosen and nothing moves, then where it is stepped to (ADR 0096)', async () => {
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
    expect(document.querySelectorAll('[data-mark="band"]')).toHaveLength(1)
    expect(document.querySelector('[data-slot="playhead"]')).toHaveClass('invisible')
    rerender(sheet(5))
    expect(document.querySelector('[data-slot="playhead"]')).not.toHaveClass('invisible')
  })

  it('moves the playhead with the music’s clock while it plays, between the onsets (ADR 0096)', async () => {
    let heard = 0
    const sheet = (clock: (() => number) | null) => (
      <SheetMusic
        title="Morning"
        performance={TWO_BARS}
        headings={['Verse']}
        current={0}
        clock={clock}
        loop={null}
        playing={clock !== null}
        fingers={false}
        names={false}
        positions={false}
        muted={undefined}
        onJump={vi.fn()}
        onLoopChange={vi.fn()}
      />
    )
    const { rerender } = render(sheet(null))
    await screen.findByRole('button', { name: 'Bar 2: G' })
    const playhead = document.querySelector<HTMLElement>('[data-slot="playhead"]')
    const standing = Number.parseFloat(playhead?.style.left ?? '')
    vi.useFakeTimers()
    rerender(sheet(() => heard))
    heard = 12
    act(() => vi.advanceTimersToNextFrame())
    const moved = Number.parseFloat(playhead?.style.left ?? '')
    expect(moved).toBeGreaterThan(standing)
    heard = 18
    act(() => vi.advanceTimersToNextFrame())
    expect(Number.parseFloat(playhead?.style.left ?? '')).toBeGreaterThan(moved)
  })

  it('scrolls to keep the playhead in sight', async () => {
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
