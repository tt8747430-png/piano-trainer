import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { SettingsStore } from '@/entities/settings'
import { setMidi, setScoreView } from '@/features/set-preference'
import { SHORTEST_PRESS_MS } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { menuOptions, pickIn, pickerValue } from '@/shared/test/pickers'
import { stubResizeObserver } from '@/shared/test/resize'

type User = ReturnType<typeof userEvent.setup>

/** The chord named, as its pickers spell it. */
const named = (symbol: string) => screen.findByRole('heading', { level: 2, name: symbol })
/** The floating bar's Play, named by what it plays (Play chord, Arpeggiate) or Stop. */
const play = () => within(screen.getByRole('toolbar', { name: 'Transport' })).getAllByRole('button')
/** The keys drawn flat rather than the hands at them (the Piano sheet's The piano as). */
const flatKeys = (settingsStore: SettingsStore) =>
  act(() => setScoreView(settingsStore, { hands: false }))

/** The staff's card laid out at a phone's width, as jsdom lays out nothing. */
const layOutStaff = () => {
  stubResizeObserver({ width: 343, height: 160 })
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(343)
}

/** Chooses a chord type by its symbol on the root, from the name's Chord type picker. */
async function chooseType(user: User, symbol: string) {
  await user.click(screen.getByRole('button', { name: /^Chord type: / }))
  const list = await screen.findByRole('listbox', { name: 'Chord type' })
  const option = within(list)
    .getAllByRole('option')
    .find((each) => [...each.querySelectorAll('span')].some((part) => part.textContent === symbol))
  if (!option) throw new Error(`no ${symbol} among the chord types`)
  await user.click(option)
}

describe('Practice → Chords', () => {
  it('keeps the scroll when a choice changes the chord', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chords')
    await named('Cmaj7')
    vi.mocked(window.scrollTo).mockClear()
    await pickIn(user, 'Root', 'D')
    await named('Dmaj7')
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('shows Cmaj7 by default, its name as three pickers: root, type and the note in the bass', async () => {
    await renderApp('/practice/chords')
    expect(await named('Cmaj7')).toBeInTheDocument()
    expect(pickerValue('Root')).toBe('C')
    expect(pickerValue('Chord type')).toBe('Cmaj7')
    expect(pickerValue('In the bass')).toBe('Root position')
  })

  it('builds a chord through its pickers, kept in the URL, sounding each choice', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/chords?root=G')
    await named('Gmaj7')
    await chooseType(user, 'Gm7')
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ root: 'G', triad: 'min' }),
    )
    expect(await named('Gm7')).toBeInTheDocument()
    await pickIn(user, 'Root', 'E')
    expect(router.state.location.search).toMatchObject({ root: 'E', triad: 'min' })
    expect(await named('Em7')).toBeInTheDocument()
    expect(audio.played.length).toBeGreaterThan(1)
  })

  it('counts a key practised once a chord opened in it plays (B1)', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/practice/chords?root=D&triad=min&size=5&key=C')
    expect(await named('Dm')).toBeInTheDocument()
    expect(progressStore.getState().keys['C']).toBeUndefined()
    await user.click(screen.getByRole('button', { name: 'Play chord' }))
    await waitFor(() => expect(progressStore.getState().keys['C']).toBeDefined())
  })

  it('writes the chord on a staff', async () => {
    layOutStaff()
    await renderApp('/practice/chords?triad=dim&size=7&seventh=diminished')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument(), { timeout: 5000 })
  })

  it('keeps the chord written while it plays, engraving it once', async () => {
    layOutStaff()
    const user = userEvent.setup()
    await renderApp('/practice/chords')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument(), { timeout: 5000 })
    const engraved = sheet.querySelector('svg')
    await user.click(screen.getByRole('button', { name: 'Play chord' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(sheet.querySelector('svg')).toBe(engraved)
  })

  it('plays from one floating bar: the voicing, Play with how it plays, the hands', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chords')
    await named('Cmaj7')
    expect(play().map((button) => button.getAttribute('aria-label') ?? button.textContent)).toEqual(
      ['Voicing: Close position', 'Play chord', 'Play as', 'Hands: Right hand'],
    )
    await user.click(screen.getByRole('button', { name: 'Play as' }))
    expect(
      (await screen.findAllByRole('menuitemcheckbox')).map((each) => each.textContent),
    ).toEqual(['Block chord', 'Arpeggio'])
  })

  it('rolls an arpeggio from Play as, Play then named for it', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    await named('Cmaj7')
    await user.click(screen.getByRole('button', { name: 'Play as' }))
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Arpeggio' }))
    await user.click(await screen.findByRole('button', { name: 'Arpeggiate' }))
    const sounds = audio.played.at(-1)?.sounds ?? []
    // One note after another: each starts on its own.
    const starts = new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : [])))
    expect(starts.size).toBe(4)
  })

  it('turns Play into Stop while the chord sounds, and back when it ends', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    await user.click(await screen.findByRole('button', { name: 'Play chord' }))
    const start = audio.played.at(-1)?.at ?? 0
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    act(() => audio.setNow(start + 1.7))
    expect(await screen.findByRole('button', { name: 'Play chord' })).toBeInTheDocument()
  })

  it('stops the chord on Stop', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    await user.click(await screen.findByRole('button', { name: 'Play chord' }))
    const stops = audio.stops
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBe(stops + 1)
    expect(screen.getByRole('button', { name: 'Play chord' })).toBeInTheDocument()
  })

  it('sounds a tapped key on the keys drawn flat', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/practice/chords')
    await named('Cmaj7')
    flatKeys(settingsStore)
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'A4' }))
    expect(audio.voice[0]).toEqual({ kind: 'press', midi: 69, velocity: 100 })
  })

  it('offers only the inversions the chord has, each by the note in its bass', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chords')
    await named('Cmaj7')
    expect(await menuOptions(user, 'In the bass')).toEqual([
      'Root position',
      '1st inversion · E in the bass',
      '2nd inversion · G in the bass',
      '3rd inversion · B in the bass',
    ])
    await user.click(screen.getByRole('button', { name: /^In the bass: / }))
    await user.click(await screen.findByRole('option', { name: /^1st inversion/ }))
    expect(router.state.location.search).toMatchObject({ inversion: 1 })
    expect(pickerValue('In the bass')).toBe('1st inversion · E in the bass')
  })

  it('shares a chord of five notes between the hands, with no hand or bass to choose', async () => {
    await renderApp('/practice/chords?size=9&seventh=minor')
    expect(await named('C9')).toBeInTheDocument()
    // One hand cannot hold the stack: both hands play it, and the choice is not offered.
    expect(screen.getByRole('button', { name: 'Hands: Both hands' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: /^In the bass: / })).toBeNull()
  })

  it('opened from a path step, offers its check and its learned toggle', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp(
      '/practice/chords?size=7&seventh=major&step=chords:sev',
    )
    const check = await screen.findByRole('link', { name: 'Check yourself' })
    expect(check.getAttribute('href')).toMatch(/^\/check\?of=chords(%3A|:)sev$/)
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['chords:sev']).toBeDefined()
  })

  it('prints the chord as the sheets print it, ♯ and ♭ as signs, the URL in ASCII', async () => {
    const { router } = await renderApp('/practice/chords?root=F%23&triad=dim&size=7&seventh=minor')
    expect(await named('F♯m7♭5')).toBeInTheDocument()
    expect(router.state.location.search).toMatchObject({ root: 'F#' })
  })

  it('is one page under a header with a way back, with no tabs', async () => {
    await renderApp('/practice/chords')
    expect(await screen.findByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Chords' })).not.toBeInTheDocument()
  })

  it('walks the chord in the Player: its arpeggio, chromatically and round the fifths, from its root', async () => {
    await renderApp('/practice/chords?root=E&triad=min&size=7&seventh=minor')
    await named('Em7')
    const practise =
      screen
        .getByRole('heading', { level: 3, name: 'Practise Em7 in the Player' })
        .closest('section') ?? document.body
    expect(within(practise).getByRole('link', { name: /^Arpeggio/ })).toHaveAttribute(
      'href',
      '/play/exercise/arpeggio?root=E&quality=m7',
    )
    const walk = within(practise).getByRole('link', { name: /^Chromatically/ })
    const [path, query] = (walk.getAttribute('href') ?? '').split('?')
    expect(path).toBe('/play/chromatic')
    const search = new URLSearchParams(query)
    expect(search.get('chords')).toBe('m7')
    expect(search.get('root')).toBe('E')
    expect(search.get('nearest')).toBe('false')
    expect(within(practise).getByRole('link', { name: /^Circle of fifths/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/direction=fifths/),
    )
  })

  it('walks the chord chromatically in the inversion shown, the same shape each semitone', async () => {
    await renderApp('/practice/chords?root=D&triad=min&size=7&seventh=minor&inversion=2')
    await named('Dm7')
    const walk = screen.getByRole('link', { name: /^Chromatically/ })
    const query = new URLSearchParams(walk.getAttribute('href')?.split('?')[1])
    expect(query.get('inversion')).toBe('2')
    expect(query.get('nearest')).toBe('false')
  })

  it('lays a chord out in the voicing chosen, offering only what it takes', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chords')
    await named('Cmaj7')
    await user.click(screen.getByRole('button', { name: /^Voicing: / }))
    // So What is a minor or suspended chord's: a major 7th is not offered it.
    const voicings = (await screen.findAllByRole('menuitemcheckbox')).map(
      (each) => each.textContent,
    )
    expect(voicings).toContain('Drop 2')
    expect(voicings).not.toContain('So What')
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Drop 2' }))
    expect(router.state.location.search).toMatchObject({ voicing: 'drop2' })
    expect(screen.getByRole('button', { name: 'Voicing: Drop 2' })).toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    await renderApp('/practice/chords', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Аккорды' })).toBeInTheDocument()
  })
})

describe('Practice → Chords, on a MIDI keyboard', () => {
  it('sounds a MIDI key only once Sound the MIDI keyboard is on', async () => {
    const { audio, midi: keyboard, settingsStore } = await renderApp('/practice/chords')
    await named('Cmaj7')
    flatKeys(settingsStore)
    await screen.findByRole('group', { name: 'Keyboard' })
    act(() => keyboard.press(midi(60)))
    act(() => keyboard.release(midi(60)))
    expect(audio.voice).toEqual([])
    act(() => setMidi(settingsStore, { sound: true }))
    act(() => keyboard.press(midi(60), { velocity: 90 }))
    expect(audio.voice).toEqual([{ kind: 'press', midi: 60, velocity: 90 }])
  })

  it('keeps a key let go under the pedal down until the pedal comes up', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { midi: keyboard, settingsStore } = await renderApp('/practice/chords')
    await named('Cmaj7')
    flatKeys(settingsStore)
    const keys = await screen.findByRole('group', { name: 'Keyboard' })
    const c4 = within(keys).getByRole('button', { name: 'C4' })
    act(() => {
      keyboard.pedal(true)
      keyboard.press(midi(60))
    })
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    act(() => keyboard.release(midi(60)))
    expect(c4).toHaveAttribute('data-down')
    act(() => keyboard.pedal(false))
    expect(c4).not.toHaveAttribute('data-down')
    vi.useRealTimers()
  })
})
