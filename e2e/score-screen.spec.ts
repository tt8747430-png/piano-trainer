import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

/** Where an area of the score's screen stands, rounded to the pixel: its top and its bottom. */
async function span(page: Page, area: string) {
  const box = await page.locator(`[data-area="${area}"]`).first().boundingBox()
  if (!box) throw new Error(`no ${area} on the screen`)
  return { top: Math.round(box.y), bottom: Math.round(box.y + box.height) }
}

/** The score engraved, so every row has its height. */
async function engraved(page: Page) {
  await page.locator('[data-slot="score"] svg g.note').first().waitFor()
}

test('the music stands still as Practise · Edit switches, and nothing keeps a band above the keys', async ({
  page,
}) => {
  await page.goto('/play/bz5')
  await engraved(page)
  const sheet = await span(page, 'sheet')
  // Nothing said, the status row takes no room: the keys meet the music (R32).
  expect.soft((await span(page, 'keys')).top).toBe(sheet.bottom)

  // Wait mode before Play: its line has nothing to say yet.
  await page.goto('/play/bz5?mode=wait')
  await engraved(page)
  expect.soft((await span(page, 'keys')).top).toBe((await span(page, 'sheet')).bottom)

  await page.goto('/edit/bz5')
  await engraved(page)
  const work = await span(page, 'work')
  // Under the same bar at the same height (ADR 0115), the palette docked on the keys.
  expect.soft(work.top).toBe(sheet.top)
  expect.soft((await span(page, 'keys')).top).toBe(work.bottom)
  // A laptop's palette is a panel at the sheet's side: it meets the bar, never over it.
  const panel = page.locator('[data-area="work"] > aside')
  if (await panel.isVisible()) {
    const box = await panel.boundingBox()
    expect.soft(Math.round(box?.y ?? 0)).toBe((await span(page, 'bar')).bottom)
  }
})
