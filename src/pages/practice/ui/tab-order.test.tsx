import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

/** What a control is called where a person would read it. */
const nameOf = (element: Element) =>
  element.getAttribute('aria-label') ?? element.textContent?.trim() ?? element.tagName

describe('Tab on Practice (A36)', () => {
  it('walks the skip link, the places, then the page top to bottom, reaching every control', async () => {
    const user = userEvent.setup()
    await renderApp('/practice')
    const heading = await screen.findByRole('heading', { level: 1, name: 'Practice' })
    // The screen puts the focus on its heading in the frame after it opens; the walk starts after.
    await waitFor(() => expect(heading).toHaveFocus())
    // From the top of the document, as a page freshly loaded is walked.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    const walked: Element[] = []
    for (let step = 0; step < 60; step++) {
      await user.tab()
      const at = document.activeElement
      if (!at || at === document.body || walked.includes(at)) break
      walked.push(at)
    }
    const names = walked.map(nameOf)
    expect(names[0]).toBe('Skip to content')
    // The places before the page, as the sidebar stands left of it and the tab bar is the app's own.
    const learn = names.indexOf('Learn')
    const metronome = names.findIndex((name) => name.startsWith('Metronome'))
    expect(learn).toBeGreaterThan(0)
    expect(metronome).toBeGreaterThan(learn)
    // The groups' rows in the order they are read: Tools, Theory, Playing, then Training.
    const row = (start: string) => names.findIndex((name) => name.startsWith(start))
    expect(row('Metronome')).toBeLessThan(row('Tuner'))
    expect(row('Tuner')).toBeLessThan(row('Chords'))
    expect(row('Chords')).toBeLessThan(row('Intervals'))
    expect(row('Progressions')).toBeLessThan(row('Accompaniment'))
    expect(row('Accompaniment')).toBeLessThan(row('Exercises'))
    // Every link and button on the screen is reached, none skipped and none trapping the walk.
    const reachable = [...document.querySelectorAll('a[href], button:not([disabled])')].filter(
      (element) => !element.closest('[hidden], [inert], [aria-hidden="true"]'),
    )
    expect(reachable.filter((element) => !walked.includes(element)).map(nameOf)).toEqual([])
    // DOM order is the walk's order: nothing pulls itself forward with a tabindex of its own.
    expect(walked.filter((element) => element.getAttribute('tabindex')?.match(/^[1-9]/))).toEqual(
      [],
    )
  })
})
