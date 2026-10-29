import { expect, test, violations } from './fixtures'

/** Each place a learner reaches from the tab bar or a link, and what says it opened. */
const PLACES = [
  { path: '/', heading: 'Learn' },
  { path: '/songs', heading: 'Songs' },
  { path: '/practice', heading: 'Practice' },
  { path: '/search', heading: 'Search' },
  { path: '/settings', heading: 'Settings' },
  { path: '/profile', heading: 'Profile' },
  { path: '/songs/public', heading: 'Public library' },
  { path: '/legal/privacy', heading: 'Privacy' },
  { path: '/account/sign-in', heading: 'Sign in' },
] as const

for (const { path, heading } of PLACES) {
  test(`${path} opens, with nothing serious for a screen reader or a keyboard`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
    expect(await violations(page)).toEqual([])
    expect(errors).toEqual([])
  })
}
