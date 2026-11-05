import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { NoteSound } from '@/shared/lib/schedule'

describe('Practice → Circle of fifths (R29 B11)', () => {
  it('a sector shows its key and plays its chords', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/circle-of-fifths')
    await screen.findByRole('heading', { level: 1, name: 'Circle of fifths' })
    expect(screen.getByText(/Select a key to view/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'D major' }))
    const key = await screen.findByRole('region', { name: 'D major' })
    expect(key).toHaveTextContent('2 sharps')
    expect(within(key).getByRole('button', { name: 'B minor' })).toBeInTheDocument()
    expect(router.state.location.search).toMatchObject({ key: 'D' })
    const chords = within(key).getByRole('region', { name: 'Diatonic chords' })
    expect(
      within(chords)
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual(['DI', 'Emii', 'F♯miii', 'GIV', 'AV', 'Bmvi', 'C♯°vii°'])
    await user.click(within(chords).getByRole('button', { name: /^A/ }))
    const sounds = audio.played.at(-1)?.sounds as NoteSound[]
    expect(sounds.map((sound) => sound.midi)).toEqual([57, 61, 64])
    // The relative key, one tap away; and the key opened in Scales and keys.
    await user.click(within(key).getByRole('button', { name: 'B minor' }))
    expect(await screen.findByRole('region', { name: 'B minor' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Open in Scales and keys' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Scales and keys' }),
    ).toBeInTheDocument()
    expect(router.state.location.search).toMatchObject({ root: 'B', kind: 'natural', show: 'key' })
  })
})
