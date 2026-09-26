import { act, createEvent, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { setKeyboard } from '@/features/set-preference'
import { stubScrolling } from '@/shared/test/layout'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

function typingKeyboard(onKeyPress = vi.fn()) {
  const set = setUp({ onKeyPress })
  act(() => setKeyboard(set.settingsStore, { typing: true }))
  return { ...set, onKeyPress }
}

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
    const { audio } = typingKeyboard()
    const c4 = screen.getByRole('button', { name: 'C4' })
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' })
    expect(c4).toHaveAttribute('data-down')
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    act(() => audio.setNow(0.3))
    expect(c4).not.toHaveAttribute('data-down')
  })

  it('lets every typed key go when the window loses the focus', () => {
    typingKeyboard()
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' })
    act(() => void window.dispatchEvent(new Event('blur')))
    expect(screen.getByRole('button', { name: 'C4' })).not.toHaveAttribute('data-down')
  })

  it('moves an octave up with X', async () => {
    const user = userEvent.setup()
    const { onKeyPress } = typingKeyboard()
    await user.keyboard('xa')
    expect(onKeyPress).toHaveBeenCalledWith(72)
  })

  it('plays nothing on auto-repeat, with Cmd held, or into a text field', async () => {
    const user = userEvent.setup()
    const { onKeyPress } = typingKeyboard()
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a', repeat: true })
    await user.keyboard('{Meta>}a{/Meta}')
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
