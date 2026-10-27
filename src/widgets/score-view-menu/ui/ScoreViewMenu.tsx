import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/**
 * Where the menu opens from, and how wide it stands: from the Player's tools row's start, as wide as
 * the row on a phone; from the editor's bar's end, under its eye. A column of its own from a
 * tablet's width either way, where the layout's three segments keep a line each.
 */
const PLACES = {
  tools: { align: 'start', width: 'w-[calc(100vw-2rem)] sm:w-104' },
  bar: { align: 'end', width: 'w-80 max-w-[calc(100vw-2rem)] sm:w-104' },
} as const

/**
 * How the music is shown (ADR 0096, 0114, 0108, Soundslice's view settings and Chordify's): one
 * menu, the Player's and the score editor's, remembered for every piece and opened by each screen's
 * own `trigger`, the Player's tools row's View or the editor's eye. Its parts are the screen's: the
 * Player's views as tiles, the view shown's own (`ViewSection`) and what every view has, each group
 * under its heading and a hairline; the editor's the sheet music's (`SheetViewFields`) and its keys.
 * What the score holds is edited on it, and how it plays is the Setup's: nothing is here twice.
 */
export function ScoreViewMenu({
  trigger,
  from,
  defaultOpen = false,
  children,
}: {
  /** What opens it: the Player's tools row's View, the editor's eye. */
  trigger: ReactElement
  /** Where it opens from: the Player's tools row, or the editor's bar. */
  from: keyof typeof PLACES
  /** Open as the screen opens: a piece's Player, asked each time (ADR 0108). */
  defaultOpen?: boolean
  children: ReactNode
}) {
  const { t } = useTranslation('music')
  const place = PLACES[from]
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        aria-label={t('view.label')}
        align={place.align}
        className={cn(
          'max-h-[80dvh] gap-4 overflow-y-auto overscroll-contain p-4 [&>section+section]:border-t [&>section+section]:border-hairline [&>section+section]:pt-4',
          place.width,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
