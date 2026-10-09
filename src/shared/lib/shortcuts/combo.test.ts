import { describe, expect, it } from 'vitest'
import { comboKeys, matches, type KeyPress } from './combo'

const press = (patch: Partial<KeyPress>): KeyPress => ({
  code: '',
  key: '',
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  ...patch,
})

describe('matches', () => {
  it('reads a letter by its physical key, whatever the layout types there', () => {
    expect(matches(press({ code: 'KeyR', key: 'к' }), { code: 'KeyR' }, false)).toBe(true)
    expect(matches(press({ code: 'KeyT', key: 'r' }), { code: 'KeyR' }, false)).toBe(false)
  })

  it('reads a named key by its name', () => {
    expect(
      matches(press({ code: 'ArrowLeft', key: 'ArrowLeft' }), { key: 'ArrowLeft' }, false),
    ).toBe(true)
    expect(matches(press({ code: 'Space', key: ' ' }), { key: ' ' }, false)).toBe(true)
  })

  it('takes a character however the layout reaches it', () => {
    // A question mark is Shift and / on one layout, Shift and 7 on another.
    expect(matches(press({ code: 'Slash', key: '?', shiftKey: true }), { key: '?' }, false)).toBe(
      true,
    )
    expect(matches(press({ code: 'Digit7', key: '?', shiftKey: true }), { key: '?' }, false)).toBe(
      true,
    )
  })

  it('wants exactly the modifiers it names', () => {
    const r = { code: 'KeyR' }
    expect(matches(press({ code: 'KeyR', shiftKey: true }), r, false)).toBe(false)
    expect(matches(press({ code: 'KeyR', altKey: true }), r, false)).toBe(false)
    expect(matches(press({ code: 'KeyR', ctrlKey: true }), r, false)).toBe(false)
    const place = { code: 'Digit1', alt: true }
    expect(matches(press({ code: 'Digit1', altKey: true }), place, false)).toBe(true)
    expect(matches(press({ code: 'Digit1' }), place, false)).toBe(false)
    expect(matches(press({ key: 'ArrowLeft', shiftKey: true }), { key: 'ArrowLeft' }, false)).toBe(
      false,
    )
  })

  it('takes Cmd on a Mac and Ctrl elsewhere for the platform’s modifier', () => {
    const sidebar = { code: 'KeyB', mod: true }
    expect(matches(press({ code: 'KeyB', metaKey: true }), sidebar, true)).toBe(true)
    expect(matches(press({ code: 'KeyB', ctrlKey: true }), sidebar, true)).toBe(false)
    expect(matches(press({ code: 'KeyB', ctrlKey: true }), sidebar, false)).toBe(true)
    expect(matches(press({ code: 'KeyB', metaKey: true }), sidebar, false)).toBe(false)
  })
})

describe('comboKeys', () => {
  it('names a combo’s keys as a keyboard prints them', () => {
    expect(comboKeys({ code: 'KeyR' }, false)).toEqual(['R'])
    expect(comboKeys({ code: 'Digit1', alt: true }, false)).toEqual(['Alt', '1'])
    expect(comboKeys({ code: 'Digit1', alt: true }, true)).toEqual(['⌥', '1'])
    expect(comboKeys({ code: 'KeyB', mod: true }, true)).toEqual(['⌘', 'B'])
    expect(comboKeys({ code: 'KeyB', mod: true }, false)).toEqual(['Ctrl', 'B'])
    expect(comboKeys({ key: ' ' }, false)).toEqual(['Space'])
    expect(comboKeys({ key: 'ArrowLeft' }, false)).toEqual(['←'])
    expect(comboKeys({ key: 'Escape' }, false)).toEqual(['Esc'])
    expect(comboKeys({ key: '?' }, false)).toEqual(['?'])
    expect(comboKeys({ key: 'Enter' }, false)).toEqual(['Enter'])
  })
})
