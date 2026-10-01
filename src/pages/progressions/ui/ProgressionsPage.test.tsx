import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const row = () =>
  within(screen.getByRole('list', { name: 'Chords' }))
    .getAllByRole('button')
    .map((button) => button.textContent)
const onsets = (sounds: readonly Sound[] = []) =>
  new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : []))).size

describe('Learn → Progressions', () => {
  it('writes a progression’s chords in the key, each over its numeral', async () => {
    await renderApp('/learn/progressions')
    await screen.findByRole('list', { name: 'Chords' })
    expect(row()).toEqual(['CI', 'GV', 'Amvi', 'FIV'])
  })

  it('reads chords typed as numerals, kept in the URL, and says when it cannot', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Am F C G')
    expect(router.state.location.search).toEqual({ p: 'vi-IV-I-V' })
    await user.clear(field)
    await user.type(field, 'Qx')
    expect(screen.getByText('This progression can’t be read.')).toBeInTheDocument()
  })

  it('writes typed chords as numerals again once the key changes, as the row plays them', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Am F C G')
    await user.click(screen.getByRole('combobox', { name: 'Key' }))
    await user.click(await screen.findByRole('option', { name: 'G major' }))
    expect(row()).toEqual(['Emvi', 'CIV', 'GI', 'DV'])
    expect(field).toHaveValue('vi IV I V')
  })

  it('grows the chords with the chord size, and plays the row', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/progressions')
    await user.click(await screen.findByRole('radio', { name: '7ths' }))
    expect(row()).toEqual(['CMaj7I', 'G7V', 'Am7vi', 'FMaj7IV'])
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(4)
  })

  it('takes a progression from the library by style', async () => {
    await renderApp('/learn/progressions')
    const blues = await screen.findByRole('region', { name: 'Blues' })
    expect(
      within(blues)
        .getByRole('link', { name: /^12-bar blues/ })
        .getAttribute('href'),
    ).toMatch(/p=I7-I7-I7-I7-IV7/)
  })

  it('opens the progression in the Player, in its key and chord size', async () => {
    await renderApp('/learn/progressions?p=ii-V-I&size=sevenths')
    const practise = await screen.findByRole('link', { name: 'Practise in the Player' })
    const href = practise.getAttribute('href') ?? ''
    expect(href).toMatch(/^\/play\/progression\?/)
    expect(href).toMatch(/p=ii-V-I/)
    expect(href).toMatch(/chordSize=sevenths/)
  })

  it('takes a library progression in place: Back then leaves for Learn', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn')
    await user.click(await screen.findByRole('link', { name: /^Progressions/ }))
    await user.click(await screen.findByRole('link', { name: /^12-bar blues/ }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ p: expect.stringMatching(/^I7/) }),
    )
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn'))
  })

  it('speaks Russian', async () => {
    await renderApp('/learn/progressions', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Последовательности' }),
    ).toBeInTheDocument()
  })
})
