import { FileCode, FileMusic, Link2, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { RowButton, Sheet, SheetContent, type Paint } from '@/shared/ui'
import { useSongExport } from './use-song-export'

/** What the screen shares, as its own Share does it, and what the row says of it. */
export type ExportShare = { readonly detail: string; readonly onSelect: () => void }

/**
 * The ways out of a piece of music: its score as MusicXML (a piece's alone), its music as played as
 * MIDI, timed to its recording where one plays along, and its link where the screen shares.
 */
export type ExportFiles = {
  readonly musicXml?: (() => void) | undefined
  readonly midi: () => void
  readonly midiAligned?: (() => void) | undefined
  readonly share?: ExportShare | undefined
}

type Row = {
  key: string
  title: string
  detail: string
  icon: LucideIcon
  paint: Paint
  onSelect: () => void
}

/**
 * Export… (ADR 0107), one sheet of the music's ways out, as every screen opens it (a song's page, its
 * library row, the Player's and the editor's More; Noji's Export deck, MuseScore's Export): each a
 * row with a line of what it is for. A row chosen does its work and closes the sheet. `subject`, the
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
            detail: t('export.musicXmlLine'),
            icon: FileCode,
            paint: 'sky' as const,
            onSelect: files.musicXml,
          },
        ]
      : []),
    {
      key: 'midi',
      title: t('export.midi'),
      detail: t(files.midiAligned ? 'export.midiFixedLine' : 'export.midiLine'),
      icon: FileMusic,
      paint: 'lilac',
      onSelect: files.midi,
    },
    ...(files.midiAligned
      ? [
          {
            key: 'midiAligned',
            title: t('export.midiAligned'),
            detail: t('export.midiAlignedLine'),
            icon: FileMusic,
            paint: 'lilac' as const,
            onSelect: files.midiAligned,
          },
        ]
      : []),
    ...(files.share
      ? [
          {
            key: 'share',
            title: t('export.share'),
            detail: files.share.detail,
            icon: Link2,
            paint: 'grass' as const,
            onSelect: files.share.onSelect,
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
                  detail={row.detail}
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
  share,
}: {
  piece: Piece | null
  onOpenChange: (open: boolean) => void
  share?: ExportShare | undefined
}) {
  const [last, setLast] = useState(piece)
  if (piece && piece !== last) setLast(piece)
  const shown = piece ?? last
  return shown ? (
    <SongExport piece={shown} open={piece !== null} share={share} onOpenChange={onOpenChange} />
  ) : null
}

function SongExport({
  piece,
  open,
  share,
  onOpenChange,
}: {
  piece: Piece
  open: boolean
  share: ExportShare | undefined
  onOpenChange: (open: boolean) => void
}) {
  const locale = useLocale()
  const files = useSongExport(piece)
  return (
    <ExportSheet
      subject={open ? entryTitles(piece, locale).primary : null}
      files={{ ...files, share }}
      onOpenChange={onOpenChange}
    />
  )
}
