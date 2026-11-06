import { chromium } from '@playwright/test'
import { clearOnboarding, settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'
// Hookpad with a song and its Band editor open: fully loaded, greetings dismissed; laptop shot and every control.
const URL = 'https://hookpad.hooktheory.com/?idOfSong=kygzWeWbxKB&enableYouTube=false&openBandEditorOnInit=true'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
console.log('late:', (await settle(page, { timeout: 40000 })).join(','))
await page.waitForTimeout(8000)
console.log('dismissed:', (await clearOnboarding(page)).join(','))
await settle(page, { timeout: 15000 })
await page.screenshot({ path: '.scratch/r34/ref/hookpad-band-laptop.png' })
const dump = () => page.evaluate(() => {
  const seen = new Set(); const out = []
  for (const e of document.querySelectorAll('button,[role=button],[role=menuitem],[role=tab],a,select,input,label,[title],[aria-label],[data-tooltip]')) {
    const b = e.getBoundingClientRect(); if (!b.width) continue
    const n = (e.getAttribute('aria-label') || e.getAttribute('title') || e.getAttribute('data-tooltip') || e.innerText || e.value || '').trim().replace(/\s+/g, ' ').slice(0, 50)
    if (n && !seen.has(n)) { seen.add(n); out.push(n) }
  }
  return out
})
console.log('CONTROLS:', (await dump()).join(' | '))
console.log('TEXT:', (await page.evaluate(() => document.body.innerText)).replace(/\s*\n\s*/g, ' | ').slice(0, 5000))
await browser.close()
