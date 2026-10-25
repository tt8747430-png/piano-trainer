import { Clock, KeyRound, Metronome } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keySymbol, type Key } from '@/shared/lib/music'
import { FactCard } from '@/shared/ui'
import { pieceKey, type Piece } from '../model/types'

/**
 * A piece's facts as cards, three across (ADR 0100), on its song's page and in the Player's Song
 * information (ADR 0099): its key, time and tempo. The key is the one it is played in, where the
 * Player's Setup has moved it (`played`), else its own.
 */
export function PieceFactCards({ piece, played }: { piece: Piece; played?: Key }) {
  const { t } = useTranslation(['piece', 'music'])
  return (
    <dl className="grid grid-cols-3 gap-2">
      <FactCard icon={KeyRound} name={t('music:key.label')}>
        {/* The key names a chord, in the serif; the time and tempo are numbers. */}
        <span className="font-display">{keySymbol(played ?? pieceKey(piece))}</span>
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
