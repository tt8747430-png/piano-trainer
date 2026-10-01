import { describe, expect, it } from 'vitest'
import { note, noteName } from '@/shared/lib/music'
import { walkHeadings } from './walk-headings'

describe('walkHeadings', () => {
  it('names each key the walk visits, home at both ends', () => {
    const name = (key: { tonic: Parameters<typeof noteName>[0]; minor: boolean }) =>
      noteName(key.tonic) + (key.minor ? ' minor' : ' major')
    expect(walkHeadings({ tonic: note('A'), minor: true }, 'tones-down', name)).toEqual([
      'A minor',
      'G minor',
      'F minor',
      'E♭ minor',
      'C# minor',
      'B minor',
      'A minor',
    ])
  })
})
