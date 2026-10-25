// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { watchTrees } from './trees'

/** A small page: a section holding a paragraph with a bold word in it. */
function page() {
  const section = document.createElement('section')
  section.innerHTML = '<p>A <b>bold</b> word</p>'
  return { section, bold: section.querySelector('b') }
}

describe('watchTrees', () => {
  it('takes apart a tree put on the page and taken off it, node from node', () => {
    const takeApart = watchTrees()
    const { section, bold } = page()
    document.body.append(section)
    section.remove()
    takeApart()
    expect(section.childNodes).toHaveLength(0)
    expect(bold?.parentNode).toBeNull()
    expect(bold?.childNodes).toHaveLength(0)
  })

  it('takes apart a tree taken off a part of the page already off it, as a portal leaves', () => {
    const takeApart = watchTrees()
    const portal = document.createElement('div')
    document.body.append(portal)
    const { section, bold } = page()
    portal.append(section)
    portal.remove()
    section.remove()
    takeApart()
    expect(bold?.parentNode).toBeNull()
  })

  it('leaves what is still on the page', () => {
    const takeApart = watchTrees()
    const { section, bold } = page()
    document.body.append(section)
    takeApart()
    expect(bold?.parentNode?.parentNode).toBe(section)
  })

  it('leaves what was on the page as the test began: a page its file shares across its tests', () => {
    const shared = page()
    document.body.append(shared.section)
    const takeApart = watchTrees()
    shared.section.remove()
    takeApart()
    expect(shared.bold?.parentNode?.parentNode).toBe(shared.section)
  })
})
