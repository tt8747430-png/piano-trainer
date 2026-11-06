import { expect, test, violations } from './fixtures'

/**
 * Each place a learner reaches from the tab bar or a link, and what says it opened: its page's heading,
 * or for Search, the palette over Learn (ADR 0052). Explore is Songs' second view; Settings opens on
 * its first page, General, beside the list on a laptop.
 */
const PLACES = [
  { path: '/', heading: 'Learn' },
  { path: '/songs', heading: 'Songs' },
  { path: '/songs?view=explore', heading: 'Songs' },
  { path: '/practice', heading: 'Practice' },
  { path: '/search', dialog: 'Search' },
  { path: '/settings/general', heading: 'General' },
  { path: '/profile', heading: 'Profile' },
  { path: '/legal/privacy', heading: 'Privacy' },
  { path: '/account/sign-in', heading: 'Sign in' },
] as const

for (const place of PLACES) {
  const { path } = place
  test(`${path} opens, with nothing serious for a screen reader or a keyboard`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(path)
    await expect(
      'dialog' in place
        ? page.getByRole('dialog', { name: place.dialog })
        : page.getByRole('heading', { level: 1, name: place.heading }),
    ).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
    expect(await violations(page)).toEqual([])
    expect(errors).toEqual([])
  })
}
