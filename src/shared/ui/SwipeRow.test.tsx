import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Archive, Heart } from 'lucide-react'
import { SwipeRow } from './SwipeRow'

// Under reduced motion a row settles at once, so a test reads where it came to rest.
beforeEach(() => {
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
})

const trailing = (onAction: () => void) => [
  { id: 'archive', icon: Archive, label: 'Archive', paint: 'lilac' as const, onAction },
]

function Row({ name, onAction }: { name: string; onAction: () => void }) {
  return (
    <SwipeRow trailing={trailing(onAction)}>
      <div data-testid={name}>{name}</div>
    </SwipeRow>
  )
}

const sledOf = (name: string) => screen.getByTestId(name).parentElement as HTMLElement

const finger = (pointerId: number) => ({ pointerId, pointerType: 'touch', isPrimary: true })

function touch(name: string, pointerId = 1) {
  fireEvent.pointerDown(sledOf(name), {
    ...finger(pointerId),
    buttons: 1,
    clientX: 300,
    clientY: 10,
  })
}

function swipe(name: string, to: number, end: 'up' | 'cancel' = 'up') {
  const sled = sledOf(name)
  const pointer = finger(1)
  fireEvent.pointerDown(sled, { ...pointer, buttons: 1, clientX: 300, clientY: 10 })
  fireEvent.pointerMove(sled, { ...pointer, buttons: 1, clientX: to, clientY: 10 })
  const lift = { ...pointer, buttons: 0, clientX: to, clientY: 10 }
  if (end === 'cancel') fireEvent.pointerCancel(sled, lift)
  else fireEvent.pointerUp(sled, lift)
}

const painted = () => act(async () => void (await new Promise(requestAnimationFrame)))

const AT_REST = 'none'

const displacement = (name: string) => sledOf(name).style.transform

const bothRails = (onLeading: () => void, onTrailing: () => void) => ({
  leading: [
    {
      id: 'favourite',
      icon: Heart,
      label: 'Favourite',
      paint: 'sand' as const,
      onAction: onLeading,
    },
  ],
  trailing: trailing(onTrailing),
})

const trayOf = (label: string) =>
  screen.getByRole('button', { name: label, hidden: true }).parentElement as HTMLElement

describe('SwipeRow — a shut rail must not stand in the open one’s way', () => {
  it('draws no rail at all while a row has never been swiped — a list of them costs no trays', () => {
    render(
      <SwipeRow {...bothRails(vi.fn(), vi.fn())}>
        <div data-testid="a">a</div>
      </SwipeRow>,
    )
    expect(screen.queryByRole('button', { name: 'Favourite', hidden: true })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Archive', hidden: true })).toBeNull()
  })

  it('draws both rails from the first movement, the shut one out of hit-testing', async () => {
    render(
      <SwipeRow {...bothRails(vi.fn(), vi.fn())}>
        <div data-testid="a">a</div>
      </SwipeRow>,
    )
    swipe('a', 240)
    await painted()
    expect(trayOf('Favourite').style.pointerEvents).toBe('none')
    expect(trayOf('Archive').style.pointerEvents).toBe('auto')
  })

  it('hands pointers to the leading rail alone once it is open', async () => {
    const onLeading = vi.fn()
    render(
      <SwipeRow {...bothRails(onLeading, vi.fn())}>
        <div data-testid="a">a</div>
      </SwipeRow>,
    )
    swipe('a', 400)
    await painted()
    expect(displacement('a')).toContain('translateX(60px)')

    // The trailing tray is full-width and later in the DOM: left hit-testable it swallows
    // every press meant for the leading buttons it covers.
    expect(trayOf('Archive').style.pointerEvents).toBe('none')
    expect(trayOf('Favourite').style.pointerEvents).toBe('auto')

    fireEvent.click(screen.getByRole('button', { name: 'Favourite', hidden: true }))
    expect(onLeading).toHaveBeenCalledOnce()
  })

  it('hands pointers to the trailing rail alone once it is open', async () => {
    const onTrailing = vi.fn()
    render(
      <SwipeRow {...bothRails(vi.fn(), onTrailing)}>
        <div data-testid="a">a</div>
      </SwipeRow>,
    )
    swipe('a', 240)
    await painted()
    expect(displacement('a')).toContain('translateX(-60px)')

    expect(trayOf('Favourite').style.pointerEvents).toBe('none')
    expect(trayOf('Archive').style.pointerEvents).toBe('auto')

    fireEvent.click(screen.getByRole('button', { name: 'Archive', hidden: true }))
    expect(onTrailing).toHaveBeenCalledOnce()
  })

  it('shuts the rails to pointers again when the row settles back', async () => {
    render(
      <SwipeRow {...bothRails(vi.fn(), vi.fn())}>
        <div data-testid="a">a</div>
      </SwipeRow>,
    )
    swipe('a', 400)
    await painted()
    fireEvent.click(screen.getByRole('button', { name: 'Favourite', hidden: true }))
    await painted()
    expect(trayOf('Favourite').style.pointerEvents).toBe('none')
  })
})

describe('SwipeRow', () => {
  it('fires the edge action on a swipe past the commit point', () => {
    const onAction = vi.fn()
    render(<Row name="a" onAction={onAction} />)
    swipe('a', 60)
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('fires nothing when the platform cancels the gesture', () => {
    const onAction = vi.fn()
    render(<Row name="a" onAction={onAction} />)
    swipe('a', 60, 'cancel')
    expect(onAction).not.toHaveBeenCalled()
  })

  it('puts an open row back the moment another row takes the touch', async () => {
    render(
      <>
        <Row name="a" onAction={vi.fn()} />
        <Row name="b" onAction={vi.fn()} />
      </>,
    )
    swipe('a', 260)
    await painted()
    expect(displacement('a')).toContain('translateX(-60px)')

    touch('b', 2)
    await painted()
    expect(displacement('a')).toBe(AT_REST)
  })

  it('puts an open row back when the learner taps away from it', async () => {
    render(
      <>
        <Row name="a" onAction={vi.fn()} />
        <div data-testid="elsewhere">elsewhere</div>
      </>,
    )
    swipe('a', 260)
    await painted()
    expect(displacement('a')).toContain('translateX(-60px)')

    fireEvent.pointerDown(screen.getByTestId('elsewhere'), { ...finger(2), buttons: 1 })
    await painted()
    expect(displacement('a')).toBe(AT_REST)
  })

  it('lets the next tap through after a swipe that clicked nothing', async () => {
    const onTap = vi.fn()
    render(
      <SwipeRow trailing={trailing(vi.fn())}>
        <button type="button" data-testid="a" onClick={onTap}>
          Open
        </button>
      </SwipeRow>,
    )
    swipe('a', 285)
    await painted()

    touch('a', 2)
    fireEvent.pointerUp(sledOf('a'), { ...finger(2), buttons: 0, clientX: 300, clientY: 10 })
    fireEvent.click(screen.getByTestId('a'))
    expect(onTap).toHaveBeenCalledOnce()
  })

  it('swallows the click a committed swipe leaves behind', async () => {
    const onTap = vi.fn()
    render(
      <SwipeRow trailing={trailing(vi.fn())}>
        <button type="button" data-testid="a" onClick={onTap}>
          Open
        </button>
      </SwipeRow>,
    )
    swipe('a', 285)
    await painted()
    fireEvent.click(screen.getByTestId('a'))
    expect(onTap).not.toHaveBeenCalled()
  })
})
