import { chromium } from '@playwright/test'

// The interactive pianos past their start screens: Recursive Arts after its power button, OnlinePianist once warm
// with Sustain on, Midiano's app after Launch. Laptop and phone.
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const shot = (page, name) => page.screenshot({ path: `.scratch/r33/ref/${name}.png` })
const tryClick = async (page, locator) => {
  try {
    await locator.first().click({ timeout: 8000 })
    return true
  } catch {
    return false
  }
}
for (const [size, width, height] of [
  ['laptop', 1440, 900],
  ['phone', 402, 874],
]) {
  const ra = await browser.newPage({ viewport: { width, height } })
  await ra.goto('https://recursivearts.com/virtual-piano/', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await ra.waitForTimeout(4000)
  await tryClick(ra, ra.getByText('Press to Start Piano'))
  await tryClick(ra, ra.locator('[class*=power], [id*=power], [class*=start]'))
  await ra.waitForTimeout(6000)
  await shot(ra, `recursivearts-started-${size}`)
  await tryClick(ra, ra.getByText(/sustain/i))
  await ra.waitForTimeout(1000)
  await shot(ra, `recursivearts-sustain-${size}`)
  await ra.close()

  const op = await browser.newPage({ viewport: { width, height } })
  await op.goto('https://www.onlinepianist.com/virtual-piano', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await op.waitForTimeout(15000)
  await shot(op, `onlinepianist-warm-${size}`)
  await tryClick(op, op.getByText(/^sustain$/i))
  await op.waitForTimeout(1000)
  await shot(op, `onlinepianist-sustain-${size}`)
  await tryClick(op, op.getByText(/^settings$/i))
  await op.waitForTimeout(1500)
  await shot(op, `onlinepianist-settings-${size}`)
  await op.close()

  const md = await browser.newPage({ viewport: { width, height } })
  await md.goto('https://midiano.com', { waitUntil: 'domcontentloaded', timeout: 45000 })
  await md.waitForTimeout(3000)
  await tryClick(md, md.getByText(/launch midiano/i))
  await md.waitForTimeout(10000)
  await shot(md, `midiano-app-${size}`)
  await md.close()
}
await browser.close()
