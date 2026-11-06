import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

const divider = () => screen.getByRole('separator', { name: 'Resize keyboard' })
const keys = () => screen.getByRole('group', { name: 'Keyboard' })

/** The keys drawn `px` tall, as jsdom lays nothing out. */
function drawnAt(px: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    height: px,
  } as DOMRect)
}

afterEach(() => vi.restoreAllMocks())

describe('the divider between the music and the keys (R34)', () => {
  it('stands over keys docked at the foot, a splitter named for what it does', () => {
    setUp({ divider: 'above' })
    expect(divider()).toHaveAttribute('aria-orientation', 'horizontal')
    expect(
      divider().compareDocumentPosition(keys()) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('makes the keys taller as it is dragged up, kept for this size of screen', () => {
    drawnAt(100)
    const { settingsStore } = setUp({ divider: 'above' })
    fireEvent.pointerDown(divider(), { pointerId: 1, clientY: 500 })
    fireEvent.pointerMove(divider(), { pointerId: 1, clientY: 440 })
    fireEvent.pointerUp(divider(), { pointerId: 1, clientY: 440 })
    expect(keys().style.height).toBe('160px')
    expect(settingsStore.getState().keysHeight).toEqual({ phone: null, side: null, wide: 160 })
  })

  it('makes keys docked at the top taller as it is dragged down', () => {
    drawnAt(100)
    setUp({ divider: 'below' })
    fireEvent.pointerDown(divider(), { pointerId: 1, clientY: 300 })
    fireEvent.pointerMove(divider(), { pointerId: 1, clientY: 330 })
    expect(keys().style.height).toBe('130px')
  })

  it('never makes the keys shorter than a finger’s reach nor taller than half the screen', () => {
    drawnAt(100)
    setUp({ divider: 'above' })
    fireEvent.pointerDown(divider(), { pointerId: 1, clientY: 500 })
    fireEvent.pointerMove(divider(), { pointerId: 1, clientY: 900 })
    expect(keys().style.height).toBe('56px')
    fireEvent.pointerMove(divider(), { pointerId: 1, clientY: -900 })
    expect(keys().style.height).toBe(`${Math.round(window.innerHeight / 2)}px`)
  })

  it('steps from the keyboard, and Enter gives the keys back their proportion', async () => {
    drawnAt(100)
    const user = userEvent.setup()
    const { settingsStore } = setUp({ divider: 'above' })
    act(() => divider().focus())
    await user.keyboard('{ArrowUp}')
    expect(keys().style.height).toBe('116px')
    expect(divider()).toHaveAttribute('aria-valuenow', '116')
    await user.keyboard('{Home}')
    expect(keys().style.height).toBe('56px')
    await user.keyboard('{Enter}')
    expect(keys().style.height).toMatch(/^clamp\(/)
    expect(settingsStore.getState().keysHeight.wide).toBeNull()
  })

  it('goes back to the proportion on a double click', () => {
    drawnAt(100)
    setUp({ divider: 'above' })
    fireEvent.pointerDown(divider(), { pointerId: 1, clientY: 500 })
    fireEvent.pointerMove(divider(), { pointerId: 1, clientY: 480 })
    fireEvent.pointerUp(divider(), { pointerId: 1, clientY: 480 })
    fireEvent.doubleClick(divider())
    expect(keys().style.height).toMatch(/^clamp\(/)
  })

  it('has no divider where the keys sit inside a card', () => {
    setUp()
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
  })
})
