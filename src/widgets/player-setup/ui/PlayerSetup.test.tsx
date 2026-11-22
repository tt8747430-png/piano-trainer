import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderRouted } from '@/app/testing/render-routed'
import {
  createPracticeLibraryStore,
  PracticeLibraryStoreProvider,
} from '@/entities/practice-library'
import {
  BUILT_IN_PATTERNS,
  LEFT_FIGURES,
  RIGHT_FIGURES,
  type AccompanimentChoice,
  type PatternFit,
  type PatternRef,
} from '@/entities/pattern'
import { withTrack, type PlayerStaves } from '@/features/practice'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeArranger } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { ServicesProvider } from '@/shared/lib/services'
import type { ScoreTrack } from '@/widgets/practice-player'
import { PatternCard } from './PatternCard'
import { PlayerSetup } from './PlayerSetup'
import { StavesSection } from './StavesSection'

/** A tune over the piano, and a recording. */
const TRACKS: readonly ScoreTrack[] = [
  { id: 'staff0', label: 'Voice', clef: 'treble', drawn: true },
  { id: 'treble', label: 'Upper staff', clef: 'treble', drawn: true },
  { id: 'bass', label: 'Lower staff', clef: 'bass', drawn: true },
  { id: 'recording', label: 'Recording', drawn: false },
]

/** A song in 4/4 with no tune and no methods of its own. */
const SONG: PatternFit = { methodCodes: false, tune: false, key: true, simpleTime: true }

async function renderSetup(
  fit: Partial<PatternFit> = {},
  figures: Partial<AccompanimentChoice> = {},
  staves: PlayerStaves = {},
) {
  const user = userEvent.setup()
  const onFigures = vi.fn()
  const onStaves = vi.fn()
  const library = createPracticeLibraryStore({
    storage: createMemoryStorage(),
    otherTabs: new EventTarget(),
  })
  const view = await renderRouted(
    <ServicesProvider
      services={{ audio: createFakeAudio(), arranger: createFakeArranger(), midi: null }}
    >
      <PracticeLibraryStoreProvider store={library}>
        <PlayerSetup
          figures={{
            pattern: 'block',
            rh: null,
            lh: null,
            inversion: null,
            nearest: true,
            ...figures,
          }}
          fit={{ ...SONG, ...fit }}
          onFigures={onFigures}
        >
          <p>The music’s own choices</p>
          <StavesSection tracks={TRACKS} staves={staves} onChange={onStaves} />
          <PatternCard />
        </PlayerSetup>
      </PracticeLibraryStoreProvider>
    </ServicesProvider>,
  )
  await user.click(screen.getByRole('button', { name: 'Player settings' }))
  return { user, onFigures, onStaves, ...view }
}

/** The Pattern page, opened from the Pattern row. */
const openPatterns = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: /^Pattern/ }))

/** A pattern's row on the Pattern page, by its name; its book's fold must be open. */
const patternRow = (id: PatternRef) =>
  screen.getByRole('button', {
    name: (name) => name.startsWith(BUILT_IN_PATTERNS.require(id).name.en),
  })

/** A pattern's row, found by searching its name: the search opens every fold it narrows to. */
async function findPattern(user: ReturnType<typeof userEvent.setup>, id: PatternRef) {
  const search = screen.getByRole('searchbox', { name: 'Search patterns' })
  await user.clear(search)
  await user.type(search, BUILT_IN_PATTERNS.require(id).name.en)
  return patternRow(id)
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

  it('starts the first chord in root position, voice-led after it, by default', async () => {
    const { user, onFigures } = await renderSetup()
    expect(screen.getByRole('radio', { name: 'Root' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Voice-led' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: '1st' }))
    expect(onFigures).toHaveBeenCalledWith({ inversion: 1 })
    await user.click(screen.getByRole('radio', { name: 'Block' }))
    expect(onFigures).toHaveBeenCalledWith({ nearest: false })
  })

  it('draws each inversion on the keys beside its name (ADR 0115)', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: 'About First chord’s inversion' }))
    const about = await screen.findByRole('dialog', { name: 'First chord’s inversion' })
    expect(about).toHaveTextContent('Which note of the first chord sits lowest')
    for (const name of ['Root position: C E G', '1st inversion: E G C', '2nd inversion: G C E'])
      expect(screen.getByRole('img', { name })).toBeInTheDocument()
  })

  it('fades the position From the chart only where no pattern the chart plays follows it, saying why beside it', async () => {
    const fromChart = { pattern: 'chart' } as const
    const { user, unmount } = await renderSetup({ methodCodes: true, chart: ['flow'] }, fromChart)
    expect(screen.getByRole('radio', { name: 'Voice-led' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(screen.getByRole('button', { name: 'About First chord’s inversion' }))
    expect(
      await screen.findByRole('dialog', { name: 'First chord’s inversion' }),
    ).toHaveTextContent('This pattern plays its own shapes.')
    unmount()
    await renderSetup({ methodCodes: true, chart: ['flow', 'block'] }, fromChart)
    expect(screen.getByRole('radio', { name: 'Voice-led' })).not.toHaveAttribute('aria-disabled')
  })

  it('turns Voice-led back on, the URL’s own', async () => {
    const { user, onFigures } = await renderSetup({}, { inversion: 2, nearest: false })
    expect(screen.getByRole('radio', { name: '2nd' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Block' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'Voice-led' }))
    expect(onFigures).toHaveBeenCalledWith({ nearest: undefined })
  })

  it('chooses a pattern found by its name, keeping tune patterns from music without a tune', async () => {
    const { user, onFigures } = await renderSetup()
    await openPatterns(user)
    expect(await findPattern(user, 'r5')).toBeDisabled()
    expect(screen.getByText('Needs a melody staff')).toBeInTheDocument()
    await user.click(await findPattern(user, 'ballad'))
    expect(onFigures).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('offers From the chart only where the chart names its methods', async () => {
    const { user, unmount } = await renderSetup({ methodCodes: true })
    await openPatterns(user)
    expect(screen.getByRole('button', { name: 'From the chart' })).toBeInTheDocument()
    unmount()
    const again = await renderSetup()
    await openPatterns(again.user)
    expect(screen.queryByRole('button', { name: 'From the chart' })).not.toBeInTheDocument()
  })

  it('goes back to the pattern’s own figure', async () => {
    const { user, onFigures } = await renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand: / }))
    await user.click(screen.getByRole('option', { name: /The pattern’s own/ }))
    expect(onFigures).toHaveBeenCalledWith({ rh: undefined })
  })

  it('lists each track with Play and Show, the recording with Play alone (A35)', async () => {
    const { user, onStaves } = await renderSetup({}, {}, withTrack({}, 'bass', { play: false }))
    const switches = within(screen.getByRole('group', { name: 'Staves' })).getAllByRole('switch')
    expect(
      switches.map((each) => [each.getAttribute('aria-label'), each.getAttribute('aria-checked')]),
    ).toEqual([
      ['Play Voice', 'true'],
      ['Show Voice', 'true'],
      ['Play Upper staff', 'true'],
      ['Show Upper staff', 'true'],
      ['Play Lower staff', 'false'],
      ['Show Lower staff', 'true'],
      ['Play Recording', 'true'],
    ])
    await user.click(screen.getByRole('switch', { name: 'Show Voice' }))
    expect(onStaves).toHaveBeenCalledWith('staff0', { show: false })
  })

  it('closes what plays the key’s triads to music without a key', async () => {
    const { user } = await renderSetup({ key: false })
    await openPatterns(user)
    expect(await findPattern(user, 'flow')).toBeDisabled()
    expect(screen.getByText('Needs a key')).toBeInTheDocument()
  })

  it('keeps the Chord flow for music in a key', async () => {
    const { user } = await renderSetup()
    await openPatterns(user)
    expect(await findPattern(user, 'flow')).toBeEnabled()
  })

  it('closes what plays inside a beat to a piece in 6/8 or 12/8, keeping what plays on it', async () => {
    const { user } = await renderSetup({ simpleTime: false })
    await openPatterns(user)
    expect(await findPattern(user, 'ballad')).toBeDisabled()
    expect(screen.getByText('Needs simple time')).toBeInTheDocument()
    expect(await findPattern(user, 'r1')).toBeEnabled()
  })

  it('opens on its first page again after it closes on a list', async () => {
    const { user } = await renderSetup()
    await openPatterns(user)
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Player settings' }))
    expect(screen.getByText('The music’s own choices')).toBeInTheDocument()
  })

  it('closes from its Done', async () => {
    const { user } = await renderSetup()
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByText('The music’s own choices')).not.toBeInTheDocument()
  })

  it('opens a list on its choice, and goes back to the row that opened it', async () => {
    const { user } = await renderSetup()
    await openPatterns(user)
    expect(patternRow('block')).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /^Pattern/ })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: /^Right hand/ }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('button', { name: /^Right hand/ })).toHaveFocus()
  })
})
