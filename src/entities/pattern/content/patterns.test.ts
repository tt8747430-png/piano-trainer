import { describe, expect, it } from 'vitest'
import { arrange, type Chart } from '@/shared/lib/arrangement'
import { note } from '@/shared/lib/music'
import { collectLocalTexts } from '@/shared/test/local-texts'
import { BUILT_IN_PATTERNS } from '../model/book'
import { patternNeed } from '../model/fit'
import { patternsIn } from '../model/selectors'
import {
  isLeftFigureId,
  isMethodCode,
  isPatternGroup,
  isPatternId,
  isRightFigureId,
  PATTERN_GROUPS,
  PATTERN_IDS,
} from '../model/types'
import { LEFT_FIGURE_GROUPS, LEFT_FIGURES, RIGHT_FIGURE_GROUPS, RIGHT_FIGURES } from './figures'
import { METHOD_PATTERNS, METHODS } from './methods'
import { PATTERN_GROUP_ENTRIES, PATTERNS } from './patterns'

describe('the pattern catalog', () => {
  it('has 48 patterns in five groups, built from 45 right-hand and 27 left-hand figures', () => {
    expect(PATTERN_IDS).toHaveLength(48)
    expect(PATTERN_GROUPS.map((group) => patternsIn(group).length)).toEqual([5, 15, 8, 6, 14])
    expect(Object.keys(RIGHT_FIGURES)).toHaveLength(45)
    expect(Object.keys(LEFT_FIGURES)).toHaveLength(27)
    expect(Object.keys(METHODS)).toHaveLength(20)
  })

  it('says which method book teaches each group, the rhythm styles no book’s', () => {
    expect(PATTERN_GROUPS.map((group) => [group, PATTERN_GROUP_ENTRIES[group].book])).toEqual([
      ['five-ways', 'called-to-play'],
      ['techniques', 'called-to-play'],
      ['seven-types', 'seven-types'],
      ['gorshkov', 'gorshkov'],
      ['genres', null],
    ])
    expect(isPatternGroup('genres')).toBe(true)
    expect(isPatternGroup('own')).toBe(false)
  })

  it('names a group without its book: a list says the book where it mixes them', () => {
    expect(PATTERN_GROUPS.map((group) => PATTERN_GROUP_ENTRIES[group].name.en)).toEqual([
      'The five ways (lesson 3)',
      'Right-hand techniques',
      'The seven types of accompaniment',
      'Arranging the accompaniment',
      'Rhythm styles',
    ])
  })

  it('plays each pattern under its own id with the figures it names', () => {
    for (const id of PATTERN_IDS) {
      const { rh, lh } = PATTERNS[id]
      const { pattern } = BUILT_IN_PATTERNS.require(id)
      expect(pattern.id).toBe(id)
      expect(pattern.rh).toBe(RIGHT_FIGURES[rh].figure)
      expect(pattern.lh).toBe(LEFT_FIGURES[lh].figure)
    }
  })

  it('falls back to r4 where a melody is needed and missing', () => {
    const tuneless = { methodCodes: true, melody: false, key: true, simpleTime: true }
    expect(
      PATTERN_IDS.filter((id) => patternNeed(BUILT_IN_PATTERNS.require(id), tuneless)),
    ).toEqual(['r5', 'r6', 'r7'])
    for (const id of ['r5', 'r6', 'r7'] as const) {
      const { pattern } = BUILT_IN_PATTERNS.require(id)
      expect('withoutMelody' in pattern && pattern.withoutMelody).toEqual(
        BUILT_IN_PATTERNS.require('r4').pattern,
      )
    }
    for (const id of ['mel', 'melE', 'melH'] as const) {
      const { figure } = RIGHT_FIGURES[id]
      expect(figure.kind === 'melody' && figure.withoutMelody).toBe(RIGHT_FIGURES.r4.figure)
    }
    const ends = RIGHT_FIGURES.melE.figure
    expect(ends.kind === 'melody' && ends.use === 'ends' && ends.between).toBe(
      RIGHT_FIGURES.r4b.figure,
    )
  })

  it('maps each method code to a pattern', () => {
    for (const { pattern } of Object.values(METHODS)) expect(isPatternId(pattern)).toBe(true)
    expect(METHODS['3ch'].pattern).toBe('c3')
    expect(METHODS['5.2'].pattern).toBe('p52')
    expect(METHODS['6d'].pattern).toBe('s6d')
    expect(METHODS['1'].pattern).toBe('M1')
    expect(METHOD_PATTERNS.get('t1')).toBe(BUILT_IN_PATTERNS.require('t1').pattern)
  })

  it('writes 3/4 and major variants where the source has them', () => {
    const r2 = RIGHT_FIGURES.r2.figure
    expect(r2.kind === 'events' && r2.inThree?.map((event) => event.start)).toEqual([12, 24])
    const p52 = RIGHT_FIGURES.p52.figure
    expect(p52.kind === 'events' && p52.onMajor).toHaveLength(3)
    expect(LEFT_FIGURES.shuf.figure.events[1]?.start).toBe(8)
  })

  it('recognises its ids', () => {
    expect(isPatternId('r4')).toBe(true)
    expect(isPatternId('song')).toBe(false)
    expect(isPatternId('constructor')).toBe(false)
    expect(isMethodCode('t1')).toBe(true)
    expect(isMethodCode('t9')).toBe(false)
    expect(isRightFigureId('melE')).toBe(true)
    expect(isRightFigureId('o')).toBe(false)
    expect(isLeftFigureId('o')).toBe(true)
    expect(isLeftFigureId(3)).toBe(false)
  })

  it('names everything in both languages', () => {
    const texts = collectLocalTexts({
      PATTERN_GROUPS: Object.values(PATTERN_GROUP_ENTRIES).map((entry) => entry.name),
      PATTERNS: Object.fromEntries(
        PATTERN_IDS.map((id) => {
          const { name, idea, description } = PATTERNS[id]
          return [id, { name, idea, description }]
        }),
      ),
      RIGHT_FIGURES: Object.values(RIGHT_FIGURES).map((entry) => entry.name),
      LEFT_FIGURES: Object.values(LEFT_FIGURES).map((entry) => entry.name),
      METHODS: Object.values(METHODS).map((method) => method.label),
    })
    expect(texts.length).toBeGreaterThanOrEqual(4 + 39 * 2 + 36 + 20 + 17)
    for (const { path, text } of texts) {
      expect(text.en.trim(), `${path}.en`).not.toBe('')
      expect(text.ru.trim(), `${path}.ru`).not.toBe('')
    }
  })
})

describe('the left hand’s own figures', () => {
  it('lists every figure in one group', () => {
    const grouped = LEFT_FIGURE_GROUPS.flatMap((group) => group.figures)
    expect(grouped.toSorted()).toEqual(Object.keys(LEFT_FIGURES).toSorted())
  })

  it('lists every right-hand figure in one group too', () => {
    const grouped = RIGHT_FIGURE_GROUPS.flatMap((group) => group.figures)
    expect(grouped.toSorted()).toEqual(Object.keys(RIGHT_FIGURES).toSorted())
  })

  const C_BAR: Chart = {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    sections: [
      { lines: [[{ chords: [{ root: note('C'), quality: 'maj', beats: 4 }], beats: 4 }]] },
    ],
  }
  const lhAt = (lh: keyof typeof LEFT_FIGURES, tick: number) =>
    arrange(C_BAR, {
      tonic: note('C'),
      pattern: BUILT_IN_PATTERNS.require('block').pattern,
      lh: LEFT_FIGURES[lh].figure,
    })
      .notes.filter((n) => n.hand === 'lh' && n.startTick === tick)
      .map((n) => n.midi)
      .toSorted((a, b) => a - b)

  it('strides: the bass, then the chord an octave and more above it', () => {
    expect(lhAt('str', 0)).toEqual([36]) // C2
    expect(lhAt('str', 12)).toEqual([52, 55, 60]) // E3 G3 C4
    expect(lhAt('str', 24)).toEqual([43]) // G2
  })

  it('opens a 5th and a 10th over the bass', () => {
    expect(lhAt('fifth', 0)).toEqual([36, 43])
    expect(lhAt('tenth', 0)).toEqual([36, 52])
  })
})
