import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Credits, pieceKey, SourceLine, type Entry } from '@/entities/piece'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { keyScale, noteParam } from '@/shared/lib/music'
import { ButtonLink } from '@/shared/ui'

/** Who wrote a song or listing and where it is in its book: under its facts, as a songbook prints it. */
export function PieceCredits({ entry }: { entry: Entry }) {
  if (!entry.credits && !entry.source) return null
  return (
    <div className="-mt-3 flex flex-col gap-1 text-muted-foreground">
      {entry.credits ? <Credits credits={entry.credits} /> : null}
      {entry.source ? <SourceLine source={entry.source} /> : null}
    </div>
  )
}

/** What is said about a song or listing, under its music: its note, and the way to its key's scale. */
export function PieceAbout({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const scaleName = useScaleName()
  const key = pieceKey(entry)
  const scaleKind = keyScale(key)
  return (
    <div className="flex flex-col gap-3">
      {entry.note ? <p className="max-w-prose text-lg">{localText(entry.note, locale)}</p> : null}
      <ButtonLink
        variant="link"
        // A link is no use on paper.
        className="self-start px-0 print:hidden"
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
