import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'
import { stubScrolling } from '@/shared/test/layout'

const chords = (group: string) =>
  within(screen.getByRole('region', { name: group }))
    .getAllByRole('button')
    .map((button) => button.textContent)
const notes = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('Practice → Reharmonise', () => {
  it('lists the triads that hold E, the ones of C major marked', async () => {
    await renderApp('/practice/progressions/reharmonise')
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

  it('takes a melody note from the twelve in sight, kept in the URL, and gives the owner’s table', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/reharmonise')
    await user.click(
      within(await screen.findByRole('group', { name: 'Melody note' })).getByRole('radio', {
        name: 'G',
      }),
    )
    expect(router.state.location.search).toEqual({ note: 'G' })
    expect(chords('Dominant 7ths')[0]).toBe('E♭7as 3')
    expect(chords('Major 7ths')).toContain('FMaj9as 9 · in the key')
  })

  it('takes a melody note tapped on the keys', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/reharmonise')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'A4' }))
    expect(router.state.location.search).toEqual({ note: 'A' })
  })

  it('names a tapped note on the key tapped, the keys held still', async () => {
    const user = userEvent.setup()
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    await renderApp('/practice/progressions/reharmonise')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    // The hand has scrolled down to F♯2 (white key 14 of 52, 28px each).
    const scroller = keyboard.closest('[data-slot="keys-scroller"]')
    if (!scroller) throw new Error('the keys scroll')
    scroller.scrollLeft = 350
    const before = scrolls.length
    await user.click(within(keyboard).getByRole('button', { name: 'F sharp 2' }))
    expect(within(keyboard).getByRole('button', { name: 'F sharp 2' })).toHaveTextContent('G♭')
    expect(scrolls).toHaveLength(before)
  })

  it('plays a chord under the melody note and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions/reharmonise?note=G')
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
    await renderApp('/practice/progressions/reharmonise', { locale: 'ru' })
    expect(await screen.findByRole('link', { name: 'Гармонизация мелодии' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
