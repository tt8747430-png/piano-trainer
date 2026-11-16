import { describe, expect, it } from 'vitest'
import { nameChords } from './chord-finder'
import { printedSymbol } from './chord-symbol'
import { note } from './note'
import { midi } from './pitch'

const found = (...keys: number[]) => nameChords(keys.map((key) => midi(key)))
const named = (...keys: number[]) => found(...keys).map((each) => each.symbol)

describe('nameChords', () => {
  it('spells a chord in a key as the key writes it, unless that writes more of it outside the key', () => {
    const C = { tonic: note('C'), minor: false }
    const E = { tonic: note('E'), minor: false }
    const inKey = (key: typeof C, ...keys: number[]) => nameChords(keys.map(midi), key)[0]?.symbol
    expect(inKey(C, 61, 64, 68)).toBe('C#m')
    expect(inKey(E, 68, 72, 75)).toBe('G#')
    expect(inKey(E, 70, 74, 77)).toBe('B♭')
    expect(inKey({ tonic: note('G', -1), minor: false }, 66, 70, 73)).toBe('G♭')
  })

  it('names a chord from the root that spells it plainly, with no key to decide', () => {
    expect(named(63, 66, 69)[0]).toBe('D#°')
    expect(named(58, 61, 64, 67)[0]).toBe('A#°7')
  })

  it('names a 9th chord over its 7th before a 6/9 that leaves its 5th out and adds a tone', () => {
    expect(named(48, 50, 52, 53, 57)[0]).not.toMatch(/6\/9/)
  })

  it('opens a chord of five notes or more in the explorer with no inversion', () => {
    expect(found(47, 48, 52, 55, 62)[0]?.inversion).toBeUndefined()
    expect(found(52, 55, 60)[0]?.inversion).toBe(1)
  })

  it('names an added tone once, a 2nd within the octave and a 9th past it', () => {
    expect(named(60, 62, 64, 67).filter((symbol) => symbol.startsWith('C'))).toEqual(['Cadd2'])
    expect(named(60, 64, 67, 74)).toContain('Cadd9')
    expect(named(60, 64, 67, 74)).not.toContain('Cadd2')
  })

  it('names a chord in root position, then what else the notes can be', () => {
    expect(named(60, 64, 67)).toEqual(['C'])
    expect(named(60, 64, 67, 69)).toEqual(['C6', 'Am7/C'])
    expect(named(52, 55, 59, 62)[0]).toBe('Em7')
  })

  it('names an inversion as a slash chord, the bass spelled as its chord tone', () => {
    expect(named(64, 67, 72)[0]).toBe('C/E')
    expect(found(64, 67, 72)[0]?.inversion).toBe(1)
  })

  it('takes a chord without its 5th, after the chords whose every tone is there', () => {
    const [best] = found(48, 52, 58)
    expect(best?.symbol).toBe('C7')
    expect(best?.leftOut).toEqual(['5th'])
    expect(found(60, 64, 67)[0]?.leftOut).toEqual([])
  })

  it('takes a 6/9 without its 5th, but never a 6th or an added tone', () => {
    const [sixNine] = found(48, 63, 69, 74)
    expect(sixNine?.symbol).toBe('Cm6/9')
    expect(sixNine?.leftOut).toEqual(['5th'])
    expect(named(48, 64, 69)[0]).toBe('Am/C')
  })

  it('takes a shell: the 9th and 11th left out under the chord’s highest number', () => {
    const [thirteenth] = found(48, 64, 70, 81)
    expect(thirteenth?.symbol).toBe('C13')
    expect(thirteenth?.leftOut).toEqual(['5th', '9th'])
    const [minorEleventh] = found(48, 63, 70, 77)
    expect(minorEleventh?.symbol).toBe('Cm11')
    expect(minorEleventh?.leftOut).toEqual(['5th', '9th'])
    expect(named(48, 64, 71, 81)[0]).toBe('Cmaj13')
    expect(named(40, 45, 50, 55, 59)[0]).toBe('Em11')
    expect(named(48, 64, 70, 78, 81)[0]).toBe('C13#11')
  })

  it('names a stacked chord before the 7th chord that adds its top tone', () => {
    // C7(add13) leaves its 5th out too: no reading worth showing after C13.
    expect(named(48, 64, 70, 81)).toEqual(['C13'])
    expect(named(48, 63, 67, 70, 77).slice(0, 2)).toEqual(['Cm11', 'Cm7(add11)'])
    expect(named(60, 62, 64, 65, 67)[0]).toBe('C(add2,add4)')
  })

  it('takes a 7th chord over a major triad without its 3rd where its 5th is played', () => {
    const [seventh] = found(48, 55, 58)
    expect(seventh?.symbol).toBe('C7')
    expect(seventh?.leftOut).toEqual(['3rd'])
    expect(named(48, 55, 59)[0]).toBe('Cmaj7')
  })

  it('reads the key a tritone over the root as the #11 from a 9th up, and as the ♭5 of a 7th chord', () => {
    expect(named(48, 64, 70, 74, 78)[0]).toBe('C9#11')
    expect(named(48, 64, 66, 70)[0]).toBe('C7♭5')
  })

  it('never leaves out the root, an alteration or the highest number', () => {
    expect(named(52, 55, 59, 62)[0]).toBe('Em7')
    expect(named(48, 64, 70, 73)[0]).toBe('C7♭9')
    expect(named(48, 64, 70)).not.toContain('C13')
  })

  it('names a 7sus4 with its ♭9, and the Lydian triad', () => {
    expect(named(48, 65, 67, 70, 73)[0]).toBe('C7sus4♭9')
    expect(named(48, 64, 67, 78)[0]).toBe('Cadd#11')
  })

  it('names nothing from fewer than three notes, or notes no chord holds', () => {
    expect(named(60, 64)).toEqual([])
    expect(named(60, 61, 62)).toEqual([])
  })

  it('spells a root by the builder’s one rule', () => {
    expect(named(61, 64, 68)[0]).toBe('C#m')
    expect(named(61, 65, 68)[0]).toBe('D♭')
  })

  it('names an inversion only whole: a slash chord leaves no tone out but the 5th over its 3rd or 7th', () => {
    expect(named(48, 50, 52)).toEqual([])
    expect(named(48, 53, 55)).toEqual(['Csus4', 'Fsus2/C'])
    expect(named(48, 50, 55)).toEqual(['Csus2'])
    expect(named(48, 52, 54, 58)).toEqual(['C7♭5', 'F#7♭5/C'])
    expect(named(52, 58, 60)).toEqual(['C7/E'])
    expect(named(48, 52, 53, 55)).toEqual(['Cadd4'])
  })

  it('names an inversion with no added tone but its 6th', () => {
    expect(named(48, 52, 55, 58, 62)).toEqual(['C9', 'Gm6/C'])
    expect(named(48, 52, 55, 62)).toEqual(['Cadd9'])
    expect(named(48, 52, 55, 69)).toEqual(['C6', 'Am7/C'])
    expect(named(48, 52, 55, 59, 62)).toEqual(['Cmaj9', 'Em7/C', 'G6/C'])
  })

  it('leaves the 5th out of a suspended chord only as a 7sus4', () => {
    expect(named(48, 53, 58)[0]).toBe('C7sus4')
    // With its 5th left out, a 9sus4 is the B♭ triad over C, as a lead sheet writes it.
    expect(named(48, 53, 58, 62)).toEqual(['B♭/C'])
    expect(named(48, 50, 58)).toEqual([])
    expect(named(48, 50, 59)).toEqual([])
    expect(named(48, 53, 59)).toEqual([])
    expect(named(48, 50, 53, 59)).toEqual([])
    expect(named(48, 53, 57, 59)).toEqual([])
  })

  it('leaves the 3rd out of a plain 7th chord alone, never one that adds a tone', () => {
    expect(named(51, 58, 60, 62)).toEqual(['Cm9/E♭'])
    expect(named(49, 56, 58, 60)).toEqual(['B♭m9/D♭'])
    expect(named(51, 58, 60, 62)).not.toContain('E♭7(add13)')
  })

  it('keeps the 9th of an 11th chord over a major 3rd, where the 11th clashes with it', () => {
    expect(named(48, 52, 53, 58)).not.toContain('C11')
    expect(named(48, 52, 53, 59)).not.toContain('Cmaj11')
    expect(named(48, 52, 55, 58, 62, 65)[0]).toBe('C11')
  })

  it('leaves the 5th out of a slash chord only under a minor 7th', () => {
    expect(named(60, 61, 64)).toEqual([])
    expect(named(59, 60, 64)).toEqual([])
    expect(named(48, 55, 56)).toEqual([])
    expect(named(47, 48, 50, 52)).toEqual([])
    expect(named(46, 52, 60)).toEqual(['C7/B♭'])
    expect(named(48, 50, 54)).toEqual(['D7/C'])
  })

  it('names a slash chord over its 3rd, 5th, 7th or added 6th, never over a tension or a suspended tone', () => {
    expect(named(48, 51, 55, 58, 62, 65)).toEqual(['Cm11'])
    expect(named(48, 50, 55)).toEqual(['Csus2'])
    expect(named(53, 55, 60)).toEqual(['Fsus2'])
    expect(named(43, 48, 50)).toEqual(['Gsus4', 'Csus2/G'])
    expect(named(57, 60, 64, 67)).toEqual(['Am7', 'C6/A', 'C/A'])
  })

  it('names a 6/9 as one, however close its 9th', () => {
    expect(named(60, 62, 64, 67, 69)[0]).toBe('C6/9')
    expect(named(60, 62, 63, 67, 69)[0]).toBe('Cm6/9')
  })

  it('spells the bass of a slash chord as the key writes it, never with a double accidental or B# for C', () => {
    const C = { tonic: note('C'), minor: false }
    const inKey = (...keys: number[]) => nameChords(keys.map(midi), C).map((each) => each.symbol)
    expect(inKey(48, 52, 56)).toEqual(['C+', 'E+/C', 'A♭+/C'])
    expect(inKey(48, 51, 54, 57)).toEqual(['C°7', 'D#°7/C', 'F#°7/C'])
  })
})

/** The best reading of the keys as it is printed, or null where they name no chord. */
const first = (keys: readonly number[]) => {
  const [best] = nameChords(keys.map((key) => midi(key)))
  return best ? printedSymbol(best.symbol) : null
}
const printed = (...keys: number[]) => named(...keys).map(printedSymbol)

/**
 * The research's cases (r61 research-theory 1.4: ChordLab's, GarageBand's, Piano Companion's and
 * Chordio's verdicts, the ChordLab packs' voicings), each with the name it is read by first: two keys
 * (D1-D3, O3) are the Chord finder's interval, never a chord.
 */
const CASES: readonly (readonly [string, string, readonly number[], string | null])[] = [
  ['A1', 'C E G', [60, 64, 67], 'C'],
  ['A2', 'C E♭ G', [60, 63, 67], 'Cm'],
  ['A3', 'C E♭ F♯', [60, 63, 66], 'C°'],
  ['A4', 'C E A♭', [60, 64, 68], 'C+'],
  ['A5', 'C E G B♭', [60, 64, 67, 70], 'C7'],
  ['A6', 'C E G B', [60, 64, 67, 71], 'Cmaj7'],
  ['A7', 'C E♭ G B♭', [60, 63, 67, 70], 'Cm7'],
  ['A8', 'C E♭ F♯ B♭', [60, 63, 66, 70], 'Cm7♭5'],
  ['A9', 'C E♭ F♯ A', [60, 63, 66, 69], 'C°7'],
  ['A10', 'C F G', [60, 65, 67], 'Csus4'],
  ['A11', 'C D G', [60, 62, 67], 'Csus2'],
  ['A12', 'C F G B♭', [60, 65, 67, 70], 'C7sus4'],
  ['A13', 'C E♭ G B', [60, 63, 67, 71], 'Cm(maj7)'],
  ['A14', 'C E♭ G A', [60, 63, 67, 69], 'Cm6'],
  ['D1', 'C G', [60, 67], null],
  ['D2', 'C G C', [48, 55, 60], null],
  ['D3', 'B F', [59, 65], null],
  ['B1', 'E C G C', [52, 60, 67, 72], 'C/E'],
  ['B2', 'E G C', [64, 67, 72], 'C/E'],
  ['B3', 'G C E G', [55, 60, 64, 67], 'C/G'],
  ['B4', 'D F G B', [62, 65, 67, 71], 'G7/D'],
  ['B5', 'C D F♯ A', [48, 50, 54, 57], 'D7/C'],
  ['C1', 'A C E G', [57, 60, 64, 67], 'Am7'],
  ['C2', 'C E G A', [60, 64, 67, 69], 'C6'],
  ['C3', 'D F A C', [62, 65, 69, 72], 'Dm7'],
  ['C4', 'C D E G', [60, 62, 64, 67], 'Cadd2'],
  ['C5', 'C E G D', [60, 64, 67, 74], 'Cadd9'],
  ['C6', 'C E F G', [60, 64, 65, 67], 'Cadd4'],
  ['C7', 'G C D', [55, 60, 62], 'Gsus4'],
  ['F1', 'D C E G', [50, 60, 64, 67], 'C/D'],
  ['F2', 'G C F A', [55, 60, 65, 69], 'F/G'],
  ['O1', 'C E B♭', [60, 64, 70], 'C7'],
  ['O2', 'C E A B♭', [48, 52, 57, 58], 'C13'],
  ['O3', 'C F♯ B', [48, 54, 59], null],
  ['E1', 'D F A C E', [50, 53, 57, 60, 64], 'Dm9'],
  ['E2', 'C E G B D', [60, 64, 67, 71, 74], 'Cmaj9'],
  ['E3', 'G B D F A', [55, 59, 62, 65, 69], 'G9'],
  ['E4', 'C E G B♭ D F A', [60, 64, 67, 70, 74, 77, 81], 'C13'],
  ['E5', 'G F A B E', [43, 53, 57, 59, 64], 'G13'],
  ['E6', 'C E A♭ B♭ E♭', [48, 52, 56, 58, 63], 'C7(♯5,♯9)'],
  ['E7', 'A♭ F♯ B♭ C F', [44, 54, 58, 60, 65], 'A♭13'],
  ['E8', 'C♯ F A♭ C E♭', [49, 53, 56, 60, 63], 'D♭maj9'],
  ['E9', 'E♭ F♯ B♭ C♯ F', [51, 54, 58, 61, 65], 'E♭m9'],
  ['E10', 'B♭ A♭ C D G', [46, 56, 60, 62, 67], 'B♭13'],
  ['E11', 'C E B♭ D F♯ A', [48, 52, 58, 62, 66, 69], 'C13♯11'],
  ['E12', 'C E G A D', [60, 64, 67, 69, 74], 'C6/9'],
  ['L1', 'C E G B♭ C♯', [60, 64, 67, 70, 73], 'C7♭9'],
  ['L2', 'C E G B♭ E♭', [60, 64, 67, 70, 75], 'C7♯9'],
  ['L3', 'C E F♯ B♭', [60, 64, 66, 70], 'C7♭5'],
  ['L4', 'C E A♭ B♭', [60, 64, 68, 70], 'C7♯5'],
  ['S1', 'C♯ F A♭', [61, 65, 68], 'D♭'],
  ['S2', 'F♯ B♭ C♯', [66, 70, 73], 'F♯'],
  ['S3', 'E♭ F♯ B♭', [63, 66, 70], 'E♭m'],
  ['X1', 'F A♭ C E♭', [53, 56, 60, 63], 'Fm7'],
  ['X2', 'D F A C E G', [50, 53, 57, 60, 64, 67], 'Dm11'],
  ['X3', 'C F G B♭ D', [48, 53, 55, 58, 62], 'C9sus4'],
  ['X4', 'C F B♭ D A', [48, 53, 58, 62, 69], 'B♭maj7/C'],
  ['X5', 'C E G B D A', [48, 52, 55, 59, 62, 69], 'Cmaj13'],
  ['X6', 'C E G B D F♯', [48, 52, 55, 59, 62, 66], 'Cmaj9♯11'],
  ['X7', 'C E F♯ B♭ C♯', [60, 64, 66, 70, 73], 'C7(♭5,♭9)'],
  ['X8', 'C E F♯ B', [60, 64, 66, 71], 'Cmaj7♭5'],
  ['X9', 'C E A♭ B', [60, 64, 68, 71], 'C+maj7'],
  ['X10', 'C E♭ G D', [60, 63, 67, 74], 'Cm(add9)'],
  ['X11', 'C D G B♭', [60, 62, 67, 70], 'Gm/C'],
  ['X12', 'C E B♭ C♯ E♭ A♭', [48, 52, 58, 61, 63, 68], 'C7(♯5,♭9,♯9)'],
  ['X13', 'C E♭ F♯ B♭ D', [60, 63, 66, 70, 74], 'Cm9♭5'],
  ['X14', 'C C E G', [36, 48, 52, 55], 'C'],
  ['X15', 'C G E B♭', [36, 55, 64, 70], 'C7'],
  ['X16', 'F C E G', [53, 60, 64, 67], 'C/F'],
  ['X17', 'C E B', [60, 64, 71], 'Cmaj7'],
  ['X18', 'C E A', [48, 64, 69], 'Am/C'],
  ['P1', 'C E F♯', [60, 64, 66], 'C(♭5)'],
  ['P2', 'C E♭ F♯ B', [60, 63, 66, 71], 'C°(maj7)'],
  ['P3', 'C E♭ G B♭ C♯', [60, 63, 67, 70, 73], 'Cm7♭9'],
  ['P4', 'C E G A B♭', [60, 64, 67, 69, 70], 'C13'],
  ['P5', 'C E♭ G B♭ D F♯', [60, 63, 67, 70, 74, 78], 'Cm9♯11'],
  ['P6', 'C E♭ F♯ B♭ D F', [60, 63, 66, 70, 74, 77], 'Cm11♭5'],
  ['P7', 'C E A♭ D', [60, 64, 68, 74], 'C+(add9)'],
  ['P8', 'C E G C♯', [60, 64, 67, 61], null],
  ['P9', 'C E G B D F', [60, 64, 67, 71, 74, 77], 'Cmaj11'],
  ['P10', 'C E G B♭ D F', [60, 64, 67, 70, 74, 77], 'C11'],
  ['P11', 'C E♭ G B D', [60, 63, 67, 71, 74], 'Cm(maj9)'],
  ['P12', 'C E G B C♯', [60, 64, 67, 71, 73], 'Em6/C'],
  ['P13', 'C E G B E♭', [60, 64, 67, 71, 75], 'Em(maj7)/C'],
  ['P14', 'C D G B', [60, 62, 67, 71], 'G/C'],
  ['P15', 'C F G B', [60, 65, 67, 71], 'Cmaj7sus4'],
  ['P16', 'C E A♭ B♭ E♭', [60, 64, 68, 70, 75], 'C7(♯5,♯9)'],
  ['P17', 'C E♭ G B♭ D F A', [60, 63, 67, 70, 74, 77, 81], 'Cm13'],
  ['P18', 'C E G B♭ D F♯ A', [60, 64, 67, 70, 74, 78, 81], 'C13♯11'],
  ['P19', 'C E♭ G F', [60, 63, 67, 77], 'Cm(add11)'],
  ['P20', 'C E B♭ D F', [60, 64, 70, 74, 77], 'C11'],
]

describe('the research cases', () => {
  it.each(CASES)('%s: %s is read first as %s', (_id, _notes, keys, expected) => {
    expect(first(keys)).toBe(expected)
  })
})

describe('a chord over a foreign bass', () => {
  it('reads the notes over a bass that sounds nowhere above it as a whole chord over it', () => {
    expect(printed(50, 60, 64, 67)[0]).toBe('C/D')
    expect(printed(60, 64, 67, 71, 73)).toEqual(['Em6/C'])
    expect(printed(60, 64, 67, 71, 75)).toEqual(['Em(maj7)/C'])
  })

  it('puts it first where the best root-position reading has no 3rd, and is no whole 7sus4', () => {
    expect(printed(55, 60, 65, 69)[0]).toBe('F/G')
    expect(printed(48, 53, 58, 62, 69)[0]).toBe('B♭maj7/C')
    expect(printed(60, 62, 67, 70)).toEqual(['Gm/C', 'C7sus2'])
    expect(printed(53, 60, 64, 67)).toEqual(['C/F', 'Fmaj7sus2'])
    expect(printed(60, 62, 67, 71)).toEqual(['G/C', 'Cmaj7sus2'])
    expect(printed(48, 53, 55, 58, 62)).toEqual(['C9sus4', 'Gm7/C', 'B♭6/C'])
  })

  it('puts it after the root-position readings and the inversions otherwise, the fewest tones first', () => {
    expect(printed(57, 60, 64, 67)).toEqual(['Am7', 'C6/A', 'C/A'])
    expect(printed(48, 50, 54, 57)).toEqual(['D7/C', 'D/C'])
    expect(printed(60, 64, 67, 71, 74)).toEqual(['Cmaj9', 'Em7/C', 'G6/C'])
  })

  it('stands only a plain chord with a 3rd over it: no suspended, diminished or augmented one', () => {
    expect(printed(60, 64, 66, 71)).toEqual(['Cmaj7♭5'])
    expect(printed(48, 60, 63, 66)).toEqual(['C°'])
  })

  it('spells the bass by the chord’s side of the circle, or as the key writes it', () => {
    expect(printed(44, 62, 65, 69)).toEqual(['Dm/A♭'])
    expect(printed(42, 63, 67, 70)).toEqual(['E♭/G♭'])
    expect(printed(46, 64, 68, 71)[0]).toBe('E/A♯')
    const F = { tonic: note('F'), minor: false }
    expect(printedSymbol(nameChords([46, 64, 68, 71].map(midi), F)[0]?.symbol ?? '')).toBe('E/B♭')
  })

  it('has no inversion to open in the Chords explorer', () => {
    expect(nameChords([50, 60, 64, 67].map(midi))[0]?.inversion).toBeUndefined()
  })
})

describe('the chords the research adds', () => {
  it('reads a 13th with all seven tones, its 11th played, as the 13th', () => {
    expect(first([60, 64, 67, 70, 74, 77, 81])).toBe('C13')
    expect(first([48, 64, 70, 74, 77, 81])).toBe('C13')
    expect(first([60, 64, 67, 71, 74, 77, 81])).toBe('Cmaj13')
  })

  it('names the major ♭5 triad, the °(maj7), the m7♭9, the m9♯11 and the maj7♭5', () => {
    expect(first([60, 64, 66])).toBe('C(♭5)')
    expect(first([60, 63, 66, 71])).toBe('C°(maj7)')
    expect(first([60, 63, 67, 70, 73])).toBe('Cm7♭9')
    expect(first([60, 63, 67, 70, 74, 78])).toBe('Cm9♯11')
    expect(first([60, 64, 66, 71])).toBe('Cmaj7♭5')
    expect(first([60, 64, 71, 74, 78])).toBe('Cmaj9♯11')
  })

  it('reads no °(maj7) over its 7th: a triad with a ♭9 over the bass', () => {
    expect(first([60, 64, 67, 61])).toBeNull()
  })
})

describe('the readings worth showing', () => {
  it('shows three at most', () => {
    expect(printed(48, 51, 54, 57)).toHaveLength(3)
  })

  it('shows after the best only whole readings with one alteration at most', () => {
    expect(printed(48, 52, 58, 62, 66, 69)).toEqual(['C13♯11', 'D9♭13/C'])
    expect(printed(48, 52, 56, 58, 63)).toEqual(['C7(♯5,♯9)'])
    expect(printed(60, 63, 66, 70, 74)).toEqual(['Cm9♭5', 'E♭m(maj7)/C'])
    expect(printed(48, 52, 56)).toEqual(['C+', 'E+/C', 'A♭+/C'])
  })

  it('shows the best whatever it leaves out', () => {
    expect(found(48, 64, 70)[0]?.leftOut).toEqual(['5th'])
  })
})
