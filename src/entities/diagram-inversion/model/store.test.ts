// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { MOST_CHORDS, MOST_PIECES } from './chosen'
import {
  createDiagramInversionsStore,
  DIAGRAM_INVERSIONS_STORAGE_KEY,
  DIAGRAM_INVERSIONS_VERSION,
} from './store'

const restored = (state: unknown, version = DIAGRAM_INVERSIONS_VERSION) => {
  const storage = createMemoryStorage()
  storage.setItem(DIAGRAM_INVERSIONS_STORAGE_KEY, JSON.stringify({ state, version }))
  return createDiagramInversionsStore({ storage, otherTabs: new EventTarget() }).getState()
}

describe('createDiagramInversionsStore', () => {
  it('starts with no inversion chosen, and saves under pt-diagram-inversions in its version', () => {
    const storage = createMemoryStorage()
    const store = createDiagramInversionsStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({ pieces: {} })
    store.setState({ pieces: { bz5: { Dm: 2 } } })
    expect(JSON.parse(storage.getItem('pt-diagram-inversions') ?? 'null')).toEqual({
      state: { pieces: { bz5: { Dm: 2 } } },
      version: 1,
    })
  })

  it('keeps each piece’s inversions by chord symbol, in the order chosen', () => {
    const pieces = { bz5: { Dm: 2, 'C#m7': 3 }, 'my-1': { E: 0 } }
    const read = restored({ pieces })
    expect(read).toEqual({ pieces })
    expect(Object.keys(read.pieces)).toEqual(['bz5', 'my-1'])
  })

  it('drops what does not read: a symbol of no chord, an inversion it is not, an empty piece', () => {
    expect(
      restored({
        pieces: {
          bz5: { Dm: 2, Hm: 1, G: 4, Am: '1', C: -1, F: 1.5 },
          '': { Dm: 1 },
          silent: {},
          bz2: 'Dm',
          olen: [1],
        },
      }),
    ).toEqual({ pieces: { bz5: { Dm: 2 } } })
    expect(restored('pieces')).toEqual({ pieces: {} })
    expect(restored({ pieces: [] })).toEqual({ pieces: {} })
  })

  it('keeps the pieces chosen in last, at most 200', () => {
    const pieces = Object.fromEntries(
      Array.from({ length: MOST_PIECES + 1 }, (_, i) => [`p${i}`, { Dm: 1 }]),
    )
    const kept = Object.keys(restored({ pieces }).pieces)
    expect(kept).toHaveLength(MOST_PIECES)
    expect(kept[0]).toBe('p1')
    expect(kept.at(-1)).toBe(`p${MOST_PIECES}`)
  })

  it('keeps the chords chosen last in a piece, at most 100', () => {
    const roots = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
    const symbols = ['', 'm', '7', 'm7', 'Maj7', 'sus4', 'sus2', '6', 'm6'].flatMap((suffix) =>
      roots.map((root) => `${root}${suffix}`),
    )
    const chords = Object.fromEntries(symbols.slice(0, MOST_CHORDS + 1).map((each) => [each, 1]))
    const kept = Object.keys(restored({ pieces: { bz5: chords } }).pieces.bz5 ?? {})
    expect(kept).toHaveLength(MOST_CHORDS)
    expect(kept[0]).toBe(symbols[1])
    expect(kept.at(-1)).toBe(symbols[MOST_CHORDS])
  })

  it('starts afresh over a save of another version (ADR 0038)', () => {
    expect(restored({ pieces: { bz5: { Dm: 2 } } }, 2)).toEqual({ pieces: {} })
  })
})
