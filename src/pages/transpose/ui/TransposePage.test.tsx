import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

/** Each chord of the row: its symbol and numeral, and what is said under it. */
const row = () =>
  within(screen.getByRole('list', { name: 'Chords' }))
    .getAllByRole('button')
    .map((button) => [...button.children].map((part) => part.textContent).join(' '))
const onsets = (sounds: readonly Sound[] = []) =>
  new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : []))).size

describe('Practice → Transpose', () => {
  it('reads «Ромашковые поля»’s opening in D minor, each chord over its numeral', async () => {
    await renderApp('/practice/transpose')
    await screen.findByRole('list', { name: 'Chords' })
    expect(row()).toEqual(['Dm7 i7', 'Gm9 iv9', 'Asus4 Vsus4', 'Dm7 i7'])
    const theirKey = screen.getByRole('radiogroup', { name: 'Their key' })
    expect(within(theirKey).getByRole('radio', { name: 'D minor' })).toBeChecked()
    expect(
      within(theirKey)
        .getAllByRole('radio')
        .map((key) => key.textContent),
    ).toEqual(['D minor', 'F major', 'G minor'])
    expect(screen.getByText('In the key: 4 of 4')).toBeInTheDocument()
  })

  it('plays the chords on the tonic chosen, a slash chord’s bass with them', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/transpose?chords=Dm+D/F%23+Gm+A7+Dm')
    const playIn = await screen.findByRole('group', { name: 'Play in' })
    await user.click(within(playIn).getByRole('radio', { name: 'G' }))
    expect(router.state.location.search).toMatchObject({ to: 'G' })
    expect(row()).toEqual(['Gm i', 'G/B V/iv Out of the key', 'Cm iv', 'D7 V7', 'Gm i'])
  })

  it('reads the chords in another key found, when asked', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/transpose')
    await user.click(await screen.findByRole('radio', { name: 'F major' }))
    expect(row()).toEqual(['Dm7 vi7', 'Gm9 ii9', 'Asus4 IIIsus4', 'Dm7 vi7'])
  })

  it('reads a line typed whole, and names the words it cannot read', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/transpose')
    const field = await screen.findByRole('textbox', { name: 'Chords' })
    await user.clear(field)
    await user.type(field, 'C F G7 C')
    expect(router.state.location.search).toEqual({ chords: 'C F G7 C' })
    expect(row()).toEqual(['C I', 'F IV', 'G7 V7', 'C I'])
    await user.type(field, ' Hx')
    expect(screen.getByText('Can’t read: Hx')).toBeInTheDocument()
    expect(row()).toEqual(['C I', 'F IV', 'G7 V7', 'C I'])
  })

  it('plays the row, a chord at a time', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/transpose')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(4)
  })

  it('opens its degrees on Progressions, in the key played', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/transpose?to=G')
    await user.click(await screen.findByRole('link', { name: /Practise these degrees/ }))
    expect(router.state.location.pathname).toBe('/practice/progressions')
    expect(router.state.location.search).toMatchObject({ key: 'Gm', p: 'i7-iv9-Vsus4-i7' })
  })

  it('is listed with Practice’s tools', async () => {
    await renderApp('/practice')
    const tools = await screen.findByRole('region', { name: 'Tools' })
    expect(within(tools).getByRole('link', { name: /Transpose/ })).toHaveAttribute(
      'href',
      '/practice/transpose',
    )
  })
})
