import { Clock, KeyRound, Metronome } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { StageMark } from '@/entities/step'
import { entryTitles, pieceKey, selectHasVersion, usePieces, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { keySymbol } from '@/shared/lib/music'
import { FactCard } from '@/shared/ui'

/**
 * A song's facts as cards, three across (spec §3.1): its key, time and tempo; then, in one quiet
 * line, its second title, Your version where the learner has one, and its stage's mark.
 */
export function PieceFactCards({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'music'])
  const locale = useLocale()
  const { secondary } = entryTitles(piece, locale)
  const stage = pieceStage(piece.id)
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  return (
    <div className="flex flex-col gap-3">
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
      {secondary || hasVersion || stage ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg text-muted-foreground">
          {secondary ? <p>{secondary}</p> : null}
          {hasVersion ? (
            <dl>
              <dt className="sr-only">{t('music')}</dt>
              <dd className="rounded-full bg-paint-yellow px-2.5 py-0.5 text-sm font-medium text-on-paint-yellow">
                {t('yourVersion')}
              </dd>
            </dl>
          ) : null}
          {stage ? <StageMark stage={stage} /> : null}
        </div>
      ) : null}
    </div>
  )
}
