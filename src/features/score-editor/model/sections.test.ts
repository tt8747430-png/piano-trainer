import { describe, expect, it } from 'vitest'
import { draftOf, form } from '../testing/test-draft'
import { joinSection, newSection, setSectionKind, setSectionPattern } from './sections'

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

  it('gives a section a pattern of its own, kept when it is named again, and gives it back', () => {
    const patterned = setSectionPattern(verse, 0, 'M3')
    expect(headings(patterned)).toEqual([{ kind: 'verse', n: 1, pattern: 'M3' }])
    expect(setSectionPattern(patterned, 0, 'M3')).toBe(patterned)
    expect(headings(setSectionKind(patterned, 0, 'chorus'))).toEqual([
      { kind: 'chorus', pattern: 'M3' },
    ])
    expect(headings(setSectionPattern(patterned, 0, null))).toEqual([{ kind: 'verse', n: 1 }])
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
})
