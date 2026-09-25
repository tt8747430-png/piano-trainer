import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { levelOf } from '@/entities/path'
import { entryTitles, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { keyName } from '@/shared/lib/music'
import { LevelMark } from '@/shared/ui'

/** A song or listing in the list: its number, titles, key and meter or "no chart yet", level and learned mark. */
export function EntryRow({ entry }: { entry: Entry }) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const { primary, secondary } = entryTitles(entry, locale)
  const learned = useProgress(selectIsLearned(`piece:${entry.id}`))
  const level = entry.kind === 'listing' ? undefined : levelOf(`piece:${entry.id}`)
  return (
    <li>
      <Link
        to="/songs/$pieceId"
        params={{ pieceId: entry.id }}
        className="flex min-h-16 items-center gap-3 rounded-2xl px-1 transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
      >
        <span className="w-7 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
          {entry.source?.number ?? ''}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg font-semibold">{primary}</span>
          {secondary ? (
            <span className="block truncate text-sm text-muted-foreground">{secondary}</span>
          ) : null}
          <span className="block text-sm text-muted-foreground">
            {entry.kind === 'listing'
              ? t('noChart')
              : `${keyName(pieceKey(entry))} · ${entry.meter}`}
          </span>
        </span>
        {level ? <LevelMark level={level} /> : null}
        <span className="grid size-6 shrink-0 place-items-center">
          {learned ? (
            <>
              <Check aria-hidden className="size-5 text-primary" strokeWidth={3} />
              <span className="sr-only">{t('learned')}</span>
            </>
          ) : null}
        </span>
      </Link>
    </li>
  )
}
