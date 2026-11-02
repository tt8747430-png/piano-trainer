import { describe, expect, it } from 'vitest'
import type { Lesson, LessonBlock } from '@/entities/lesson'
import { readMusic, writeStaff, type PieceMusic } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { exampleBlock, exampleMusic, notesBlocks, withNotesBlock } from './example-music'

type NotesBlock = Extract<LessonBlock, { kind: 'notes' }>
const block = (fields: Partial<NotesBlock> & { notes: string }): NotesBlock => ({
  kind: 'notes',
  clef: 'treble',
  ...fields,
})
/** The block the editor writes back of the music it opened on, unchanged. */
const roundTrip = (given: NotesBlock) => exampleBlock(exampleMusic(given), given)

describe('an example’s music in the score editor', () => {
  it('opens a line alone as one staff, the piano hidden: a lead sheet of empty bars of no chord', () => {
    const music = exampleMusic(block({ notes: 'E4 D4 C4/2' }))
    expect(music).toMatchObject({ key: 'C', meter: '4/4', leadSheet: true })
    expect(music.staves).toEqual([{ notes: 'E4/1 D4/1 C4/2' }])
    expect(music.sections).toEqual([{ kind: 'verse', lines: ['_'] }])
  })

  it('keeps a bass line’s clef, and its bars as many as the line fills', () => {
    const music = exampleMusic(block({ clef: 'bass', notes: 'C3/1 G2/1' }))
    expect(music.staves).toEqual([{ clef: 'bass', notes: 'C3/4 | G2/4' }])
    expect(music.sections[0]?.lines[0]?.split(' ')).toHaveLength(2)
  })

  it('opens a tune over a bass line on the grand staff, each hand its own', () => {
    const music = exampleMusic(block({ notes: 'E4/2 G4/2', bass: 'C3/1' }))
    expect(music).not.toHaveProperty('staves')
    expect(music.hands).toEqual({ rh: 'E4/2 G4/2', lh: 'C3/4' })
  })

  it('writes the line back as the lesson writes it: values, dots, rests and ties', () => {
    for (const notes of [
      'E4 D4 C4/2',
      'C5/2~ C5/8 B4/8. A4/16',
      'r/4 G4/8 A4/8 B4/2',
      'C4/1~ C4 D4/2.',
    ]) {
      expect(roundTrip(block({ notes }))).toEqual({ ok: true, block: block({ notes }) })
    }
    expect(roundTrip(block({ notes: 'E4/2 G4/2', bass: 'C3/1' }))).toEqual({
      ok: true,
      block: block({ notes: 'E4/2 G4/2', bass: 'C3/1' }),
    })
  })

  it('counts a compound meter’s values in its dotted beat', () => {
    const given = block({ notes: 'E4/4. D4/8 C4 B3/8', meter: '6/8' })
    expect(roundTrip(given)).toEqual({ ok: true, block: given })
  })

  it('carries back the key and time the editor gave it, and the notes written', () => {
    const music: PieceMusic = {
      ...exampleMusic(block({ notes: 'C4/1' })),
      key: 'G',
      meter: '3/4',
      staves: [
        {
          notes: writeStaff(
            [{ midi: 66 as never, spelled: note('F', 1), startTick: 0, durationTicks: 15120 }],
            [{ startTick: 0, ticks: 15120 }],
          ),
        },
      ],
    }
    expect(exampleBlock(music, block({ notes: 'C4/1' }))).toEqual({
      ok: true,
      block: block({ notes: 'F#4/2.', key: { tonic: note('G'), minor: false }, meter: '3/4' }),
    })
  })

  it('refuses what an example cannot hold: marks, notes struck together, more staves', () => {
    const marked = exampleMusic(block({ notes: 'C4/1' }))
    expect(
      exampleBlock({ ...marked, staves: [{ notes: 'C4/1[stacc] r/3' }] }, block({ notes: 'C4' })),
    ).toEqual({ ok: false, why: 'marks' })
    const chord = exampleMusic(block({ notes: 'E4/1', bass: 'C3/1' }))
    expect(
      exampleBlock({ ...chord, hands: { rh: 'E4+G4/1 r/3', lh: 'C3/4' } }, block({ notes: 'E4' })),
    ).toEqual({ ok: false, why: 'chords' })
    expect(
      exampleBlock(
        { ...marked, staves: [{ notes: 'C4/4' }, { notes: 'E4/4' }] },
        block({ notes: 'C4' }),
      ),
    ).toEqual({ ok: false, why: 'staves' })
    expect(() => readMusic(chord)).not.toThrow()
  })
})

describe('a lesson’s examples of notes', () => {
  const lesson = {
    id: 'l',
    title: { en: 'L', ru: 'Л' },
    summary: { en: '', ru: '' },
    sections: [
      {
        heading: { en: 'A', ru: 'А' },
        blocks: [block({ notes: 'C4' }), { kind: 'chords', symbols: ['C'] } as LessonBlock],
      },
      { heading: { en: 'B', ru: 'Б' }, blocks: [block({ notes: 'D4' }), block({ notes: 'E4' })] },
    ],
  } as unknown as Lesson

  it('are its notes blocks in the order the lesson reads them', () => {
    expect(notesBlocks(lesson).map((each) => each.notes)).toEqual(['C4', 'D4', 'E4'])
  })

  it('has one replaced by its place among them, every other block kept', () => {
    const next = withNotesBlock(lesson, 1, block({ notes: 'G4' }))
    expect(notesBlocks(next).map((each) => each.notes)).toEqual(['C4', 'G4', 'E4'])
    expect(next.sections[0]?.blocks[1]).toEqual({ kind: 'chords', symbols: ['C'] })
    expect(withNotesBlock(lesson, 9, block({ notes: 'G4' }))).toBe(lesson)
  })
})
