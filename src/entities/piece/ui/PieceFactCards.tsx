import { Clock, KeyRound, Metronome } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { keySymbol, printedSymbol, type Key } from '@/shared/lib/music'
import { FactCard } from '@/shared/ui'
import { pieceKey, type Piece } from '../model/types'

/**
 * A piece's facts as cards, three across (ADR 0100), on its song's page and in the Player's Song
 * information (ADR 0099): its key, time and tempo. The key is the one it is played in, where the
 * Player's Setup has moved it (`played`), else its own. A fact more after them (`children`: Song
 * information's tuning, ADR 0107) makes four, two by two on a phone held upright.
 */
export function PieceFactCards({
  piece,
  played,
  children,
}: {
  piece: Piece
  played?: Key
  children?: ReactNode
}) {
  const { t } = useTranslation(['piece', 'music'])
  return (
    <dl className={cn('grid gap-2', children ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3')}>
      <FactCard icon={KeyRound} name={t('music:key.label')}>
        {/* The key is written as a chord is, in the serif and as the sheet prints it (`C♯m`); the
            time and tempo are numbers. */}
        <span className="font-display">{printedSymbol(keySymbol(played ?? pieceKey(piece)))}</span>
      </FactCard>
      <FactCard icon={Clock} name={t('time')}>
        {piece.meter}
      </FactCard>
      <FactCard icon={Metronome} name={t('tempo')}>
        {t('music:bpm', { tempo: piece.tempo })}
      </FactCard>
      {children}
    </dl>
  )
}
