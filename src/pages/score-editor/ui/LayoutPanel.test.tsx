import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { openGear } from '@/app/testing/editor-gear'
import { renderApp } from '@/app/testing/render-app'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

const withSong = () => {
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
            sections: [{ kind: 'verse', lines: ['G G G G'] }],
            hands: { rh: 'G4/4 | A4/4 | B4/4 | G4/4', lh: 'r/4 | r/4 | r/4 | r/4' },
          },
        ],
        nextSong: 2,
      },
      version: PIECES_VERSION,
    }),
  )
  return storage
}

/** The treble clef as the first page draws it: its glyph's outline, the music font's own. */
const clefOutline = () =>
  screen
    .getByRole('figure', { name: 'The first page' })
    .querySelector('defs [id^="E050"] path')
    ?.getAttribute('d')

/** The first page's drawing, once drawn: its width over its height. */
async function pageShape(): Promise<number> {
  const page = await screen.findByRole('figure', { name: 'The first page' })
  await waitFor(() => expect(page).toHaveAttribute('data-state', 'ready'), { timeout: 20_000 })
  const [, , width = 0, height = 1] = (page.querySelector('svg')?.getAttribute('viewBox') ?? '')
    .split(' ')
    .map(Number)
  return width / height
}

describe('the editor’s Layout (A40)', () => {
  it('each group changes the preview and saves with the score', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^How the editor works/, /^Layout/)
    // Pages: an upright A4, turned on its side.
    expect(await pageShape()).toBeLessThan(1)
    await user.click(screen.getByRole('radio', { name: 'Landscape' }))
    await waitFor(async () => expect(await pageShape()).toBeGreaterThan(1), { timeout: 20_000 })
    await user.click(screen.getByRole('radio', { name: 'Letter' }))
    const top = screen.getByRole('textbox', { name: 'Top' })
    await user.clear(top)
    await user.type(top, '2{Enter}')
    const bravura = clefOutline()
    expect(bravura).toBeTruthy()
    // Measures: two a system; Measure numbers: every measure; Music font: Leland.
    await user.click(screen.getByRole('button', { name: 'Measures' }))
    await user.click(screen.getByRole('button', { name: 'More measures per system' }))
    await user.click(screen.getByRole('button', { name: 'More measures per system' }))
    await user.click(screen.getByRole('button', { name: 'Measure numbers' }))
    await user.click(screen.getByRole('radio', { name: 'Every measure' }))
    await user.click(screen.getByRole('button', { name: 'Music font' }))
    await user.click(screen.getByRole('radio', { name: 'Leland' }))
    await user.click(screen.getByRole('button', { name: 'Hide empty staves' }))
    await user.click(screen.getByRole('radio', { name: 'Always' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.layout).toEqual({
        orientation: 'landscape',
        pageSize: 'letter',
        margins: { top: 2, bottom: 1.5, left: 1.5, right: 1.5 },
        barsPerLine: 2,
        measureNumbers: 'every',
        font: 'Leland',
        hideEmpty: 'always',
      }),
    )
    // The preview is drawn in the font chosen.
    await waitFor(() => expect(clefOutline()).not.toBe(bravura), { timeout: 20_000 })
  }, 90_000)

  it('Reset, asked first, puts every setting back', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^How the editor works/, /^Layout/)
    const reset = await screen.findByRole('button', { name: 'Reset' })
    expect(reset).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: 'A3' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]?.layout).toEqual({ pageSize: 'a3' }))
    await user.click(reset)
    const asked = await screen.findByRole('alertdialog', { name: 'Reset the layout?' })
    await user.click(within(asked).getByRole('button', { name: 'Reset' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]).not.toHaveProperty('layout'))
  })
})
