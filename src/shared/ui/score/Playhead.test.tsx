import { act, render, screen } from '@testing-library/react'
import { useLayoutEffect, useRef, type ComponentProps, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { midi, note, type Tick, TICKS_PER_BEAT } from '@/shared/lib/music'
import { notate, type StaffId, type TimedNote } from '@/shared/lib/notation'
import { stubBox, stubScrolling } from '@/shared/test/layout'
import { RevealContext } from '../canvas-reveal'
import type { ScoreLayout } from './layout'
import { Playhead } from './Playhead'
import { playheadSpan, playheadX } from './playhead-place'
import { ScoreView } from './ScoreView'

const B = TICKS_PER_BEAT

const n = (key: number, hand: TimedNote['hand'], startTick: number, durationTicks: number) => ({
  midi: midi(key),
  spelled: note('C'),
  hand,
  startTick,
  durationTicks,
})

/** Two bars on the grand staff: quarters over the first bar's whole note, a whole note each in the second. */
const score = notate({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 4 * B, beats: 4 },
  ],
  notes: [
    n(72, 'rh', 0, B),
    n(72, 'rh', B, B),
    n(72, 'rh', 2 * B, B),
    n(72, 'rh', 3 * B, B),
    n(48, 'lh', 0, 4 * B),
    n(72, 'rh', 4 * B, 4 * B),
    n(48, 'lh', 4 * B, 4 * B),
  ],
  chords: [],
})

type PlayheadProps = Omit<ComponentProps<typeof Playhead>, 'layout'>

/** The engraving's layout, as the playhead is handed it. */
let laid: ScoreLayout | undefined

/**
 * Tells the test the layout the engraving handed the playhead, before "Engraved" can be found: a
 * passive effect may run after the test has read the layout of the test before.
 */
function Laid({ layout }: { layout: ScoreLayout }) {
  useLayoutEffect(() => {
    laid = layout
  }, [layout])
  return <p>Engraved</p>
}

function Sheet({
  props,
  staves,
  around = (sheet) => sheet,
}: {
  props: PlayheadProps
  staves?: readonly StaffId[]
  around?: (sheet: ReactNode) => ReactNode
}) {
  const scroller = useRef<HTMLDivElement>(null)
  return around(
    <div ref={scroller} data-slot="sheet-line">
      <ScoreView score={score} scale={1} fingers={false} staves={staves}>
        {(layout) => (
          <>
            <Playhead layout={layout} scroller={scroller} {...props} />
            <Laid layout={layout} />
          </>
        )}
      </ScoreView>
    </div>,
  )
}

async function renderPlayhead(props: PlayheadProps, staves?: readonly StaffId[]) {
  const view = render(<Sheet props={props} staves={staves} />)
  await screen.findByText('Engraved')
  const line = document.querySelector<HTMLElement>('[data-slot="playhead"]')
  if (!line || !laid) throw new Error('a playhead on an engraving')
  return { ...view, line, layout: laid }
}

const leftOf = (line: HTMLElement) => Number.parseFloat(line.style.left)

describe('Playhead (ADR 0096)', () => {
  it('spans every staff in sight, its height the same wherever it stands', async () => {
    const { line, layout, rerender } = await renderPlayhead({ tick: 0 })
    const span = playheadSpan(layout)
    expect(line.style.top).toBe(`${span.top}px`)
    expect(line.style.height).toBe(`${span.height}px`)
    // From the treble's top line past the bass's foot: both staves.
    expect(span.top).toBeLessThan(layout.staves.treble?.top ?? 0)
    expect(span.top + span.height).toBeGreaterThan(layout.staves.bass?.bottom ?? 0)
    rerender(<Sheet props={{ tick: 4 * B }} />)
    expect(line.style.height).toBe(`${span.height}px`)
  })

  it('spans only the staves drawn', async () => {
    const { line, layout } = await renderPlayhead({ tick: 0 }, ['treble'])
    expect(line.style.height).toBe(`${playheadSpan(layout).height}px`)
    expect(playheadSpan(layout).height).toBeLessThan(60)
  })

  it('stands just before the notes it is at, and slides there as it is moved', async () => {
    const { line, layout, rerender } = await renderPlayhead({ tick: B })
    const heads = (layout.heads ?? []).filter((head) => head.tick === B)
    expect(leftOf(line)).toBe(playheadX(layout, B))
    expect(leftOf(line)).toBeLessThan(Math.min(...heads.map((head) => head.left)))
    expect(line).toHaveClass('transition-[left]')
    rerender(<Sheet props={{ tick: 2 * B }} />)
    expect(leftOf(line)).toBe(playheadX(layout, 2 * B))
  })

  it('moves with the music’s clock every frame between the onsets, by its left', async () => {
    const { line, layout, rerender } = await renderPlayhead({ tick: 0 })
    let heard: Tick | null = 0.5 * B
    vi.useFakeTimers()
    rerender(<Sheet props={{ tick: 0, clock: () => heard }} />)
    // Half way from the first quarter to the second, and with no sliding behind the music.
    expect(leftOf(line)).toBe(playheadX(layout, 0.5 * B))
    expect(line).not.toHaveClass('transition-[left]')
    heard = 1.25 * B
    act(() => vi.advanceTimersToNextFrame())
    expect(leftOf(line)).toBe(playheadX(layout, 1.25 * B))
    expect(leftOf(line)).toBeGreaterThan(playheadX(layout, B))
    expect(line.style.transform).toBe('')
    // Past the line's end, it waits at its last barline; before its start, where it was.
    heard = (125 * B) / 6
    act(() => vi.advanceTimersToNextFrame())
    expect(leftOf(line)).toBe(playheadX(layout, 8 * B))
    heard = -(5 * B) / 12
    act(() => vi.advanceTimersToNextFrame())
    expect(leftOf(line)).toBe(playheadX(layout, 8 * B))
  })

  it('brings its line into sight as it comes onto it, on a page canvas by the canvas', async () => {
    const scrolled = vi.mocked(Element.prototype.scrollIntoView)
    scrolled.mockClear()
    await renderPlayhead({ tick: 0 })
    // It scrolls once the line is placed, a frame after the engraving: later under the whole suite.
    await vi.waitFor(() =>
      expect(scrolled).toHaveBeenCalledWith(expect.objectContaining({ block: 'nearest' })),
    )
    expect(scrolled.mock.contexts.at(-1)).toBe(document.querySelector('[data-slot="sheet-line"]'))
    const reveal = vi.fn()
    render(
      <Sheet
        props={{ tick: 0 }}
        around={(sheet) => <RevealContext value={reveal}>{sheet}</RevealContext>}
      />,
    )
    // The second sheet engraves in the worker: under the whole suite that can take past a second.
    await vi.waitFor(() => expect(reveal).toHaveBeenCalled(), { timeout: 5000 })
    expect(reveal.mock.calls[0]?.[0]).toHaveAttribute('data-slot', 'sheet-line')
  })

  it('keeps itself in the middle half of a line wider than its scroller', async () => {
    const { scrolls } = stubScrolling({ clientWidth: 100, scrollWidth: 2000 })
    const { rerender } = await renderPlayhead({ tick: 0 })
    rerender(<Sheet props={{ tick: 4 * B }} />)
    expect(scrolls.at(-1)).toBeGreaterThan(0)
  })

  it('has a zoomed page canvas follow it along its line, a quarter in once past three quarters', async () => {
    const reveal = vi.fn()
    const onCanvas = (sheet: ReactNode) => (
      <RevealContext value={reveal}>
        <div data-slot="page-canvas">{sheet}</div>
      </RevealContext>
    )
    const { rerender } = render(<Sheet props={{ tick: 0 }} around={onCanvas} />)
    await screen.findByText('Engraved')
    const canvas = document.querySelector('[data-slot="page-canvas"]')
    const shown = document.querySelector('[data-slot="sheet-line"]')
    const line = document.querySelector('[data-slot="playhead"]')
    if (!canvas || !shown || !line) throw new Error('a playhead on a canvas')
    // A screen 400 wide, a line zoomed to 1000 from 0; the playhead moved on to 350, past three
    // quarters: a quarter in, with the room after it.
    stubBox(canvas, { left: 0, top: 0, width: 400, height: 300 })
    stubBox(shown, { left: 0, top: 0, width: 1000, height: 200 })
    stubBox(line, { left: 350, top: 20, width: 2, height: 100 })
    reveal.mockClear()
    rerender(<Sheet props={{ tick: B }} around={onCanvas} />)
    expect(reveal).toHaveBeenCalledWith({ left: 250, right: 650, top: 20, bottom: 120 })
    // In the middle half, the canvas stays.
    stubBox(line, { left: 200, top: 20, width: 2, height: 100 })
    reveal.mockClear()
    rerender(<Sheet props={{ tick: 2 * B }} around={onCanvas} />)
    expect(reveal).not.toHaveBeenCalled()
    // Its line's end in sight already (a page fitted to the screen): the canvas stays.
    stubBox(shown, { left: 0, top: 0, width: 390, height: 200 })
    stubBox(line, { left: 350, top: 20, width: 2, height: 100 })
    rerender(<Sheet props={{ tick: 3 * B }} around={onCanvas} />)
    expect(reveal).not.toHaveBeenCalled()
  })

  it('is out of sight where it is hidden, and still followed', async () => {
    const { line } = await renderPlayhead({ tick: 0, hidden: true })
    expect(line).toHaveClass('invisible')
  })
})
