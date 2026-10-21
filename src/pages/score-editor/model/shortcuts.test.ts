import { describe, expect, it } from 'vitest'
import type { KeyPress } from '@/shared/lib/shortcuts'
import { shortcutOf, staffNear } from './shortcuts'

const press = (code: string, key: string, mods: Partial<KeyPress> = {}): KeyPress => ({
  code,
  key,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  ...mods,
})

describe('shortcutOf', () => {
  it('chooses a value by 1 to 5, a dot by the full stop, and writes a rest by 0', () => {
    expect(shortcutOf(press('Digit1', '1'), 'melody')).toEqual({ type: 'value', value: 1 })
    expect(shortcutOf(press('Digit3', '3'), 'rh')).toEqual({ type: 'value', value: 4 })
    expect(shortcutOf(press('Digit5', '5'), 'lh')).toEqual({ type: 'value', value: 16 })
    expect(shortcutOf(press('Digit6', '6'), 'lh')).toEqual({ type: 'value', value: 32 })
    expect(shortcutOf(press('Period', '.'), 'melody')).toEqual({ type: 'dot' })
    expect(shortcutOf(press('Digit0', '0'), 'melody')).toEqual({ type: 'rest' })
  })

  it('moves the caret: a step, Alt a bar, Home and End or Cmd to the ends, Shift choosing bars', () => {
    expect(shortcutOf(press('ArrowRight', 'ArrowRight'), 'melody')).toEqual({
      type: 'move',
      by: 'step',
      direction: 1,
      extend: false,
    })
    expect(shortcutOf(press('ArrowLeft', 'ArrowLeft', { altKey: true }), 'chords')).toEqual({
      type: 'move',
      by: 'bar',
      direction: -1,
      extend: false,
    })
    expect(shortcutOf(press('ArrowRight', 'ArrowRight', { shiftKey: true }), 'chords')).toEqual({
      type: 'move',
      by: 'step',
      direction: 1,
      extend: true,
    })
    expect(shortcutOf(press('End', 'End'), 'melody')).toEqual({
      type: 'move',
      by: 'end',
      direction: 1,
      extend: false,
    })
    expect(shortcutOf(press('ArrowLeft', 'ArrowLeft', { metaKey: true }), 'melody')).toEqual({
      type: 'move',
      by: 'end',
      direction: -1,
      extend: false,
    })
  })

  it('moves notes by a semitone, or an octave with Cmd or Ctrl, but not chords', () => {
    expect(shortcutOf(press('ArrowUp', 'ArrowUp'), 'melody')).toEqual({
      type: 'shift',
      semitones: 1,
    })
    expect(shortcutOf(press('ArrowDown', 'ArrowDown', { ctrlKey: true }), 'lh')).toEqual({
      type: 'shift',
      semitones: -12,
    })
    expect(shortcutOf(press('ArrowUp', 'ArrowUp'), 'chords')).toBeNull()
  })

  it('deletes back with Backspace and what is chosen with Delete, undoes and redoes', () => {
    expect(shortcutOf(press('Backspace', 'Backspace'), 'chords')).toEqual({
      type: 'delete',
      back: true,
    })
    expect(shortcutOf(press('Delete', 'Delete'), 'melody')).toEqual({ type: 'delete' })
    expect(shortcutOf(press('KeyZ', 'z', { metaKey: true }), 'melody')).toEqual({ type: 'undo' })
    expect(shortcutOf(press('KeyZ', 'z', { metaKey: true, shiftKey: true }), 'melody')).toEqual({
      type: 'redo',
    })
    expect(shortcutOf(press('KeyY', 'y', { ctrlKey: true }), 'melody')).toEqual({ type: 'redo' })
  })

  it('copies, cuts and pastes bars, and opens the chord field with Enter in the chords', () => {
    expect(shortcutOf(press('KeyC', 'c', { metaKey: true }), 'chords')).toEqual({
      type: 'bars',
      edit: 'copy',
    })
    expect(shortcutOf(press('KeyX', 'x', { ctrlKey: true }), 'chords')).toEqual({
      type: 'bars',
      edit: 'cut',
    })
    expect(shortcutOf(press('KeyX', 'x', { ctrlKey: true }), 'melody')).toBeNull()
    expect(shortcutOf(press('KeyC', 'c', { metaKey: true }), 'rh')).toBeNull()
    expect(shortcutOf(press('KeyV', 'v', { metaKey: true }), 'chords')).toEqual({
      type: 'bars',
      edit: 'paste',
    })
    expect(shortcutOf(press('Enter', 'Enter'), 'chords')).toEqual({ type: 'chordField' })
    expect(shortcutOf(press('Enter', 'Enter'), 'melody')).toEqual({
      type: 'move',
      by: 'line',
      direction: 1,
      extend: false,
    })
    expect(shortcutOf(press('Enter', 'Enter', { shiftKey: true }), 'rh')).toEqual({
      type: 'move',
      by: 'line',
      direction: -1,
      extend: false,
    })
  })

  it('leaves every typing key to the piano, and a plain letter or Cmd with another key alone', () => {
    for (const code of ['KeyA', 'KeyW', 'KeyZ', 'KeyX', 'Semicolon', 'Quote']) {
      expect(shortcutOf(press(code, code.slice(-1).toLowerCase()), 'melody')).toBeNull()
    }
    expect(shortcutOf(press('KeyR', 'r', { metaKey: true }), 'melody')).toBeNull()
  })
})

describe('staffNear', () => {
  it('moves to the row over or under, top down, the same row at either end', () => {
    const all = ['chords', 'melody', 'rh', 'lh'] as const
    expect(staffNear('melody', -1, all)).toBe('chords')
    expect(staffNear('rh', 1, all)).toBe('lh')
    expect(staffNear('lh', 1, all)).toBe('lh')
    expect(staffNear('rh', -1, ['rh', 'lh'])).toBe('rh')
  })

  it('goes through the more voices’ staves, between the tune’s and the piano’s', () => {
    const sung = ['melody', 'voice2', 'voice3', 'rh', 'lh'] as const
    expect(staffNear('melody', 1, sung)).toBe('voice2')
    expect(staffNear('voice2', 1, sung)).toBe('voice3')
    expect(staffNear('voice3', 1, sung)).toBe('rh')
    expect(staffNear('rh', -1, sung)).toBe('voice3')
  })

  it('is Alt with the up or down arrow', () => {
    expect(shortcutOf(press('ArrowUp', 'ArrowUp', { altKey: true }), 'rh')).toEqual({
      type: 'staff',
      direction: -1,
    })
  })
})
