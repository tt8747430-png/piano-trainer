import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderRouted } from '@/app/testing/render-routed'
import { PATTERNS, type PatternFit } from '@/entities/pattern'
import { FigureRows } from './FigureRows'
import { MelodySwitch } from './MelodySwitch'
import { PlayerSetup } from './PlayerSetup'

/** A song in 4/4 with no tune and no methods of its own. */
const SONG: PatternFit = { methodCodes: false, melody: false, key: true, simpleTime: true }

async function renderSetup(fit: Partial<PatternFit> = {}) {
  const user = userEvent.setup()
  const onFigures = vi.fn()
  const view = await renderRouted(
    <PlayerSetup
      figures={{ pattern: 'block', rh: null, lh: null, inversion: null }}
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
    expect(screen.getByRole('option', { name: new RegExp(PATTERNS.r5.name.en) })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(screen.getByRole('option', { name: new RegExp(PATTERNS.ballad.name.en) }))
    expect(onFigures).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('offers From the chart only where the chart names its methods', async () => {
    const { user } = await renderSetup({ methodCodes: true })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('option', { name: /From the chart/ })).toBeInTheDocument()
  })

  it('goes back to the pattern’s own figure', async () => {
    const { user, onFigures } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand.*own/ }))
    await user.click(screen.getByRole('option', { name: /The pattern’s own/ }))
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
      screen.getByRole('option', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('Needs a key')).toBeInTheDocument()
  })

  it('keeps the Chord flow for music in a key', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('option', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).not.toHaveAttribute('aria-disabled')
  })

  it('closes what plays inside a beat to a piece in 6/8 or 12/8, keeping what plays on it', async () => {
    const { user } = await renderSetup({ simpleTime: false })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('option', { name: (name) => name.includes(PATTERNS.ballad.name.en) }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      screen.getByRole('option', { name: (name) => name.includes(PATTERNS.r1.name.en) }),
    ).not.toHaveAttribute('aria-disabled')
    expect(screen.getAllByText('Needs simple time').length).toBeGreaterThan(0)
  })

  it('opens on its first page again after it closes on a list', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    expect(screen.getByText('The music’s own choices')).toBeInTheDocument()
  })

  it('closes from a Close a screen reader reaches', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('The music’s own choices')).not.toBeInTheDocument()
  })

  it('opens a list on its choice, and goes back to the row that opened it', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('option', { name: new RegExp(PATTERNS.block.name.en) })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /^Pattern/ })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: /^Right hand/ }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('button', { name: /^Right hand/ })).toHaveFocus()
  })
})
