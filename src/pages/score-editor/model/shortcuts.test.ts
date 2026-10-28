import { describe, expect, it } from 'vitest'
import type { KeyPress } from '@/shared/lib/shortcuts'
import { shortcutOf } from './shortcuts'

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
  it('chooses a value by 1 to 7, a dot by the full stop, and writes a rest by 0', () => {
    expect(shortcutOf(press('Digit1', '1'), 'staff0')).toEqual({ type: 'value', value: 1 })
    expect(shortcutOf(press('Digit3', '3'), 'rh')).toEqual({ type: 'value', value: 4 })
    expect(shortcutOf(press('Digit5', '5'), 'lh')).toEqual({ type: 'value', value: 16 })
    expect(shortcutOf(press('Digit6', '6'), 'lh')).toEqual({ type: 'value', value: 32 })
    expect(shortcutOf(press('Digit7', '7'), 'lh')).toEqual({ type: 'value', value: 64 })
    expect(shortcutOf(press('Period', '.'), 'staff0')).toEqual({ type: 'dot' })
    expect(shortcutOf(press('Digit0', '0'), 'staff0')).toEqual({ type: 'rest' })
  })

  it('puts a tuplet of two to nine on the value with Shift and its digit, as Flat’s (ADR 0097)', () => {
    expect(shortcutOf(press('Digit3', '#', { shiftKey: true }), 'staff0')).toEqual({
      type: 'tuplet',
      num: 3,
    })
    expect(shortcutOf(press('Digit5', '%', { shiftKey: true }), 'rh')).toEqual({
      type: 'tuplet',
      num: 5,
    })
    expect(shortcutOf(press('Digit9', '(', { shiftKey: true }), 'lh')).toEqual({
      type: 'tuplet',
      num: 9,
    })
    expect(shortcutOf(press('Digit1', '!', { shiftKey: true }), 'lh')).toBeNull()
    expect(shortcutOf(press('Digit3', '#', { shiftKey: true }), 'chords')).toBeNull()
  })

  it('moves the caret: a step, Alt a bar, Home and End or Cmd to the ends, Shift choosing bars', () => {
    expect(shortcutOf(press('ArrowRight', 'ArrowRight'), 'staff0')).toEqual({
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
    // Shift chooses bars in any row: a range of notes as of chords.
    expect(shortcutOf(press('ArrowRight', 'ArrowRight', { shiftKey: true }), 'rh')).toMatchObject({
      type: 'move',
      extend: true,
    })
    expect(shortcutOf(press('End', 'End'), 'staff0')).toEqual({
      type: 'move',
      by: 'end',
      direction: 1,
      extend: false,
    })
    expect(shortcutOf(press('ArrowLeft', 'ArrowLeft', { metaKey: true }), 'staff0')).toEqual({
      type: 'move',
      by: 'end',
      direction: -1,
      extend: false,
    })
  })

  it('moves notes a step in the key, a semitone with Shift, an octave with Cmd or Ctrl, but not chords', () => {
    expect(shortcutOf(press('ArrowUp', 'ArrowUp'), 'staff0')).toEqual({ type: 'step', steps: 1 })
    expect(shortcutOf(press('ArrowDown', 'ArrowDown'), 'rh')).toEqual({ type: 'step', steps: -1 })
    expect(shortcutOf(press('ArrowUp', 'ArrowUp', { shiftKey: true }), 'staff0')).toEqual({
      type: 'shift',
      semitones: 1,
    })
    expect(shortcutOf(press('ArrowDown', 'ArrowDown', { ctrlKey: true }), 'lh')).toEqual({
      type: 'shift',
      semitones: -12,
    })
    // Alt keeps going through a chord's notes (ADR 0096).
    expect(shortcutOf(press('ArrowUp', 'ArrowUp', { altKey: true }), 'rh')).toEqual({
      type: 'chordNote',
      direction: 1,
    })
    expect(shortcutOf(press('ArrowUp', 'ArrowUp'), 'chords')).toBeNull()
  })

  it('deletes back with Backspace and what is chosen with Delete, undoes and redoes', () => {
    expect(shortcutOf(press('Backspace', 'Backspace'), 'chords')).toEqual({
      type: 'delete',
      back: true,
    })
    expect(shortcutOf(press('Delete', 'Delete'), 'staff0')).toEqual({ type: 'delete' })
    expect(shortcutOf(press('KeyZ', 'z', { metaKey: true }), 'staff0')).toEqual({ type: 'undo' })
    expect(shortcutOf(press('KeyZ', 'z', { metaKey: true, shiftKey: true }), 'staff0')).toEqual({
      type: 'redo',
    })
    expect(shortcutOf(press('KeyY', 'y', { ctrlKey: true }), 'staff0')).toEqual({ type: 'redo' })
  })

  it('copies, cuts and pastes what is chosen in any row, Enter going on a line in each', () => {
    expect(shortcutOf(press('KeyC', 'c', { metaKey: true }), 'chords')).toEqual({
      type: 'clip',
      edit: 'copy',
    })
    expect(shortcutOf(press('KeyX', 'x', { ctrlKey: true }), 'chords')).toEqual({
      type: 'clip',
      edit: 'cut',
    })
    expect(shortcutOf(press('KeyX', 'x', { ctrlKey: true }), 'staff0')).toEqual({
      type: 'clip',
      edit: 'cut',
    })
    expect(shortcutOf(press('KeyC', 'c', { metaKey: true }), 'rh')).toEqual({
      type: 'clip',
      edit: 'copy',
    })
    expect(shortcutOf(press('KeyV', 'v', { metaKey: true }), 'chords')).toEqual({
      type: 'clip',
      edit: 'paste',
    })
    expect(shortcutOf(press('Enter', 'Enter'), 'chords')).toMatchObject({ by: 'line' })
    expect(shortcutOf(press('Enter', 'Enter'), 'staff0')).toEqual({
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

  it('extends what is chosen with Shift: a note, Alt a bar, Cmd or Home and End to an end (ADR 0096)', () => {
    const shift = { shiftKey: true }
    expect(shortcutOf(press('ArrowLeft', 'ArrowLeft', shift), 'rh')).toEqual({
      type: 'move',
      by: 'step',
      direction: -1,
      extend: true,
    })
    expect(shortcutOf(press('ArrowRight', 'ArrowRight', { ...shift, altKey: true }), 'rh')).toEqual(
      { type: 'move', by: 'bar', direction: 1, extend: true },
    )
    expect(
      shortcutOf(press('ArrowRight', 'ArrowRight', { ...shift, metaKey: true }), 'staff0'),
    ).toEqual({ type: 'move', by: 'end', direction: 1, extend: true })
    expect(shortcutOf(press('Home', 'Home', shift), 'lh')).toEqual({
      type: 'move',
      by: 'end',
      direction: -1,
      extend: true,
    })
    expect(shortcutOf(press('End', 'End', shift), 'lh')).toEqual({
      type: 'move',
      by: 'end',
      direction: 1,
      extend: true,
    })
  })

  it('steps through a chord’s notes with Alt ↑ ↓, and lets go of what is chosen with Escape', () => {
    expect(shortcutOf(press('ArrowUp', 'ArrowUp', { altKey: true }), 'rh')).toEqual({
      type: 'chordNote',
      direction: 1,
    })
    expect(shortcutOf(press('ArrowDown', 'ArrowDown', { altKey: true }), 'chords')).toEqual({
      type: 'chordNote',
      direction: -1,
    })
    expect(shortcutOf(press('Escape', 'Escape'), 'staff0')).toEqual({ type: 'deselect' })
  })

  it('opens the chord-symbol field with Cmd or Ctrl and K, the Lyrics field with L, from any row, as Flat’s (ADR 0096)', () => {
    for (const layer of ['chords', 'staff0', 'lh'] as const) {
      expect(shortcutOf(press('KeyK', 'k', { metaKey: true }), layer)).toEqual({
        type: 'field',
        field: 'chord',
      })
      expect(shortcutOf(press('KeyK', 'k', { ctrlKey: true }), layer)).toEqual({
        type: 'field',
        field: 'chord',
      })
      expect(shortcutOf(press('KeyL', 'l', { metaKey: true }), layer)).toEqual({
        type: 'field',
        field: 'lyrics',
      })
    }
    // K and L alone are the piano's.
    expect(shortcutOf(press('KeyK', 'k'), 'staff0')).toBeNull()
    expect(shortcutOf(press('KeyL', 'l'), 'staff0')).toBeNull()
  })

  it('opens the fingering field with Shift and F, which typing leaves free (ADR 0062, 0096)', () => {
    for (const layer of ['rh', 'lh', 'staff0'] as const)
      expect(shortcutOf(press('KeyF', 'F', { shiftKey: true }), layer)).toEqual({
        type: 'field',
        field: 'fingering',
      })
    expect(shortcutOf(press('KeyF', 'f'), 'rh')).toBeNull()
    expect(shortcutOf(press('KeyF', 'f', { metaKey: true, shiftKey: true }), 'rh')).toBeNull()
  })

  it('cycles the editing modes with I, a letter typing leaves free, on a staff alone (ADR 0114)', () => {
    expect(shortcutOf(press('KeyI', 'i'), 'staff0')).toEqual({ type: 'mode' })
    expect(shortcutOf(press('KeyI', 'i'), 'lh')).toEqual({ type: 'mode' })
    expect(shortcutOf(press('KeyI', 'i'), 'chords')).toBeNull()
    expect(shortcutOf(press('KeyI', 'i', { metaKey: true }), 'staff0')).toBeNull()
  })

  it('leaves every typing key to the piano, and a plain letter or Cmd with another key alone', () => {
    for (const code of ['KeyA', 'KeyW', 'KeyZ', 'KeyX', 'Semicolon', 'Quote']) {
      expect(shortcutOf(press(code, code.slice(-1).toLowerCase()), 'staff0')).toBeNull()
    }
    expect(shortcutOf(press('KeyR', 'r', { metaKey: true }), 'staff0')).toBeNull()
  })
})
