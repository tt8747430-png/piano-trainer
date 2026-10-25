import { Clock, KeyRound, Metronome } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pieceKey, type Piece } from '@/entities/piece'
import { keySymbol } from '@/shared/lib/music'
import { FactCard } from '@/shared/ui'

/** A song's facts as cards, three across (spec §3.1): its key, time and tempo. */
export function PieceFactCards({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'music'])
  return (
    <dl className="grid grid-cols-3 gap-2">
      <FactCard icon={KeyRound} name={t('music:key.label')}>
        {/* The key names a chord, in the serif; the time and tempo are numbers. */}
        <span className="font-display">{keySymbol(pieceKey(piece))}</span>
      </FactCard>
      <FactCard icon={Clock} name={t('time')}>
        {piece.meter}
      </FactCard>
      <FactCard icon={Metronome} name={t('tempo')}>
        {t('music:bpm', { tempo: piece.tempo })}
      </FactCard>
    </dl>
  )
}
