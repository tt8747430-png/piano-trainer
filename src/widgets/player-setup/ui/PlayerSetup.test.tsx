import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderRouted } from '@/app/testing/render-routed'
import {
  BUILT_IN_PATTERNS,
  LEFT_FIGURES,
  RIGHT_FIGURES,
  type AccompanimentChoice,
  type PatternFit,
} from '@/entities/pattern'
import { melodyOf } from '../model/melody'
import { MelodyField } from './MelodyField'
import { PatternCard } from './PatternCard'
import { PlayerSetup } from './PlayerSetup'

/** A song in 4/4 with no tune and no methods of its own. */
const SONG: PatternFit = { methodCodes: false, tune: false, key: true, simpleTime: true }

async function renderSetup(
  fit: Partial<PatternFit> = {},
  figures: Partial<AccompanimentChoice> = {},
) {
  const user = userEvent.setup()
  const onFigures = vi.fn()
  const view = await renderRouted(
    <PlayerSetup
      figures={{ pattern: 'block', rh: null, lh: null, inversion: null, nearest: true, ...figures }}
      fit={{ ...SONG, ...fit }}
      onFigures={onFigures}
    >
      <p>The music’s own choices</p>
      <PatternCard />
      <MelodyField
        melody={melodyOf('none', {
          staff: fit.tune ?? false,
          recording: false,
          inOwnKey: true,
          leadSheet: false,
        })}
        staff="Melody"
        ownKey="C major"
      />
    </PlayerSetup>,
  )
  await user.click(screen.getByRole('button', { name: 'Setup' }))
  return { user, onFigures, ...view }
}

describe('PlayerSetup', () => {
  it('opens from its button on the page’s own choices, with the pattern and its two hands', async () => {
    await renderSetup()
    expect(screen.getByText('The music’s own choices')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Pattern.*Whole notes/ })).toBeInTheDocument()
  })

  it('names the figure each hand plays: the pattern’s own until the learner changes it', async () => {
    await renderSetup()
    expect(
      screen.getByRole('button', {
        name: `Right hand: ${RIGHT_FIGURES[BUILT_IN_PATTERNS.require('block').rh].name.en}`,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: `Left hand: ${LEFT_FIGURES[BUILT_IN_PATTERNS.require('block').lh].name.en}`,
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /back to the pattern’s own/ })).toBeNull()
  })

  it('shows a changed hand by its figure, your choice, with a way back to the pattern’s own beside it', async () => {
    const { user, onFigures } = await renderSetup({}, { rh: 'b2' })
    expect(
      screen.getByRole('button', { name: `Right hand: ${RIGHT_FIGURES.b2.name.en}, Your choice` }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Right hand: back to the pattern’s own' }))
    expect(onFigures).toHaveBeenCalledWith({ rh: undefined })
    expect(
      screen.queryByRole('button', { name: 'Left hand: back to the pattern’s own' }),
    ).toBeNull()
  })

  it('says on the pattern which hand the learner changed, the pattern their mix, and goes back to it', async () => {
    const { user, onFigures } = await renderSetup({}, { lh: 'o' })
    const pattern = screen.getByRole('button', {
      name: /^Pattern: Whole notes.*, left hand changed$/,
    })
    expect(pattern).toHaveTextContent('your mix')
    await user.click(screen.getByRole('button', { name: 'Back to the pattern' }))
    expect(onFigures).toHaveBeenCalledWith({ lh: undefined, rh: undefined })
  })

  it('says what a pattern is, and what choosing a hand does, beside its name', async () => {
    const { user } = await renderSetup()
    expect(screen.queryByRole('button', { name: 'Back to the pattern' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'About Pattern' }))
    expect(await screen.findByRole('dialog', { name: 'Pattern' })).toHaveTextContent(
      'the music changes at once, and the pattern becomes your own mix',
    )
  })

  it('draws what each hand’s part plays, in its row and in its list', async () => {
    const { user } = await renderSetup()
    const right = screen.getByRole('button', { name: /^Right hand: / })
    expect(right.querySelector('svg rect')).not.toBeNull()
    await user.click(right)
    for (const option of screen.getAllByRole('option').slice(1))
      expect(option.querySelector('svg rect')).not.toBeNull()
  })

  it('says both hands are changed when both are', async () => {
    await renderSetup({}, { lh: 'o', rh: 'b2' })
    expect(
      screen.getByRole('button', { name: /^Pattern: Whole notes.*, both hands changed$/ }),
    ).toBeInTheDocument()
  })

  it('starts the first chord in root position, moving smoothly after it, by default', async () => {
    const { user, onFigures } = await renderSetup()
    expect(screen.getByRole('radio', { name: 'Root' })).toBeChecked()
    expect(screen.getByRole('switch', { name: /Move smoothly/ })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: '1st' }))
    expect(onFigures).toHaveBeenCalledWith({ inversion: 1 })
    await user.click(screen.getByRole('switch', { name: /Move smoothly/ }))
    expect(onFigures).toHaveBeenCalledWith({ nearest: false })
  })

  it('draws each starting position on the keys beside its name (ADR 0115)', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: 'About Starting position' }))
    const about = await screen.findByRole('dialog', { name: 'Starting position' })
    expect(about).toHaveTextContent('Which note of the first chord your hand plays lowest')
    for (const name of ['Root position: C E G', '1st inversion: E G C', '2nd inversion: G C E'])
      expect(screen.getByRole('img', { name })).toBeInTheDocument()
  })

  it('fades the position From the chart only where no pattern the chart plays follows it, saying why beside it', async () => {
    const fromChart = { pattern: 'chart' } as const
    const { user, unmount } = await renderSetup({ methodCodes: true, chart: ['flow'] }, fromChart)
    expect(screen.getByRole('switch', { name: 'Move smoothly' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(screen.getByRole('button', { name: 'About Starting position' }))
    expect(await screen.findByRole('dialog', { name: 'Starting position' })).toHaveTextContent(
      'This pattern plays its own shapes.',
    )
    unmount()
    await renderSetup({ methodCodes: true, chart: ['flow', 'block'] }, fromChart)
    expect(screen.getByRole('switch', { name: 'Move smoothly' })).not.toHaveAttribute(
      'aria-disabled',
    )
  })

  it('turns Move smoothly back on, the URL’s own', async () => {
    const { user, onFigures } = await renderSetup({}, { inversion: 2, nearest: false })
    expect(screen.getByRole('radio', { name: '2nd' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'Move smoothly' })).not.toBeChecked()
    await user.click(screen.getByRole('switch', { name: /Move smoothly/ }))
    expect(onFigures).toHaveBeenCalledWith({ nearest: undefined })
  })

  it('chooses a pattern from its group, keeping tune patterns from music without a tune', async () => {
    const { user, onFigures } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('option', { name: new RegExp(BUILT_IN_PATTERNS.require('r5').name.en) }),
    ).toHaveAttribute('aria-disabled', 'true')
    await user.click(
      screen.getByRole('option', { name: new RegExp(BUILT_IN_PATTERNS.require('ballad').name.en) }),
    )
    expect(onFigures).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('offers From the chart only where the chart names its methods', async () => {
    const { user } = await renderSetup({ methodCodes: true })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('option', { name: /From the chart/ })).toBeInTheDocument()
  })

  it('goes back to the pattern’s own figure', async () => {
    const { user, onFigures } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand: / }))
    await user.click(screen.getByRole('option', { name: /The pattern’s own/ }))
    expect(onFigures).toHaveBeenCalledWith({ rh: undefined })
  })

  it('saves the Melody chosen in settings, the staff by its name, a source the song has not greyed', async () => {
    const { user, settingsStore } = await renderSetup({ tune: true })
    const melody = screen.getByRole('radiogroup', { name: 'Melody' })
    const staff = screen.getByRole('radio', { name: 'Melody' })
    expect(screen.getByRole('radio', { name: 'None' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Recording' })).toHaveAttribute(
      'title',
      'This song has no recording',
    )
    await user.click(staff)
    expect(settingsStore.getState().melody).toBe('staff')
    expect(melody).toBeInTheDocument()
  })

  it('closes what plays the key’s triads to music without a key', async () => {
    const { user } = await renderSetup({ key: false })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('option', {
        name: (name) => name.includes(BUILT_IN_PATTERNS.require('flow').name.en),
      }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('Needs a key')).toBeInTheDocument()
  })

  it('keeps the Chord flow for music in a key', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('option', {
        name: (name) => name.includes(BUILT_IN_PATTERNS.require('flow').name.en),
      }),
    ).not.toHaveAttribute('aria-disabled')
  })

  it('closes what plays inside a beat to a piece in 6/8 or 12/8, keeping what plays on it', async () => {
    const { user } = await renderSetup({ simpleTime: false })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('option', {
        name: (name) => name.includes(BUILT_IN_PATTERNS.require('ballad').name.en),
      }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      screen.getByRole('option', {
        name: (name) => name.includes(BUILT_IN_PATTERNS.require('r1').name.en),
      }),
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
    expect(
      screen.getByRole('option', { name: new RegExp(BUILT_IN_PATTERNS.require('block').name.en) }),
    ).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /^Pattern/ })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: /^Right hand/ }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('button', { name: /^Right hand/ })).toHaveFocus()
  })
})
