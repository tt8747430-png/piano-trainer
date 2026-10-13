import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { IntervalCard, intervalRoot, useShownKeys, writesInterval } from '@/features/play-example'
import { cn } from '@/shared/lib'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  noteFromParam,
  type IntervalGroup,
} from '@/shared/lib/music'
import { NoteChoice } from '@/shared/ui'
import type { IntervalView } from '../model/interval-view'

/**
 * Every interval over a root, Clefs' cards, within the octave and past it, each group folding under
 * its heading (past the octave folded until opened): the keys pinned over them show the one played
 * last, or the root.
 */
export function IntervalExplorer({
  view,
  onChange,
}: {
  view: IntervalView
  onChange: (change: Partial<IntervalView>) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  const [shown, show] = useShownKeys(view.root, intervalRoot(noteFromParam(view.root)))
  const [open, setOpen] = useState<ReadonlySet<IntervalGroup>>(
    () => new Set(INTERVAL_GROUP_IDS.slice(0, 1)),
  )
  const toggle = (group: IntervalGroup) =>
    setOpen((before) => {
      const next = new Set(before)
      if (!next.delete(group)) next.add(group)
      return next
    })
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard shown={shown} />
      <div className="grid-fields">
        <NoteChoice
          label={t('root')}
          value={view.root}

          onChange={(root) => onChange({ root })}
        />
      </div>
      {INTERVAL_GROUP_IDS.map((group) => (
        <section key={group} aria-labelledby={`${id}-${group}`} className="flex flex-col gap-3">
          <h2 id={`${id}-${group}`} className="text-2xl">
            <button
              type="button"
              aria-expanded={open.has(group)}
              aria-controls={`${id}-${group}-list`}
              onClick={() => toggle(group)}
              className="flex items-center gap-2 rounded-lg text-left"
            >
              <ChevronDown
                aria-hidden
                className={cn(
                  'size-5 text-muted-foreground transition-transform duration-200 ease-out',
                  open.has(group) ? '' : '-rotate-90',
                )}
              />
              {t(`intervals.${group}`)}
            </button>
          </h2>
          {open.has(group) ? (
            <ul id={`${id}-${group}-list`} className="grid-fields gap-4">
              {/* An interval no letter writes over this root (the A9 over E♯) is left out. */}
              {INTERVAL_GROUPS[group]
                .filter((name) => writesInterval(noteFromParam(view.root), name))
                .map((name) => (
                  <li key={name}>
                    <IntervalCard root={view.root} name={name} onShow={show} />
                  </li>
                ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  )
}
