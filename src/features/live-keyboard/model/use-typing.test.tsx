import { act, createEvent, fireEvent, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setKeyboard } from '@/features/set-preference'
import { SHORTEST_PRESS_MS } from '@/shared/lib'
import { stubScrolling } from '@/shared/test/layout'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'
import { useTyping } from './use-typing'

function typingKeyboard(onKeyPress = vi.fn()) {
  const set = setUp({ onKeyPress })
  act(() => setKeyboard(set.settingsStore, { typing: true }))
  return { ...set, onKeyPress }
}

afterEach(() => vi.useRealTimers())

describe('typing on the computer keyboard', () => {
  it('plays the key a letter stands for, as a tap does, and letters the keys it plays', async () => {
    const user = userEvent.setup()
    const { audio, onKeyPress } = typingKeyboard()
    await user.keyboard('a')
    expect(audio.played.at(-1)?.sounds).toMatchObject([{ kind: 'note', midi: 60 }])
    expect(onKeyPress).toHaveBeenCalledWith(60)
    expect(screen.getByRole('button', { name: 'C4' })).toHaveTextContent('A')
  })

  it('holds a typed key down until it is let go', () => {
    vi.useFakeTimers()
    typingKeyboard()
    const c4 = screen.getByRole('button', { name: 'C4' })
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' })
    act(() => vi.advanceTimersByTime(1000))
    expect(c4).toHaveAttribute('data-down')
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    expect(c4).not.toHaveAttribute('data-down')
  })

  it('holds a quick keystroke down for the shortest press', () => {
    vi.useFakeTimers()
    typingKeyboard()
    const c4 = screen.getByRole('button', { name: 'C4' })
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    expect(c4).toHaveAttribute('data-down')
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    expect(c4).not.toHaveAttribute('data-down')
  })

  it('lets every typed key go when the window loses the focus', () => {
    vi.useFakeTimers()
    typingKeyboard()
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyDown(window, { code: 'KeyD', key: 'd' })
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    act(() => void window.dispatchEvent(new Event('blur')))
    expect(screen.getByRole('button', { name: 'C4' })).not.toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-down')
  })

  it('lets every typed key go when Cmd is let go: macOS sends no key-up for a letter under Cmd', () => {
    vi.useFakeTimers()
    typingKeyboard()
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyDown(window, { code: 'MetaLeft', key: 'Meta', metaKey: true })
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    fireEvent.keyUp(window, { code: 'MetaLeft', key: 'Meta' })
    expect(screen.getByRole('button', { name: 'C4' })).not.toHaveAttribute('data-down')
  })

  it('moves an octave up with X', async () => {
    const user = userEvent.setup()
    const { onKeyPress } = typingKeyboard()
    await user.keyboard('xa')
    expect(onKeyPress).toHaveBeenCalledWith(72)
  })

  it('plays nothing on auto-repeat, with Cmd or Shift held, or into a text field', async () => {
    const user = userEvent.setup()
    const { onKeyPress } = typingKeyboard()
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a', repeat: true })
    await user.keyboard('{Meta>}a{/Meta}')
    await user.keyboard('{Shift>}a{/Shift}')
    await user.click(screen.getByRole('textbox', { name: 'Search' }))
    await user.keyboard('a')
    expect(onKeyPress).not.toHaveBeenCalled()
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('a')
  })

  it('keeps a key it plays from the browser (Firefox’s Quick Find on ’)', () => {
    typingKeyboard()
    const quote = createEvent.keyDown(window, { code: 'Quote', key: "'" })
    fireEvent(window, quote)
    expect(quote.defaultPrevented).toBe(true)
  })

  it('shows the typing octave after X, until the screen’s own keys in view change', async () => {
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    const user = userEvent.setup()
    typingKeyboard()
    const opened = scrolls.length
    await user.keyboard('x')
    // C5–F6 was out of sight: the keyboard scrolls to it.
    expect(scrolls.length).toBeGreaterThan(opened)
  })

  it('plays nothing while typing is off', async () => {
    const user = userEvent.setup()
    const onKeyPress = vi.fn()
    setUp({ onKeyPress })
    await user.keyboard('a')
    expect(onKeyPress).not.toHaveBeenCalled()
  })
})

describe('a typed key let go', () => {
  function typing() {
    const onKey = vi.fn()
    const onKeyUp = vi.fn()
    const hook = renderHook(
      ({ enabled }) => useTyping({ enabled, onKey, onKeyUp, inView: undefined }),
      { initialProps: { enabled: true } },
    )
    return { onKeyUp, hook }
  }

  const down = (code: string, key: string) => fireEvent.keyDown(window, { code, key })

  it('reports the key it played as it comes up, though Z moved the octave meanwhile', () => {
    const { onKeyUp } = typing()
    down('KeyA', 'a')
    down('KeyZ', 'z')
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    expect(onKeyUp).toHaveBeenCalledExactlyOnceWith(60)
  })

  it('reports every key held as the window loses the focus', () => {
    const { onKeyUp } = typing()
    down('KeyA', 'a')
    down('KeyD', 'd')
    act(() => void window.dispatchEvent(new Event('blur')))
    expect(onKeyUp.mock.calls).toEqual([[60], [64]])
  })

  it('reports every key held as Cmd is let go', () => {
    const { onKeyUp } = typing()
    down('KeyA', 'a')
    fireEvent.keyUp(window, { code: 'MetaLeft', key: 'Meta' })
    expect(onKeyUp).toHaveBeenCalledExactlyOnceWith(60)
  })

  it('reports every key held as typing is switched off, or the screen goes', () => {
    const { onKeyUp, hook } = typing()
    down('KeyA', 'a')
    hook.rerender({ enabled: false })
    expect(onKeyUp).toHaveBeenCalledExactlyOnceWith(60)
    hook.rerender({ enabled: true })
    down('KeyD', 'd')
    hook.unmount()
    expect(onKeyUp.mock.calls).toEqual([[60], [64]])
  })
})
