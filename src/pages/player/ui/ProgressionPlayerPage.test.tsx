import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { createMemoryStorage } from '@/shared/lib'

describe('A progression in the Player', () => {
  it('plays numerals in a key as sheet music, titled by them', async () => {
    await renderApp('/play/progression?p=ii-V-I&key=Bb')
    expect(await screen.findByRole('heading', { name: 'ii–V–I in B♭ major' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: Cm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 3: B♭' })).toBeInTheDocument()
  })

  it('changes the chord size and the key in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=Bb')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('radio', { name: '7ths' }))
    expect(router.state.location.search).toMatchObject({ chordSize: 'sevenths' })
    expect(
      await screen.findByRole('button', { name: 'Bar 1: Cm7', hidden: true }),
    ).toBeInTheDocument()
    const key = screen.getByRole('group', { name: 'Key' })
    await user.click(within(key).getByRole('radio', { name: 'G' }))
    expect(router.state.location.search).toMatchObject({ key: 'Gb', p: 'ii-V-I' })
    await user.click(within(key).getByRole('radio', { name: 'Natural' }))
    expect(router.state.location.search).toMatchObject({ key: 'G', p: 'ii-V-I' })
  })

  it('keeps every chord in the inversion chosen in the Setup', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp(
      '/play/progression?p=ii-V-I&key=C&chordSize=sevenths&hands=rh',
    )
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(screen.getByRole('radio', { name: 'Nearest' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: '1st' }))
    expect(router.state.location.search).toMatchObject({ inversion: 1 })
    await user.keyboard('{Escape}')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    // Dm7 from its 3rd: F3 A3 C4 D4.
    await waitFor(() => expect(audio.played).not.toHaveLength(0))
    const first = audio.played[0]?.sounds.flatMap((sound) =>
      sound.kind === 'note' && sound.at === 0 ? [sound.midi] : [],
    )
    expect(first?.toSorted((a, b) => a - b)).toEqual([53, 57, 60, 62])
  })

  it('fades the inversion under a pattern that plays its own shapes', async () => {
    const user = userEvent.setup()
    await renderApp('/play/progression?p=ii-V-I&key=C&pattern=flow')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(screen.getByRole('radio', { name: '1st' })).toHaveAttribute('data-disabled')
    expect(screen.getByText('This pattern plays its own shapes.')).toBeInTheDocument()
  })

  it('walks the progression through the keys chosen in the Setup, titled by the walk', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=C&chordSize=sevenths')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(screen.getByRole('combobox', { name: 'Through the keys' }))
    await user.click(await screen.findByRole('option', { name: 'Up by semitones' }))
    expect(router.state.location.search).toMatchObject({ walk: 'semitones-up' })
    expect(
      await screen.findByRole('heading', {
        name: 'ii–V–I from C major, up by semitones',
        hidden: true,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 4: E♭m7', hidden: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 39: CMaj7', hidden: true })).toBeInTheDocument()
  })

  it('opens the default progression for a line it cannot read', async () => {
    await renderApp('/play/progression?p=Q')
    expect(await screen.findByRole('heading', { name: 'I–V–vi–IV in C major' })).toBeInTheDocument()
  })

  it('closes to the Progressions tool on the same numerals and key when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=Bb')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    expect(router.state.location.pathname).toBe('/practice/progressions')
    expect(router.state.location.search).toMatchObject({ p: 'ii-V-I', key: 'Bb' })
  })

  describe('its pattern picker', () => {
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
    const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(await screen.findByRole('button', { name: 'Setup' }))
      await user.click(screen.getByRole('button', { name: /^Pattern/ }))
      return screen.getByRole('listbox', { name: 'Pattern' })
    }

    it('offers favourites and the learner’s own first, each with its idea, and plays their own', async () => {
      const user = userEvent.setup()
      const { router } = await renderApp('/play/progression?p=ii-V-I', { storage: saved() })
      const list = await openPicker(user)
      const [first, second] = within(list).getAllByRole('group')
      expect(first).toBe(within(list).getByRole('group', { name: 'Favourites' }))
      expect(second).toBe(within(list).getByRole('group', { name: 'Your patterns' }))
      // Every book's shelves are in one list here, so a method book's says its book first.
      for (const name of [
        'Called to Play · The 5 ways (lesson 3)',
        'Called to Play · Right-hand techniques',
        'Боброва · The 7 types of accompaniment',
        'Rhythm styles',
      ]) {
        expect(within(list).getByRole('group', { name })).toBeInTheDocument()
      }
      if (!first) throw new Error('the favourites')
      expect(
        within(first).getByRole('option', { name: /^Rock Driving 8th-note chords/ }),
      ).toBeInTheDocument()
      await user.click(within(list).getByRole('option', { name: /^Sunday/ }))
      expect(router.state.location.search).toMatchObject({ pattern: 'my-1' })
      expect(screen.getByRole('button', { name: /^Pattern.*Sunday/ })).toBeInTheDocument()
    })

    it('leaves the hidden out, but for the one playing', async () => {
      const user = userEvent.setup()
      await renderApp('/play/progression?p=ii-V-I&pattern=ballad', { storage: saved() })
      const list = await openPicker(user)
      expect(within(list).getByRole('option', { name: /^Ballad arpeggio/ })).toBeInTheDocument()
      expect(within(list).queryByRole('option', { name: /^Funk/ })).toBeNull()
      expect(screen.getByRole('link', { name: /^All patterns/ })).toHaveAttribute(
        'href',
        '/practice/accompaniment',
      )
    })

    it('plays its own pattern for one of the learner’s since deleted', async () => {
      const user = userEvent.setup()
      await renderApp('/play/progression?p=ii-V-I&pattern=my-7', { storage: saved() })
      await user.click(await screen.findByRole('button', { name: 'Setup' }))
      expect(screen.getByRole('button', { name: /^Pattern.*Whole notes/ })).toBeInTheDocument()
    })
  })
})
