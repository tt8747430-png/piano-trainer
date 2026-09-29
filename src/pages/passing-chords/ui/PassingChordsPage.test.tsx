import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const onsets = (sounds: readonly Sound[] = []) =>
  new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : []))).size

describe('Learn → Passing chords', () => {
  it('suggests chords from C to E♭ by category, each in the key or chromatic, with its reason', async () => {
    await renderApp('/learn/passing-chords?from=C&to=Eb')
    const dominant = await screen.findByRole('region', { name: 'Dominant' })
    const secondary = within(dominant).getByRole('article', { name: 'Secondary dominant' })
    expect(within(secondary).getByRole('button', { name: 'B♭7' })).toBeInTheDocument()
    expect(secondary).toHaveTextContent('Chromatic')
    expect(secondary).toHaveTextContent('B♭7 is the V7 of E♭.')
    expect(screen.getByRole('region', { name: 'Cadences' })).toBeInTheDocument()
  })

  it('plays a suggestion’s row, voice-led, and a chord of it alone', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/passing-chords?from=C&to=Eb')
    const twoFive = await screen.findByRole('article', { name: 'Secondary ii–V' })
    await user.click(within(twoFive).getByRole('button', { name: 'Play' }))
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(4)
    await user.click(within(twoFive).getByRole('button', { name: 'Fm7' }))
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(1)
  })

  it('says so when a chord typed cannot be read, and keeps what was typed in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/passing-chords')
    const to = await screen.findByRole('textbox', { name: 'To' })
    await user.clear(to)
    await user.type(to, 'Qx')
    expect(screen.getByText('This chord can’t be read.')).toBeInTheDocument()
    expect(to).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryAllByRole('article')).toEqual([])
    expect(router.state.location.search).toEqual({ to: 'Qx' })
  })

  it('marks a row whose chords are all the key’s', async () => {
    await renderApp('/learn/passing-chords?from=C&to=Am')
    const subdominant = await screen.findByRole('article', { name: 'Subdominant approach' })
    expect(within(subdominant).getByRole('button', { name: 'Dm' })).toBeInTheDocument()
    expect(subdominant).toHaveTextContent('In the key')
  })

  it('speaks Russian', async () => {
    await renderApp('/learn/passing-chords', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Проходящие аккорды' }),
    ).toBeInTheDocument()
  })
})
