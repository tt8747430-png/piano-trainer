import { FileArchive, FileCode, FileMusic, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { RowButton, Sheet, SheetContent, type Paint } from '@/shared/ui'
import { useSongExport } from './use-song-export'
import type { MusicXmlFormat } from '../model/export-music-xml'

/**
 * The ways out of a piece of music: its score as MusicXML (a piece's alone), its music as played as
 * MIDI, timed to its recording where one plays along. Its link is the screen's own Share link, never
 * a row here (R31-S): one way to each action.
 */
export type ExportFiles = {
  readonly musicXml?: ((format?: MusicXmlFormat) => void) | undefined
  readonly midi: () => void
  readonly midiAligned?: (() => void) | undefined
}

type Row = {
  key: string
  title: string
  icon: LucideIcon
  paint: Paint
  onSelect: () => void
}

/**
 * Export… (ADR 0107), one sheet of the music's ways out, as every screen opens it (a song's page, its
 * library row, the Player's and the editor's More; Noji's Export deck, MuseScore's Export): each a
 * row named for its file. A row chosen does its work and closes the sheet. `subject`, the
 * name under the title, null while it is shut.
 */
export function ExportSheet({
  subject,
  files,
  onOpenChange,
}: {
  subject: string | null
  files: ExportFiles
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const rows: Row[] = [
    ...(files.musicXml
      ? [
          {
            key: 'musicXml',
            title: t('export.musicXml'),
            icon: FileCode,
            paint: 'sky' as const,
            onSelect: () => files.musicXml?.('musicxml'),
          },
          {
            key: 'mxl',
            title: t('export.mxl'),
            icon: FileArchive,
            paint: 'sky' as const,
            onSelect: () => files.musicXml?.('mxl'),
          },
        ]
      : []),
    {
      key: 'midi',
      title: t('export.midi'),
      icon: FileMusic,
      paint: 'lilac',
      onSelect: files.midi,
    },
    ...(files.midiAligned
      ? [
          {
            key: 'midiAligned',
            title: t('export.midiAligned'),
            icon: FileMusic,
            paint: 'lilac' as const,
            onSelect: files.midiAligned,
          },
        ]
      : []),
  ]
  return (
    <Sheet open={subject !== null} onOpenChange={onOpenChange}>
      {subject !== null ? (
        <SheetContent title={t('export.title')} description={subject}>
          <ul aria-label={t('export.title')} className="flex flex-col gap-1">
            {rows.map((row) => (
              <li key={row.key}>
                <RowButton
                  title={row.title}
                  icon={row.icon}
                  paint={row.paint}
                  onClick={() => {
                    onOpenChange(false)
                    row.onSelect()
                  }}
                />
              </li>
            ))}
          </ul>
        </SheetContent>
      ) : null}
    </Sheet>
  )
}

/**
 * Export… for a song of the library: its own files, under its title (`piece` null: shut). The last
 * song stays behind the sheet while it closes, so it slides away as it came.
 */
export function SongExportSheet({
  piece,
  onOpenChange,
}: {
  piece: Piece | null
  onOpenChange: (open: boolean) => void
}) {
  const [last, setLast] = useState(piece)
  if (piece && piece !== last) setLast(piece)
  const shown = piece ?? last
  return shown ? (
    <SongExport piece={shown} open={piece !== null} onOpenChange={onOpenChange} />
  ) : null
}

function SongExport({
  piece,
  open,
  onOpenChange,
}: {
  piece: Piece
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const locale = useLocale()
  const files = useSongExport(piece)
  return (
    <ExportSheet
      subject={open ? entryTitles(piece, locale).primary : null}
      files={files}
      onOpenChange={onOpenChange}
    />
  )
}
