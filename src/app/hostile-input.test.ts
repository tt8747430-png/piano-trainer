import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { readMusic, readSharedSong, type ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { notate } from '@/shared/lib/notation'
import { parseKey, parseNoteName, parseNumerals, readChordSymbol } from '@/shared/lib/music'

let seed = 7
const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647
const ALPHABET = 'ABCDEFGabcdefg#b♯♭♮0123456789/|-:@()[]{} .,~*+mMajdimsusaddo°ø^_=\n\t%x\\'
const junk = (n: number) =>
  Array.from(
    { length: Math.floor(rand() * n) },
    () => ALPHABET[Math.floor(rand() * ALPHABET.length)],
  ).join('')

const CHORDS = [
  'G',
  'C',
  'Em',
  'D/F#',
  'Am7',
  'Bb',
  'F#m7b5',
  'Cmaj9',
  'G7sus4',
  'Dsus4',
  'E7',
  'Abm',
]
const ODD = ['%', 'x', 'N.C.', '@0', '@9', ':t9', 'H', '//', '']
const pick = <T>(list: readonly T[]): T => list[Math.floor(rand() * list.length)] as T
const chartJunk = () =>
  Array.from({ length: 1 + Math.floor(rand() * 4) }, () => {
    const bar = Array.from({ length: 1 + Math.floor(rand() * 3) }, () =>
      rand() < 0.95
        ? pick(CHORDS) + (rand() < 0.3 ? `@${1 + Math.floor(rand() * 3)}` : '')
        : pick(ODD),
    )
    return bar.join('-')
  }).join(' ')
const NOTES = [
  'G4/3',
  'B4/1',
  'r/2',
  'C#5/0.5',
  'D5/3t',
  'E4',
  '/',
  'Bb3/4',
  'x/1',
  '|',
  'G4/0',
  'A4/-1',
]
const melodyJunk = () =>
  Array.from(
    { length: 1 + Math.floor(rand() * 12) },
    () => NOTES[Math.floor(rand() * NOTES.length)],
  ).join(rand() < 0.7 ? ' ' : ' | ')
let accepted = 0

/**
 * Text from outside the app (a shared link, a URL, a field) read and played without throwing: a seeded
 * stream of hostile input, the same each run.
 */
describe('hostile input', () => {
  it('reads hostile text without throwing', () => {
    const failures: string[] = []
    for (let i = 0; i < 3000; i++) {
      const text = junk(40)
      for (const [name, f] of [
        ['parseKey', () => parseKey(text)],
        ['parseNoteName', () => parseNoteName(text)],
        ['parseNumerals', () => parseNumerals(text)],
        ['readChordSymbol', () => readChordSymbol(text)],
      ] as const) {
        try {
          f()
        } catch (e) {
          failures.push(`${name}(${JSON.stringify(text)}): ${String(e)}`)
        }
      }
    }
    expect(failures.slice(0, 10)).toEqual([])
  })

  it('reads a hostile shared song, and plays what it reads, without throwing', () => {
    const failures: string[] = []
    const meters = ['4/4', '3/4', '6/8', '5/4', 'x', '']
    for (let i = 0; i < 3000; i++) {
      const saved = {
        title: junk(10) || 't',
        key: rand() < 0.95 ? pick(['C', 'G', 'F#m', 'Bb', 'Ebm']) : junk(4),
        meter: rand() < 0.95 ? pick(['4/4', '3/4', '6/8', '5/4']) : pick(meters),
        tempo: 40 + Math.floor(rand() * 140),
        pattern: rand() < 0.95 ? pick(['r1', 'r4', 'r2']) : junk(3),
        sections: [{ kind: 'verse', n: 1, lines: [chartJunk(), chartJunk()] }],
        melody: rand() < 0.5 ? melodyJunk() : undefined,
        hands: rand() < 0.3 ? [{ bar: 1, rh: junk(15), lh: junk(15) }] : undefined,
      }
      let song
      try {
        song = readSharedSong(saved)
      } catch (e) {
        failures.push(`readSharedSong(${JSON.stringify(saved)}): ${String(e)}`)
        continue
      }
      if (!song) continue
      accepted++
      try {
        readMusic(song.music)
        const piece: ChartPiece = { id: 'my-1', kind: 'song', title: song.title, ...song.music }
        notate(arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS))
      } catch (e) {
        failures.push(`readMusic(${JSON.stringify(song.music)}): ${String(e)}`)
      }
    }
    // Enough read as songs for the Player's part to be tried.
    expect(accepted).toBeGreaterThan(100)
    expect(failures.slice(0, 10)).toEqual([])
  })
})
