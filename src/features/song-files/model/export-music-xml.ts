import type { PieceMusic } from '@/entities/piece'
import { downloadFile } from '@/shared/lib'
import { musicXmlOf, type SongFileNames } from './music-xml-of'

/** MusicXML's own media type (its text form). */
const MUSIC_XML_TYPE = 'application/vnd.recordare.musicxml+xml'
/** What a file system refuses in a name. */
const UNSAFE = /[/\\:*?"<>|]/g

/** A MusicXML file's name: its title, with nothing a file system refuses, as `.musicxml`. */
export const musicXmlFileName = (title: string): string => `${title.replace(UNSAFE, '-')}.musicxml`

/**
 * Saves a song's music as MusicXML 4.0 named for its title (ADR 0107), as the browser saves a
 * download: the music as written, which any notation app opens.
 */
export function exportMusicXml(music: PieceMusic, names: SongFileNames): void {
  downloadFile(
    new TextEncoder().encode(musicXmlOf(music, names)),
    musicXmlFileName(names.title),
    MUSIC_XML_TYPE,
  )
}
