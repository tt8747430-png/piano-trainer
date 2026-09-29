import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PATTERNS, type PatternId } from '@/entities/pattern'
import { entryTitles, type Piece } from '@/entities/piece'
import type { ShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, PlayLabel } from '@/shared/ui'
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
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const titleId = useId()
  const playback = usePlayback<'opening'>()
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
        {t('example.over', { piece: entryTitles(piece, locale).primary })}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="soft"
          onClick={() => {
            // Arranged on the tap, not on the page: a lesson shows many patterns and plays few.
            const opening = patternOpening(piece, pattern)
            onShow(opening.shown)
            playback.toggle('opening', opening.sounds)
          }}
        >
          <PlayLabel playing={playback.playing === 'opening'}>{t('example.play')}</PlayLabel>
        </Button>
        <ButtonLink
          variant="outline"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} search={{ pattern }} />}
        >
          {t('example.openInPlayer')}
        </ButtonLink>
      </div>
    </article>
  )
}
