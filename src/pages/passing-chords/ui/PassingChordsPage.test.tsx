import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const onsets = (sounds: readonly Sound[] = []) =>
  new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : []))).size

/** Each note's onset and key, lowest first. */
const keysOf = (sounds: readonly Sound[]): [number, number][] =>
  sounds
    .flatMap((sound): [number, number][] => (sound.kind === 'note' ? [[sound.at, sound.midi]] : []))
    .sort((a, b) => a[1] - b[1])

describe('Practice → Passing chords', () => {
  it('suggests chords from C to E♭ by category, each in the key or chromatic, with its reason', async () => {
    await renderApp('/practice/progressions/passing?from=C&to=Eb')
    const dominant = await screen.findByRole('region', { name: 'Dominant' })
    const secondary = within(dominant).getByRole('article', { name: 'Secondary dominant' })
    expect(within(secondary).getByRole('button', { name: 'B♭7' })).toBeInTheDocument()
    expect(secondary).toHaveTextContent('Chromatic')
    expect(secondary).toHaveTextContent('B♭7 is the V7 of E♭.')
    expect(screen.getByRole('region', { name: 'Cadences' })).toBeInTheDocument()
  })

  it('plays a suggestion’s row, voice-led, and a chord of it alone', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions/passing?from=C&to=Eb')
    const twoFive = await screen.findByRole('article', { name: 'Secondary ii–V' })
    await user.click(within(twoFive).getByRole('button', { name: 'Play' }))
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(4)
    await user.click(within(twoFive).getByRole('button', { name: 'Fm7' }))
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(1)
  })

  it('plays a chord of a row as the row voices it', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions/passing?from=C&to=Eb')
    const twoFive = await screen.findByRole('article', { name: 'Secondary ii–V' })
    await user.click(within(twoFive).getByRole('button', { name: 'Play' }))
    const row = audio.played.at(-1)?.sounds ?? []
    const starts = [...new Set(keysOf(row).map(([at]) => at))].sort((a, b) => a - b)
    const second = keysOf(row).flatMap(([at, key]) => (at === starts[1] ? [key] : []))
    await user.click(within(twoFive).getByRole('button', { name: 'Fm7' }))
    const alone = keysOf(audio.played.at(-1)?.sounds ?? []).map(([, key]) => key)
    expect(alone).toEqual(second)
  })

  it('says so when a chord typed cannot be read, and keeps what was typed in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/passing')
    const to = await screen.findByRole('textbox', { name: 'To' })
    await user.clear(to)
    await user.type(to, 'Qx')
    expect(screen.getByText('This chord can’t be read.')).toBeInTheDocument()
    expect(to).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryAllByRole('article')).toEqual([])
    expect(router.state.location.search).toEqual({ to: 'Qx' })
  })

  it('marks a row whose chords are all the key’s', async () => {
    await renderApp('/practice/progressions/passing?from=C&to=Am')
    const plagal = await screen.findByRole('article', { name: 'Plagal cadence' })
    expect(within(plagal).getByRole('button', { name: 'Dm' })).toBeInTheDocument()
    expect(plagal).toHaveTextContent('In the key')
  })

  it('walks through the key between two of its chords, under Diatonic', async () => {
    await renderApp('/practice/progressions/passing?from=C&to=F')
    const diatonic = await screen.findByRole('region', { name: 'Diatonic' })
    const walk = within(diatonic).getByRole('article', { name: 'Walking through the key' })
    expect(within(walk).getByRole('button', { name: 'Dm' })).toBeInTheDocument()
    expect(within(walk).getByRole('button', { name: 'Em' })).toBeInTheDocument()
    expect(walk).toHaveTextContent('In the key')
    expect(walk).toHaveTextContent('The bass steps through the key’s own chords into F.')
  })

  it('leads a diminished 7th into a slash chord’s bass, and plays the bass it writes', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions/passing?from=F&to=C/G')
    const diminished = await screen.findByRole('article', { name: 'Diminished approach' })
    expect(diminished).toHaveTextContent('F#°7 leads up a half step into C/G.')
    await user.click(within(diminished).getByRole('button', { name: 'Play' }))
    const row = keysOf(audio.played.at(-1)?.sounds ?? [])
    const starts = [...new Set(row.map(([at]) => at))].sort((a, b) => a - b)
    const basses = starts.map((start) => row.find(([at]) => at === start)?.[1])
    expect(basses).toEqual([53, 54, 55])
  })

  it('is Progressions’ second tab, the one page shown', async () => {
    await renderApp('/practice/progressions/passing')
    const nav = await screen.findByRole('navigation', { name: 'Progressions' })
    expect(
      within(nav)
        .getAllByRole('link')
        .map((tab) => [tab.textContent, tab.getAttribute('aria-current')]),
    ).toEqual([
      ['Progression', null],
      ['Passing chords', 'page'],
      ['Reharmonise', null],
    ])
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/progressions/passing', { locale: 'ru' })
    expect(await screen.findByRole('link', { name: 'Проходящие аккорды' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
