import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Credits, entryTitles, SourceLine, pieceKey, type Entry } from '@/entities/piece'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { keyName, noteParam } from '@/shared/lib/music'
import { ButtonLink, RoundButton, ScreenHeader } from '@/shared/ui'

/**
 * A song's or listing's title, credits, source, key and meter, note, and a way to its key's scale.
 * Back returns where the learner came from (Path, Songs), or to Songs.
 */
export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation(['piece', 'common'])
  const locale = useLocale()
  const scaleName = useScaleName()
  const navigate = useNavigate()
  const back = useGoBack(() => void navigate({ to: '/songs' }))
  const { primary, secondary } = entryTitles(entry, locale)
  const key = pieceKey(entry)
  const scaleKind = key.mode === 'minor' ? 'natural' : 'major'
  return (
    <div className="flex flex-col gap-3">
      <ScreenHeader
        title={primary}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      {secondary ? <p className="-mt-3 text-lg text-muted-foreground">{secondary}</p> : null}
      {entry.credits ? <Credits credits={entry.credits} /> : null}
      {entry.source ? <SourceLine source={entry.source} /> : null}
      <dl className="flex flex-wrap gap-2">
        <div className="rounded-full bg-muted px-3 py-1.5">
          <dt className="sr-only">{t('piece:key')}</dt>
          <dd className="font-semibold">{keyName(key)}</dd>
        </div>
        <div className="rounded-full bg-muted px-3 py-1.5">
          <dt className="sr-only">{t('piece:meter')}</dt>
          <dd className="font-semibold">{entry.meter}</dd>
        </div>
      </dl>
      {entry.note ? <p className="max-w-prose text-lg">{localText(entry.note, locale)}</p> : null}
      <ButtonLink
        variant="link"
        className="self-start px-0"
        render={
          <Link to="/theory/scales" search={{ root: noteParam(key.tonic), kind: scaleKind }} />
        }
      >
        {t('piece:scaleOf', { scale: scaleName(key.tonic, scaleKind) })}
      </ButtonLink>
    </div>
  )
}
