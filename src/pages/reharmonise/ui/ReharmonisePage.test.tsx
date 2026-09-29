import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const chords = (group: string) =>
  within(screen.getByRole('region', { name: group }))
    .getAllByRole('button')
    .map((button) => button.textContent)
const notes = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('Learn → Reharmonise', () => {
  it('lists the triads that hold E, the ones of C major marked', async () => {
    await renderApp('/learn/reharmonise')
    await screen.findByRole('region', { name: 'Triads' })
    expect(chords('Triads')).toEqual([
      'Eas 1',
      'Cas 3 · in the key',
      'Aas 5',
      'Emas 1 · in the key',
      'C#mas ♭3',
      'Amas 5 · in the key',
    ])
  })

  it('takes a melody note from the pop-up, kept in the URL, and gives the owner’s table', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/reharmonise')
    await user.click(await screen.findByRole('combobox', { name: 'Melody note' }))
    await user.click(await screen.findByRole('option', { name: 'G' }))
    expect(router.state.location.search).toEqual({ note: 'G' })
    expect(chords('Dominant 7ths')[0]).toBe('E♭7as 3')
    expect(chords('Major 7ths')).toContain('FMaj9as 9 · in the key')
  })

  it('takes a melody note tapped on the keys', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/reharmonise')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'A4' }))
    expect(router.state.location.search).toEqual({ note: 'A' })
  })

  it('plays a chord under the melody note and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/reharmonise?note=G')
    const major = await screen.findByRole('region', { name: 'Major 7ths' })
    const fMaj9 = within(major)
      .getAllByRole('button')
      .find((button) => button.textContent === 'FMaj9as 9 · in the key')
    if (!fMaj9) throw new Error('FMaj9 is missing')
    await user.click(fMaj9)
    expect(notes(audio.played.at(-1)?.sounds)).toEqual([65, 69, 72, 76, 79, 91])
    expect(fMaj9).toHaveAttribute('aria-pressed', 'true')
  })

  it('speaks Russian', async () => {
    await renderApp('/learn/reharmonise', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Гармонизация мелодии' }),
    ).toBeInTheDocument()
  })
})
