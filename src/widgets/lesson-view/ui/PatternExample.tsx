import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS, type PatternId } from '@/entities/pattern'
import { entryTitles, type Piece } from '@/entities/piece'

import { localText, useLocale } from '@/shared/i18n'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, PlayButton, type ShownKeys } from '@/shared/ui'
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
  const { t } = useTranslation(['learn', 'music'])
  const locale = useLocale()
  const titleId = useId()
  const playback = usePlayback<'opening'>()
  const { name, description } = BUILT_IN_PATTERNS.require(pattern)
  return (
    <article aria-labelledby={titleId} className="flex flex-col gap-3 card p-4">
      <h3 id={titleId} className="text-xl">
        {localText(name, locale)}
      </h3>
      {description ? <p className="text-base">{localText(description, locale)}</p> : null}
      <p className="text-sm text-muted-foreground">
        {t('learn:example.over', { piece: entryTitles(piece, locale).primary })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <PlayButton
          label={t('music:play')}
          playing={playback.playing === 'opening'}
          onClick={() =>
            // Arranged when Play starts, never on the page or for a Stop: a lesson shows many
            // patterns and plays few.
            playback.toggle('opening', () => {
              const opening = patternOpening(piece, pattern)
              onShow(opening.shown)
              return opening.sounds
            })
          }
        />
        <ButtonLink
          variant="outline"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} search={{ pattern }} />}
        >
          {t('learn:example.openInPlayer')}
        </ButtonLink>
      </div>
    </article>
  )
}
