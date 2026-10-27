import { Link } from '@tanstack/react-router'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { libraryLine, libraryParam, progressionsOf } from '@/entities/progression-library'
import { localText, useLocale } from '@/shared/i18n'
import { keyParam } from '@/shared/lib/music'

/**
 * The library's progressions a song uses (ADR 0112), one quiet line under its chords: each a chip by
 * its name and numerals, opening it on Progressions in the key the song uses it in. None where it
 * uses none.
 */
export function PieceProgressions({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const id = useId()
  const used = useMemo(() => progressionsOf(piece), [piece])
  if (used.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span id={id} className="text-sm text-muted-foreground">
        {t('progressions')}
      </span>
      <ul aria-labelledby={id} className="flex flex-wrap gap-2">
        {used.map(({ progression, key }) => (
          <li key={progression.id}>
            <Link
              to="/practice/progressions"
              search={{
                key: keyParam(key),
                p: libraryParam(progression, key.minor),
                ...(progression.size ? { size: progression.size } : {}),
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-out hover:bg-muted"
            >
              {localText(progression.name, locale)}
              <span className="font-display font-medium text-muted-foreground">
                {libraryLine(progression, key.minor)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
