import { Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { BookPattern } from '@/entities/pattern'
import { cn } from '@/shared/lib'
import { HeartToggle } from '@/shared/ui'
import type { LibraryItem } from '@/widgets/practice-library'
import { LevelBars } from './LevelBars'
import { PatternRoll } from './PatternRoll'

/**
 * A pattern's row on the Pattern sheet (the PlayerApp board's): its two hands' picture, its name and
 * under it its hands (two lines at most), or what the music lacks for it, closed; its level as bars;
 * then Listen, which turns into Stop while it sounds, and its ♡. The one playing is washed in honey,
 * its name heavier.
 */
export function PatternRow({
  item,
  pattern,
  chosen,
  need,
  playing,
  onChoose,
  onListen,
  onFavourite,
}: {
  item: LibraryItem
  pattern: BookPattern
  chosen: boolean
  /** What the music lacks for it, where it cannot play it. */
  need: string | null
  playing: boolean
  onChoose: () => void
  onListen: () => void
  onFavourite: () => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const favourite = t(item.favourite ? 'common:library.unfavourite' : 'common:library.favourite')
  const listen = t(playing ? 'player:patternSheet.stop' : 'player:patternSheet.listen', {
    name: item.name,
  })
  return (
    <div
      className={cn(
        'flex min-h-15 items-center border-t border-hairline pr-0.5 transition-colors duration-200 ease-out',
        chosen ? 'bg-chosen-honey' : 'bg-card has-[>button:first-child:enabled:hover]:bg-muted',
      )}
    >
      <button
        type="button"
        aria-pressed={chosen}
        data-chosen={chosen ? '' : undefined}
        disabled={need !== null}
        onClick={onChoose}
        className="flex min-h-15 min-w-0 flex-1 items-center gap-3 rounded-control py-2 pr-1 pl-3 text-left focus-visible:-outline-offset-3 disabled:text-muted-foreground"
      >
        <PatternRoll pattern={pattern} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={cn('truncate text-[0.9375rem]', chosen ? 'font-bold' : 'font-medium')}>
            {item.name}
          </span>
          <span className="line-clamp-2 text-xs leading-4 text-muted-foreground">
            {need ?? item.extra}
          </span>
        </span>
        {item.stage ? <LevelBars stage={item.stage} /> : null}
      </button>
      <button
        type="button"
        aria-label={listen}
        title={listen}
        onClick={onListen}
        className="grid size-10 shrink-0 place-items-center rounded-pill text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:-outline-offset-3"
      >
        {playing ? (
          <Square aria-hidden strokeWidth={0} className="size-3 fill-current" />
        ) : (
          <Play aria-hidden strokeWidth={0} className="size-3.5 fill-current" />
        )}
      </button>
      <HeartToggle
        pressed={item.favourite}
        label={favourite}
        onToggle={onFavourite}
        className="size-10"
      />
    </div>
  )
}
