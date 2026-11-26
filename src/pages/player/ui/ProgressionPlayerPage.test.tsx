import { screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { createMemoryStorage } from '@/shared/lib'
import type { Sound } from '@/shared/lib/schedule'

/** The lowest key the right hand plays these chords from: the left hand's bass is under it. */
const RIGHT_HAND = 48

/** The run's Setup, open over it as it opens. */
const setupSheet = () => screen.findByRole('dialog', { name: 'Setup' })

/** Start in the Setup: the run plays, the Setup closed. */
async function start(user: UserEvent) {
  await user.click(within(await setupSheet()).getByRole('button', { name: 'Start' }))
}

/** The run's gear, its Setup closed first: how the run is played. */
async function openGear(user: UserEvent) {
  await user.click(within(await setupSheet()).getByRole('button', { name: 'Close' }))
  await user.click(screen.getByRole('button', { name: 'Player settings' }))
  return screen.findByRole('dialog', { name: 'Player settings' })
}

/** The right hand's keys at the music's first moment, low to high. */
function firstChord(sounds: readonly Sound[]): number[] {
  const notes = sounds.flatMap((sound) =>
    sound.kind === 'note' && sound.midi >= RIGHT_HAND ? [sound] : [],
  )
  const first = Math.min(...notes.map((note) => note.at))
  return notes
    .filter((note) => note.at === first)
    .map((note) => note.midi)
    .toSorted((a, b) => a - b)
}

describe('A progression, a run of its own (the run boards)', () => {
  it('plays numerals in a key, titled by them', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/progression?p=ii-V-I&key=Bb')
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'ii – V – I in B♭ major' }),
    ).toBeInTheDocument()
    expect(audio.played).toHaveLength(1)
    expect(screen.getByRole('meter', { name: 'Chord 1 of 3' })).toBeInTheDocument()
  })

  it('changes the chord size in its Setup', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=Bb')
    await user.click(within(await setupSheet()).getByRole('radio', { name: '7ths' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ chordSize: 'sevenths', key: 'Bb' }),
    )
  })

  it('starts in the inversion chosen in its gear', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/play/progression?p=ii-V-I&key=C&chordSize=sevenths')
    const gear = await openGear(user)
    const inversion = within(gear).getByRole('radiogroup', { name: 'First chord’s inversion' })
    expect(within(inversion).getByRole('radio', { name: 'Root' })).toBeChecked()
    await user.click(within(inversion).getByRole('radio', { name: '1st' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ inversion: 1 }))
    await user.click(within(gear).getByRole('button', { name: 'Done' }))
    const transport = screen.getByRole('toolbar', { name: 'Setup, play and tempo' })
    await user.click(within(transport).getByRole('button', { name: 'Play' }))
    await waitFor(() => expect(audio.played).not.toHaveLength(0))
    // Dm7 from its 3rd: F3 A3 C4 D4, over the left hand's bass (Listen plays both, R29 B8).
    expect(firstChord(audio.played[0]?.sounds ?? [])).toEqual([53, 57, 60, 62])
  })

  it('keeps every chord in the first one’s inversion, Block in its gear', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp(
      '/play/progression?p=ii-V-I&key=C&chordSize=sevenths&inversion=1',
    )
    const gear = await openGear(user)
    await user.click(within(gear).getByRole('radio', { name: 'Block' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ inversion: 1, nearest: false }),
    )
    await user.click(within(gear).getByRole('button', { name: 'Done' }))
    const transport = screen.getByRole('toolbar', { name: 'Setup, play and tempo' })
    await user.click(within(transport).getByRole('button', { name: 'Play' }))
    await waitFor(() => expect(audio.played).not.toHaveLength(0))
    // The right hand's, over the left hand's bass (Listen plays both, R29 B8).
    const sounds = (audio.played[0]?.sounds ?? []).filter(
      (s) => s.kind !== 'note' || s.midi >= RIGHT_HAND,
    )
    const starts = [...new Set(sounds.flatMap((s) => (s.kind === 'note' ? [s.at] : [])))].sort(
      (a, b) => a - b,
    )
    const lowest = starts.map((at) =>
      Math.min(...sounds.flatMap((s) => (s.kind === 'note' && s.at === at ? [s.midi] : []))),
    )
    const changes = lowest.map((m) => m % 12).filter((pc, i, all) => pc !== all[i - 1])
    expect(changes.slice(0, 3)).toEqual([5, 11, 4]) // F, B, E: each from its 3rd
  })

  it('fades the inversion under a pattern that plays its own shapes, saying why in its ⓘ', async () => {
    const user = userEvent.setup()
    await renderApp('/play/progression?p=ii-V-I&key=C&pattern=flow')
    const gear = await openGear(user)
    const inversion = within(gear).getByRole('radiogroup', { name: 'First chord’s inversion' })
    expect(within(inversion).getByRole('radio', { name: '1st' })).toHaveAttribute('data-disabled')
    expect(within(gear).queryByText('This pattern plays its own shapes.')).toBeNull()
    await user.click(within(gear).getByRole('button', { name: 'About First chord’s inversion' }))
    expect(await screen.findByText(/This pattern plays its own shapes\./)).toBeInTheDocument()
  })

  it('walks the progression through the keys chosen in its Setup, counting its keys', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=C&chordSize=sevenths')
    await user.click(
      within(await setupSheet()).getByRole('radio', { name: 'Chromatically, rising' }),
    )
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ walk: 'semitones-up' }),
    )
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'ii – V – I in C major' }),
    ).toBeInTheDocument()
    // Up the twelve keys and home to C.
    expect(screen.getByRole('meter', { name: 'Key 1 of 13' })).toBeInTheDocument()
  })

  it('opens the default progression for a line it cannot read', async () => {
    const user = userEvent.setup()
    await renderApp('/play/progression?p=Q')
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'I – V – vi – IV in C major' }),
    ).toBeInTheDocument()
  })

  it('closes to the progression’s page in the same key when opened directly (R30-4)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=Bb')
    await start(user)
    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Close' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/progressions/jazz-cadence'),
    )
    expect(router.state.location.search).toMatchObject({ key: 'Bb' })
  })

  it('closes to a line typed on its own page, the library has none like it', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=I-I-IV&key=Bb')
    await start(user)
    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/progressions/line'))
    expect(router.state.location.search).toMatchObject({ p: 'I-I-IV', key: 'Bb' })
  })

  describe('its pattern', () => {
    const saved = () => {
      const storage = createMemoryStorage()
      storage.setItem(
        PATTERNS_STORAGE_KEY,
        JSON.stringify({
          state: {
            favourites: ['rock'],
            hidden: ['ballad', 'funk'],
            own: [{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }],
            nextOwn: 2,
          },
          version: 1,
        }),
      )
      return storage
    }

    it('plays one of the learner’s own chosen from its list', async () => {
      const user = userEvent.setup()
      const { router } = await renderApp('/play/progression?p=ii-V-I', { storage: saved() })
      const gear = await openGear(user)
      await user.click(within(gear).getByRole('button', { name: /^Pattern: / }))
      const list = await screen.findByRole('dialog', { name: 'Pattern' })
      await user.click(within(list).getByRole('radio', { name: 'Mine' }))
      await user.click(within(list).getByRole('button', { name: /^Sunday/ }))
      await waitFor(() => expect(router.state.location.search).toMatchObject({ pattern: 'my-1' }))
    })

    it('plays its own pattern for one of the learner’s since deleted', async () => {
      const user = userEvent.setup()
      await renderApp('/play/progression?p=ii-V-I&pattern=my-7', { storage: saved() })
      const gear = await openGear(user)
      expect(within(gear).getByRole('button', { name: 'Pattern: Whole notes' })).toBeInTheDocument()
    })
  })
})
