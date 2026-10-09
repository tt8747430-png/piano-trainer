import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('the Player’s shortcuts', () => {
  it('plays and stops on Space', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'Play' })
    await user.keyboard(' ')
    expect(audio.played).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('keeps Space for Play after a button was pressed with the pointer', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Loop' }))
    await user.keyboard(' ')
    expect(audio.played).toHaveLength(1)
    expect(router.state.location.search).toMatchObject({ loop: '1-1' })
  })

  it('steps on the arrows and goes back to the first bar on Home', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'Play' })
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowLeft}')
    expect(audio.played).toHaveLength(3)
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'Bar 1: G' })).toHaveAttribute('aria-current', 'step')
  })

  it('takes the tempo 5% down and up, and loops the bar on R', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'Tempo: 100%' })
    // The song goes at 72: 90% is 65, 95% is 68.
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Tempo: 90%' })).toBeInTheDocument()
    expect(router.state.location.search).toMatchObject({ tempo: 65 })
    await user.keyboard('{ArrowUp}')
    expect(router.state.location.search).toMatchObject({ tempo: 68 })
    await user.keyboard('r')
    expect(router.state.location.search).toMatchObject({ loop: '1-1' })
    await user.keyboard('r')
    expect(router.state.location.search).not.toHaveProperty('loop')
  })

  it('closes on Escape, back to the song', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'Play' })
    await user.keyboard('{Escape}')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Practise/ })).toBeInTheDocument()
  })

  it('says each button’s key on hover', async () => {
    await renderApp('/play/bz5')
    expect(await screen.findByRole('button', { name: 'Play' })).toHaveAttribute(
      'title',
      'Play (Space)',
    )
    expect(screen.getByRole('button', { name: 'Loop' })).toHaveAttribute('title', 'Loop (R)')
    expect(screen.getByRole('button', { name: 'Next' })).toHaveAttribute('title', 'Next (→)')
  })
})
