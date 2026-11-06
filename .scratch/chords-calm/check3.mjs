// Renders the canvas boards locally: a small stand-in for the canvas runtime (holes, sc-if, sc-for).
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const [repo, dir] = process.argv.slice(2)
const require = createRequire(join(repo, 'package.json'))
const { chromium } = require('@playwright/test')
const project = join(dir, 'calm/project')
const out = join(dir, 'check-calm')
mkdirSync(out, { recursive: true })

const read = (name) => {
  const html = readFileSync(join(project, `${name}.dc.html`), 'utf8')
  return {
    template: html.slice(html.indexOf('</helmet>') + 9, html.indexOf('</x-dc>')),
    logic: /data-dc-script[^>]*>([\s\S]*?)<\/script>/.exec(html)[1],
  }
}

const expand = (name, props) => {
  const { template, logic } = read(name)
  return { template, logic, props }
}

async function render(browser, shot, source, width, height) {
  const tab = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await tab.setContent(
    `<!doctype html><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Noto+Music&display=swap" rel="stylesheet"><style>body{margin:0}</style><div id="root"></div>`,
    { waitUntil: 'load' },
  )
  const errors = await tab.evaluate(({ template, logic, props }) => {
    const problems = []
    class DCLogic {
      constructor() { this.props = props; this.state = {} }
      setState(next) { Object.assign(this.state, next) }
    }
    const Component = new Function('DCLogic', `${logic}; return Component`)(DCLogic)
    const vals = new Component().renderVals()
    const look = (path, scope) => {
      const value = path.trim().split('.').reduce((at, key) => (at == null ? at : at[key]), scope)
      if (value === undefined && !/^(true|false)$/.test(path.trim())) problems.push(`missing ${path}`)
      if (path.trim() === 'true') return true
      if (path.trim() === 'false') return false
      return value
    }
    const fill = (text, scope) => text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, p) => {
      const value = look(p, scope)
      return typeof value === 'function' ? '' : String(value ?? '')
    })
    const walk = (node, scope, into) => {
      if (node.nodeType === 3) { into.appendChild(document.createTextNode(fill(node.textContent, scope))); return }
      if (node.nodeType !== 1) return
      const tag = node.tagName.toLowerCase()
      if (tag === 'sc-if') {
        const cond = look(/\{\{\s*(.+?)\s*\}\}/.exec(node.getAttribute('value'))[1], scope)
        if (cond) for (const child of node.childNodes) walk(child, scope, into)
        return
      }
      if (tag === 'sc-for') {
        const list = look(/\{\{\s*(.+?)\s*\}\}/.exec(node.getAttribute('list'))[1], scope) || []
        const as = node.getAttribute('as')
        list.forEach((item) => { for (const child of node.childNodes) walk(child, { ...scope, [as]: item }, into) })
        return
      }
      const copy = document.createElementNS(node.namespaceURI, node.localName)
      for (const attr of node.attributes) {
        if (/^on/i.test(attr.name)) continue
        copy.setAttribute(attr.name, fill(attr.value, scope))
      }
      for (const child of node.childNodes) walk(child, scope, copy)
      into.appendChild(copy)
    }
    const holder = document.createElement('div')
    holder.innerHTML = template
    const root = document.getElementById('root')
    for (const child of holder.childNodes) walk(child, vals, root)
    return problems
  }, source)
  await tab.evaluate(() => document.fonts.ready)
  await tab.waitForTimeout(700)
  await tab.screenshot({ path: join(out, `${shot}.png`) })
  const overflow = await tab.evaluate(() =>
    [...document.querySelectorAll('button, div, span')]
      .filter((el) => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow === 'visible' && el.clientWidth > 0 && el.textContent.trim().length > 0 && el.children.length === 0)
      .map((el) => `${el.textContent.trim().slice(0, 24)} (${el.scrollWidth}>${el.clientWidth})`)
      .slice(0, 8),
  )
  console.log(shot, 'problems:', [...new Set(errors)].join(', ') || 'none', '| overflow:', overflow.join('; ') || 'none')
  await tab.close()
}

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const P=(n,pr)=>render(browser,n,expand('App',pr),402,874)
const Q=(n,pr)=>render(browser,n,expand('AppSafari',pr),402,714)
const M=(n,pr)=>render(browser,n,expand('AppSmallSafari',pr),393,695)
const A=(n,pr)=>render(browser,n,expand('AppSmall',pr),393,852)
await P('staffset',{overlay:'staffSettings',page:'staff',root:7,chord:'7',staffFingers:true})
await P('more2',{overlay:'more',chord:'maj7'})
await P('rest',{})
await P('toolsLive',{overlay:'tools',metroOn:true})
await P('metro',{overlay:'metroSettings'})
await P('ramp',{overlay:'metroSettings',rampOn:true})
await P('both',{overlay:'metroSettings',rampOn:true,gapOn:true})
await P('tuner',{overlay:'tuner'})
await P('tunerNo',{overlay:'tuner',tunerRefused:true})
await Q('sBoth',{overlay:'metroSettings',rampOn:true,gapOn:true})
await Q('sTuner',{overlay:'tuner'})
await Q('sMetro',{overlay:'metroSettings'})
await M('mMetro',{overlay:'metroSettings'})
await render(browser,'laptopRamp',expand('DeskApp',{overlay:'metroSettings',rampOn:true,gapOn:true}),1710,904)
await Q('sTools',{overlay:'tools',metroOn:true})
await render(browser,'laptopTools',expand('DeskApp',{overlay:'tools',metroOn:true}),1710,904)
await Q('sRest',{chord:'maj7'})
await Q('sStaff',{page:'staff',root:7,chord:'13',staffFingers:true})
await Q('sFing',{page:'fingers',root:7,chord:'13'})
await Q('sChange',{overlay:'change',root:3,flats:true,chord:'m7'})
await Q('sSet',{overlay:'staffSettings',page:'staff',root:7,chord:'7',staffFingers:true})
await Q('sKey',{overlay:'keyboard'})
await M('mRest',{root:9,chord:'m7'})
await M('mKey',{overlay:'keyboard'})
await M('mStaff',{page:'staff',root:7,chord:'13',staffFingers:true})
await A('aRest',{root:9,chord:'m7'})
await render(browser,'laptopStaff',expand('DeskApp',{page:'staff',root:7,chord:'13',staffFingers:true}),1710,904)
await P('big',{root:7,chord:'13'})
await P('bigf',{page:'fingers',root:7,chord:'13'})
await P('bigs',{page:'staff',root:7,chord:'13',staffFingers:true})
await P('staff',{page:'staff',root:7,chord:'7',staffFingers:true})
await P('nine',{page:'fingers',root:3,flats:true,chord:'m9'})
await P('practise',{overlay:'practise'})
await P('change',{overlay:'change',root:3,flats:true,chord:'m7'})
await P('voicing',{overlay:'voicing',chord:'maj7',voicing:'drop2'})
await P('fingers',{page:'fingers',chord:'maj7'})
await P('notes',{page:'built',root:7,chord:'7'})
await P('more',{overlay:'more',chord:'maj7'})
await P('keyboard',{overlay:'keyboard'})
await P('tools',{overlay:'tools'})
await P('pedals',{overlay:'pedals'})
await P('large',{keySize:'large',root:2,chord:'m7'})
await P('all',{keySize:'all',root:5,chord:'maj7'})
await P('hands',{showHands:true,root:7})
await P('night',{theme:'night',root:1,flats:true,chord:'maj7'})
await render(browser,'laptop',expand('DeskApp',{root:3,flats:true,chord:'m7'}),1710,904)
await render(browser,'laptopMore',expand('DeskApp',{overlay:'keyboard'}),1710,904)
await render(browser,'land',expand('SideApp',{root:2,chord:'m7'}),874,402)
await browser.close()
