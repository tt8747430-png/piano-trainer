import { useRender } from '@base-ui/react/use-render'
import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { selectMetronome, selectTuner, useSettings } from '@/entities/settings'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { PRACTICE_PAGES, usePageWords, type PracticePageId } from '@/widgets/practice-pages'

/** One tool as a tile: its picture, its name, and what it is set to now or what it does. */
function ToolTile({ page, value }: { page: PracticePageId; value: string }) {
  const words = usePageWords()
  const { title } = words(page)
  const { to, tile } = PRACTICE_PAGES[page]
  const Icon = tile.icon
  return useRender({
    defaultTagName: 'a',
    render: <Link to={to} state={OPEN_PLAINLY} />,
    props: {
      className:
        'flex min-h-26 flex-col gap-2 card p-3 transition-colors duration-200 ease-out hover:border-input',
      children: (
        <>
          <span
            aria-hidden
            className={cn(
              'grid size-10 place-items-center rounded-control',
              PAINT[tile.paint].fill,
              PAINT[tile.paint].ink,
            )}
          >
            <Icon className="size-5" />
          </span>
          <span className="flex flex-col">
            <span className="font-semibold">{title}</span>
            <span className="text-sm text-muted-foreground tabular-nums">{value}</span>
          </span>
        </>
      ),
    },
  })
}

/**
 * Practice's Tools (R32), last and compact as Chordify's Toolkit: a tile each, two across on a phone
 * and four on a laptop, each showing what it is set to now (the Metronome's tempo and meter, the
 * Tuner's A4) or what it does.
 */
export function ToolTiles({ pages }: { pages: readonly PracticePageId[] }) {
  const { t } = useTranslation('practice')
  const words = usePageWords()
  const metronome = useSettings(selectMetronome)
  const { a4 } = useSettings(selectTuner)
  const id = useId()
  const valueOf = (page: PracticePageId): string =>
    page === 'metronome'
      ? t('toolValue.metronome', { bpm: metronome.bpm, meter: metronome.meter })
      : page === 'tuner'
        ? t('toolValue.tuner', { hz: a4 })
        : words(page).about
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('groups.tools')}
      </h2>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {pages.map((page) => (
          <li key={page} className="flex [&>a]:flex-1">
            <ToolTile page={page} value={valueOf(page)} />
          </li>
        ))}
      </ul>
    </section>
  )
}
