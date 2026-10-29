import { expect, test, violations } from './fixtures'

test('a lesson opens from Learn and reads, a section at a time on a phone', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('link', { name: /lesson/i })
    .first()
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await violations(page)).toEqual([])
})

test('a song opens from Songs and plays in the Player', async ({ page }) => {
  await page.goto('/songs/au-clair')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await violations(page)).toEqual([])
  await page.goto('/play/au-clair')
  const play = page.getByRole('button', { name: 'Play', exact: true })
  await expect(play).toBeVisible()
  await play.click()
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeVisible()
  expect(await violations(page)).toEqual([])
})
