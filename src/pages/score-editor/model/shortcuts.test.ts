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
    // Shift chooses bars in any row: a range of notes as of chords.
    expect(shortcutOf(press('ArrowRight', 'ArrowRight', { shiftKey: true }), 'rh')).toMatchObject({
      type: 'move',
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

  it('moves notes a step in the key, a semitone with Shift, an octave with Cmd or Ctrl, but not chords', () => {
    expect(shortcutOf(press('ArrowUp', 'ArrowUp'), 'melody')).toEqual({ type: 'step', steps: 1 })
    expect(shortcutOf(press('ArrowDown', 'ArrowDown'), 'rh')).toEqual({ type: 'step', steps: -1 })
    expect(shortcutOf(press('ArrowUp', 'ArrowUp', { shiftKey: true }), 'melody')).toEqual({
      type: 'shift',
      semitones: 1,
    })
    expect(shortcutOf(press('ArrowDown', 'ArrowDown', { ctrlKey: true }), 'lh')).toEqual({
      type: 'shift',
      semitones: -12,
    })
    // Alt keeps going through a chord's notes (ADR 0088).
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
    expect(shortcutOf(press('Delete', 'Delete'), 'melody')).toEqual({ type: 'delete' })
    expect(shortcutOf(press('KeyZ', 'z', { metaKey: true }), 'melody')).toEqual({ type: 'undo' })
    expect(shortcutOf(press('KeyZ', 'z', { metaKey: true, shiftKey: true }), 'melody')).toEqual({
      type: 'redo',
    })
    expect(shortcutOf(press('KeyY', 'y', { ctrlKey: true }), 'melody')).toEqual({ type: 'redo' })
  })

  it('copies, cuts and pastes what is chosen in any row, and opens the chord field with Enter in the chords', () => {
    expect(shortcutOf(press('KeyC', 'c', { metaKey: true }), 'chords')).toEqual({
      type: 'clip',
      edit: 'copy',
    })
    expect(shortcutOf(press('KeyX', 'x', { ctrlKey: true }), 'chords')).toEqual({
      type: 'clip',
      edit: 'cut',
    })
    expect(shortcutOf(press('KeyX', 'x', { ctrlKey: true }), 'melody')).toEqual({
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

  it('extends what is chosen with Shift: a note, Alt a bar, Cmd or Home and End to an end (ADR 0088)', () => {
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
      shortcutOf(press('ArrowRight', 'ArrowRight', { ...shift, metaKey: true }), 'melody'),
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
    expect(shortcutOf(press('Escape', 'Escape'), 'melody')).toEqual({ type: 'deselect' })
  })

  it('cycles the editing modes with I, a letter typing leaves free, on a staff alone (ADR 0092)', () => {
    expect(shortcutOf(press('KeyI', 'i'), 'melody')).toEqual({ type: 'mode' })
    expect(shortcutOf(press('KeyI', 'i'), 'lh')).toEqual({ type: 'mode' })
    expect(shortcutOf(press('KeyI', 'i'), 'chords')).toBeNull()
    expect(shortcutOf(press('KeyI', 'i', { metaKey: true }), 'melody')).toBeNull()
  })

  it('leaves every typing key to the piano, and a plain letter or Cmd with another key alone', () => {
    for (const code of ['KeyA', 'KeyW', 'KeyZ', 'KeyX', 'Semicolon', 'Quote']) {
      expect(shortcutOf(press(code, code.slice(-1).toLowerCase()), 'melody')).toBeNull()
    }
    expect(shortcutOf(press('KeyR', 'r', { metaKey: true }), 'melody')).toBeNull()
  })
})
