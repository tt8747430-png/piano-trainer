import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Credits,
  entryTitles,
  pieceKey,
  selectHasVersion,
  SourceLine,
  usePieces,
  type Entry,
} from '@/entities/piece'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { keySymbol, keyScale, noteParam } from '@/shared/lib/music'
import { ButtonLink } from '@/shared/ui'

/**
 * A song's or listing's facts under its bar (`PieceHeader`): its second title, credits, source, key
 * and meter (and Your version, where the learner has one), note, and a way to its key's scale.
 */
export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const scaleName = useScaleName()
  const { secondary } = entryTitles(entry, locale)
  const key = pieceKey(entry)
  const scaleKind = keyScale(key)
  const hasVersion = usePieces((state) => selectHasVersion(state, entry.id))
  return (
    <div className="flex flex-col gap-3">
      {secondary ? <p className="text-lg text-muted-foreground">{secondary}</p> : null}
      {entry.credits ? <Credits credits={entry.credits} /> : null}
      {entry.source ? <SourceLine source={entry.source} /> : null}
      <dl className="flex flex-wrap gap-2">
        <div className="rounded-lg border border-border bg-card px-3 py-1">
          <dt className="sr-only">{t('key')}</dt>
          <dd className="font-semibold">{keySymbol(key)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-1">
          <dt className="sr-only">{t('meter')}</dt>
          <dd className="font-semibold">{entry.meter}</dd>
        </div>
        {hasVersion ? (
          <div className="rounded-lg border border-border bg-card px-3 py-1">
            <dt className="sr-only">{t('music')}</dt>
            <dd className="font-semibold">{t('yourVersion')}</dd>
          </div>
        ) : null}
      </dl>
      {entry.note ? <p className="max-w-prose text-lg">{localText(entry.note, locale)}</p> : null}
      <ButtonLink
        variant="link"
        className="self-start px-0"
        render={
          <Link to="/practice/scales" search={{ root: noteParam(key.tonic), kind: scaleKind }} />
        }
      >
        {t('scaleOf', { scale: scaleName(key.tonic, scaleKind) })}
      </ButtonLink>
    </div>
  )
}
