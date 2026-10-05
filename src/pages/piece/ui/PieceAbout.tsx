import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Credits, pieceKey, SourceLine, type Entry } from '@/entities/piece'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { keyScale, noteParam } from '@/shared/lib/music'
import { ButtonLink } from '@/shared/ui'

/**
 * What is printed about a song or listing, under its music: its note, who wrote it, where it is in
 * its book, and the way to its key's scale.
 */
export function PieceAbout({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const scaleName = useScaleName()
  const key = pieceKey(entry)
  const scaleKind = keyScale(key)
  return (
    <div className="flex flex-col gap-3">
      {entry.note ? <p className="max-w-prose text-lg">{localText(entry.note, locale)}</p> : null}
      {entry.credits ? <Credits credits={entry.credits} /> : null}
      {entry.source ? <SourceLine source={entry.source} /> : null}
      <ButtonLink
        variant="link"
        className="self-start px-0"
        render={
          <Link
            to="/practice/scales"
            search={{ root: noteParam(key.tonic), kind: scaleKind, show: 'key' }}
          />
        }
      >
        {t('scaleOf', { scale: scaleName(key.tonic, scaleKind) })}
      </ButtonLink>
    </div>
  )
}
