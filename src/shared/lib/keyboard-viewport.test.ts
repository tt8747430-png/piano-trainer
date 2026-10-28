// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import {
  expectKeyboard,
  KEYBOARD_STORAGE_KEY,
  keyboardHeight,
  keyboardOpen as isKeyboardOpen,
  startKeyboardViewport,
  subscribeKeyboard,
  visibleBottom,
} from './keyboard-viewport'

interface Viewport {
  height: number
  offsetTop: number
  scale?: number
}

/** A phone's two viewports (Mindscape's test): the layout one's room, and the visual one inside it. */
function stubViewport({ height, offsetTop, scale = 1 }: Viewport, layoutHeight: number) {
  const listeners = new Set<() => void>()
  const visual = {
    height,
    offsetTop,
    scale,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }
  const layout = { height: layoutHeight, width: 390 }
  Object.defineProperty(window, 'visualViewport', { value: visual, configurable: true })
  Object.defineProperty(document.documentElement, 'clientHeight', {
    get: () => layout.height,
    configurable: true,
  })
  Object.defineProperty(document.documentElement, 'clientWidth', {
    get: () => layout.width,
    configurable: true,
  })
  return {
    move: async (next: Viewport & { layoutHeight?: number; width?: number }) => {
      visual.height = next.height
      visual.offsetTop = next.offsetTop
      visual.scale = next.scale ?? 1
      if (next.layoutHeight !== undefined) layout.height = next.layoutHeight
      if (next.width !== undefined) layout.width = next.width
      for (const listener of listeners) listener()
      await new Promise((resolve) => requestAnimationFrame(resolve))
    },
    heard: () => listeners.size,
  }
}

const root = document.documentElement
const inset = () => root.style.getPropertyValue('--kb-inset')
const room = () => root.style.getPropertyValue('--app-height')
const keyboardOpen = () => root.hasAttribute('data-keyboard')
const range = () => root.style.getPropertyValue('--kb-range')
/** The keyboard's height a launch remembers, as the store saves it. */
const remembered = (height: number) =>
  localStorage.setItem(KEYBOARD_STORAGE_KEY, JSON.stringify({ state: { height }, version: 1 }))
const rememberedHeight = (): unknown =>
  JSON.parse(localStorage.getItem(KEYBOARD_STORAGE_KEY) ?? 'null')?.state?.height

let stop: (() => void) | undefined
afterEach(() => {
  stop?.()
  stop = undefined
  Reflect.deleteProperty(window, 'visualViewport')
  Reflect.deleteProperty(root, 'clientHeight')
  Reflect.deleteProperty(root, 'clientWidth')
})

describe('the keyboard’s viewport', () => {
  it('publishes no inset and no keyboard while none is up', () => {
    stubViewport({ height: 800, offsetTop: 0 }, 800)
    stop = startKeyboardViewport()
    expect(inset()).toBe('0px')
    expect(room()).toBe('800px')
    expect(keyboardOpen()).toBe(false)
  })

  it('measures the keyboard less the pan iOS made to show the field', () => {
    stubViewport({ height: 412, offsetTop: 113 }, 802)
    stop = startKeyboardViewport()
    // A keyboard of 390, the view panned by 113: 277 of the layout's room covered.
    expect(inset()).toBe('277px')
    expect(keyboardOpen()).toBe(true)
  })

  it('reads a keyboard panned past its floor as a keyboard still (the floor is the keyboard’s)', () => {
    stubViewport({ height: 390, offsetTop: 289 }, 793)
    stop = startKeyboardViewport()
    expect(keyboardOpen()).toBe(true)
    expect(inset()).toBe('114px')
  })

  it('takes neither an accessory bar nor a pinch-zoom for a keyboard', async () => {
    const viewport = stubViewport({ height: 802, offsetTop: 0 }, 802)
    stop = startKeyboardViewport()
    await viewport.move({ height: 760, offsetTop: 0 })
    expect(keyboardOpen()).toBe(false)
    await viewport.move({ height: 412, offsetTop: 113, scale: 2 })
    expect(keyboardOpen()).toBe(false)
    expect(inset()).toBe('0px')
  })

  it('keeps the room it anchored while a keyboard shrinks the layout, and anchors anew on a turn', async () => {
    const viewport = stubViewport({ height: 844, offsetTop: 0 }, 844)
    stop = startKeyboardViewport()
    // A browser that resizes the layout with the keyboard: the room stays the one anchored.
    await viewport.move({ height: 500, offsetTop: 0, layoutHeight: 500 })
    expect(room()).toBe('844px')
    expect(inset()).toBe('344px')
    await viewport.move({ height: 390, offsetTop: 0, layoutHeight: 390, width: 844 })
    expect(room()).toBe('390px')
    expect(keyboardOpen()).toBe(false)
  })

  it('clears all it set when stopped, and hears the viewport no more', async () => {
    const viewport = stubViewport({ height: 800, offsetTop: 0 }, 800)
    stop = startKeyboardViewport()
    await viewport.move({ height: 450, offsetTop: 0 })
    expect(keyboardOpen()).toBe(true)
    stop()
    stop = undefined
    expect(viewport.heard()).toBe(0)
    expect(inset()).toBe('')
    expect(room()).toBe('')
    expect(root.hasAttribute('data-keyboard')).toBe(false)
  })

  it('gives the page the range to lift a field clear of the keyboard: the room it covers and a gap', async () => {
    const viewport = stubViewport({ height: 844, offsetTop: 0 }, 844)
    stop = startKeyboardViewport()
    expect(range()).toBe('0px')
    await viewport.move({ height: 500, offsetTop: 0 })
    expect(range()).toBe('368px')
    await viewport.move({ height: 844, offsetTop: 0 })
    expect(range()).toBe('0px')
  })

  it('remembers the tallest keyboard measured, never the part the pan left', async () => {
    const viewport = stubViewport({ height: 844, offsetTop: 0 }, 844)
    stop = startKeyboardViewport()
    await viewport.move({ height: 500, offsetTop: 100 })
    expect(rememberedHeight()).toBe(344)
    await viewport.move({ height: 600, offsetTop: 0 })
    expect(rememberedHeight()).toBe(344)
  })

  it('reserves the remembered keyboard as a field takes the focus, before the keyboard reports itself', async () => {
    remembered(340)
    const viewport = stubViewport({ height: 844, offsetTop: 0 }, 844)
    stop = startKeyboardViewport()
    expect(keyboardOpen()).toBe(false)
    expectKeyboard(true)
    // Nothing moves when it comes: the field was lifted, and the foot stepped aside, already.
    expect(keyboardOpen()).toBe(true)
    expect(inset()).toBe('340px')
    expect(range()).toBe('364px')
    // The keyboard reports itself: its own measure from then on.
    await viewport.move({ height: 520, offsetTop: 0 })
    expect(inset()).toBe('324px')
    // Dismissed under a field that keeps the focus: the room comes back.
    await viewport.move({ height: 844, offsetTop: 0 })
    expect(keyboardOpen()).toBe(false)
    expect(inset()).toBe('0px')
  })

  it('reserves nothing where no keyboard was ever measured (a laptop), and nothing once the field is left', () => {
    stubViewport({ height: 800, offsetTop: 0 }, 800)
    stop = startKeyboardViewport()
    expectKeyboard(true)
    expect(keyboardOpen()).toBe(false)
    expectKeyboard(false)
    remembered(300)
    stop()
    stop = startKeyboardViewport()
    expectKeyboard(true)
    expect(keyboardOpen()).toBe(true)
    expectKeyboard(false)
    expect(keyboardOpen()).toBe(false)
    expect(range()).toBe('0px')
  })

  it('holds the room it anchored while a field is focused, so a layout shrinking under it reflows nothing', async () => {
    remembered(300)
    const viewport = stubViewport({ height: 844, offsetTop: 0 }, 700)
    stop = startKeyboardViewport()
    expectKeyboard(true)
    await viewport.move({ height: 844, offsetTop: 0, layoutHeight: 844 })
    expect(room()).toBe('700px')
  })

  it('tells who listens, and says how high the keyboard stands and where the seen room ends', async () => {
    const viewport = stubViewport({ height: 844, offsetTop: 0 }, 844)
    stop = startKeyboardViewport()
    let heard = 0
    const unsubscribe = subscribeKeyboard(() => heard++)
    await viewport.move({ height: 500, offsetTop: 0 })
    expect(heard).toBeGreaterThan(0)
    expect(isKeyboardOpen()).toBe(true)
    expect(keyboardHeight()).toBe(344)
    expect(visibleBottom()).toBe(500)
    unsubscribe()
    const before = heard
    await viewport.move({ height: 844, offsetTop: 0 })
    expect(heard).toBe(before)
    expect(keyboardHeight()).toBe(0)
  })
})
