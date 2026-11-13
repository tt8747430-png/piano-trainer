import { useTranslation } from 'react-i18next'
import {
  Credits,
  entryTitles,
  selectHasVersion,
  SourceLine,
  usePieces,
  type Piece,
  shownCredits,
} from '@/entities/piece'
import { useLocale } from '@/shared/i18n'

/**
 * Under a song's title, as a byline (ADR 0111): what else it is called and Your version where the
 * learner has one, then who wrote it and where it is in its book: the one place its credits are read
 * (its Details edit them, where the learner may). Its level, genre and language are its Details'.
 */
export function PieceByline({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const { secondary } = entryTitles(piece, locale)
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const lead = Boolean(secondary) || hasVersion
  if (!lead && !piece.credits && !piece.source) return null
  return (
    <div className="-mt-3 flex flex-col gap-1.5 text-muted-foreground">
      {lead ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
          {secondary ? <p>{secondary}</p> : null}
          {hasVersion ? (
            <dl>
              <dt className="sr-only">{t('music')}</dt>
              <dd className="rounded-pill bg-paint-yellow px-2.5 py-0.5 text-sm font-medium text-on-paint-yellow">
                {t('yourVersion')}
              </dd>
            </dl>
          ) : null}
        </div>
      ) : null}
      {shownCredits(piece).length > 0 ? <Credits credits={shownCredits(piece)} /> : null}
      {piece.source ? <SourceLine source={piece.source} /> : null}
    </div>
  )
}
