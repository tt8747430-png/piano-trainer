import { Hand } from 'lucide-react'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { libraryShown, type LibraryItem, type PracticeLibraryView } from './library-view'

const item = (id: string, group: string, more: Partial<LibraryItem> = {}): LibraryItem => ({
  id,
  name: id,
  detail: `${id} line`,
  group,
  picture: { icon: Hand, paint: 'yellow' },
  link: createElement('a'),
  favourite: false,
  actions: [],
  ...more,
})

const ITEMS = [
  item('Hanon', 'technique', { stage: 'intermediate', favourite: true }),
  item('Five-finger', 'technique', { stage: 'beginner' }),
  item('Modes', 'jonny', { stage: 'advanced', extra: 'Ionian to Locrian' }),
  item('Arpeggio', 'jonny', { stage: 'beginner', section: { id: 'jonny:songs', name: 'Songs' } }),
  item('Waltz', 'mine'),
  item('Funk', 'hidden', { stage: 'advanced' }),
]
const GROUPS = [
  { id: 'technique', name: 'Finger technique' },
  { id: 'jonny', name: 'Piano With Jonny' },
]
const DEFAULTS: PracticeLibraryView = { q: '', sort: 'group', place: 'all', stage: 'any' }
const NAMES = { favourites: 'Favourites', mine: 'Mine', hidden: 'Hidden' }
const shown = (view: Partial<PracticeLibraryView>) =>
  libraryShown(
    ITEMS,
    { ...DEFAULTS, ...view },
    {
      groups: GROUPS,
      mine: true,
      compare: (a, b) => a.localeCompare(b, 'en'),
      names: NAMES,
    },
  )
const names = (list: readonly LibraryItem[]) => list.map((each) => each.name)

describe('libraryShown', () => {
  it('shows at All every row but the hidden, Favourites first on a phone, then each book’s runs, Mine last', () => {
    const view = shown({})
    expect(names(view.items)).toEqual(['Hanon', 'Five-finger', 'Modes', 'Arpeggio', 'Waltz'])
    expect(view.sections.map((section) => [section.name, names(section.items)])).toEqual([
      ['Favourites', ['Hanon']],
      ['Finger technique', ['Hanon', 'Five-finger']],
      ['Piano With Jonny', ['Modes']],
      ['Songs', ['Arpeggio']],
      ['Mine', ['Waltz']],
    ])
  })

  it('counts each place, the hidden apart from All', () => {
    expect(shown({}).counts).toEqual({
      all: 5,
      favourites: 1,
      technique: 2,
      jonny: 2,
      mine: 1,
      hidden: 1,
    })
  })

  it('opens a book, Mine, the hidden or the favourites; a place it has not is All', () => {
    expect(names(shown({ place: 'jonny' }).items)).toEqual(['Modes', 'Arpeggio'])
    expect(names(shown({ place: 'hidden' }).items)).toEqual(['Funk'])
    expect(shown({ place: 'favourites' }).sections.map((section) => section.name)).toEqual([
      'Favourites',
    ])
    expect(shown({ place: 'nowhere' }).place).toBe('all')
  })

  it('searches the names, the lines and the extra column, and keeps one level', () => {
    expect(names(shown({ q: 'locrian' }).items)).toEqual(['Modes'])
    expect(names(shown({ stage: 'beginner' }).items)).toEqual(['Five-finger', 'Arpeggio'])
    expect(shown({ stage: 'beginner' }).filtering).toBe(true)
  })

  it('leaves Favourites out of a phone’s runs while the search narrows', () => {
    expect(shown({ q: 'hanon' }).sections.map((section) => section.name)).toEqual([
      'Finger technique',
    ])
  })

  it('sorts by name, or by level with the rows of none last', () => {
    expect(names(shown({ sort: 'name' }).items)).toEqual([
      'Arpeggio',
      'Five-finger',
      'Hanon',
      'Modes',
      'Waltz',
    ])
    expect(names(shown({ sort: 'level' }).items)).toEqual([
      'Arpeggio',
      'Five-finger',
      'Hanon',
      'Modes',
      'Waltz',
    ])
  })

  it('offers the levels the place holds', () => {
    expect(shown({ place: 'technique' }).stages).toEqual(['beginner', 'intermediate'])
  })
})
