import { describe, expect, it } from 'vitest'
import { note, noteName, parseNoteName, pitchClassOf } from './note'
import { chordsHolding, type HoldingGroup } from './reharmonise'

const C_MAJOR = { tonic: note('C'), minor: false }
const symbols = (group: HoldingGroup) =>
  chordsHolding(note('G'), C_MAJOR)[group].map(
    (each) => `${noteName(each.chord.root)}${each.chord.suffix} ${each.degree}`,
  )

describe('chordsHolding', () => {
  it('never marks a chord in the key that holds a note the key spells otherwise', () => {
    const fMinor = chordsHolding(note('G', 1), { tonic: note('A'), minor: true }).triads.find(
      (each) => noteName(each.chord.root) === 'F' && each.chord.suffix === 'm',
    )
    expect(fMinor?.inKey).toBe(false)
  })

  it('lists the triads that hold a note as root, 3rd or 5th', () => {
    expect(symbols('triads')).toEqual(['G 1', 'E♭ 3', 'C 5', 'Gm 1', 'Em ♭3', 'Cm 5'])
  })

  it('gives the owner’s table for a melody G', () => {
    expect(symbols('major')).toEqual([
      'E♭Maj7 3',
      'A♭Maj7 7',
      'FMaj9 9',
      'D♭Maj7#11 #11',
      'B♭Maj13 13',
    ])
    expect(symbols('minor')).toEqual(['Em7 ♭3', 'Am7 ♭7', 'Fm9 9', 'Dm11 11', 'B♭m13 13'])
    expect(symbols('dominant')).toEqual([
      'E♭7 3',
      'A7 ♭7',
      'F#7♭9 ♭9',
      'F9 9',
      'E7#9 #9',
      'D♭7#11 #11',
      'B7♭13 ♭13',
      'B♭13 13',
    ])
  })

  it('names a root plainly where letters would not (A♭ as the 3rd of E, not F♭)', () => {
    const major = chordsHolding(note('A', -1), C_MAJOR).major
    expect(noteName(major[0]?.chord.root ?? note('C'))).toBe('E')
  })

  it('marks the chords made of the key’s notes', () => {
    const inKey = chordsHolding(note('E'), C_MAJOR).triads.filter((each) => each.inKey)
    expect(inKey.map((each) => noteName(each.chord.root) + each.chord.suffix)).toEqual([
      'C',
      'Em',
      'Am',
    ])
  })
})

/** The owner's table (roadmap §10.3): each melody note's major, minor and dominant roots, as it wrote them. */
const TABLE: readonly (readonly [string, string, string, string])[] = [
  ['G', 'E♭ A♭ F D♭ B♭', 'E A F D B♭', 'E♭ A F# F E D♭ B B♭'],
  ['A♭', 'E A G♭ D B', 'F B♭ G♭ E♭ B', 'E B♭ G G♭ F D C B'],
  ['A', 'F B♭ G E♭ C', 'G♭ B G E C', 'F B A♭ G G♭ E♭ D♭ C'],
  ['B♭', 'G♭ B A♭ E D♭', 'G C A♭ F D♭', 'G♭ C A A♭ G E D D♭'],
  ['B', 'G C A F D', 'A♭ D♭ A G♭ D', 'G D♭ B♭ A A♭ F E♭ D'],
  ['C', 'A♭ D♭ B♭ G♭ E♭', 'A D B♭ G E♭', 'A♭ D B B♭ A G♭ E E♭'],
  ['D♭', 'A D B G E', 'B♭ E♭ B A♭ E', 'A E♭ C B B♭ G F E'],
  ['D', 'B♭ E♭ C A♭ F', 'B E C A F', 'B♭ E D♭ C B A♭ G♭ F'],
  ['E♭', 'B E D♭ A G♭', 'C F D♭ B♭ G♭', 'B F D D♭ C A G G♭'],
  ['E', 'C F D B♭ G', 'D♭ G♭ D B G', 'C G♭ E♭ D D♭ B♭ A♭ G'],
  ['F', 'D♭ G♭ E♭ B A♭', 'D G E♭ C A♭', 'D♭ G E E♭ D B A A♭'],
  ['G♭', 'D G E C A', 'E♭ A♭ E D♭ A', 'D A♭ F E E♭ C B♭ A'],
]

const pitchClasses = (names: string) =>
  names.split(' ').map((name) => {
    const spelled = parseNoteName(name)
    if (!spelled) throw new Error(`the table writes "${name}"`)
    return pitchClassOf(spelled)
  })

describe('chordsHolding against the owner’s whole table', () => {
  it.each(TABLE)('holds %s in the roots the table gives', (melody, major, minor, dominant) => {
    const spelled = parseNoteName(melody)
    if (!spelled) throw new Error(`the table writes "${melody}"`)
    const held = chordsHolding(spelled, C_MAJOR)
    const roots = (group: HoldingGroup) => held[group].map((each) => pitchClassOf(each.chord.root))
    expect(roots('major')).toEqual(pitchClasses(major))
    expect(roots('minor')).toEqual(pitchClasses(minor))
    expect(roots('dominant')).toEqual(pitchClasses(dominant))
  })
})
