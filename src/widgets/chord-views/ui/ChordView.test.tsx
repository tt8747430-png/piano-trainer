import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, initialPractice, ownChoice } from '@/features/practice'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi, createFakeArranger } from '@/shared/api/midi'
import type { Performance } from '@/shared/lib/arrangement'
import { ServicesProvider } from '@/shared/lib/services'
import { stubMatchMedia } from '@/shared/test/match-media'
import { ChordView } from './ChordView'

const B = TICKS_PER_BEAT

/** C, C, G and Am, a bar each of 4/4, as the Player plays them. */
const piece: ChartPiece = {
  id: 'my-1',
  kind: 'song',
  title: 'Morning',
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['C C G Am'] }],
}
const performance: Performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, {
  unfold: true,
})

/** The beat group starting a bar, as the cursor stands on it. */
const barGroup = (bar: number) =>
  performance.beatGroups.findIndex((group) => group.bar === bar && group.tick === bar * 4 * B)

/** Diagrams in its summary mode, the cursor at a bar's first beat. */
function renderSummary(bar: number) {
  const practice = {
    state: { ...initialPractice(performance, 'listen', 'both'), beatGroup: barGroup(bar) },
    clock: null,
    jumpToBeatGroup: vi.fn(),
    restart: vi.fn(),
  }
  const rendered = renderWithSettings(
    <ServicesProvider
      services={{
        audio: createFakeAudio(),
        arranger: createFakeArranger(),
        midi: createFakeMidi(),
      }}
    >
      <ChordView
        title="Amazing Grace"
        view="diagrams"
        mode="summary"
        performance={performance}
        headings={[]}
        practice={practice}
        loop={null}
        onLoopChange={vi.fn()}
        words={false}
        pinned={false}
        textSize={100}
      />
    </ServicesProvider>,
  )
  return { ...rendered, practice }
}

/** The summary's cards, by their chord's symbol, the one sounding marked `*`. */
const cards = (list = 'In this song') =>
  within(screen.getByRole('list', { name: list }))
    .getAllByRole('button')
    .map(
      (card) =>
        `${card.getAttribute('aria-label') ?? card.textContent}${card.getAttribute('aria-current') ? '*' : ''}`,
    )

describe('Diagrams, its summary (ADR 0108)', () => {
  it('shows the strip, then the song’s chords at once as cards, the one sounding marked', () => {
    renderSummary(0)
    const view = screen.getByRole('region', { name: 'Diagrams' })
    expect(view.querySelector('[data-slot="beat-strip"]')).toBeInTheDocument()
    expect(cards()).toEqual(['C*', 'G', 'Am'])
  })

  it('marks the chord sounding as the music moves on', () => {
    renderSummary(2)
    expect(cards()).toEqual(['C', 'G*', 'Am'])
  })

  it('plays a chord tapped In this song without moving the cursor, its places each a jump (R29 A37)', async () => {
    const user = userEvent.setup()
    const { practice } = renderSummary(0)
    await user.click(screen.getByRole('button', { name: 'Am' }))
    expect(practice.jumpToBeatGroup).not.toHaveBeenCalled()
    const places = screen.getByRole('list', { name: 'Where Am is' })
    await user.click(within(places).getByRole('button', { name: 'Bar 4' }))
    expect(practice.jumpToBeatGroup).toHaveBeenCalledWith(barGroup(3))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('lists In order a card a change, and a card tapped takes the cursor there (R29 A37)', async () => {
    const user = userEvent.setup()
    const { practice } = renderSummary(0)
    await user.click(screen.getByRole('radio', { name: 'In order' }))
    expect(cards('In order')[0]).toMatch(/^C, Bar 1\*$/)
    await user.click(screen.getByRole('button', { name: 'Am, Bar 4' }))
    expect(practice.jumpToBeatGroup).toHaveBeenCalledWith(barGroup(3))
  })
})

/** Diagrams' row, the cursor at a bar's first beat, under reduced motion so it moves at once. */
function renderRow(bar: number) {
  vi.stubGlobal('matchMedia', (media: string) => ({
    matches: media.includes('prefers-reduced-motion'),
    media,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }))
  const practice = {
    state: { ...initialPractice(performance, 'listen', 'both'), beatGroup: barGroup(bar) },
    clock: null,
    jumpToBeatGroup: vi.fn(),
    restart: vi.fn(),
  }
  const { unmount } = renderWithSettings(
    <ServicesProvider
      services={{
        audio: createFakeAudio(),
        arranger: createFakeArranger(),
        midi: createFakeMidi(),
      }}
    >
      <ChordView
        title="Amazing Grace"
        view="diagrams"
        mode="animated"
        performance={performance}
        headings={[]}
        practice={practice}
        loop={null}
        onLoopChange={vi.fn()}
        words={false}
        pinned={false}
        textSize={100}
      />
    </ServicesProvider>,
  )
  const row = screen.getByRole('group', { name: 'Chords, one at a time' })
  /** The row's slots, the one sounding marked `*`. */
  const slots = () =>
    within(row)
      .getAllByRole('button')
      .map((slot) => `${slot.textContent}${slot.getAttribute('aria-current') ? '*' : ''}`)
  return { practice, row, slots, unmount }
}

describe('Diagrams, its row of chords (ADR 0108, the Diagrams board)', () => {
  it('holds every change of chord in played order, the one sounding marked', () => {
    // C held over two bars is one change.
    expect(renderRow(0).slots()).toEqual(['C*', 'G', 'Am'])
  })

  it('marks the chord sounding as the music moves on', () => {
    expect(renderRow(3).slots()).toEqual(['C', 'G', 'Am*'])
  })

  it('takes the music to a chord tapped', async () => {
    const user = userEvent.setup()
    const { practice, row } = renderRow(0)
    await user.click(within(row).getAllByRole('button')[1]!)
    expect(practice.jumpToBeatGroup).toHaveBeenCalledExactlyOnceWith(barGroup(2))
  })

  it('takes the music to the chord a hand’s scroll rests on, once it settles', async () => {
    vi.useFakeTimers()
    onTestFinished(() => void vi.useRealTimers())
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(150)
    const { practice, row } = renderRow(0)
    // The row laid out (its size measured) and done sliding to the chord sounding, as a hand finds it.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })
    fireEvent.pointerDown(row)
    row.scrollLeft = 300
    fireEvent.scroll(row)
    expect(practice.jumpToBeatGroup).not.toHaveBeenCalled()
    vi.advanceTimersByTime(140)
    expect(practice.jumpToBeatGroup).toHaveBeenCalledExactlyOnceWith(barGroup(3))
  })

  it('keeps a hand’s swipe when the row is measured again under the hand', async () => {
    vi.useFakeTimers()
    onTestFinished(() => void vi.useRealTimers())
    const measured: Array<() => void> = []
    class LateObserver implements ResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(target: Element) {
        const report = (width: number) => {
          const size = [{ blockSize: 120, inlineSize: width }]
          this.callback(
            [
              {
                target,
                borderBoxSize: size,
                contentBoxSize: size,
                devicePixelContentBoxSize: size,
                contentRect: target.getBoundingClientRect(),
              },
            ],
            this,
          )
        }
        queueMicrotask(() => report(300))
        measured.push(() => report(320))
      }
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', LateObserver)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(150)
    const { practice, row } = renderRow(0)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })
    fireEvent.pointerDown(row)
    // The row's size arrives again while the hand is on it, as a slow device reports it late.
    act(() => measured.forEach((report) => report()))
    row.scrollLeft = 300
    fireEvent.scroll(row)
    act(() => vi.advanceTimersByTime(140))
    expect(practice.jumpToBeatGroup).toHaveBeenCalledExactlyOnceWith(barGroup(3))
  })
})

/** A sung line of C and G, then the same two bars twice with no words, then F. */
const sung: ChartPiece = {
  ...piece,
  sections: [{ kind: 'verse', lines: ['C G', 'C G', 'C G', 'F'] }],
  staves: [{ notes: 'E4/4 | D4/4 | r/4 | r/4 | r/4 | r/4 | r/4' }],
  lyrics: ['Good day'],
}
const sungPerformance = arrangePiece(sung, ownChoice(sung), BUILT_IN_PATTERNS, { unfold: true })

/** Chords over lyrics or the Grid of the sung song, the cursor at a bar's first beat. */
function renderView(
  view: 'lyrics' | 'grid',
  {
    bar = 0,
    pinned = true,
    textSize = 100,
    words = true,
  }: { bar?: number; pinned?: boolean; textSize?: 80 | 100 | 130; words?: boolean } = {},
) {
  const group = sungPerformance.beatGroups.findIndex(
    (each) => each.bar === bar && each.tick === bar * 4 * B,
  )
  const practice = {
    state: { ...initialPractice(sungPerformance, 'listen', 'both'), beatGroup: group },
    clock: null,
    jumpToBeatGroup: vi.fn(),
    restart: vi.fn(),
  }
  return renderWithSettings(
    <ServicesProvider
      services={{
        audio: createFakeAudio(),
        arranger: createFakeArranger(),
        midi: createFakeMidi(),
      }}
    >
      <ChordView
        title="Amazing Grace"
        view={view}
        mode="animated"
        performance={sungPerformance}
        headings={[]}
        practice={practice}
        loop={null}
        onLoopChange={vi.fn()}
        words={words}
        pinned={pinned}
        textSize={textSize}
      />
    </ServicesProvider>,
  )
}

describe('Chords over lyrics (ADR 0108)', () => {
  it('pins the song’s chord diagrams under the strip, the one sounding marked', () => {
    renderView('lyrics', { bar: 1 })
    const strip = document.querySelector('[data-slot="beat-strip"]')?.parentElement
    const pinned = within(strip as HTMLElement).getByRole('list', { name: 'Chords' })
    const marked = within(pinned)
      .getAllByRole('button')
      .map((card) => `${card.textContent}${card.getAttribute('aria-current') ? '*' : ''}`)
    expect(marked).toEqual(['C', 'G*', 'F'])
  })

  it('shows no diagrams with the switch off', () => {
    renderView('lyrics', { pinned: false })
    expect(screen.queryByRole('list', { name: 'Chords' })).not.toBeInTheDocument()
  })

  it('sizes the words and their chords together by the text size', () => {
    renderView('lyrics', { textSize: 130 })
    const song = document.querySelector('[data-line="0"]')?.parentElement
    expect(song).toHaveStyle({ fontSize: '130%' })
  })

  it('shows a line of chords alone played again straight after itself once, ×2', () => {
    renderView('lyrics')
    const lines = [...document.querySelectorAll('[data-line]')]
    expect(lines).toHaveLength(3)
    expect(lines[1]).toHaveTextContent(/^CG×2/)
    expect(within(lines[1] as HTMLElement).getByText('Played 2 times')).toBeInTheDocument()
    expect(lines[2]).not.toHaveTextContent('×')
  })

  it('marks the line playing in either copy of a line shown once', () => {
    renderView('lyrics', { bar: 4 })
    expect(document.querySelector('[data-line="1"] button[aria-current]')).toBeInTheDocument()
    expect(document.querySelector('[data-line="1"] [data-sounding]')).toHaveTextContent('C')
  })

  it('shows a chord’s diagram as a pointer rests on it, where the device hovers', async () => {
    stubMatchMedia({ dark: true })
    const user = userEvent.setup()
    renderView('lyrics', { pinned: false })
    const [chip] = within(document.querySelector('[data-line="0"]') as HTMLElement).getAllByRole(
      'button',
      { name: 'C' },
    )
    await user.hover(chip as HTMLElement)
    await waitFor(() =>
      expect(
        within(document.querySelector('[data-slot="tooltip-content"]') as HTMLElement).getByRole(
          'img',
        ),
      ).toHaveAccessibleName(/^C: /),
    )
  })

  it('shows no diagram on a pointer resting where the device does not hover', async () => {
    const user = userEvent.setup()
    renderView('lyrics', { pinned: false })
    const [chip] = within(document.querySelector('[data-line="0"]') as HTMLElement).getAllByRole(
      'button',
      { name: 'C' },
    )
    await user.hover(chip as HTMLElement)
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull()
  })
})

describe('the Grid’s words (ADR 0108)', () => {
  it('writes the words under the beats they are sung on with the View’s Lyrics', () => {
    renderView('grid')
    expect(screen.getByRole('button', { name: 'Bar 1: C · Good' })).toBeInTheDocument()
    expect(document.querySelectorAll('[data-verse]')).toHaveLength(2)
  })

  it('writes none with the Lyrics off', () => {
    renderView('grid', { words: false })
    expect(screen.getByRole('button', { name: 'Bar 1: C' })).toBeInTheDocument()
    expect(document.querySelector('[data-verse]')).toBeNull()
  })
})

describe('the loop’s grips (R37)', () => {
  function renderLooped(view: 'grid' | 'diagrams') {
    const onLoopChange = vi.fn()
    renderWithSettings(
      <ServicesProvider
        services={{
          audio: createFakeAudio(),
          arranger: createFakeArranger(),
          midi: createFakeMidi(),
        }}
      >
        <ChordView
          title="Amazing Grace"
          view={view}
          mode="animated"
          performance={performance}
          headings={[]}
          practice={{
            state: { ...initialPractice(performance, 'listen', 'both'), beatGroup: barGroup(1) },
            clock: null,
            jumpToBeatGroup: vi.fn(),
          }}
          loop={{ first: 1, last: 2 }}
          onLoopChange={onLoopChange}
          words={false}
          pinned={false}
          textSize={100}
        />
      </ServicesProvider>,
    )
    return onLoopChange
  }

  it('moves the Grid’s loop a bar at a time from its grips', () => {
    const onLoopChange = renderLooped('grid')
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Loop end' }), { key: 'ArrowRight' })
    expect(onLoopChange).toHaveBeenLastCalledWith({ first: 1, last: 3 })
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Loop start' }), { key: 'Home' })
    expect(onLoopChange).toHaveBeenLastCalledWith({ first: 0, last: 2 })
  })

  it('puts a grip at each end of the strip’s loop, out of a screen reader’s way', () => {
    renderLooped('diagrams')
    const strip = document.querySelector('[data-slot="beat-strip"]') as HTMLElement
    expect(
      [...strip.querySelectorAll('[data-grip]')].map((grip) => grip.getAttribute('data-grip')),
    ).toEqual(['start', 'end'])
    expect(screen.queryByRole('slider', { name: 'Loop end' })).not.toBeInTheDocument()
  })
})
