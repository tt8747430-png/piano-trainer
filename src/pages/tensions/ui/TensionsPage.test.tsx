import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const notes = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))
const chips = (group: string) =>
  within(screen.getByRole('region', { name: group }))
    .getAllByRole('button')
    .map((chip) => chip.textContent)

describe('Practice → Available tensions', () => {
  it('groups the notes over C7 as the owner’s table does', async () => {
    await renderApp('/practice/tensions')
    await screen.findByRole('region', { name: 'Weak' })
    expect(chips('Weak')).toEqual(['1 C', '5 G'])
    expect(chips('Strong')).toEqual(['3 E', '♭7 B♭'])
    expect(chips('Tensions')).toEqual(['♭9 D♭', '9 D', '#9 D#', '#11 F#', '♭13 A♭', '13 A'])
    expect(chips('Avoid')).toEqual(['11 F', '7 B'])
  })

  it('plays the chord with a note on top and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/tensions')
    const ninth = await screen.findByRole('button', { name: '9 D' })
    await user.click(ninth)
    expect(notes(audio.played.at(-1)?.sounds)).toEqual([60, 64, 67, 70, 74])
    expect(ninth).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D5' })).toHaveTextContent('9')
  })

  it('chooses a chord and a root, kept in the URL, and drops the note shown over the last chord', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/tensions')
    await user.click(await screen.findByRole('button', { name: '9 D' }))
    await user.click(screen.getByRole('combobox', { name: 'Chord' }))
    await user.click(await screen.findByRole('option', { name: 'Cm7 Minor 7th' }))
    expect(router.state.location.search).toEqual({ chord: 'm7' })
    expect(chips('Strong')).toEqual(['♭3 E♭', '♭7 B♭'])
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D5' })).not.toHaveTextContent('9')
    expect(screen.getByRole('button', { name: '9 D' })).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'D' }))
    expect(router.state.location.search).toEqual({ chord: 'm7', root: 'D' })
    expect(chips('Strong')).toEqual(['♭3 F', '♭7 C'])
  })

  it('names each chord in its list as choosing it will spell it, on the root’s pitch', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/tensions?root=C%23&chord=m7')
    await user.click(await screen.findByRole('combobox', { name: 'Chord' }))
    await user.click(await screen.findByRole('option', { name: /^D♭Maj7 / }))
    expect(router.state.location.search).toEqual({ chord: 'maj7', root: 'Db' })
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/tensions', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Доступные опции' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Избегаемые' })).toBeInTheDocument()
  })
})
