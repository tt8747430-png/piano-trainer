import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { PATTERNS, type PatternFit } from '@/entities/pattern'
import { FigureRows } from './FigureRows'
import { MelodySwitch } from './MelodySwitch'
import { PlayerSetup } from './PlayerSetup'

/** A song in 4/4 with no tune and no methods of its own. */
const SONG: PatternFit = { methodCodes: false, melody: false, key: true, simpleTime: true }

async function renderSetup(fit: Partial<PatternFit> = {}) {
  const user = userEvent.setup()
  const onFigures = vi.fn()
  const view = renderWithSettings(
    <PlayerSetup
      figures={{ pattern: 'block', rh: null, lh: null }}
      fit={{ ...SONG, ...fit }}
      onFigures={onFigures}
    >
      <p>The music’s own choices</p>
      <FigureRows />
      <MelodySwitch />
    </PlayerSetup>,
  )
  await user.click(screen.getByRole('button', { name: 'Setup' }))
  return { user, onFigures, ...view }
}

describe('PlayerSetup', () => {
  it('opens from its button on the page’s own choices, with the figure rows', async () => {
    await renderSetup()
    expect(screen.getByText('The music’s own choices')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Pattern.*Whole notes/ })).toBeInTheDocument()
  })

  it('chooses a pattern from its group, keeping melody patterns from music without a tune', async () => {
    const { user, onFigures } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: new RegExp(PATTERNS.r5.name.en) })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: new RegExp(PATTERNS.ballad.name.en) }))
    expect(onFigures).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('offers From the chart only where the chart names its methods', async () => {
    const { user } = await renderSetup({ methodCodes: true })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: /From the chart/ })).toBeInTheDocument()
  })

  it('goes back to the pattern’s own figure', async () => {
    const { user, onFigures } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand.*own/ }))
    await user.click(screen.getByRole('button', { name: /The pattern’s own/ }))
    expect(onFigures).toHaveBeenCalledWith({ rh: undefined })
  })

  it('saves the melody switch in settings', async () => {
    const { user, settingsStore } = await renderSetup({ melody: true })
    await user.click(screen.getByRole('switch', { name: 'Melody' }))
    expect(settingsStore.getState().practice.melody).toBe(true)
  })

  it('closes what plays the key’s triads to music without a key', async () => {
    const { user } = await renderSetup({ key: false })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeDisabled()
    expect(screen.getByText('Needs a key')).toBeInTheDocument()
  })

  it('keeps the Chord flow for music in a key', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeEnabled()
  })

  it('closes what plays inside a beat to a piece in 6/8 or 12/8, keeping what plays on it', async () => {
    const { user } = await renderSetup({ simpleTime: false })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.ballad.name.en) }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.r1.name.en) }),
    ).toBeEnabled()
    expect(screen.getAllByText('Needs simple time').length).toBeGreaterThan(0)
  })

  it('opens on its first page again after it closes on a list', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    expect(screen.getByText('The music’s own choices')).toBeInTheDocument()
  })
})
