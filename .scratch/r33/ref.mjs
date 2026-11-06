import { chromium } from '@playwright/test'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
for (const [name, url, w, h] of [['musicca-laptop','https://www.musicca.com/piano',1440,900],['musicca-phone','https://www.musicca.com/piano',402,874],['pianoorg-laptop','https://piano.org/',1440,900],['pianoorg-phone','https://piano.org/',402,874]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' })
  try { const r = await p.goto(url, { waitUntil: 'networkidle', timeout: 40000 }); await p.waitForTimeout(2500); console.log(name, r?.status()); await p.screenshot({ path: `.scratch/r33/ref/${name}.png` }) } catch (e) { console.log(name, 'ERR', e.message.split('\n')[0]) }
  await p.close()
}
await b.close()
