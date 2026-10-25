import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { StageMark } from '@/entities/step'
import {
  Credits,
  entryTitles,
  selectHasVersion,
  SourceLine,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { useLocale } from '@/shared/i18n'

/**
 * Under a song's title, as a byline (ADR 0100): what else it is called and Your version where the
 * learner has one, then who wrote it and where it is in its book; its stage's mark ends the first
 * line, or begins its book's line where nothing comes before.
 */
export function PieceByline({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const { secondary } = entryTitles(piece, locale)
  const stage = pieceStage(piece.id)
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const mark = stage ? <StageMark stage={stage} /> : null
  const lead = Boolean(secondary) || hasVersion
  if (!lead && !mark && !piece.credits && !piece.source) return null
  return (
    <div className="-mt-3 flex flex-col gap-1.5 text-muted-foreground">
      {lead ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
          {secondary ? <p>{secondary}</p> : null}
          {hasVersion ? (
            <dl>
              <dt className="sr-only">{t('music')}</dt>
              <dd className="rounded-full bg-paint-yellow px-2.5 py-0.5 text-sm font-medium text-on-paint-yellow">
                {t('yourVersion')}
              </dd>
            </dl>
          ) : null}
          {mark}
        </div>
      ) : null}
      {piece.credits ? <Credits credits={piece.credits} /> : null}
      {piece.source || (!lead && mark) ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {lead ? null : mark}
          {piece.source ? <SourceLine source={piece.source} /> : null}
        </div>
      ) : null}
    </div>
  )
}
