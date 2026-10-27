import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { useRovingFocus } from './use-roving-focus'

function Row() {
  const row = useRef<HTMLDivElement>(null)
  const roving = useRovingFocus(row)
  const [off, setOff] = useState(true)
  return (
    <>
      <button type="button">Before</button>
      <div ref={row} role="toolbar" aria-label="Tools" {...roving}>
        <button type="button">Whole</button>
        <button type="button" disabled={off}>
          Half
        </button>
        <button type="button" aria-pressed>
          Quarter
        </button>
        <button type="button">Eighth</button>
      </div>
      <button type="button" onClick={() => setOff(!off)}>
        After
      </button>
    </>
  )
}

describe('useRovingFocus', () => {
  it('is one stop of the Tab key, at the key pressed, the arrows moving along it', async () => {
    const user = userEvent.setup()
    render(<Row />)
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Quarter' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Eighth' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Eighth' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'Whole' })).toHaveFocus()
    // Past a greyed key.
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Quarter' })).toHaveFocus()
    await user.keyboard('{End}{ArrowLeft}')
    expect(screen.getByRole('button', { name: 'Quarter' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
    // Back in, where it was left.
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Quarter' })).toHaveFocus()
  })

  it('keeps one stop as a key comes back from greyed', async () => {
    const user = userEvent.setup()
    render(<Row />)
    await user.click(screen.getByRole('button', { name: 'After' }))
    await new Promise((resolve) => setTimeout(resolve))
    expect(screen.getByRole('button', { name: 'Half' })).toHaveAttribute('tabindex', '-1')
  })
})
