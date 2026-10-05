import type { ExerciseGroup } from '@/entities/exercise'
import type { TrainerId } from '@/features/trainer'

/** Practice's topics, in the order its tabs stand: what a learner works on, whatever the way. */
export const PRACTICE_TOPICS = [
  'chords',
  'scales',
  'ear',
  'progressions',
  'accompaniment',
  'technique',
] as const
export type PracticeTopic = (typeof PRACTICE_TOPICS)[number]

/** What Practice shows: one topic at a time. */
export interface PracticeHubView {
  readonly topic: PracticeTopic
}

/** The pages that show a thing on the keys and work it out: each explored, never scored. */
export const EXPLORERS = [
  'chords',
  'chordFinder',
  'tensions',
  'scales',
  'intervals',
  'progressions',
  'passingChords',
  'reharmonise',
  'patterns',
] as const
export type Explorer = (typeof EXPLORERS)[number]

/** A topic's three ways in: pages to explore, trainers to be quizzed by, music to play in the Player. */
export interface Topic {
  readonly explore: readonly Explorer[]
  readonly quiz: readonly TrainerId[]
  /** The exercise groups it plays, each under its own name. */
  readonly play: readonly ExerciseGroup[]
  /** The pieces it plays: the studies or the progressions. */
  readonly pieces?: 'studies' | 'progressions'
}

/** Every explorer, trainer (but My gaps, which checks across topics), exercise group and practice piece, in one topic. */
export const TOPICS: Readonly<Record<PracticeTopic, Topic>> = {
  chords: {
    explore: ['chords', 'chordFinder', 'tensions'],
    quiz: ['build-chord', 'name-chord', 'chord-role', 'chords-by-ear'],
    play: ['arpeggios', 'chords'],
  },
  scales: {
    explore: ['scales'],
    quiz: ['build-scale', 'key-signatures', 'key-degrees', 'scales-by-ear'],
    play: ['scales'],
  },
  ear: {
    explore: ['intervals'],
    quiz: ['intervals-by-ear', 'reading-notes'],
    play: [],
  },
  progressions: {
    explore: ['progressions', 'passingChords', 'reharmonise'],
    quiz: [],
    play: ['progressions'],
    pieces: 'progressions',
  },
  accompaniment: {
    explore: ['patterns'],
    quiz: [],
    play: [],
    pieces: 'studies',
  },
  technique: {
    explore: [],
    quiz: [],
    play: ['technique', 'barryHarris', 'jonny'],
  },
}
