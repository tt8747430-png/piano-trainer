import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { PATTERNS } from '@/entities/pattern'
import { FigureRows } from './FigureRows'
import { MelodySwitch } from './MelodySwitch'
import { PlayerSetup } from './PlayerSetup'

function renderSetup({ methods = false, melody = false, keyed = true } = {}) {
  const onFigures = vi.fn()
  const view = renderWithSettings(
    <PlayerSetup
      open
      onOpenChange={() => {}}
      figures={{ pattern: 'block', rh: null, lh: null }}
      methods={methods}
      melody={melody}
      keyed={keyed}
      onFigures={onFigures}
    >
      <p>The source’s own choices</p>
      <FigureRows />
      <MelodySwitch />
    </PlayerSetup>,
  )
  return { onFigures, ...view }
}

describe('PlayerSetup', () => {
  it('shows the page’s own choices on its first page, with the figure rows', () => {
    renderSetup()
    expect(screen.getByText('The source’s own choices')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Pattern.*Whole notes/ })).toBeInTheDocument()
  })

  it('chooses a pattern from its group, keeping melody patterns from a source without a tune', async () => {
    const user = userEvent.setup()
    const { onFigures } = renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: new RegExp(PATTERNS.r5.name.en) })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: new RegExp(PATTERNS.ballad.name.en) }))
    expect(onFigures).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('offers From the chart only where the chart names its methods', async () => {
    const user = userEvent.setup()
    renderSetup({ methods: true })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: /From the chart/ })).toBeInTheDocument()
  })

  it('goes back to the pattern’s own figure', async () => {
    const user = userEvent.setup()
    const { onFigures } = renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand.*own/ }))
    await user.click(screen.getByRole('button', { name: /The pattern’s own/ }))
    expect(onFigures).toHaveBeenCalledWith({ rh: undefined })
  })

  it('saves the melody switch in settings', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderSetup({ melody: true })
    await user.click(screen.getByRole('switch', { name: 'Melody' }))
    expect(settingsStore.getState().practice.melody).toBe(true)
  })

  it('closes what plays the key’s triads to a source without a key', async () => {
    const user = userEvent.setup()
    renderSetup({ keyed: false })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeDisabled()
    expect(screen.getByText('Needs a key')).toBeInTheDocument()
  })

  it('keeps the Chord flow for a source in a key', async () => {
    const user = userEvent.setup()
    renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeEnabled()
  })
})
