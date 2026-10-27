import { useTranslation } from 'react-i18next'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import type { DiagramChord } from '@/features/practice'
import { printedSymbol } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayLabel, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ChordDiagram } from './ChordDiagram'
import { ChordLearning, type ChordLearn } from './ChordLearning'
import { DiagramInversionField } from './DiagramInversionField'

/**
 * A chord's sheet (ADR 0108), opened wherever the chord is shown (a chip, a summary's diagram, the
 * Diagrams view's), as its opener says: its diagram as wide as the sheet allows, under its name;
 * a piece's chord its inversion to choose (ADR 0108), kept for every diagram of it in the piece;
 * then Close and Play, which sounds its keys together and turns into Stop while they sound. With
 * `learn` (a section's page, ADR 0111) the chord is learned there, played on the keys under it.
 */
export function ChordSheet({
  open,
  onOpenChange,
  chord,
  learn,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** As its piece draws it now: the inversion chosen in the sheet shows at once. */
  chord: DiagramChord
  learn?: ChordLearn | undefined
}) {
  const { t } = useTranslation(['music', 'common'])
  const playback = usePlayback<'chord'>()
  // A walk, a progression or an exercise is no piece: its chords keep no inversion.
  const inversions = usePieceInversions()
  const play = () => playback.toggle('chord', () => chordSounds(chord.keys, { arpeggio: false }))
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={t('music:chordSheet.title', { symbol: printedSymbol(chord.symbol) })}
        footer={
          <div className="flex gap-3">
            <Button size="lg" variant="soft" className="flex-1" onClick={() => onOpenChange(false)}>
              {t('common:close')}
            </Button>
            <Button size="lg" className="flex-1" onClick={play}>
              <PlayLabel playing={playback.playing === 'chord'}>{t('music:play')}</PlayLabel>
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-4 pt-2">
          <ChordDiagram chord={chord} className="max-w-md" />
          {inversions ? (
            <div className="w-full max-w-md">
              <DiagramInversionField chord={chord} choose={inversions.choose} />
            </div>
          ) : null}
          {learn ? <ChordLearning key={chord.symbol} chord={chord} {...learn} /> : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
