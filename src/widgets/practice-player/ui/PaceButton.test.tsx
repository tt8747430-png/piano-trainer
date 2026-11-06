import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { i18n } from '@/shared/i18n'
import { PaceButton } from './PaceButton'

function renderPace(props: Partial<Parameters<typeof PaceButton>[0]> = {}) {
  const handlers = { onMode: vi.fn(), onListen: vi.fn(), onSpeedTraining: vi.fn() }
  renderWithSettings(
    <PaceButton
      mode="listen"
      tempo={72}
      shownTempo={72}
      ownTempo={72}
      speedTraining={false}
      piano
      {...handlers}
      {...props}
    />,
  )
  return handlers
}

describe('PaceButton', () => {
  it('reads as a metronome mark in Listen, its share of the piece’s tempo in its name (R32)', () => {
    renderPace({ tempo: 54, shownTempo: 54 })
    expect(screen.getByRole('button', { name: 'Pace: 75%' })).toHaveTextContent(/= 54$/)
  })

  it('names the mode played at the learner’s own pace (R36)', () => {
    renderPace({ mode: 'wait' })
    expect(screen.getByRole('button', { name: 'Pace: Wait mode' })).toHaveTextContent('Wait mode')
  })

  it('offers Wait mode and Interpret at your own pace, then the speeds to listen and play along at (R36, flowkey’s)', async () => {
    const user = userEvent.setup()
    renderPace()
    await user.click(screen.getByRole('button', { name: 'Pace: 100%' }))
    expect(await screen.findByRole('dialog', { name: 'Pace' })).toBeInTheDocument()
    const own = screen.getByRole('group', { name: 'At your own pace' })
    expect(
      within(own)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual([
      'Wait modeThe music waits for the right notes.',
      'InterpretThe music follows your tempo.',
    ])
    const along = screen.getByRole('group', { name: 'Listen and play along' })
    expect(
      within(along)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['50% speed', '75% speed', 'Original tempo'])
    expect(
      screen.getByRole('option', { name: 'Original tempo', selected: true }),
    ).toBeInTheDocument()
  })

  it('chooses a mode at the learner’s own pace, and closes', async () => {
    const user = userEvent.setup()
    const { onMode } = renderPace()
    await user.click(screen.getByRole('button', { name: 'Pace: 100%' }))
    await user.click(await screen.findByRole('option', { name: /^Interpret/ }))
    expect(onMode).toHaveBeenCalledWith('follow')
    expect(screen.queryByRole('dialog', { name: 'Pace' })).not.toBeInTheDocument()
  })

  it('listens at a speed chosen from Wait mode, no speed chosen while the music waits', async () => {
    const user = userEvent.setup()
    const { onListen } = renderPace({ mode: 'wait' })
    await user.click(screen.getByRole('button', { name: 'Pace: Wait mode' }))
    expect(
      await screen.findByRole('option', { name: /^Wait mode/, selected: true }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Original tempo', selected: false }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: '50% speed' }))
    expect(onListen).toHaveBeenLastCalledWith(36)
  })

  it('says Wait mode and Interpret need a piano where none is there to play', async () => {
    const user = userEvent.setup()
    renderPace({ piano: false })
    await user.click(screen.getByRole('button', { name: 'Pace: 100%' }))
    expect(await screen.findAllByText('Connect a piano or show the Keyboard.')).toHaveLength(2)
  })

  it('sets the speed in 5% steps of the piece’s tempo, from 50% to 200%, listening at it (ADR 0105)', async () => {
    const user = userEvent.setup()
    const { onListen } = renderPace()
    await user.click(screen.getByRole('button', { name: 'Pace: 100%' }))
    await screen.findByRole('dialog', { name: 'Pace' })
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
    expect(onListen).toHaveBeenLastCalledWith(76)
    await user.keyboard('{End}')
    expect(onListen).toHaveBeenLastCalledWith(144)
  })

  it('says a tempo at 200% and its beats a minute, its slider at its end', async () => {
    const user = userEvent.setup()
    renderPace({ tempo: 144, shownTempo: 144 })
    await user.click(screen.getByRole('button', { name: 'Pace: 200%' }))
    await screen.findByRole('dialog', { name: 'Pace' })
    expect(screen.getByRole('slider', { hidden: true })).toHaveAttribute('aria-valuenow', '200')
    expect(screen.getByText('200% · 144 BPM')).toBeInTheDocument()
  })

  it('puts a tempo between two steps on the nearer, saying its own share', async () => {
    const user = userEvent.setup()
    renderPace({ tempo: 60, shownTempo: 60 })
    await user.click(screen.getByRole('button', { name: 'Pace: 83%' }))
    await screen.findByRole('dialog', { name: 'Pace' })
    expect(screen.getByRole('slider', { hidden: true })).toHaveAttribute('aria-valuenow', '85')
    expect(screen.getByText('83% · 60 BPM')).toBeInTheDocument()
  })

  it('scrolls within the screen’s height where the screen is short (a phone on its side)', async () => {
    const user = userEvent.setup()
    renderPace()
    await user.click(screen.getByRole('button', { name: 'Pace: 100%' }))
    const dialog = await screen.findByRole('dialog', { name: 'Pace' })
    expect(dialog).toHaveClass('max-h-(--available-height)', 'overflow-y-auto')
  })

  it('offers speed training only below the piece’s tempo, in Listen', async () => {
    const user = userEvent.setup()
    renderPace({ tempo: 54, shownTempo: 54 })
    await user.click(screen.getByRole('button', { name: 'Pace: 75%' }))
    expect(await screen.findByRole('switch', { name: /Speed training/ })).toBeInTheDocument()
  })

  it('offers no speed training while the music waits', async () => {
    const user = userEvent.setup()
    renderPace({ mode: 'wait', tempo: 54, shownTempo: 54 })
    await user.click(screen.getByRole('button', { name: 'Pace: Wait mode' }))
    await screen.findByRole('dialog', { name: 'Pace' })
    expect(screen.queryByRole('switch', { name: /Speed training/ })).not.toBeInTheDocument()
  })

  it('writes the percent and the modes the Russian way', async () => {
    const user = userEvent.setup()
    act(() => void i18n.changeLanguage('ru'))
    renderPace({ tempo: 54, shownTempo: 54 })
    await user.click(screen.getByRole('button', { name: 'Темп: 75 %' }))
    expect(await screen.findByRole('option', { name: 'Скорость 50 %' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /^Режим ожидания/ })).toBeInTheDocument()
  })
})
