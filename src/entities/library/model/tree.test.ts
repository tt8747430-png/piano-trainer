import { describe, expect, it } from 'vitest'
import {
  canMoveFolder,
  childFolders,
  folderPath,
  reachableFolders,
  subtreeIds,
  withoutDescendants,
  type TreeFolder,
} from './tree'

// Home holds a and d; a holds b, which holds c.
const TREE: readonly TreeFolder[] = [
  { id: 'a', parent: null },
  { id: 'b', parent: 'a' },
  { id: 'd', parent: null },
  { id: 'c', parent: 'b' },
  { id: 'e', parent: 'a' },
]

describe('the library’s tree of folders (Mindscape’s deck-tree)', () => {
  it('lists a place’s folders in the order the store lists them', () => {
    expect(childFolders(TREE, null).map((each) => each.id)).toEqual(['a', 'd'])
    expect(childFolders(TREE, 'a').map((each) => each.id)).toEqual(['b', 'e'])
    expect(childFolders(TREE, 'c')).toEqual([])
  })

  it('walks a folder’s subtree, itself first, each folder once', () => {
    expect(subtreeIds(TREE, 'a')).toEqual(['a', 'b', 'c', 'e'])
    expect(subtreeIds(TREE, 'd')).toEqual(['d'])
    const loop = [
      { id: 'x', parent: 'y' },
      { id: 'y', parent: 'x' },
    ]
    expect(subtreeIds(loop, 'x')).toEqual(['x', 'y'])
  })

  it('reads the path from Home down to a folder', () => {
    expect(folderPath(TREE, 'c').map((each) => each.id)).toEqual(['a', 'b', 'c'])
    expect(folderPath(TREE, 'd').map((each) => each.id)).toEqual(['d'])
    expect(folderPath(TREE, 'gone')).toEqual([])
  })

  it('moves a folder anywhere but into itself or a folder under it', () => {
    expect(canMoveFolder(TREE, 'a', null)).toBe(true)
    expect(canMoveFolder(TREE, 'c', 'a')).toBe(true)
    expect(canMoveFolder(TREE, 'd', 'c')).toBe(true)
    expect(canMoveFolder(TREE, 'a', 'a')).toBe(false)
    expect(canMoveFolder(TREE, 'a', 'c')).toBe(false)
    expect(canMoveFolder(TREE, 'b', 'c')).toBe(false)
  })

  it('keeps of a choice only the folders no other chosen one holds', () => {
    expect(withoutDescendants(TREE, ['c', 'a', 'd'])).toEqual(['a', 'd'])
    expect(withoutDescendants(TREE, ['b', 'e'])).toEqual(['b', 'e'])
  })

  it('stands at Home a folder whose place is gone or on a loop, its own folders still under it', () => {
    const stranded: readonly TreeFolder[] = [
      { id: 'a', parent: 'gone' },
      { id: 'b', parent: 'a' },
      { id: 'x', parent: 'y' },
      { id: 'y', parent: 'x' },
      { id: 's', parent: 's' },
    ]
    expect(reachableFolders(stranded)).toEqual([
      { id: 'a', parent: null },
      { id: 'b', parent: 'a' },
      { id: 'x', parent: null },
      { id: 'y', parent: null },
      { id: 's', parent: null },
    ])
    // What stands somewhere is handed back as it is.
    expect(reachableFolders(TREE)).toEqual(TREE)
  })
})
