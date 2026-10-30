import { C_MAJOR } from '@/shared/lib/music'
import type { LessonBlock } from './types'

/**
 * The blocks an editor inserts in a lesson, by what the editor calls them (a rule is a note with a
 * name): its words, then its examples that play.
 */
export const INSERTABLE_BLOCKS = [
  'text',
  'steps',
  'note',
  'rule',
  'chords',
  'notes',
  'progression',
  'grid',
  'scale',
  'interval',
  'question',
] as const
export type InsertableBlock = (typeof INSERTABLE_BLOCKS)[number]

const blank = { en: '', ru: '' }

/** A new block of a kind: its words to write, its music a first example to write over. */
export function blankBlock(kind: InsertableBlock): LessonBlock {
  switch (kind) {
    case 'text':
      return { kind: 'text', text: blank }
    case 'steps':
      return { kind: 'steps', steps: [blank] }
    case 'note':
      return { kind: 'note', text: blank }
    case 'rule':
      return { kind: 'note', rule: blank, text: blank }
    case 'chords':
      return { kind: 'chords', symbols: ['C', 'F', 'G'] }
    case 'notes':
      return { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4' }
    case 'progression':
      return { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR }
    case 'grid':
      return { kind: 'grid', quality: 'maj' }
    case 'scale':
      return { kind: 'scale', root: C_MAJOR.tonic, scale: 'major' }
    case 'interval':
      return { kind: 'interval', root: C_MAJOR.tonic, interval: 'P5' }
    case 'question':
      return { kind: 'question', ask: blank, answer: { chord: 'C' } }
  }
}
