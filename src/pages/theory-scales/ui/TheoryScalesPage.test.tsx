import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Theory → Scales', () => {
  it('spells E♭ harmonic minor with its C♭ and names its structure', async () => {
    renderApp('/theory/scales?root=Eb&kind=harmonic')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'E♭ harmonic minor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('C♭')
    expect(screen.getByText('W H W W H W+H H')).toBeInTheDocument()
  })

  it('labels the keys with right-hand fingers when asked', async () => {
    const user = userEvent.setup()
    renderApp('/theory/scales')
    await user.click(await screen.findByRole('button', { name: 'RH fingers' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('1')
  })

  it('links to the relative minor', async () => {
    renderApp('/theory/scales?root=G&kind=major')
    expect(await screen.findByRole('link', { name: 'E natural minor' })).toBeInTheDocument()
  })

  it('plays up and down, each key going down as it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = renderApp('/theory/scales')
    await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
    const start = audio.played[0]?.at ?? 0
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const c4 = within(keyboard).getByRole('button', { name: 'C4' })
    const d4 = within(keyboard).getByRole('button', { name: 'D4' })
    act(() => audio.setNow(start + 0.05))
    expect(c4).toHaveAttribute('data-down')
    expect(d4).not.toHaveAttribute('data-down')
    // An eighth at 80 BPM later, the run has moved on to D.
    act(() => audio.setNow(start + 0.5))
    expect(d4).toHaveAttribute('data-down')
    expect(c4).not.toHaveAttribute('data-down')
  })
})
