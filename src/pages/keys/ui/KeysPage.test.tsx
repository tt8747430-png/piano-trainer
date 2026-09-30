import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const notes = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('Learn → Keys', () => {
  it('opens on C major, the circle marking its seven chords', async () => {
    await renderApp('/learn/keys')
    expect(await screen.findByRole('heading', { level: 2, name: 'C major' })).toBeInTheDocument()
    const circle = screen.getByRole('navigation', { name: 'Circle of fifths' })
    expect(within(circle).getByRole('link', { name: 'C major' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(circle).getByRole('link', { name: 'F major' })).toHaveTextContent('IV')
    expect(within(circle).getByRole('link', { name: 'B minor' })).toHaveTextContent('vii°')
    expect(within(circle).getByRole('link', { name: 'E♭ major' })).toHaveTextContent('3♭')
  })

  it('chooses a key on the circle, and shows its signature, notes, relative and modes', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/keys')
    const circle = await screen.findByRole('navigation', { name: 'Circle of fifths' })
    await user.click(within(circle).getByRole('link', { name: 'E♭ major' }))
    expect(router.state.location.search).toEqual({ key: 'Eb' })
    expect(await screen.findByRole('heading', { level: 2, name: 'E♭ major' })).toBeInTheDocument()
    expect(screen.getByText('B♭ E♭ A♭')).toBeInTheDocument()
    const relative = screen
      .getAllByRole('link', { name: 'C minor' })
      .filter((link) => !circle.contains(link))
    expect(relative).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'F Dorian' }).getAttribute('href')).toMatch(
      /^\/learn\/scales\?/,
    )
  })

  it('plays its chords and the ones it borrows, and walks its chords', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/keys')
    await user.click(await screen.findByRole('button', { name: /^Fm/ }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([65, 68, 72])
    await user.click(screen.getByRole('button', { name: 'Play the chords' }))
    expect(notes(audio.played.at(-1)?.sounds ?? []).slice(0, 3)).toEqual([60, 64, 67])
  })

  it('keeps the key’s signature written while its chords change, engraving it once', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/keys?key=G')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument())
    const engraved = sheet.querySelector('svg')
    await user.click(screen.getByRole('button', { name: '7ths' }))
    expect(sheet.querySelector('svg')).toBe(engraved)
  })

  it('lists the songs written in the key', async () => {
    await renderApp('/learn/keys?key=G')
    const songs = await screen.findByRole('region', { name: 'Songs in this key' })
    expect(
      within(songs).getByRole('link', { name: /Still, my soul, be still/ }),
    ).toBeInTheDocument()
  })

  it('lists the studies written in the key apart from its songs', async () => {
    await renderApp('/learn/keys?key=C')
    const studies = await screen.findByRole('region', { name: 'Studies in this key' })
    expect(within(studies).getByRole('link', { name: /^Lesson 3: C – Dm/ })).toBeInTheDocument()
    const songs = screen.getByRole('region', { name: 'Songs in this key' })
    expect(within(songs).queryByRole('link', { name: /^Lesson 3: C – Dm/ })).not.toBeInTheDocument()
  })

  it('says so when no song is in the key', async () => {
    await renderApp('/learn/keys?key=B')
    expect(await screen.findByText('No songs are in this key.')).toBeInTheDocument()
  })

  it('reads a key spelled another way as the circle spells it, with its relative’s signature', async () => {
    const { router } = await renderApp('/learn/keys?key=Ebm')
    expect(await screen.findByRole('heading', { level: 2, name: 'D# minor' })).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ key: 'D#m' })
  })

  it('takes a random key from the header', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/keys')
    await user.click(await screen.findByRole('button', { name: 'A random key' }))
    expect(router.state.location.search).toHaveProperty('key')
  })
})
