import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Credits, pieceKey, SourceLine, type Entry } from '@/entities/piece'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { keyScale, noteParam } from '@/shared/lib/music'
import { ButtonLink, InfoTip } from '@/shared/ui'

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

/**
 * Under a song's facts, in one quiet line: the way to its key's scale, and what is said about it
 * behind an ⓘ (ADR 0100, amended: no paragraph of description on the page).
 */
export function PieceAbout({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const scaleName = useScaleName()
  const key = pieceKey(entry)
  const scaleKind = keyScale(key)
  const kind = entry.kind === 'study' ? 'study' : 'song'
  return (
    <div className="-mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 print:hidden">
      <ButtonLink
        variant="link"
        className="group h-auto min-h-11 gap-1.5 self-start px-0 text-base"
        render={
          <Link
            to="/practice/scales"
            search={{ root: noteParam(key.tonic), kind: scaleKind, show: 'key' }}
          />
        }
      >
        {t('scaleOf', { scale: scaleName(key.tonic, scaleKind) })}
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      </ButtonLink>
      {entry.note ? (
        <span className="flex items-center gap-1 text-muted-foreground">
          {t(`about.${kind}`)}
          <InfoTip name={t(`about.${kind}`)}>
            <p className="max-w-prose text-pretty">{localText(entry.note, locale)}</p>
          </InfoTip>
        </span>
      ) : null}
    </div>
  )
}
