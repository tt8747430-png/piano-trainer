import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { i18n } from '@/shared/i18n'
import { TempoButton } from './TempoButton'

function renderTempo(props: Partial<Parameters<typeof TempoButton>[0]> = {}) {
  const handlers = { onWait: vi.fn(), onTempo: vi.fn(), onSpeedTraining: vi.fn() }
  renderWithSettings(
    <TempoButton
      mode="listen"
      tempo={72}
      shownTempo={72}
      ownTempo={72}
      speedTraining={false}
      {...handlers}
      {...props}
    />,
  )
  return handlers
}

describe('TempoButton', () => {
  it('says the tempo as a share of the piece’s, or Wait', () => {
    renderTempo({ tempo: 54, shownTempo: 54 })
    expect(screen.getByRole('button', { name: 'Tempo: 75%' })).toBeInTheDocument()
  })

  it('chooses Wait mode or a speed', async () => {
    const user = userEvent.setup()
    const { onWait, onTempo } = renderTempo()
    await user.click(screen.getByRole('button', { name: 'Tempo: 100%' }))
    expect(await screen.findByRole('dialog', { name: 'Tempo' })).toBeInTheDocument()
    expect(
      await screen.findByRole('option', { name: 'Original tempo', selected: true }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Wait mode' }))
    expect(onWait).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Tempo: 100%' }))
    await user.click(await screen.findByRole('option', { name: '50% speed' }))
    expect(onTempo).toHaveBeenLastCalledWith(36)
  })

  it('scrolls within the screen’s height where the screen is short (a phone on its side)', async () => {
    const user = userEvent.setup()
    renderTempo()
    await user.click(screen.getByRole('button', { name: 'Tempo: 100%' }))
    const dialog = await screen.findByRole('dialog', { name: 'Tempo' })
    expect(dialog).toHaveClass('max-h-(--available-height)', 'overflow-y-auto')
  })

  it('offers speed training only below the piece’s tempo, in Listen', async () => {
    const user = userEvent.setup()
    renderTempo({ tempo: 54, shownTempo: 54 })
    await user.click(screen.getByRole('button', { name: 'Tempo: 75%' }))
    expect(await screen.findByRole('switch', { name: /Speed training/ })).toBeInTheDocument()
  })

  it('writes the percent the Russian way', async () => {
    const user = userEvent.setup()
    act(() => void i18n.changeLanguage('ru'))
    renderTempo({ tempo: 54, shownTempo: 54 })
    await user.click(screen.getByRole('button', { name: 'Темп: 75\u00a0%' }))
    expect(await screen.findByRole('option', { name: 'Скорость 50\u00a0%' })).toBeInTheDocument()
  })
})
