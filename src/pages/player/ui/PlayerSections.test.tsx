import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

type User = ReturnType<typeof userEvent.setup>

/** Opens More and finds its Sections. */
async function sectionsAction(user: User, more = 'More', name = 'Sections') {
  await user.click(await screen.findByRole('button', { name: more }))
  return within(await screen.findByRole('dialog', { name: more })).getByRole('button', { name })
}

/** The sheet's sections, each its name and where it starts. */
const sectionsIn = (sheet: HTMLElement) =>
  within(sheet)
    .getAllByRole('button')
    .filter((row) => row.textContent?.includes('Bar') || row.textContent?.includes('Такт'))
    .map((row) => row.textContent)

describe('the Player’s Sections (ADR 0107)', () => {
  it('lists a song’s sections by name with their first bar, and takes the cursor to the one tapped', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await sectionsAction(user))
    const sheet = await screen.findByRole('dialog', { name: 'Sections' })
    expect(sectionsIn(sheet)).toEqual(['Verse Bar 1', 'Chorus Bar 9', 'Ending Bar 19'])
    await user.click(within(sheet).getByRole('button', { name: /^Chorus/ }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Sections' })).not.toBeInTheDocument(),
    )
    // The cursor at the chorus's first bar: the editor opens there from it (ADR 0115).
    await user.click(screen.getByRole('combobox', { name: 'Practise or edit' }))
    await user.click(await screen.findByRole('option', { name: 'Edit' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/Bar 9, beat 1/))
  })

  it('marks the section the cursor is in', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5?bar=10')
    await user.click(await sectionsAction(user))
    const sheet = await screen.findByRole('dialog', { name: 'Sections' })
    expect(within(sheet).getByRole('button', { name: /^Chorus/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(within(sheet).getByRole('button', { name: /^Verse/ })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('is greyed for a song of one section, saying why', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({
        state: {
          songs: [
            {
              id: 'my-1',
              title: 'Morning',
              key: 'G',
              meter: '4/4',
              tempo: 90,
              pattern: 'r1',
              sections: [{ kind: 'verse', lines: ['G C D G'] }],
            },
          ],
          nextSong: 2,
        },
        version: PIECES_VERSION,
      }),
    )
    await renderApp('/play/my-1', { storage })
    const sections = await sectionsAction(user)
    expect(sections).toBeDisabled()
    expect(sections).toHaveAccessibleDescription('This song has one section.')
  })

  it('reads in Russian', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5', { locale: 'ru' })
    await user.click(await sectionsAction(user, 'Ещё', 'Разделы'))
    const sheet = await screen.findByRole('dialog', { name: 'Разделы' })
    expect(sectionsIn(sheet)).toEqual(['Куплет Такт 1', 'Припев Такт 9', 'Окончание Такт 19'])
    expect(untranslated(sheet)).toEqual([])
  })
})
