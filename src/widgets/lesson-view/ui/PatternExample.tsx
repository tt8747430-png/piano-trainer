import { Link } from '@tanstack/react-router'
import { Square } from 'lucide-react'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PATTERNS, type PatternId } from '@/entities/pattern'
import { entryTitles, type Piece } from '@/entities/piece'
import type { ShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { patternOpening } from '../model/pattern-example'

/**
 * An accompaniment pattern over the piece its source teaches it on: its name and what it does, Play
 * for the piece's first line with it, and the piece in the Player with it.
 */
export function PatternExample({
  pattern,
  piece,
  onShow,
}: {
  pattern: PatternId
  piece: Piece
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const titleId = useId()
  const playback = usePlayback<'opening'>()
  const opening = useMemo(() => patternOpening(piece, pattern), [piece, pattern])
  const { name, description } = PATTERNS[pattern]
  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4"
    >
      <h3 id={titleId} className="text-xl">
        {localText(name, locale)}
      </h3>
      {description ? <p className="text-base">{localText(description, locale)}</p> : null}
      <p className="text-sm text-muted-foreground">
        {t('learn:example.over', { piece: entryTitles(piece, locale).primary })}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="pill"
          onClick={() => {
            onShow(opening.shown)
            playback.toggle('opening', opening.sounds)
          }}
        >
          {playback.playing === 'opening' ? (
            <>
              <Square data-icon="inline-start" />
              {t('common:stop')}
            </>
          ) : (
            t('learn:example.play')
          )}
        </Button>
        <ButtonLink
          size="pill"
          variant="soft"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} search={{ pattern }} />}
        >
          {t('learn:example.openInPlayer')}
        </ButtonLink>
      </div>
    </article>
  )
}
