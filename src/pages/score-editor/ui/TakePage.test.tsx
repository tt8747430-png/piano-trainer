import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY } from '@/entities/piece'
import { TAKES_STORAGE_KEY } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'

const SONG = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 120,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G G G G'] }],
}
/** At 120 in 4/4: four bars of 2000 ms, a key struck in each. */
const TAKE = {
  id: 'take-1',
  pieceId: 'my-1',
  name: 'First go',
  made: 1_760_000_000_000,
  tempo: 120,
  meter: '4/4',
  fromBar: 1,
  length: 8000,
  notes: [
    [55, 0, 500, 80],
    [59, 2000, 500, 80],
    [62, 4000, 500, 80],
    [67, 6000, 500, 80],
  ],
  pedals: [],
}

function withTake(take: object = TAKE) {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [SONG], nextSong: 2 }, version: 1 }),
  )
  storage.setItem(
    TAKES_STORAGE_KEY,
    JSON.stringify({ state: { takes: [take], nextTake: 2 }, version: 2 }),
  )
  return storage
}

const keysOf = (sounds: readonly { kind: string; midi?: number }[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('A take’s page', () => {
  it.each(['/edit/my-1/takes/take-9', '/edit/bz1/takes/take-1', '/edit/my-1/takes/one'])(
    'is not found at %s',
    async (path) => {
      await renderApp(path, { storage: withTake() })
      expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    },
  )

  it('plays the take, or from a bar tapped on its roll', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/edit/my-1/takes/take-1', { storage: withTake() })
    expect(await screen.findByRole('heading', { level: 1, name: 'First go' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(keysOf(audio.played.at(-1)?.sounds)).toEqual([55, 59, 62, 67])
    await user.click(screen.getByRole('button', { name: 'Play from bar 3' }))
    expect(keysOf(audio.played.at(-1)?.sounds)).toEqual([62, 67])
  })

  it('names the take as it leaves the field, and the list shows the name', async () => {
    const user = userEvent.setup()
    const { takesStore } = await renderApp('/edit/my-1/takes/take-1', { storage: withTake() })
    const name = await screen.findByRole('textbox', { name: 'Name' })
    await user.clear(name)
    await user.type(name, 'Verse, slower')
    await user.tab()
    expect(takesStore.getState().takes[0]?.name).toBe('Verse, slower')
    await user.click(screen.getByRole('button', { name: 'Back' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    expect(within(sheet).getByRole('link', { name: 'Verse, slower' })).toBeInTheDocument()
  })

  it('keeps the bars chosen, once asked', async () => {
    const user = userEvent.setup()
    const { takesStore } = await renderApp('/edit/my-1/takes/take-1', { storage: withTake() })
    const keep = await screen.findByRole('button', { name: 'Keep' })
    expect(keep).toBeDisabled()
    await user.click(screen.getByRole('combobox', { name: 'First bar' }))
    await user.click(await screen.findByRole('option', { name: '2' }))
    await user.click(screen.getByRole('combobox', { name: 'Last bar' }))
    await user.click(await screen.findByRole('option', { name: '3' }))
    expect(screen.getByRole('button', { name: 'Play from bar 1' })).toHaveAttribute('data-dimmed')
    await user.click(keep)
    const asking = await screen.findByRole('alertdialog', { name: 'Keep bars 2–3?' })
    await user.click(within(asking).getByRole('button', { name: 'Keep' }))
    await waitFor(() =>
      expect(takesStore.getState().takes[0]).toMatchObject({ fromBar: 2, length: 4000 }),
    )
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(await screen.findByRole('button', { name: 'Play from bar 2' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play from bar 1' })).not.toBeInTheDocument()
  })

  it('opens from its row in the takes', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1?record=true', { storage: withTake() })
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    await user.click(within(sheet).getByRole('link', { name: 'First go' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1/takes/take-1'))
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/edit/my-1/takes/take-1', { storage: withTake(), locale: 'ru' })
    await screen.findByRole('textbox', { name: 'Название' })
    expect(untranslated(document.body)).toEqual([])
  })
})
