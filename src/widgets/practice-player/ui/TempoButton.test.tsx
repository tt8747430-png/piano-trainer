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

  it('wears its gauge beside the value at every size, the pill sized to fit (ADR 0114)', () => {
    renderTempo()
    const gauge = screen.getByRole('button', { name: 'Tempo: 100%' }).querySelector('svg')
    expect(gauge).not.toBeNull()
    expect(gauge?.getAttribute('class')).not.toMatch(/:hidden/)
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

  it('only sets how fast the music plays back where it has no Wait mode or speed training (the editor’s)', async () => {
    const user = userEvent.setup()
    const onTempo = vi.fn()
    renderWithSettings(<TempoButton tempo={45} ownTempo={90} onTempo={onTempo} />)
    await user.click(screen.getByRole('button', { name: 'Tempo: 50%' }))
    expect(
      await screen.findByRole('option', { name: '50% speed', selected: true }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Wait mode' })).not.toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: /Speed training/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Original tempo' }))
    expect(onTempo).toHaveBeenLastCalledWith(90)
  })

  it('sets the speed in 5% steps of the piece’s tempo, from 50% to 200% (ADR 0105)', async () => {
    const user = userEvent.setup()
    const { onTempo } = renderTempo()
    await user.click(screen.getByRole('button', { name: 'Tempo: 100%' }))
    await screen.findByRole('dialog', { name: 'Tempo' })
    // Base UI shows a thumb once it has measured the track, which jsdom never lays out.
    const speed = screen.getByRole('slider', { hidden: true })
    expect(speed).toHaveAttribute('aria-valuenow', '100')
    // A range input: its own bounds and step are its screen reader's.
    expect(speed).toHaveAttribute('min', '50')
    expect(speed).toHaveAttribute('max', '200')
    expect(speed).toHaveAttribute('step', '5')
    expect(speed).toHaveAttribute('aria-valuetext', '100%')
    expect(screen.getByText('100% · 72 BPM')).toBeInTheDocument()
    speed.focus()
    await user.keyboard('{ArrowRight}')
    // 105% of 72 is 75.6, played at 76.
    expect(onTempo).toHaveBeenLastCalledWith(76)
    await user.keyboard('{End}')
    expect(onTempo).toHaveBeenLastCalledWith(144)
  })

  it('says a tempo at 200% and its beats a minute, its slider at its end', async () => {
    const user = userEvent.setup()
    renderTempo({ tempo: 144, shownTempo: 144 })
    await user.click(screen.getByRole('button', { name: 'Tempo: 200%' }))
    await screen.findByRole('dialog', { name: 'Tempo' })
    expect(screen.getByRole('slider', { hidden: true })).toHaveAttribute('aria-valuenow', '200')
    expect(screen.getByText('200% · 144 BPM')).toBeInTheDocument()
  })

  it('puts a tempo between two steps on the nearer, saying its own share', async () => {
    const user = userEvent.setup()
    renderTempo({ tempo: 60, shownTempo: 60 })
    await user.click(screen.getByRole('button', { name: 'Tempo: 83%' }))
    await screen.findByRole('dialog', { name: 'Tempo' })
    expect(screen.getByRole('slider', { hidden: true })).toHaveAttribute('aria-valuenow', '85')
    expect(screen.getByText('83% · 60 BPM')).toBeInTheDocument()
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
