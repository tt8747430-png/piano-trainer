import type { PieceMusic } from '@/entities/piece'
import { downloadFile } from '@/shared/lib'
import { writeMxl } from '@/shared/lib/musicxml'
import { musicXmlOf, type SongFileNames } from './music-xml-of'

/** MusicXML's own media type (its text form). */
const MUSIC_XML_TYPE = 'application/vnd.recordare.musicxml+xml'
/** Compressed MusicXML's. */
const MXL_TYPE = 'application/vnd.recordare.musicxml'
/** What a file system refuses in a name. */
const UNSAFE = /[/\\:*?"<>|]/g

/** A MusicXML file's name: its title, with nothing a file system refuses, as `.musicxml`. */
export const musicXmlFileName = (title: string, format: MusicXmlFormat = 'musicxml'): string =>
  `${title.replace(UNSAFE, '-')}.${format}`

/** MusicXML as text (.musicxml), or compressed (.mxl, R29 A29) as most notation apps save it. */
export type MusicXmlFormat = 'musicxml' | 'mxl'

/**
 * Saves a song's music as MusicXML 4.0 named for its title (ADR 0107), as the browser saves a
 * download: the music as written, which any notation app opens.
 */
export function exportMusicXml(
  music: PieceMusic,
  names: SongFileNames,
  format: MusicXmlFormat = 'musicxml',
): void {
  const xml = musicXmlOf(music, names)
  downloadFile(
    format === 'mxl' ? writeMxl(xml) : new TextEncoder().encode(xml),
    musicXmlFileName(names.title, format),
    format === 'mxl' ? MXL_TYPE : MUSIC_XML_TYPE,
  )
}
