import { describe, expect, it } from 'vitest'
import { EXERCISES } from '@/entities/exercise'
import { COURSES } from '@/entities/course'
import { LESSONS } from '@/entities/lesson'
import { BUILT_IN_PATTERNS, PATTERN_IDS } from '@/entities/pattern'
import { COLLECTIONS } from '@/entities/piece'
import { LIBRARY_BY_STYLE } from '@/entities/progression-library'
import { TRAINER_IDS } from '@/features/trainer'
import { CHORD_QUALITIES, keySymbol, SCALE_KINDS } from '@/shared/lib/music'
import { PRACTICE_PAGE_IDS } from '@/widgets/practice-pages'
import {
  INDEX_KINDS,
  indexEntries,
  searchIndex,
  typedEntry,
  type IndexEntry,
  type IndexNames,
  type IndexSources,
} from './index-entries'

/** Names as a test reads them: each thing by its id, so an entry's title says where it came from. */
const names: IndexNames = {
  page: (page) => ({ title: `page ${page}`, about: `about ${page}` }),
  quality: (quality) => `quality ${quality}`,
  scale: (kind) => `scale ${kind}`,
  trainer: (trainer) => ({ title: `trainer ${trainer}`, about: `asks ${trainer}` }),
  key: (key) => `key ${keySymbol(key)}`,
}
const pieces = COLLECTIONS.flatMap((collection) => collection.entries)
const patterns = PATTERN_IDS.map((id) => BUILT_IN_PATTERNS.require(id))
const sources = (locale: IndexSources['locale'] = 'en'): IndexSources => ({
  locale,
  names,
  pieces,
  patterns,
})
const all = indexEntries(sources())
const ofKind = (kind: IndexEntry['kind'], entries = all) =>
  entries.filter((entry) => entry.kind === kind)
const titled = (title: string, entries = all) => {
  const found = entries.find((entry) => entry.title === title)
  if (!found) throw new RangeError(`No entry titled ${title}`)
  return found
}

describe('indexEntries', () => {
  it('holds every named thing once: no registry is listed twice or left out', () => {
    expect(ofKind('pages')).toHaveLength(PRACTICE_PAGE_IDS.length)
    expect(ofKind('songs')).toHaveLength(pieces.length)
    expect(ofKind('lessons')).toHaveLength(LESSONS.length)
    expect(ofKind('courses')).toHaveLength(
      COURSES.length + COURSES.reduce((sum, course) => sum + course.lessons.length, 0),
    )
    expect(ofKind('chords')).toHaveLength(CHORD_QUALITIES.length)
    expect(ofKind('scales')).toHaveLength(SCALE_KINDS.length)
    expect(ofKind('progressions')).toHaveLength(
      LIBRARY_BY_STYLE.flatMap((style) => style.progressions).length,
    )
    expect(ofKind('patterns')).toHaveLength(PATTERN_IDS.length)
    expect(ofKind('exercises')).toHaveLength(EXERCISES.length)
    expect(ofKind('quiz')).toHaveLength(TRAINER_IDS.length)
    expect(all).toHaveLength(INDEX_KINDS.reduce((sum, kind) => sum + ofKind(kind).length, 0))
    expect(new Set(all.map((entry) => entry.id)).size).toBe(all.length)
  })

  it('names a page by its row on Practice, and opens it', () => {
    expect(titled('page freePlay')).toMatchObject({
      kind: 'pages',
      detail: 'about freePlay',
      target: { opens: 'page', page: 'freePlay' },
    })
  })

  it('names a chord quality, shows it on C, and answers to the other ways it is written', () => {
    const minor7 = titled('quality m7')
    expect(minor7).toMatchObject({
      kind: 'chords',
      detail: 'Cm7',
      target: { opens: 'chord', quality: 'm7' },
    })
    expect(minor7.words).toContain('C−7')
  })

  it('opens a scale kind on C', () => {
    expect(titled('scale dorian')).toMatchObject({
      kind: 'scales',
      target: { opens: 'scale', scale: 'dorian' },
    })
  })

  it('names a lesson in the learner’s language under its journey, and answers to the other', () => {
    const triads = LESSONS.find((lesson) => lesson.id === 'triads')
    if (!triads) throw new RangeError('no triads lesson')
    const english = titled(triads.title.en)
    expect(english).toMatchObject({
      kind: 'lessons',
      detail: 'Foundations · Your first chords',
      target: { opens: 'lesson', lesson: 'triads' },
    })
    expect(english.words).toContain(triads.title.ru)
    expect(titled(triads.title.ru, indexEntries(sources('ru'))).words).toContain(triads.title.en)
  })

  it('shows a library progression by its line, opened in the mode it has', () => {
    const axis = ofKind('progressions').find((entry) => entry.id === 'progressions:axis')
    expect(axis).toMatchObject({
      title: 'Axis of Awesome',
      detail: 'I–V–vi–IV',
      target: { opens: 'progression', p: 'I-V-vi-IV', minor: false },
    })
    const minorOnly = ofKind('progressions').filter(
      (entry) => entry.target.opens === 'progression' && entry.target.minor,
    )
    expect(minorOnly.length).toBeGreaterThan(0)
  })

  it('names a pattern, an exercise and a trainer with a line on what each is', () => {
    const pattern = BUILT_IN_PATTERNS.require('M1')
    expect(titled(pattern.name.en)).toMatchObject({
      kind: 'patterns',
      detail: pattern.idea.en,
      target: { opens: 'pattern', ref: 'M1' },
    })
    const [exercise] = EXERCISES
    expect(titled(exercise!.name.en)).toMatchObject({
      kind: 'exercises',
      detail: exercise!.trains.en,
      target: { opens: 'exercise', exercise: exercise!.id },
    })
    expect(titled('trainer gaps')).toMatchObject({
      kind: 'quiz',
      detail: 'asks gaps',
      target: { opens: 'trainer', trainer: 'gaps' },
    })
  })

  it('lists a song by its title, its page’s entry kept for its row', () => {
    const [first] = pieces
    const song = ofKind('songs').find((entry) => entry.id === `songs:${first!.id}`)
    expect(song?.target).toEqual({ opens: 'piece', entry: first })
    expect([song?.title, ...(song?.words ?? [])]).toContain(first!.title)
  })
})

describe('searchIndex', () => {
  it('is the whole index for no query, grouped by kind in the order it lists them', () => {
    const groups = searchIndex(all, '')
    expect(groups.map((group) => group.kind)).toEqual([...INDEX_KINDS])
    expect(groups.flatMap((group) => group.entries)).toHaveLength(all.length)
  })

  it('finds by a title, a line or another name, in either case, and drops the empty groups', () => {
    expect(searchIndex(all, 'QUALITY M7').map((group) => group.kind)).toEqual(['chords'])
    expect(searchIndex(all, 'c−7')[0]?.entries.map((entry) => entry.title)).toEqual(['quality m7'])
    expect(searchIndex(all, 'asks gaps')[0]?.entries.map((entry) => entry.title)).toEqual([
      'trainer gaps',
    ])
  })

  it('finds a lesson by its title in the other language', () => {
    const triads = LESSONS.find((lesson) => lesson.id === 'triads')
    const found = searchIndex(all, triads!.title.ru).flatMap((group) => group.entries)
    expect(found.map((entry) => entry.id)).toContain('lessons:triads')
  })

  it('ranks a group: the title itself, one starting with it, a word of it, then anywhere', () => {
    const entry = (kind: IndexEntry['kind'], title: string, words: string[] = []): IndexEntry => ({
      id: `${kind}:${title}`,
      kind,
      title,
      words,
      target: { opens: 'lesson', lesson: title },
    })
    const entries = [
      entry('lessons', 'Arc'),
      entry('lessons', 'Some lines', ['an arc in them']),
      entry('lessons', 'The arch'),
      entry('lessons', 'Arcs and lines'),
      entry('lessons', 'Arc'.padEnd(3)),
      entry('songs', 'Marc'),
    ]
    const [first, second] = searchIndex(entries, 'arc')
    expect(first?.entries.map((each) => each.title)).toEqual([
      'Arc',
      'Arc',
      'Arcs and lines',
      'The arch',
      'Some lines',
    ])
    // The group with the closer match leads: a word of a title beats a part of a word.
    expect([first?.kind, second?.kind]).toEqual(['lessons', 'songs'])
    expect(searchIndex([entry('songs', 'Marc'), entry('lessons', 'Arc')], 'arc')[0]?.kind).toBe(
      'lessons',
    )
  })

  it('finds nothing for what no entry answers to', () => {
    expect(searchIndex(all, 'zzzz no such thing')).toEqual([])
  })

  it('leads with the chord a typed symbol names, its group first', () => {
    const typed = typedEntry('F#m7b5', names)
    expect(typed).toMatchObject({
      kind: 'chords',
      title: 'F#m7♭5',
      detail: 'quality hd',
      target: { opens: 'chord', quality: 'hd' },
    })
    const groups = searchIndex(all, 'F#m7b5', typed)
    expect(groups[0]?.kind).toBe('chords')
    expect(groups[0]?.entries[0]).toBe(typed)
  })

  it('reads a line of chords typed as a song’s, on Progressions in the key it is in, its group first', () => {
    const typed = typedEntry('Dm7, Gm9 | Asus Dm7', names)
    expect(typed).toMatchObject({
      kind: 'progressions',
      title: 'Dm7 Gm9 Asus4 Dm7',
      detail: 'page progressions · key Dm',
      target: { opens: 'typed-line', key: 'Dm', p: 'i7-iv9-Vsus4-i7' },
    })
    const groups = searchIndex(all, 'Dm7, Gm9 | Asus Dm7', typed)
    expect(groups[0]?.kind).toBe('progressions')
    expect(groups[0]?.entries[0]).toBe(typed)
  })

  it('reads no chord from a word, and adds none the index already opens', () => {
    expect(typedEntry('blues', names)).toBeUndefined()
    expect(typedEntry('Amazing Grace', names)).toBeUndefined()
    expect(typedEntry('', names)).toBeUndefined()
    // C7 is the dominant 7th the index shows on C: one row, not two.
    expect(typedEntry('C7', names)).toBeUndefined()
  })
})
