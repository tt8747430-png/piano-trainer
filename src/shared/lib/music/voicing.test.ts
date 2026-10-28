import { describe, expect, it } from 'vitest'
import { spellChord, type ChordQuality } from './chord'
import { note, noteName, type SpelledNote } from './note'
import type { PlacedTone } from './place'
import { VOICINGS, voiceChord, voicingBar, type Voicing } from './voicing'

const at = (key: PlacedTone) => `${noteName(key.tone.note)}${Math.floor(key.midi / 12) - 1}`

/** A voicing's keys, the left hand's then the right's: `G3 | C4 E4 B4`. */
const voiced = (
  quality: ChordQuality,
  voicing: Voicing,
  inversion = 0,
  root: SpelledNote = note('C'),
) => {
  const { lh, rh } = voiceChord(spellChord(root, quality), voicing, inversion)
  return `${lh.map(at).join(' ')} | ${rh.map(at).join(' ')}`.trim()
}

describe('voiceChord', () => {
  it('drops a close 7th chord’s second voice from the top an octave, in each inversion', () => {
    expect(voiced('maj7', 'drop2', 0)).toBe('G3 | C4 E4 B4')
    expect(voiced('maj7', 'drop2', 1)).toBe('B3 | E4 G4 C5')
    expect(voiced('maj7', 'drop2', 2)).toBe('C4 | G4 B4 E5')
    expect(voiced('maj7', 'drop2', 3)).toBe('E4 | B4 C5 G5')
  })

  it('drops its third voice from the top for drop 3', () => {
    expect(voiced('maj7', 'drop3', 0)).toBe('E3 | C4 G4 B4')
    expect(voiced('m7', 'drop3', 0, note('D'))).toBe('F3 | D4 A4 C5')
  })

  it('holds a shell in the left hand: root, 3rd and 7th', () => {
    expect(voiced('d7', 'shell', 0, note('G'))).toBe('G3 B3 F4 |')
    expect(voiced('maj9', 'shell')).toBe('C3 E3 B3 |')
  })

  it('spells the rootless voicings as the books do, type A and type B (ii–V–I in C)', () => {
    expect(voiced('m7', 'rootlessA', 0, note('D'))).toBe('F3 A3 C4 E4 |')
    expect(voiced('m7', 'rootlessB', 0, note('D'))).toBe('C4 E4 F4 A4 |')
    // A dominant takes its 13th for its 5th, and starts from its 7th in type A.
    expect(voiced('d7', 'rootlessA', 0, note('G'))).toBe('F3 A3 B3 E4 |')
    expect(voiced('n13', 'rootlessB', 0, note('G'))).toBe('B3 E4 F4 A4 |')
    expect(voiced('maj7', 'rootlessA')).toBe('E3 G3 B3 D4 |')
    expect(voiced('maj7', 'rootlessB')).toBe('B3 D4 E4 G4 |')
  })

  it('keeps an altered dominant’s altered tones in its rootless voicing', () => {
    // E7♭9: 7 ♭9 3 5; G7alt: 7 ♭9 3 #5.
    expect(voiced('b9', 'rootlessA', 0, note('E'))).toBe('D3 F3 G#3 B3 |')
    expect(voiced('b9', 'rootlessB', 0, note('E'))).toBe('G#3 B3 D4 F4 |')
    expect(voiced('alt', 'rootlessA', 0, note('G'))).toBe('F3 A♭3 B3 D#4 |')
  })

  it('locks the hands: a close chord in the right, its top note doubled an octave down in the left', () => {
    expect(voiced('maj7', 'locked', 2)).toBe('E4 | G4 B4 C5 E5')
    expect(voiced('d7', 'locked', 3, note('G'))).toBe('D4 | F4 G4 B4 D5')
  })

  it('builds So What on the root’s 9th: three 4ths and a major 3rd', () => {
    expect(voiced('m7', 'soWhat', 0, note('D'))).toBe('E3 A3 | D4 G4 B4')
    expect(voiced('sus7', 'soWhat')).toBe('D3 G3 | C4 F4 A4')
  })

  it('places close as the explorer does: the chord in the right hand from middle C', () => {
    expect(voiced('maj', 'close', 1)).toBe('| E4 G4 C5')
  })
})

describe('voicingBar', () => {
  const bar = (quality: ChordQuality, voicing: Voicing) =>
    voicingBar(spellChord(note('C'), quality), voicing)

  it('lets close voice every chord', () => {
    expect(bar('maj', 'close')).toBeUndefined()
    expect(bar('alt', 'close')).toBeUndefined()
  })

  it('drops and locks only a chord of four notes', () => {
    expect(bar('maj', 'drop2')).toBe('fourNotes')
    expect(bar('maj9', 'drop3')).toBe('fourNotes')
    expect(bar('six', 'locked')).toBeUndefined()
    expect(bar('m7', 'drop2')).toBeUndefined()
  })

  it('needs a 3rd and a 7th for a shell or a rootless voicing', () => {
    expect(bar('sus7', 'shell')).toBe('noThird')
    expect(bar('six', 'rootlessA')).toBe('noSeventh')
    expect(bar('maj', 'rootlessB')).toBe('noSeventh')
    expect(bar('hd', 'rootlessA')).toBeUndefined()
  })

  it('keeps So What to a minor or suspended chord in the Dorian sound', () => {
    expect(bar('m7', 'soWhat')).toBeUndefined()
    expect(bar('m11', 'soWhat')).toBeUndefined()
    expect(bar('sus4', 'soWhat')).toBeUndefined()
    expect(bar('maj7', 'soWhat')).toBe('notDorian')
    expect(bar('hd', 'soWhat')).toBe('notDorian')
    expect(bar('mM7', 'soWhat')).toBe('notDorian')
  })

  it('names the eight voicings', () => {
    expect(VOICINGS).toEqual([
      'close',
      'drop2',
      'drop3',
      'shell',
      'rootlessA',
      'rootlessB',
      'locked',
      'soWhat',
    ])
  })
})
