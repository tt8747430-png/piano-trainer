import { readFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
const [route, out, w='1710', h='984', theme='light'] = process.argv.slice(2)
const v = Number(/SETTINGS_VERSION = (\d+)/.exec(readFileSync('src/entities/settings/model/store.ts','utf8'))?.[1])
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const touch = Number(w) < 1000
const c = await b.newContext({ viewport:{width:+w,height:+h}, deviceScaleFactor:1, colorScheme:theme, hasTouch:touch, isMobile:touch })
await c.addInitScript((v)=>{ if(!localStorage.getItem('pt-settings')) localStorage.setItem('pt-settings', JSON.stringify({state:{welcomed:true},version:v}))}, v)
const p = await c.newPage(); p.on('pageerror', e=>console.log('ERR', e.message))
await p.goto('http://localhost:5191'+route); await p.waitForTimeout(2500)
await p.screenshot({ path: out }); await b.close()
