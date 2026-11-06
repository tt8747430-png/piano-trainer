import { createRequire } from 'node:module'
import { join } from 'node:path'
const [repo, dir] = process.argv.slice(2)
const require = createRequire(join(repo, 'package.json'))
const { chromium } = require('@playwright/test')
const f = `file://${dir}/calm/project/frames/`, s = `file://${dir}/check-calm/`
const safari = `<svg xmlns="http://www.w3.org/2000/svg" width="334" height="48" style="position:absolute;left:58px;bottom:57px"><rect x="56.5" y=".5" width="221" height="47" rx="23.5" fill="#fafafa" stroke="#ccc"/><circle cx="24" cy="24" r="23.5" fill="#fafafa" stroke="#ccc"/><circle cx="310" cy="24" r="23.5" fill="#fafafa" stroke="#ccc"/></svg>`
const pages = {
  fPro: [450, 920, `<img src="${s}staff.png" style="position:absolute;left:24px;top:23px;border-radius:62px"><img src="${f}iphone-17-pro.png" style="position:absolute;inset:0;width:450px;height:920px">`],
  fSafari: [450, 920, `<div style="position:absolute;left:24px;top:23px;width:402px;height:874px;background:#F7F3EE;border-radius:62px"></div><img src="${s}sStaff.png" style="position:absolute;left:24px;top:85px">${safari}<img src="${f}iphone-safari.png" style="position:absolute;inset:0;width:450px;height:920px">`],
  fSide: [920, 450, `<img src="${s}land.png" style="position:absolute;left:23px;top:24px;border-radius:62px"><img src="${f}iphone-17-pro.png" style="position:absolute;left:235px;top:-235px;width:450px;height:920px;transform:rotate(-90deg)">`],
  fMac: [2143, 1299, `<img src="${f}macbook-wallpaper.jpg" style="position:absolute;left:217.7px;top:36.6px;width:1710px;height:1112px"><div style="position:absolute;left:217.7px;top:73.6px;width:1710px;height:51px;background:url(${f}safari-light.png) 0 0/100% 100%;border-radius:16px 16px 0 0"></div><img src="${s}laptop.png" style="position:absolute;left:217.7px;top:124.6px;border-radius:0 0 16px 16px"><img src="${f}macbook-air.png" style="position:absolute;inset:0;width:2143px;height:1299px">`],
}
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
for (const [n, [w, h, html]] of Object.entries(pages)) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  const file = join(dir, `check-calm/${n}.html`)
  ;(await import('node:fs')).writeFileSync(file, `<!doctype html><body style="margin:0;background:#ddd;position:relative">${html}`)
  await p.goto('file://' + file); await p.waitForTimeout(300)
  await p.screenshot({ path: join(dir, `check-calm/${n}.png`) }); await p.close()
}
await b.close()
