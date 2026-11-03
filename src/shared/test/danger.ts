import { expect } from 'vitest'

/**
 * Rule 25 for a destructive row: red, in a group of what ends or destroys, and that group with the
 * page's others like it after every ordinary group, a footnote under it.
 */
export function expectLastAndAlone(row: HTMLElement): void {
  expect(row).toHaveAttribute('data-danger')
  expect(row.querySelector('.text-destructive')).not.toBeNull()
  const group = row.closest('[data-group="danger"]')
  expect(group).not.toBeNull()
  expect(group?.querySelector(':scope > p')?.textContent).toBeTruthy()
  const page = row.closest('main') ?? document.body
  const sections = [...page.querySelectorAll('section')]
  const first = sections.findIndex((section) => section.matches('[data-group="danger"]'))
  expect(sections.slice(first).every((section) => section.matches('[data-group="danger"]'))).toBe(
    true,
  )
}
