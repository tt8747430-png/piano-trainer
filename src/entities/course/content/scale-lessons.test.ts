import { describe, expect, it } from 'vitest'
import type { Lesson } from '@/entities/lesson'
import { note, noteName, placeScale, spellChord, type SpelledNote } from '@/shared/lib/music'
import {
  arpeggioFingers,
  arpeggioLesson,
  fingerText,
  keyLessonId,
  keyNames,
  MAJOR_TONICS,
  majorScaleLesson,
  MINOR_TONICS,
  minorScaleLesson,
  scaleFingers,
} from './scale-lessons'

const names = (tonics: readonly SpelledNote[]) => tonics.map(noteName).join(' ')

/** Every text a lesson shows, in both languages. */
const textsOf = (lesson: Lesson): string[] =>
  [
    lesson.title,
    lesson.summary,
    ...lesson.sections.flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap((block) =>
        block.kind === 'text' || block.kind === 'note'
          ? [block.text]
          : block.kind === 'steps'
            ? block.steps
            : block.kind === 'question'
              ? [block.ask]
              : block.kind === 'link'
                ? [block.title]
                : [],
      ),
    ]),
  ].flatMap((text) => [text.en, text.ru])

const answers = (lesson: Lesson) =>
  lesson.sections.flatMap((section) =>
    section.blocks.flatMap((block) => (block.kind === 'question' ? [block.answer] : [])),
  )

describe('the key lessons’ keys', () => {
  it('go round the circle of fifths in the app’s spellings', () => {
    expect(names(MAJOR_TONICS)).toBe('C G D A E B F# D♭ A♭ E♭ B♭ F')
    expect(names(MINOR_TONICS)).toBe('A E B F# C# G# E♭ B♭ F C G D')
  })

  it('name each key in English and in Russian, in the cases a lesson needs', () => {
    expect(keyNames({ tonic: note('F', 1), minor: false }).en).toBe('F♯ major')
    expect(keyNames({ tonic: note('B', -1), minor: true })).toEqual({
      en: 'B♭ minor',
      ru: 'си-бемоль минор',
      ruOf: 'си-бемоль минора',
      ruIn: 'си-бемоль миноре',
    })
    expect(keyNames({ tonic: note('G'), minor: false }).ruIn).toBe('соль мажоре')
    expect(keyLessonId({ tonic: note('F', 1), minor: false })).toBe('f-sharp-major')
    expect(keyLessonId({ tonic: note('E', -1), minor: true })).toBe('e-flat-minor')
    expect(majorScaleLesson(note('F', 1)).title).toEqual({ en: 'F♯ major', ru: 'Фа-диез мажор' })
    expect(minorScaleLesson(note('C', 1)).title).toEqual({ en: 'C♯ minor', ru: 'До-диез минор' })
  })
})

describe('the scale fingerings', () => {
  it('finger the major keys as they are published', () => {
    const rh = (tonic: SpelledNote) => fingerText(scaleFingers(tonic, 'major', 'rh'))
    const lh = (tonic: SpelledNote) => fingerText(scaleFingers(tonic, 'major', 'lh'))
    for (const tonic of [note('C'), note('G'), note('D'), note('A'), note('E')]) {
      expect(rh(tonic)).toBe('1-2-3-1-2-3-4-5')
      expect(lh(tonic)).toBe('5-4-3-2-1-3-2-1')
    }
    expect(rh(note('B'))).toBe('1-2-3-1-2-3-4-5')
    expect(lh(note('B'))).toBe('4-3-2-1-4-3-2-1')
    expect(rh(note('F', 1))).toBe('2-3-4-1-2-3-1-2')
    expect(lh(note('F', 1))).toBe('4-3-2-1-3-2-1-4')
    expect(rh(note('D', -1))).toBe('2-3-1-2-3-4-1-2')
    expect(rh(note('E', -1))).toBe('3-1-2-3-4-1-2-3')
    for (const tonic of [note('D', -1), note('A', -1), note('E', -1), note('B', -1)]) {
      expect(lh(tonic)).toBe('3-2-1-4-3-2-1-3')
    }
    expect(rh(note('F'))).toBe('1-2-3-4-1-2-3-4')
    expect(lh(note('F'))).toBe('5-4-3-2-1-3-2-1')
    // The kernel's one-octave start: published books often start B♭ on 4 and A♭ on 3 4.
    expect(rh(note('B', -1))).toBe('4-1-2-3-1-2-3-4')
    expect(rh(note('A', -1))).toBe('3-4-1-2-3-1-2-3')
  })

  it('finger the minor keys’ left hands as they are published', () => {
    const lh = (tonic: SpelledNote) => fingerText(scaleFingers(tonic, 'natural', 'lh'))
    expect(lh(note('B'))).toBe('4-3-2-1-4-3-2-1')
    expect(lh(note('F', 1))).toBe('4-3-2-1-3-2-1-4')
    expect(lh(note('C', 1))).toBe('3-2-1-4-3-2-1-3')
    expect(lh(note('G', 1))).toBe('3-2-1-3-2-1-4-3')
    expect(lh(note('E', -1))).toBe('2-1-4-3-2-1-3-2')
    expect(lh(note('B', -1))).toBe('2-1-3-2-1-4-3-2')
    expect(lh(note('F'))).toBe('5-4-3-2-1-3-2-1')
  })

  it('write each key’s fingers in its lesson as the kernel gives them', () => {
    for (const tonic of MAJOR_TONICS) {
      const text = textsOf(majorScaleLesson(tonic)).join('\n')
      for (const hand of ['rh', 'lh'] as const) {
        expect(text, noteName(tonic)).toContain(
          `Up: ${fingerText(scaleFingers(tonic, 'major', hand))}.`,
        )
      }
    }
    for (const tonic of MINOR_TONICS) {
      const text = textsOf(minorScaleLesson(tonic)).join('\n')
      for (const hand of ['rh', 'lh'] as const) {
        expect(text, noteName(tonic)).toContain(
          `Up: ${fingerText(scaleFingers(tonic, 'natural', hand))}.`,
        )
      }
    }
  })
})

describe('the scale lessons', () => {
  it('ask for each key’s notes as the kernel spells its scale', () => {
    const spelled = (tonic: SpelledNote, kind: 'major' | 'natural' | 'harmonic' | 'melodic') =>
      placeScale(tonic, kind).map((placed) => noteName(placed.tone.note))
    for (const tonic of MAJOR_TONICS) {
      expect(answers(majorScaleLesson(tonic))).toContainEqual({
        notes: spelled(tonic, 'major'),
        rising: true,
      })
    }
    for (const tonic of MINOR_TONICS) {
      for (const kind of ['natural', 'harmonic', 'melodic'] as const) {
        expect(answers(minorScaleLesson(tonic))).toContainEqual({
          notes: spelled(tonic, kind),
          rising: true,
        })
      }
    }
    expect(answers(minorScaleLesson(note('G', 1)))).toContainEqual({
      notes: ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F𝄪', 'G#'],
      rising: true,
    })
  })

  it('ask for the key’s V chord, major in a minor key', () => {
    expect(answers(majorScaleLesson(note('E', -1)))).toContainEqual({ chord: 'B♭' })
    expect(answers(minorScaleLesson(note('A')))).toContainEqual({ chord: 'E' })
    expect(answers(minorScaleLesson(note('C', 1)))).toContainEqual({ chord: 'G#' })
  })

  it('say each key’s signature and relative major', () => {
    const text = (lesson: Lesson) => textsOf(lesson).join('\n')
    expect(text(majorScaleLesson(note('A')))).toContain('A major has three sharps: F♯, C♯ and G♯.')
    expect(text(majorScaleLesson(note('D', -1)))).toContain('В ре-бемоль мажоре пять бемолей')
    expect(text(minorScaleLesson(note('E', -1)))).toContain(
      'Те же знаки у его параллельного мажора, соль-бемоль мажора.',
    )
  })
})

describe('the arpeggio lessons', () => {
  const fingers = (tonic: SpelledNote, minor: boolean, hand: 'rh' | 'lh') =>
    fingerText(arpeggioFingers({ tonic, minor }, hand))

  it('finger two octaves as they are published', () => {
    expect(fingers(note('C'), false, 'rh')).toBe('1-2-3-1-2-3-5')
    expect(fingers(note('C'), false, 'lh')).toBe('5-4-2-1-4-2-1')
    expect(fingers(note('A'), true, 'rh')).toBe('1-2-3-1-2-3-5')
    expect(fingers(note('A', -1), false, 'rh')).toBe('4-1-2-4-1-2-4')
    expect(fingers(note('A', -1), false, 'lh')).toBe('2-1-4-2-1-4-2')
    expect(fingers(note('F', 1), true, 'rh')).toBe('4-1-2-4-1-2-4')
    // Before the first thumb, each note takes the finger its tone takes an octave up.
    expect(fingers(note('B', -1), true, 'rh')).toBe('2-3-1-2-3-1-2')
  })

  it('ask for the triad and its arpeggio as the kernel spells them', () => {
    for (const [tonics, minor] of [
      [MAJOR_TONICS, false],
      [MINOR_TONICS, true],
    ] as const) {
      for (const tonic of tonics) {
        const notes = spellChord(tonic, minor ? 'min' : 'maj').map((tone) => noteName(tone.note))
        expect(answers(arpeggioLesson({ tonic, minor }))).toContainEqual({
          notes: [...notes, noteName(tonic)],
          rising: true,
        })
        const text = textsOf(arpeggioLesson({ tonic, minor })).join('\n')
        expect(text).toContain(`Up: ${fingers(tonic, minor, 'rh')}.`)
        expect(text).toContain(`Up: ${fingers(tonic, minor, 'lh')}.`)
      }
    }
  })
})

describe('every generated lesson', () => {
  const lessons = [
    ...MAJOR_TONICS.map(majorScaleLesson),
    ...MINOR_TONICS.map(minorScaleLesson),
    ...MAJOR_TONICS.map((tonic) => arpeggioLesson({ tonic, minor: false })),
    ...MINOR_TONICS.map((tonic) => arpeggioLesson({ tonic, minor: true })),
  ]

  it('says nothing left blank, and writes sharps as ♯ in prose', () => {
    for (const lesson of lessons) {
      for (const text of textsOf(lesson)) {
        expect(text, lesson.id).not.toMatch(/undefined|NaN|\[object|#|\s{2}|^\s|\s$/)
      }
    }
  })

  it('ends on Try it', () => {
    for (const lesson of lessons) expect(lesson.sections.at(-1)?.heading.en).toBe('Try it')
  })
})
