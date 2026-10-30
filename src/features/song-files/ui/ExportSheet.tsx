import { FileCode, FileMusic, Link2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { entryTitles, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { RowButton, Sheet, SheetContent } from '@/shared/ui'
import { useSongExport } from './use-song-export'

/** The ways out: a file the learner keeps, or a link. */
type Format = 'musicXml' | 'midi' | 'share'

/**
 * Export… (ADR 0107), one menu of a song's ways out, as a song's page and its library row open it
 * (Noji's Export deck, MuseScore's Export): MusicXML, the score for a notation app; MIDI, the music
 * as played; and Share link where the screen shares (`share`): each a row with a line of what it is
 * for. A row chosen does its work and closes the sheet. Nothing to export (`piece` null), it is shut.
 */
export function ExportSheet({
  piece,
  onOpenChange,
  share,
}: {
  piece: Piece | null
  onOpenChange: (open: boolean) => void
  /** The song's link, shared as its screen shares it; what the row says of it. */
  share?: { readonly detail: string; readonly onSelect: () => void } | undefined
}) {
  return (
    <Sheet open={piece !== null} onOpenChange={onOpenChange}>
      {piece ? <ExportRows piece={piece} share={share} onDone={() => onOpenChange(false)} /> : null}
    </Sheet>
  )
}

function ExportRows({
  piece,
  share,
  onDone,
}: {
  piece: Piece
  share: { readonly detail: string; readonly onSelect: () => void } | undefined
  onDone: () => void
}) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const files = useSongExport(piece)
  const run = (format: Format) => {
    onDone()
    if (format === 'share') share?.onSelect()
    else files[format]()
  }
  return (
    <SheetContent title={t('export.title')} description={entryTitles(piece, locale).primary}>
      <ul aria-label={t('export.title')} className="flex flex-col gap-1">
        <li>
          <RowButton
            title={t('export.musicXml')}
            detail={t('export.musicXmlLine')}
            icon={FileCode}
            paint="sky"
            onClick={() => run('musicXml')}
          />
        </li>
        <li>
          <RowButton
            title={t('export.midi')}
            detail={t('export.midiLine')}
            icon={FileMusic}
            paint="lilac"
            onClick={() => run('midi')}
          />
        </li>
        {share ? (
          <li>
            <RowButton
              title={t('export.share')}
              detail={share.detail}
              icon={Link2}
              paint="grass"
              onClick={() => run('share')}
            />
          </li>
        ) : null}
      </ul>
    </SheetContent>
  )
}
