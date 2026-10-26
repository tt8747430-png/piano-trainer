// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'

const html = readFileSync('index.html', 'utf8')
const boot = html.match(/<script id="standalone-boot">([\s\S]*?)<\/script>/)?.[1]
const viewport = html.match(/<meta\s+name="viewport"\s+content="([^"]*)"/)?.[1]

/** Runs index.html's standalone script as the browser would, as an installed app or in a tab. */
function runBoot(display: 'standalone' | 'fullscreen' | 'browser') {
  if (!boot || viewport === undefined) throw new Error('index.html has no standalone boot')
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === `(display-mode: ${display})`,
  }))
  const meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = viewport
  document.head.append(meta)
  new Function(boot)()
  return meta.content
}

afterEach(() => document.head.querySelector('meta[name="viewport"]')?.remove())

describe('the #standalone-boot script in index.html', () => {
  it.each(['standalone', 'fullscreen'] as const)(
    'locks the zoom in the installed app (%s): no pinch, no double tap',
    (display) => {
      expect(runBoot(display)).toContain('maximum-scale=1, user-scalable=no')
    },
  )

  it('opens no long-press menu, starts no selection and takes no Safari gesture in the installed app, outside fields', () => {
    runBoot('standalone')
    const press = (type: string, target: EventTarget = document.body) => {
      const event = new Event(type, { bubbles: true, cancelable: true })
      target.dispatchEvent(event)
      return event.defaultPrevented
    }
    expect(press('contextmenu')).toBe(true)
    expect(press('selectstart')).toBe(true)
    expect(press('gesturestart')).toBe(true)
    const field = document.createElement('input')
    document.body.append(field)
    expect(press('contextmenu', field)).toBe(false)
    expect(press('selectstart', field)).toBe(false)
    field.remove()
  })

  it('keeps the keyboard over the page, in a tab and installed alike (Mindscape’s ADR 0002)', () => {
    // Under resizes-content the layout would shrink with the keyboard and the app lift with it.
    expect(viewport).toContain('interactive-widget=resizes-visual')
    expect(runBoot('standalone')).toContain('interactive-widget=resizes-visual')
  })

  it('leaves a browser tab zoomable', () => {
    expect(runBoot('browser')).toBe(viewport)
  })

  it('declares the installed app to iOS and Android, its status bar black', () => {
    for (const meta of [
      '<meta name="mobile-web-app-capable" content="yes" />',
      '<meta name="apple-mobile-web-app-capable" content="yes" />',
      '<meta name="apple-mobile-web-app-status-bar-style" content="black" />',
      '<meta name="apple-mobile-web-app-title" content="Piano" />',
    ])
      expect(html).toContain(meta)
    expect(viewport).toContain('interactive-widget=resizes-visual')
  })
})
