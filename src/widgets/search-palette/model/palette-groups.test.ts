import { describe, expect, it } from 'vitest'
import type { IndexEntry, IndexGroup, IndexKind } from './index-entries'
import { paletteGroups } from './palette-groups'

const entry = (kind: IndexKind, title: string): IndexEntry => ({
  id: `${kind}:${title}`,
  kind,
  title,
  words: [],
  target: { opens: 'lesson', lesson: title },
})
const group = (kind: IndexKind, ...titles: string[]): IndexGroup => ({
  kind,
  entries: titles.map((title) => entry(kind, title)),
})

describe('paletteGroups', () => {
  it('lists Practice, Songs, Folders, Lessons in that order, whatever the index ranked first', () => {
    const groups = paletteGroups([
      group('lessons', 'Triads'),
      group('songs', 'Grace'),
      group('chords', 'Minor'),
      group('folders', 'Hymns'),
    ])
    expect(groups.map(({ id }) => id)).toEqual(['practice', 'songs', 'folders', 'lessons'])
  })

  it('puts every tool’s kind under Practice and a course with the lessons, nearest kinds first', () => {
    const groups = paletteGroups([
      group('scales', 'Dorian'),
      group('courses', 'Called to play'),
      group('pages', 'Scales and keys'),
      group('lessons', 'Modes'),
    ])
    expect(groups.map(({ id, entries }) => [id, entries.map(({ title }) => title)])).toEqual([
      ['practice', ['Dorian', 'Scales and keys']],
      ['lessons', ['Called to play', 'Modes']],
    ])
  })

  it('shows a group’s nearest rows only, and no group with none', () => {
    const groups = paletteGroups([group('songs', 'a', 'b', 'c', 'd')], 2)
    expect(groups).toEqual([{ id: 'songs', entries: [entry('songs', 'a'), entry('songs', 'b')] }])
    expect(paletteGroups([])).toEqual([])
  })
})
