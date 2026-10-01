import { describe, expect, it } from 'vitest'
import { draftOf, form } from '../testing/test-draft'
import { joinSection, newSection, setSectionKind } from './sections'

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
})
