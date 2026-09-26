import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Theory → Scales', () => {
  it('spells E♭ harmonic minor with its C♭ and names its structure', async () => {
    await renderApp('/theory/scales?root=Eb&kind=harmonic')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'E♭ harmonic minor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('C♭')
    expect(screen.getByText('W H W W H W+H H')).toBeInTheDocument()
  })

  it('colours the scale’s keys whole: the tonic deep, the others light', async () => {
    await renderApp('/theory/scales')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveClass('bg-key-scale')
  })

  it('puts a hand’s fingers under the keys, which keep their degrees', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/theory/scales')
    const fingers = await screen.findByRole('group', { name: 'Fingers' })
    await user.click(within(fingers).getByRole('button', { name: 'Right hand' }))
    expect(router.state.location.search).toMatchObject({ fingers: 'rh' })
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('4')
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
  })

  it('stops the run on Stop', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/scales')
    await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Play up and down' })).toBeInTheDocument()
  })

  it('presses a chord of the scale while it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/scales')
    const dm = await screen.findByRole('button', { name: /^Dm/ })
    await user.click(dm)
    expect(dm).toHaveAttribute('aria-pressed', 'true')
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2))
    expect(dm).toHaveAttribute('aria-pressed', 'false')
  })

  it('links to the relative minor', async () => {
    await renderApp('/theory/scales?root=G&kind=major')
    expect(await screen.findByRole('link', { name: 'E natural minor' })).toBeInTheDocument()
  })

  it('plays up and down, each key going down as it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/scales')
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
