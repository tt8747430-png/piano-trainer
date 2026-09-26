import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Theory → Symbols', () => {
  it('lists every quality by family with its spellings, formula and notes on C', async () => {
    await renderApp('/theory/symbols')
    const sevenths = await screen.findByRole('region', { name: '7th chords' })
    const minor7 = within(sevenths).getByRole('listitem', { name: 'Minor 7th' })
    expect(minor7).toHaveTextContent('Cm7')
    expect(minor7).toHaveTextContent('1 ♭3 5 ♭7')
    expect(minor7).toHaveTextContent('C E♭ G B♭')
    expect(within(minor7).getByRole('link', { name: 'Open' })).toHaveAttribute(
      'href',
      '/theory/chords?quality=m7',
    )
  })

  it('opens the reading notes behind one control', async () => {
    const user = userEvent.setup()
    await renderApp('/theory/symbols')
    await user.click(await screen.findByRole('button', { name: 'How to read chord symbols' }))
    expect(
      await screen.findByRole('heading', { name: 'Naming any chord in 7 steps' }),
    ).toBeInTheDocument()
  })

  it('shows the chord Hear plays going down on its keyboard', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/symbols')
    const triads = await screen.findByRole('region', { name: 'Triads' })
    const minor = within(triads).getByRole('listitem', { name: 'Minor triad' })
    await user.click(within(minor).getByRole('button', { name: 'Hear' }))
    act(() => audio.setNow((audio.played[0]?.at ?? 0) + 0.05))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    for (const name of ['C4', 'D sharp 4', 'G4'])
      expect(within(keyboard).getByRole('button', { name })).toHaveAttribute('data-down')
    expect(within(keyboard).getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-down')
  })
})
