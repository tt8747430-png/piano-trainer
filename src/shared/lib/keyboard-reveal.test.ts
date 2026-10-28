// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { stubBox } from '@/shared/test/layout'
import { isTextField, revealOffset, startKeyboardReveal } from './keyboard-reveal'
import { KEYBOARD_STORAGE_KEY, keyboardOpen, startKeyboardViewport } from './keyboard-viewport'

const band = (top: number, bottom: number) => ({ top, bottom })

describe('how far a field is lifted', () => {
  it('leaves a field clear of the keyboard where it is', () => {
    expect(revealOffset(band(0, 500), band(200, 240))).toBe(0)
  })

  it('lifts a field from behind the keyboard, with a gap over it', () => {
    expect(revealOffset(band(0, 500), band(460, 510))).toBe(34)
  })

  it('puts the top of a field taller than the room at the room’s top', () => {
    expect(revealOffset(band(0, 300), band(100, 800))).toBe(76)
  })

  it('brings down a field left above the room (under the screen’s bar)', () => {
    expect(revealOffset(band(100, 500), band(40, 90))).toBe(-84)
  })
})

describe('what is typed in', () => {
  const make = (html: string) => {
    const host = document.createElement('div')
    host.innerHTML = html
    return host.firstElementChild
  }

  it('is a text field, a text area or what edits its own text', () => {
    expect(isTextField(make('<input />'))).toBe(true)
    expect(isTextField(make('<input type="search" />'))).toBe(true)
    expect(isTextField(make('<textarea></textarea>'))).toBe(true)
  })

  it('is never a button, a checkbox, a file, a range, nor a field read-only or disabled', () => {
    for (const type of ['button', 'checkbox', 'file', 'range', 'radio', 'submit']) {
      expect(isTextField(make(`<input type="${type}" />`))).toBe(false)
    }
    expect(isTextField(make('<input readonly />'))).toBe(false)
    expect(isTextField(make('<textarea disabled></textarea>'))).toBe(false)
    expect(isTextField(make('<button></button>'))).toBe(false)
    expect(isTextField(null)).toBe(false)
  })
})

/** A phone of 390×844 whose keyboard, 340 tall, was measured on an earlier visit. */
function phone() {
  localStorage.setItem(KEYBOARD_STORAGE_KEY, JSON.stringify({ state: { height: 340 }, version: 1 }))
  const root = document.documentElement
  Object.defineProperty(root, 'clientHeight', { get: () => 844, configurable: true })
  Object.defineProperty(root, 'clientWidth', { get: () => 390, configurable: true })
  const stopViewport = startKeyboardViewport()
  const stopReveal = startKeyboardReveal()
  return () => {
    stopReveal()
    stopViewport()
    Reflect.deleteProperty(root, 'clientHeight')
    Reflect.deleteProperty(root, 'clientWidth')
  }
}

let stop: (() => void) | undefined
afterEach(() => {
  stop?.()
  stop = undefined
  document.body.replaceChildren()
  document.documentElement.scrollTop = 0
})

describe('a field focused over the phone’s keyboard', () => {
  it('lifts the page so the field, its label and its error stand clear of the keyboard', () => {
    stop = phone()
    document.body.innerHTML = '<label><span>Name</span><input /><span>Error</span></label>'
    const label = document.querySelector('label')!
    // Its label at 700–780: under the keyboard's top (844 − 340 = 504).
    stubBox(label, { top: 700, width: 358, height: 80 })
    document.querySelector('input')!.focus()
    expect(keyboardOpen()).toBe(true)
    expect(document.documentElement.scrollTop).toBe(780 + 24 - 504)
  })

  it('keeps clear of the screen’s bar standing at the top', () => {
    stop = phone()
    document.body.innerHTML =
      '<header data-slot="screen-bar"></header><label><span>Name</span><input /></label>'
    stubBox(document.querySelector('header')!, { top: 0, width: 390, height: 100 })
    // A label of 380 (a long error under it), whose foot the keyboard covers.
    stubBox(document.querySelector('label')!, { top: 150, width: 358, height: 380 })
    document.querySelector('input')!.focus()
    // Lifting it by the 50 its foot asks would put its top under the bar: its top goes under it.
    expect(document.documentElement.scrollTop).toBe(150 - 24 - 100)
  })

  it('leaves a field in a sheet or a popover to it: it stands on the keyboard itself', () => {
    stop = phone()
    document.body.innerHTML = '<div role="dialog"><input /></div>'
    stubBox(document.querySelector('input')!, { top: 760, width: 358, height: 48 })
    document.querySelector('input')!.focus()
    expect(keyboardOpen()).toBe(true)
    expect(document.documentElement.scrollTop).toBe(0)
  })

  it('lifts it in the box that scrolls round it, not the page', () => {
    stop = phone()
    document.body.innerHTML = '<div style="overflow-y: auto"><input /></div>'
    const box = document.querySelector('div')!
    Object.defineProperty(box, 'scrollHeight', { value: 2000 })
    Object.defineProperty(box, 'clientHeight', { value: 800 })
    stubBox(box, { top: 0, width: 390, height: 800 })
    stubBox(document.querySelector('input')!, { top: 600, width: 358, height: 48 })
    document.querySelector('input')!.focus()
    expect(box.scrollTop).toBe(648 + 24 - 504)
    expect(document.documentElement.scrollTop).toBe(0)
  })

  it('gives the keyboard back once nothing is typed in', () => {
    stop = phone()
    document.body.innerHTML = '<input /><button>Save</button>'
    document.querySelector('input')!.focus()
    expect(keyboardOpen()).toBe(true)
    document.querySelector('button')!.focus()
    expect(keyboardOpen()).toBe(false)
  })

  it('moves nothing where no keyboard is up or awaited (a laptop)', () => {
    localStorage.clear()
    const stopViewport = startKeyboardViewport()
    const stopReveal = startKeyboardReveal()
    stop = () => {
      stopReveal()
      stopViewport()
    }
    document.body.innerHTML = '<input />'
    stubBox(document.querySelector('input')!, { top: 760, width: 358, height: 48 })
    document.querySelector('input')!.focus()
    expect(keyboardOpen()).toBe(false)
    expect(document.documentElement.scrollTop).toBe(0)
  })
})
