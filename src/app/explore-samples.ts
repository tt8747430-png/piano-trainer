import { createFakePublicLibrary, type PublicLibrary } from '@/shared/api/public-library'

/** A sample's song, as Publish writes it: one verse of its chords, so its page opens and plays. */
const chart = (title: string, key: string, line: string) => ({
  title,
  key,
  meter: '4/4',
  tempo: 90,
  pattern: 'M1',
  sections: [{ kind: 'verse', lines: [line] }],
})

/**
 * Explore's sample songs for a development build (`VITE_EXPLORE_SAMPLES`): published by four named
 * people and one with no public name, in each of the kinds' tags, rated and not, so Explore's feed,
 * its chips, People and a song's page can be looked at without a server.
 */
export const createSamplePublicLibrary = (): PublicLibrary =>
  createFakePublicLibrary({
    items: [
      [
        'amazing-grace',
        'Amazing Grace',
        'John Newton',
        'G',
        'arrangement',
        'Hymn',
        'Maria Ionescu',
        'G C G D',
        [5, 5, 4, 5],
      ],
      [
        'canon-in-d',
        'Canon in D',
        'Pachelbel',
        'D',
        'arrangement',
        'Classical',
        'Daniel Rusu',
        'D A Bm F#m',
        [5, 4, 5],
      ],
      [
        'scarborough-fair',
        'Scarborough Fair',
        'Traditional',
        'Dm',
        'arrangement',
        'Folk',
        'Elena Popa',
        'Dm C Dm',
        [4, 5, 4],
      ],
      [
        'let-it-be',
        'Let It Be',
        'The Beatles',
        'C',
        'arrangement',
        'Pop',
        'Ana Popescu',
        'C G Am F',
        [5, 4, 4, 5, 5],
      ],
      [
        'czerny-599-1',
        'Study in C, Op. 599 No. 1',
        'Czerny',
        'C',
        'original',
        'Study',
        'Daniel Rusu',
        'C G7 C',
        [],
      ],
      [
        'be-thou-my-vision',
        'Be Thou My Vision',
        'Irish hymn',
        'E♭',
        'arrangement',
        'Hymn',
        'Maria Ionescu',
        'Eb Bb Cm Ab',
        [5, 5, 5],
      ],
      [
        'gymnopedie-1',
        'Gymnopédie No. 1',
        'Satie',
        'D',
        'arrangement',
        'Classical',
        'Elena Popa',
        'Gmaj7 Dmaj7',
        [5, 4, 5, 5],
      ],
      [
        'morning-waltz',
        'Morning Waltz',
        'Written by a learner',
        'F',
        'original',
        'Classical',
        '',
        'F C7 F',
        [],
      ],
    ].map(([id, title, composer, key, type, tag, authorName, line, stars]) => ({
      id: `sample-${String(id)}`,
      title: String(title),
      authorName: String(authorName),
      meta: {
        composer: String(composer),
        key: String(key),
        type: type === 'original' ? 'original' : 'arrangement',
        tags: [String(tag)],
      },
      stars: Array.isArray(stars) ? stars : [],
      body: chart(String(title), String(key), String(line)),
    })),
  })
