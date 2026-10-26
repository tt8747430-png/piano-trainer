import { AudioWaveform } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Credits, entryTitles, PieceFactCards, type Piece } from '@/entities/piece'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { chordSummary } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { STANDARD_TUNING, tuningOf } from '@/shared/lib/schedule'
import { FactCard, InfoTip, MenuSection, Sheet, SheetContent } from '@/shared/ui'
import { ChordSummary } from '@/widgets/chord-diagrams'

/**
 * A piece's Song information (ADR 0099, Chordify's), from the Player's More: its chords as the
 * Player plays them now, each opening its sheet (none for music of no chord symbol); its key as
 * played, its time and tempo, the song page's cards, and its tuning (ADR 0107: the A its recording
 * is tuned to, A 440 Hz otherwise; an ⓘ says what it means where it is not 440); then its second
 * title and who wrote it, where it has them.
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
  const chosen = usePieceInversions()?.chosen
  const chords = useMemo(() => chordSummary(performance, chosen), [performance, chosen])
  const { secondary } = entryTitles(piece, locale)
  const tuning = tuningOf(piece.recording)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t(`player:info.${piece.kind}`)}>
        <div className="flex flex-col gap-5">
          {chords.length > 0 ? (
            <MenuSection title={t('music:chordSummary')}>
              <ChordSummary chords={chords} />
            </MenuSection>
          ) : null}
          <PieceFactCards piece={piece} played={performance.key}>
            <FactCard icon={AudioWaveform} name={t('player:tuning.label')}>
              <span className="inline-flex items-center gap-1">
                {t('player:tuning.value', { hz: tuning })}
                {tuning === STANDARD_TUNING ? null : (
                  <InfoTip name={t('player:tuning.label')}>
                    {t('player:tuning.about', { hz: tuning })}
                  </InfoTip>
                )}
              </span>
            </FactCard>
          </PieceFactCards>
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
