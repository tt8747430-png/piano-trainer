import {
  CHORD_QUALITIES,
  chordFamily,
  chordRootSpelling,
  chordSymbol,
  PITCH_CLASSES,
  pitchClassOf,
  qualityIntervals,
  sameNote,
  scaleRootSpelling,
  skillOf,
  spellChord,
  spellScale,
} from '@/shared/lib/music'
import type { ChordQuestion, Question, QuizConfig, QuizScope } from './quiz-machine'

/** A question equal to the last one is drawn again at most this many times. */
const DRAWS = 8
const OPTIONS = 4

function itemAt<T>(items: readonly T[], index: number): T {
  const item = items[index]
  if (item === undefined) throw new RangeError(`No item ${index} of ${items.length}`)
  return item
}

const pick = <T>(items: readonly T[], random: () => number): T =>
  itemAt(items, Math.min(items.length - 1, Math.floor(random() * items.length)))

/** In an order drawn from `random`. */
const shuffled = <T>(items: readonly T[], random: () => number): T[] =>
  items
    .map((item) => ({ item, key: random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ item }) => item)

/**
 * The answer and three other chords on the same key: the scope's own family first, then any. Each
 * root is spelled by its own chord (`chordRootSpelling`), as the app writes it everywhere else.
 */
function nameOptions(
  question: ChordQuestion,
  scope: QuizScope,
  random: () => number,
): readonly string[] {
  const family = chordFamily(question.quality)
  const inScope = new Set(
    scope.skills.flatMap((id) => {
      const skill = skillOf(id)
      return skill.kind === 'chord' && skill.quality !== question.quality ? [skill.quality] : []
    }),
  )
  const sameFamily = shuffled(
    [...inScope].filter((quality) => chordFamily(quality) === family),
    random,
  )
  const others = shuffled(
    CHORD_QUALITIES.filter(
      (quality) => quality !== question.quality && !sameFamily.includes(quality),
    ),
    random,
  )
  const wrong = [...sameFamily, ...others].slice(0, OPTIONS - 1).map((quality) => {
    const root = chordRootSpelling(pitchClassOf(question.root), qualityIntervals(quality))
    return chordSymbol({ root, quality })
  })
  return shuffled([...wrong, question.symbol], random)
}

function draw(config: QuizConfig, index: number, random: () => number): Question {
  const { scope } = config
  const skill = scope.ordered
    ? itemAt(scope.skills, index % scope.skills.length)
    : pick(scope.skills, random)
  const pc = pick(scope.roots?.length ? scope.roots : PITCH_CLASSES, random)
  const target = skillOf(skill)
  if (target.kind === 'scale') {
    const root = scaleRootSpelling(pc, target.scale)
    return {
      mode: 'build-scale',
      skill,
      root,
      kind: target.scale,
      notes: spellScale(root, target.scale),
    }
  }
  const root = chordRootSpelling(pc, qualityIntervals(target.quality))
  const chord: ChordQuestion = {
    skill,
    root,
    quality: target.quality,
    symbol: chordSymbol({ root, quality: target.quality }),
    tones: spellChord(root, target.quality),
  }
  return config.chordMode === 'name-chord'
    ? { mode: 'name-chord', ...chord, options: nameOptions(chord, scope, random) }
    : { mode: 'build-chord', ...chord }
}

const sameQuestion = (a: Question, b: Question | null | undefined): boolean =>
  !!b && a.skill === b.skill && sameNote(a.root, b.root)

/** The next question of a quiz; a repeat of the last one is drawn again, up to 8 times. */
export function createQuestion(
  config: QuizConfig,
  context: { index: number; random: () => number; previous?: Question | null },
): Question {
  let question = draw(config, context.index, context.random)
  for (let draws = 1; draws < DRAWS && sameQuestion(question, context.previous); draws++) {
    question = draw(config, context.index, context.random)
  }
  return question
}
