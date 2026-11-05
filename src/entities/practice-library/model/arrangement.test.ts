import { describe, expect, it } from 'vitest'
import {
  addFolder,
  arrangedItems,
  arrangedPlaces,
  deleteFolder,
  EMPTY_ARRANGEMENT,
  libraryFolderId,
  moveItem,
  orderItems,
  orderPlaces,
  renameItem,
  renamePlace,
  setItemHidden,
  setPlaceHidden,
} from './arrangement'

const BOOKS = [
  { id: 'technique', name: 'Finger technique' },
  { id: 'jonny', name: 'Piano With Jonny' },
]
const ITEMS = [
  { id: 'five-finger', group: 'technique', name: 'Five-finger position' },
  { id: 'hanon', group: 'technique', name: 'Hanon' },
  { id: 'modes', group: 'jonny', name: 'Modes' },
]
const morning = libraryFolderId(1)

describe('a Practice library arranged by the learner (R32)', () => {
  it('shows the catalog as it is with nothing arranged', () => {
    const places = arrangedPlaces(BOOKS, EMPTY_ARRANGEMENT)
    expect(places.map((place) => [place.id, place.name, place.builtIn])).toEqual([
      ['technique', 'Finger technique', true],
      ['jonny', 'Piano With Jonny', true],
    ])
    expect(arrangedItems(ITEMS, places, EMPTY_ARRANGEMENT).map((item) => item.id)).toEqual([
      'five-finger',
      'hanon',
      'modes',
    ])
  })

  it('renames, reorders and hides a built-in book, and gives its name back', () => {
    let arrangement = renamePlace(EMPTY_ARRANGEMENT, 'technique', '  Warm-ups ')
    arrangement = orderPlaces(arrangement, ['jonny', 'technique'])
    arrangement = setPlaceHidden(arrangement, 'jonny', true)
    const places = arrangedPlaces(BOOKS, arrangement)
    expect(places.map((place) => [place.name, place.renamed, place.hidden])).toEqual([
      ['Piano With Jonny', false, true],
      ['Warm-ups', true, false],
    ])
    // A hidden book's items are hidden with it.
    expect(
      arrangedItems(ITEMS, places, arrangement).find((item) => item.id === 'modes')?.hidden,
    ).toBe(true)
    expect(arrangedPlaces(BOOKS, renamePlace(arrangement, 'technique', ''))[1]?.name).toBe(
      'Finger technique',
    )
  })

  it('makes a folder, moves an item into it, and sends it home when the folder goes', () => {
    let arrangement = addFolder(EMPTY_ARRANGEMENT, morning, 'Morning routine')
    arrangement = moveItem(arrangement, 'modes', morning, 'jonny')
    const places = arrangedPlaces(BOOKS, arrangement)
    expect(places.at(-1)).toMatchObject({ id: morning, name: 'Morning routine', builtIn: false })
    expect(arrangedItems(ITEMS, places, arrangement).at(-1)).toMatchObject({
      id: 'modes',
      group: morning,
      home: 'jonny',
    })
    const gone = deleteFolder(arrangement, morning)
    const back = arrangedItems(ITEMS, arrangedPlaces(BOOKS, gone), gone)
    expect(back.find((item) => item.id === 'modes')?.group).toBe('jonny')
    // Moved to its own place, an item simply goes home.
    expect(moveItem(arrangement, 'modes', 'jonny', 'jonny').placed).toEqual({})
  })

  it('renames, hides and orders items, each restorable', () => {
    let arrangement = renameItem(EMPTY_ARRANGEMENT, 'hanon', 'Hanon No. 1')
    arrangement = setItemHidden(arrangement, 'five-finger', true)
    arrangement = orderItems(arrangement, 'technique', ['hanon', 'five-finger'])
    const items = arrangedItems(ITEMS, arrangedPlaces(BOOKS, arrangement), arrangement)
    expect(items.map((item) => [item.name, item.renamed, item.hidden])).toEqual([
      ['Hanon No. 1', true, false],
      ['Five-finger position', false, true],
      ['Modes', false, false],
    ])
    expect(renameItem(arrangement, 'hanon', '').itemNames).toEqual({})
    expect(setItemHidden(arrangement, 'five-finger', false).hiddenItems).toEqual([])
  })

  it('refuses a name it cannot keep', () => {
    expect(addFolder(EMPTY_ARRANGEMENT, morning, '   ')).toBe(EMPTY_ARRANGEMENT)
    expect(renamePlace(EMPTY_ARRANGEMENT, 'technique', 'x'.repeat(61)).placeNames).toEqual({})
  })
})
