import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import {
  entryTitles,
  isDegreePiece,
  musicOf,
  staffNamesOf,
  usePieceHeadingsOf,
  useStaffTitle,
  versionableEntry,
  type ChartPiece,
  type Piece,
} from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import { exportMidi } from '../model/export-midi'
import { exportMusicXml } from '../model/export-music-xml'

type Credit = NonNullable<Piece['credits']>[number]

/** Who a credit names for a role a file keeps: the music's (composer), or the words' (lyricist). */
function creditNames(credits: readonly Credit[] | undefined, roles: readonly string[]) {
  const names = (credits ?? []).flatMap((credit) =>
    credit.role !== 'unknown' && roles.includes(credit.role) ? [credit.names] : [],
  )
  return names.length > 0 ? names.join(', ') : undefined
}

/** A piece as its chart in its key: one written in degrees as the editor writes it (ADR 0115). */
const chartOf = (piece: Piece): ChartPiece =>
  isDegreePiece(piece) ? (versionableEntry(piece.id) as ChartPiece) : piece

/** A song's files: its score as MusicXML, its music as played as MIDI. */
export interface SongFiles {
  readonly musicXml: () => void
  readonly midi: () => void
}

/**
 * A song's files (ADR 0107), as its page's More, the Player's and Select's export them: its music as
 * written as MusicXML, under its title and who wrote it, its sections' headings, its staves' names and
 * the piano's in the learner's language; and its music as played in its own key and pattern as a
 * MIDI file, each part's track named as the screen names it. For any song: several chosen at once.
 */
export function useSongFiles(): (piece: Piece) => SongFiles {
  const { t } = useTranslation(['music', 'common'])
  const locale = useLocale()
  const headingsOf = usePieceHeadingsOf()
  const staffTitle = useStaffTitle()
  return (piece) => {
    const chart = chartOf(piece)
    const title = entryTitles(piece, locale).primary
    const staffNames = staffNamesOf(chart.staves ?? [], locale)
    const composer = creditNames(chart.credits, ['music', 'words-and-music', 'authors'])
    const lyricist = creditNames(chart.credits, ['words', 'russian-text'])
    return {
      musicXml: () =>
        exportMusicXml(musicOf(chart), {
          title,
          ...(composer ? { composer } : {}),
          ...(lyricist ? { lyricist } : {}),
          headings: headingsOf(chart),
          staffNames,
          piano: t('music:sheet.staves.piano'),
        }),
      midi: () =>
        exportMidi({
          performance: arrangePiece(chart, ownChoice(chart), BUILT_IN_PATTERNS),
          title,
          tempo: chart.tempo,
          names: {
            staff: (place) => staffTitle(staffNames[place], place),
            rh: t('common:hands.rh'),
            lh: t('common:hands.lh'),
          },
        }),
    }
  }
}

/** One song's files (`useSongFiles`). */
export const useSongExport = (piece: Piece): SongFiles => useSongFiles()(piece)
