import { afterEach, describe, expect, it } from 'vitest'
import { keepContent } from '@/shared/api/content'
import { PROGRESSION_LIBRARY } from '../content/library'
import { libraryByStyle, libraryProgression, progressionById } from './selectors'
import { readsAsProgression } from './types'

afterEach(() => keepContent([]))

const made = {
  id: 'made-vamp',
  style: 'gospel',
  major: 'I IV',
  name: { en: 'Made vamp', ru: 'Новый вамп' },
  character: { en: 'Rocking', ru: 'Качает' },
}
const keep = (body: unknown, id = 'made-vamp') =>
  keepContent([{ kind: 'progression', id, version: 'v1', body }])

describe('the progressions over the kept content (content as data)', () => {
  it('adds a progression an editor made at its style’s end, found by id and by its line', () => {
    keep(made)
    expect(progressionById('made-vamp')).toEqual(made)
    expect(
      libraryByStyle()
        .find(({ style }) => style === 'gospel')
        ?.progressions.at(-1),
    ).toEqual(made)
    expect(libraryProgression('I-IV', false)?.id).toBe('made-vamp')
  })

  it('reads the database’s newer copy of one of the app’s in its place', () => {
    const own = PROGRESSION_LIBRARY[0]
    if (!own) throw new Error('there are progressions')
    const newer = { ...own, character: { en: 'Said anew', ru: 'Сказано заново' } }
    keep(newer, own.id)
    expect(progressionById(own.id)).toEqual(newer)
  })

  it('reads as a progression only with a style, a name, a character and a line that reads', () => {
    expect(readsAsProgression('made-vamp', made)).toBe(true)
    for (const body of [
      { ...made, style: 'polka' },
      { ...made, major: 'I XYZ' },
      { ...made, major: undefined },
      { ...made, name: 'flat' },
      { ...made, id: 'other' },
    ])
      expect(readsAsProgression('made-vamp', body)).toBe(false)
  })
})
