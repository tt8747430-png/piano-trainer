import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { ShortcutsProvider, useShortcuts } from '@/shared/lib/shortcuts'
import { ShortcutsButton } from './ShortcutsButton'
import { ShortcutsHelp } from './ShortcutsHelp'

function Player() {
  useShortcuts('Player', [{ label: 'Play or stop', combo: { key: ' ' }, run: () => {} }])
  return null
}

const setUp = (ui: ReactNode) =>
  render(
    <ShortcutsProvider mac={false}>
      <ShortcutsHelp>{ui}</ShortcutsHelp>
    </ShortcutsProvider>,
  )

describe('the shortcuts’ sheet', () => {
  it('opens on ?, listing what the screen binds first, each with its keys', async () => {
    const user = userEvent.setup()
    setUp(<Player />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.keyboard('?')
    const sheet = await screen.findByRole('dialog', { name: 'Shortcuts' })
    const groups = within(sheet).getAllByRole('heading', { level: 3 })
    expect(groups.map((group) => group.textContent)).toEqual(['Player', 'Anywhere'])
    const play = within(sheet).getByText('Play or stop').closest('div')
    expect(play).toHaveTextContent('Space')
    expect(within(sheet).getByText('Show the shortcuts').closest('div')).toHaveTextContent('?')
  })

  it('opens from its button, for a hand on the pointer', async () => {
    const user = userEvent.setup()
    setUp(<ShortcutsButton />)
    await user.click(screen.getByRole('button', { name: 'Shortcuts' }))
    expect(await screen.findByRole('dialog', { name: 'Shortcuts' })).toBeInTheDocument()
  })
})
