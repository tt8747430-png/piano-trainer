import type { PieceMusic } from '@/entities/piece'
import { barsOf, readDraft } from '@/features/score-editor'
import { scoreToMusicXml } from '@/shared/lib/musicxml'
import { notate } from '@/shared/lib/notation'
import { songFileData, writeSongFileData } from './app-data'
import { draftMusic } from './draft-music'

/** What a song's file says besides its music, in the learner's language. */
export interface SongFileNames {
  readonly title: string
  readonly composer?: string
  readonly lyricist?: string
  /** Each section's heading, as the score prints it. */
  readonly headings: readonly string[]
  /** Each single staff's own name, top down; none where it has none. */
  readonly staffNames: readonly (string | undefined)[]
  /** The piano's name, the instrument's. */
  readonly piano: string
}

/** The software a song's file names as its maker. */
const SOFTWARE = 'Piano Trainer'

/**
 * A song's music as MusicXML 4.0 (ADR 0107): as written, every bar of every staff (a lead sheet's
 * piano kept, not printed), its chord symbols, words, fingers and marks; each section's heading a
 * rehearsal mark and each of its lines a system; what only the app reads (its pattern, its sections,
 * its method codes) kept in the file's identification.
 */
export function musicXmlOf(music: PieceMusic, names: SongFileNames): string {
  const draft = readDraft(music)
  const placed = barsOf(draft)
  const firstBar = (section: number) => placed.findIndex((bar) => bar.section === section)
  const lineStarts = placed
    .filter(
      (bar, index) =>
        index > 0 &&
        (bar.line !== placed[index - 1]?.line || bar.section !== placed[index - 1]?.section),
    )
    .map((bar) => bar.index)
  return scoreToMusicXml(notate(draftMusic(draft)), {
    title: names.title,
    ...(names.composer ? { composer: names.composer } : {}),
    ...(names.lyricist ? { lyricist: names.lyricist } : {}),
    staffNames: names.staffNames,
    pianoName: names.piano,
    pianoHidden: draft.leadSheet,
    // A song of one section prints no heading.
    headings: (draft.sections.length < 2 ? [] : draft.sections)
      .map((_, section) => ({
        measure: firstBar(section),
        text: names.headings[section] ?? '',
      }))
      .filter((heading) => heading.text !== '' && heading.measure >= 0),
    lineStarts,
    appData: writeSongFileData(songFileData(draft)),
    software: SOFTWARE,
  })
}
