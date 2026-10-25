import { describe, expect, it } from 'vitest'
import { parseKey, type Key } from '@/shared/lib/music'
import { draftOf, form } from '../testing/test-draft'
import { joinSection, newSection, setSectionKey, setSectionKind } from './sections'
import { keyAt, meterAt } from './timeline'

const key = (text: string): Key => {
  const parsed = parseKey(text)
  if (!parsed) throw new Error(text)
  return parsed
}

const headings = (draft: ReturnType<typeof draftOf>) =>
  draft.sections.map((section) => section.heading)

describe('sections', () => {
  const verse = draftOf({ sections: [{ kind: 'verse', n: 1, lines: ['G C', 'D G'] }] })

  it('starts a new section at a bar, splitting its line, numbered after its kind', () => {
    const split = newSection(verse, 3)
    expect(form(split)).toEqual([[['G@0', 'C@0'], ['D@0']], [['G@0']]])
    expect(headings(split)).toEqual([
      { kind: 'verse', n: 1 },
      { kind: 'verse', n: 2 },
    ])
    expect(newSection(verse, 0)).toBe(verse)
  })

  it('leaves a section given the kind and name it has as it was', () => {
    expect(setSectionKind(verse, 0, 'verse')).toBe(verse)
    const last = draftOf({ sections: [{ kind: 'chorus', last: true, lines: ['G'] }] })
    expect(headings(setSectionKind(last, 0, 'chorus'))).toEqual([{ kind: 'chorus' }])
  })

  it('joins a section to the one before', () => {
    expect(form(joinSection(newSection(verse, 2), 1))).toEqual(form(verse))
  })

  it('names a section by its kind: a verse the next number, a part the next letter', () => {
    const three = draftOf({
      sections: [
        { kind: 'part', label: 'A', lines: ['G'] },
        { kind: 'chorus', last: true, lines: ['C'] },
        { kind: 'intro', lines: ['D'] },
      ],
    })
    expect(headings(setSectionKind(three, 2, 'part'))[2]).toEqual({ kind: 'part', label: 'B' })
    expect(headings(setSectionKind(three, 1, 'verse'))[1]).toEqual({ kind: 'verse', n: 1 })
    expect(headings(setSectionKind(three, 0, 'chorus'))[0]).toEqual({ kind: 'chorus' })
  })

  it('counts the verses after a new, joined or changed verse on or back, so no two verses share a number', () => {
    const two = draftOf({
      sections: [
        { kind: 'verse', n: 1, lines: ['G C'] },
        { kind: 'verse', n: 2, lines: ['D G'] },
      ],
    })
    expect(headings(newSection(two, 1))).toEqual([
      { kind: 'verse', n: 1 },
      { kind: 'verse', n: 2 },
      { kind: 'verse', n: 3 },
    ])
    expect(headings(joinSection(newSection(two, 1), 1))).toEqual([
      { kind: 'verse', n: 1 },
      { kind: 'verse', n: 2 },
    ])
    expect(headings(setSectionKind(two, 0, 'chorus'))).toEqual([
      { kind: 'chorus' },
      { kind: 'verse', n: 1 },
    ])
  })

  it('never letters a part again: a new part takes the first letter no part has', () => {
    const form = draftOf({
      sections: [
        { kind: 'part', label: 'A', lines: ['C G'] },
        { kind: 'part', label: 'A', lines: ['C G'] },
        { kind: 'part', label: 'B', lines: ['G C'] },
        { kind: 'part', label: 'A', lines: ['C G'] },
      ],
    })
    expect(headings(newSection(form, 1))).toEqual([
      { kind: 'part', label: 'A' },
      { kind: 'part', label: 'C' },
      { kind: 'part', label: 'A' },
      { kind: 'part', label: 'B' },
      { kind: 'part', label: 'A' },
    ])
    expect(headings(joinSection(form, 1)).map((heading) => heading.label)).toEqual(['A', 'B', 'A'])
  })

  describe('a key change at a section (ADR 0089)', () => {
    const song = draftOf({
      sections: [
        { kind: 'verse', n: 1, lines: ['G C'] },
        { kind: 'chorus', lines: ['C G'] },
        { kind: 'verse', n: 2, lines: ['G D'] },
        { kind: 'bridge', key: 'E', lines: ['E A'] },
        { kind: 'chorus', last: true, lines: ['C G'] },
      ],
    })
    const keys = (draft: typeof song) => draft.sections.map((section) => section.heading.key)

    it('runs from the section on, until the next change of key', () => {
      expect(keys(setSectionKey(song, 1, key('A')))).toEqual([undefined, 'A', 'A', 'E', undefined])
    })

    it('writes no key where the section goes back to the song’s', () => {
      expect(keys(setSectionKey(song, 3, key('G')))).toEqual([
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ])
      expect(setSectionKey(song, 0, key('G'))).toBe(song)
    })

    it('is the key at a tick: a section’s own, else the song’s', () => {
      expect(keyAt(song, 0)).toEqual(key('G'))
      // Each bar a whole note: the bridge starts at its seventh bar.
      expect(keyAt(song, 6 * 96)).toEqual(key('E'))
      expect(keyAt(song, 8 * 96)).toEqual(key('G'))
    })

    it('stays in a section split by a new section: its second half keeps its key', () => {
      // The bridge, in E, split at its second bar.
      const split = newSection(song, 7)
      expect(keys(split)).toEqual([undefined, undefined, undefined, 'E', 'E', undefined])
      expect(keyAt(split, 7 * 96)).toEqual(key('E'))
    })
  })

  describe('a change of time at a section (ADR 0095)', () => {
    const song = draftOf({
      sections: [
        { kind: 'verse', n: 1, lines: ['G C'] },
        { kind: 'chorus', lines: ['C G'] },
        { kind: 'bridge', meter: '3/4', lines: ['E A'] },
        { kind: 'chorus', last: true, lines: ['C G'] },
      ],
      melody: 'B4/4 | C5/4 | E5/2 E5/2 | G5/4 | B4/3 | A4/3 | G4/4 | G4/4',
    })
    const meters = (draft: typeof song) => draft.sections.map((section) => section.heading.meter)

    it('is the meter at a tick: a section’s own, else the song’s', () => {
      expect(meterAt(song, 0)).toBe('4/4')
      // The bridge starts at its fifth bar, after four of 4/4.
      expect(meterAt(song, 4 * 96)).toBe('3/4')
      expect(meterAt(song, 4 * 96 + 2 * 72)).toBe('4/4')
    })

    it('stays in a section split by a new section, and in one named afresh', () => {
      const split = newSection(song, 5)
      expect(meters(split)).toEqual([undefined, undefined, '3/4', '3/4', undefined])
      expect(meters(setSectionKind(song, 2, 'verse'))[2]).toBe('3/4')
    })
  })
})
