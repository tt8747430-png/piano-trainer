import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ShortcutsProvider } from './ShortcutsProvider'
import type { Shortcut } from './registry'
import { useListedShortcuts, useShortcuts } from './use-shortcuts'

function Screen({
  name = 'Player',
  shortcuts,
  enabled,
  children,
}: {
  name?: string
  shortcuts: readonly Shortcut[]
  enabled?: boolean
  children?: ReactNode
}) {
  useShortcuts(name, shortcuts, enabled === undefined ? {} : { enabled })
  return <>{children}</>
}

function Listed() {
  const groups = useListedShortcuts()
  return (
    <ul>
      {groups.map((group) => (
        <li key={group.name}>
          {group.name}: {group.rows.map((row) => `${row.label} ${row.keys.join('+')}`).join(', ')}
        </li>
      ))}
    </ul>
  )
}

const setUp = (ui: ReactNode, mac = false) =>
  render(<ShortcutsProvider mac={mac}>{ui}</ShortcutsProvider>)

const play = (run: () => void): Shortcut => ({ label: 'Play', combo: { key: ' ' }, run })

describe('the computer’s shortcuts', () => {
  it('runs what a screen bound to a key, the key kept from the browser', () => {
    const run = vi.fn()
    setUp(<Screen shortcuts={[play(run)]} />)
    const pressed = fireEvent.keyDown(document.body, { key: ' ', code: 'Space' })
    expect(run).toHaveBeenCalledOnce()
    // fireEvent says false when the event's default was prevented.
    expect(pressed).toBe(false)
  })

  it('leaves the keys alone once the screen is gone, or while it binds nothing', () => {
    const run = vi.fn()
    const { rerender } = setUp(<Screen shortcuts={[play(run)]} enabled={false} />)
    fireEvent.keyDown(document.body, { key: ' ' })
    rerender(<ShortcutsProvider mac={false}>{null}</ShortcutsProvider>)
    fireEvent.keyDown(document.body, { key: ' ' })
    expect(run).not.toHaveBeenCalled()
  })

  it('runs what the screen last rendered', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = setUp(<Screen shortcuts={[play(first)]} />)
    rerender(
      <ShortcutsProvider mac={false}>
        <Screen shortcuts={[play(second)]} />
      </ShortcutsProvider>,
    )
    fireEvent.keyDown(document.body, { key: ' ' })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })

  it('leaves a key typed into a field, pressed inside a pop-up, or already handled', () => {
    const run = vi.fn()
    setUp(
      <Screen shortcuts={[play(run)]}>
        <input aria-label="Search" />
        <div role="dialog">
          <button type="button">Inside</button>
        </div>
      </Screen>,
    )
    fireEvent.keyDown(screen.getByRole('textbox'), { key: ' ' })
    fireEvent.keyDown(screen.getByRole('button', { name: 'Inside' }), { key: ' ' })
    window.addEventListener('keydown', (event) => event.preventDefault(), {
      capture: true,
      once: true,
    })
    fireEvent.keyDown(document.body, { key: ' ' })
    expect(run).not.toHaveBeenCalled()
  })

  it('runs once for a key held down, unless the shortcut repeats', () => {
    const once = vi.fn()
    const again = vi.fn()
    setUp(
      <Screen
        shortcuts={[
          play(once),
          { label: 'Faster', combo: { key: 'ArrowUp' }, repeat: true, run: again },
        ]}
      />,
    )
    fireEvent.keyDown(document.body, { key: ' ' })
    expect(fireEvent.keyDown(document.body, { key: ' ', repeat: true })).toBe(false)
    fireEvent.keyDown(document.body, { key: 'ArrowUp' })
    fireEvent.keyDown(document.body, { key: 'ArrowUp', repeat: true })
    expect(once).toHaveBeenCalledOnce()
    expect(again).toHaveBeenCalledTimes(2)
  })

  it('leaves Space to a control the keyboard moved to, and takes it on one a pointer pressed', async () => {
    const user = userEvent.setup()
    const run = vi.fn()
    const loop = vi.fn()
    setUp(
      <Screen shortcuts={[play(run)]}>
        <button type="button" onClick={loop}>
          Loop
        </button>
      </Screen>,
    )
    await user.tab()
    await user.keyboard(' ')
    expect(loop).toHaveBeenCalledOnce()
    expect(run).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Loop' }))
    await user.keyboard(' ')
    expect(loop).toHaveBeenCalledTimes(2)
    expect(run).toHaveBeenCalledOnce()
  })

  it('gives a key two screens bind to the one bound last', () => {
    const under = vi.fn()
    const over = vi.fn()
    setUp(
      <>
        <Screen
          name="Shell"
          shortcuts={[{ label: 'Back', combo: { key: 'Escape' }, run: under }]}
        />
        <Screen
          name="Player"
          shortcuts={[{ label: 'Close', combo: { key: 'Escape' }, run: over }]}
        />
      </>,
    )
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(over).toHaveBeenCalledOnce()
    expect(under).not.toHaveBeenCalled()
  })

  it('lists the shortcuts on screen with their keycaps, hidden ones left out', () => {
    setUp(
      <>
        <Screen
          shortcuts={[
            play(() => {}),
            { label: 'Sidebar', combo: { code: 'KeyB', mod: true }, run: () => {} },
            { label: 'First answer', combo: { code: 'Digit1' }, hidden: true, run: () => {} },
            { label: 'The answer in that place', shown: ['1', '–', '9'] },
          ]}
        />
        <Listed />
      </>,
      true,
    )
    expect(screen.getByRole('listitem')).toHaveTextContent(
      'Player: Play Space, Sidebar ⌘+B, The answer in that place 1+–+9',
    )
  })

  it('lists groups of one name as one, a row bound twice once', () => {
    const row = (label: string, code: string): Shortcut => ({
      label,
      combo: { code },
      run: () => {},
    })
    setUp(
      <>
        <Screen name="Anywhere" shortcuts={[row('Songs', 'Digit2')]} />
        <Screen name="Anywhere" shortcuts={[row('Songs', 'Digit2'), row('Learn', 'Digit3')]} />
        <Listed />
      </>,
    )
    expect(screen.getByRole('listitem')).toHaveTextContent('Anywhere: Songs 2, Learn 3')
  })
})
