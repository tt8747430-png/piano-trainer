// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { dockTap } from './tap-on-screen'

function screenWith(html: string) {
  const root = document.createElement('div')
  root.innerHTML = html
  document.body.append(root)
  return (selector: string) => {
    const found = root.querySelector(selector)
    if (!found) throw new Error(selector)
    return found
  }
}

describe('dockTap', () => {
  const at = screenWith(`
    <div data-area="lead"><button id="close">×</button><h1 id="title">Song</h1></div>
    <div data-area="sheet"><div id="margin"><button id="bar">Bar 1</button></div></div>
    <div data-area="dock"><button id="play">Play</button><div id="pill"></div></div>
    <div data-area="keys"><div id="key"></div></div>`)

  it('leaves the transport be on itself, the keys and every other control', () => {
    expect(dockTap(at('#play'))).toBe('none')
    expect(dockTap(at('#pill'))).toBe('none')
    expect(dockTap(at('#key'))).toBe('none')
    expect(dockTap(at('#close'))).toBe('none')
  })

  it('brings it into sight at a tap on a note, ready to play from there', () => {
    expect(dockTap(at('#bar'))).toBe('show')
  })

  it('shows or hides it at a tap anywhere else', () => {
    expect(dockTap(at('#margin'))).toBe('toggle')
    expect(dockTap(at('#title'))).toBe('toggle')
  })
})
