import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Credits, entryTitles, PieceFactCards, type Piece } from '@/entities/piece'
import { chordSummary } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { MenuSection, Sheet, SheetContent } from '@/shared/ui'
import { ChordSummary } from '@/widgets/chord-diagrams'

/**
 * A piece's Song information (ADR 0099, Chordify's), from the Player's More: its chords as the
 * Player plays them now, each opening its sheet (none for music of no chord symbol); its key as
 * played, its time and tempo, the song page's cards; then its second title and who wrote it, where
 * it has them.
 */
export function SongInfo({
  piece,
  performance,
  open,
  onOpenChange,
}: {
  piece: Piece
  performance: Performance
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const locale = useLocale()
  const chords = useMemo(() => chordSummary(performance), [performance])
  const { secondary } = entryTitles(piece, locale)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t(`player:info.${piece.kind}`)}>
        <div className="flex flex-col gap-5">
          {chords.length > 0 ? (
            <MenuSection title={t('music:chordSummary')}>
              <ChordSummary chords={chords} />
            </MenuSection>
          ) : null}
          <PieceFactCards piece={piece} played={performance.key} />
          {secondary || piece.credits ? (
            <div className="flex flex-col gap-1.5 text-muted-foreground">
              {secondary ? <p className="text-lg">{secondary}</p> : null}
              {piece.credits ? <Credits credits={piece.credits} /> : null}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
