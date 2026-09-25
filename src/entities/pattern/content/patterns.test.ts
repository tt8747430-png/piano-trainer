import { describe, expect, it } from 'vitest'
import { collectLocalTexts } from '@/shared/test/local-texts'
import {
  LEFT_FIGURES,
  METHOD_PATTERNS,
  METHODS,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERN_IDS,
  PATTERNS,
  RIGHT_FIGURES,
  isLeftFigureId,
  isMethodCode,
  isPatternId,
  isRightFigureId,
  needsMelody,
  patternsIn,
} from '../index'

describe('the pattern catalog', () => {
  it('has 39 patterns in four groups, built from 36 right-hand and 20 left-hand figures', () => {
    expect(PATTERN_IDS).toHaveLength(39)
    expect(PATTERN_GROUPS.map((group) => patternsIn(group).length)).toEqual([5, 12, 8, 14])
    expect(Object.keys(RIGHT_FIGURES)).toHaveLength(36)
    expect(Object.keys(LEFT_FIGURES)).toHaveLength(20)
    expect(Object.keys(METHODS)).toHaveLength(17)
  })

  it('gives every pattern its own id', () => {
    for (const id of PATTERN_IDS) expect(PATTERNS[id].pattern.id).toBe(id)
  })

  it('plays each pattern with the figures it names', () => {
    for (const id of PATTERN_IDS) {
      const { rh, lh, pattern } = PATTERNS[id]
      expect(pattern.rh).toBe(RIGHT_FIGURES[rh].figure)
      expect(pattern.lh).toBe(LEFT_FIGURES[lh].figure)
    }
  })

  it('falls back to r4 where a melody is needed and missing', () => {
    expect(PATTERN_IDS.filter(needsMelody)).toEqual(['r5', 'r6', 'r7'])
    for (const id of ['r5', 'r6', 'r7'] as const) {
      const { pattern } = PATTERNS[id]
      expect('withoutMelody' in pattern && pattern.withoutMelody).toBe(PATTERNS.r4.pattern)
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
    expect(METHOD_PATTERNS.t1).toBe(PATTERNS.t1.pattern)
  })

  it('writes 3/4 and major variants where the source has them', () => {
    const r2 = RIGHT_FIGURES.r2.figure
    expect(r2.kind === 'events' && r2.inThree?.map((event) => event.start)).toEqual([12, 24])
    const p52 = RIGHT_FIGURES.p52.figure
    expect(p52.kind === 'events' && p52.onMajor).toHaveLength(4)
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
      PATTERN_GROUP_NAMES,
      PATTERNS: Object.fromEntries(
        PATTERN_IDS.map((id) => [
          id,
          { name: PATTERNS[id].name, description: PATTERNS[id].description },
        ]),
      ),
      RIGHT_FIGURES: Object.values(RIGHT_FIGURES).map((entry) => entry.name),
      LEFT_FIGURES: Object.values(LEFT_FIGURES).map((entry) => entry.name),
      METHODS: Object.values(METHODS).map((method) => method.label),
    })
    expect(texts.length).toBeGreaterThanOrEqual(4 + 39 + 36 + 20 + 17)
    for (const { path, text } of texts) {
      expect(text.en.trim(), `${path}.en`).not.toBe('')
      expect(text.ru.trim(), `${path}.ru`).not.toBe('')
    }
  })
})
