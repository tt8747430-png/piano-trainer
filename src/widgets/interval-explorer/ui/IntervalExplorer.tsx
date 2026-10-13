import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { IntervalCard, intervalRoot, useShownKeys, writesInterval } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  noteFromParam,
  type IntervalGroup,
} from '@/shared/lib/music'
import { FoldGroup, NoteChoice } from '@/shared/ui'
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
        <FoldGroup
          key={group}
          title={t(`intervals.${group}`)}
          open={open.has(group)}
          onToggle={() => toggle(group)}
          listClassName="grid-fields gap-4"
        >
          {/* An interval no letter writes over this root (the A9 over E♯) is left out. */}
          {INTERVAL_GROUPS[group]
            .filter((name) => writesInterval(noteFromParam(view.root), name))
            .map((name) => (
              <li key={name}>
                <IntervalCard root={view.root} name={name} onShow={show} />
              </li>
            ))}
        </FoldGroup>
      ))}
    </div>
  )
}
