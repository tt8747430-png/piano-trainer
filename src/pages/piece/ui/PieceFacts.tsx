import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Credits, entryTitles, pieceKey, shelfOf, SourceLine, type Entry } from '@/entities/piece'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { keyName, keyScale, noteParam } from '@/shared/lib/music'
import { BackButton, ButtonLink, ScreenHeader } from '@/shared/ui'

/** Where Back leads from an entry opened directly: its shelf. */
const SHELF_PAGE = { songs: '/songs', practice: '/practice' } as const

/**
 * A song's or listing's title, credits, source, key and meter, note, and a way to its key's scale.
 * Back returns where the learner came from (Path, Songs, Practice), or to the entry's shelf.
 */
export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const scaleName = useScaleName()
  const { primary, secondary } = entryTitles(entry, locale)
  const key = pieceKey(entry)
  const scaleKind = keyScale(key)
  return (
    <div className="flex flex-col gap-3">
      <ScreenHeader
        title={primary}
        back={<BackButton fallback={{ to: SHELF_PAGE[shelfOf(entry.kind)] }} />}
      />
      {secondary ? <p className="-mt-3 text-lg text-muted-foreground">{secondary}</p> : null}
      {entry.credits ? <Credits credits={entry.credits} /> : null}
      {entry.source ? <SourceLine source={entry.source} /> : null}
      <dl className="flex flex-wrap gap-2">
        <div className="rounded-lg border border-border bg-card px-3 py-1">
          <dt className="sr-only">{t('key')}</dt>
          <dd className="font-semibold">{keyName(key)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-1">
          <dt className="sr-only">{t('meter')}</dt>
          <dd className="font-semibold">{entry.meter}</dd>
        </div>
      </dl>
      {entry.note ? <p className="max-w-prose text-lg">{localText(entry.note, locale)}</p> : null}
      <ButtonLink
        variant="link"
        className="self-start px-0"
        render={
          <Link to="/learn/scales" search={{ root: noteParam(key.tonic), kind: scaleKind }} />
        }
      >
        {t('scaleOf', { scale: scaleName(key.tonic, scaleKind) })}
      </ButtonLink>
    </div>
  )
}
