import { Link } from '@tanstack/react-router'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { libraryLine, libraryParam, progressionsOf } from '@/entities/progression-library'
import { localText, useLocale } from '@/shared/i18n'
import { keyParam } from '@/shared/lib/music'
import { GROUPED_LIST, OpensMark } from '@/shared/ui'

/**
 * The library's progressions a song uses (ADR 0112), under its chords in one card (canvas 125): each a
 * row of its name, its numerals and its chevron, opening it on Progressions in the key the song uses it in. None where it
 * uses none.
 */
export function PieceProgressions({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const id = useId()
  const used = useMemo(() => progressionsOf(piece), [piece])
  if (used.length === 0) return null
  return (
    <div className="flex flex-col">
      <span id={id} className="sr-only">
        {t('progressions')}
      </span>
      <ul aria-labelledby={id} className={GROUPED_LIST}>
        {used.map(({ progression, key }) => (
          <li key={progression.id}>
            <Link
              to="/practice/progressions/line"
              search={{
                key: keyParam(key),
                p: libraryParam(progression, key.minor),
                ...(progression.size ? { size: progression.size } : {}),
              }}
              className="flex min-h-12 items-center gap-3 px-4 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
            >
              <span className="min-w-0 flex-1 truncate">{localText(progression.name, locale)}</span>
              <span className="shrink-0 font-display text-muted-foreground">
                {libraryLine(progression, key.minor)}
              </span>
              <OpensMark />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
