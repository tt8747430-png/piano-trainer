import { readFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
const [route] = process.argv.slice(2)
const v = Number(/SETTINGS_VERSION = (\d+)/.exec(readFileSync('src/entities/settings/model/store.ts','utf8'))?.[1])
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const c = await b.newContext({ viewport:{width:1710,height:984} })
await c.addInitScript((v)=>{ if(!localStorage.getItem('pt-settings')) localStorage.setItem('pt-settings', JSON.stringify({state:{welcomed:true},version:v}))}, v)
const p = await c.newPage(); await p.goto('http://localhost:5191'+route); await p.waitForTimeout(2500)
console.log((await p.$$eval('main a[href]', as => as.map(a => a.getAttribute('href') + ' | ' + a.textContent.trim().slice(0,40)))).slice(0,40).join('\n'))
await b.close()
