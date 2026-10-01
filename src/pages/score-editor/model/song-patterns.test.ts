import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { songPatterns } from './song-patterns'

const draftOf = (melody: string | undefined, pattern: 'r1' | 'r7') =>
  readDraft({
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern,
    sections: [{ kind: 'verse', lines: ['C G'] }],
    ...(melody ? { melody } : {}),
  })
const ids = (groups: ReturnType<typeof songPatterns>) =>
  groups.flatMap((group) => group.options.map((option) => option.value))

describe('songPatterns', () => {
  it('lists the built-in patterns the music can play, by group', () => {
    const groups = songPatterns(draftOf(undefined, 'r1'), 'en')
    expect(groups.map((group) => group.label)).toContain('7 types of accompaniment (Боброва)')
    expect(ids(groups)).toContain('r1')
    expect(ids(groups)).not.toContain('r7')
    expect(ids(songPatterns(draftOf('E4/4', 'r1'), 'en'))).toContain('r7')
  })

  it('keeps the song’s own pattern in the list though its music can no longer play it', () => {
    expect(ids(songPatterns(draftOf(undefined, 'r7'), 'en'))).toContain('r7')
  })
})
