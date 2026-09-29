import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { IntervalCard, intervalRoot, type ShownKeys } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  rootSpelling,
  type NoteParam,
} from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import type { IntervalView } from '../model/interval-view'

/**
 * Every interval over a root, Clefs' cards, within the octave and past it: the keys pinned over them
 * show the one played last, or the root.
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
  const [played, setPlayed] = useState<{ root: NoteParam; shown: ShownKeys } | null>(null)
  // What was played over another root no longer stands on these keys.
  const shown = played?.root === view.root ? played.shown : intervalRoot(noteFromParam(view.root))
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={shown.keys} marks={shown.marks} />
      <Dropdown
        label={t('root')}
        value={view.root}
        options={PITCH_CLASSES.map((pc) => {
          const spelled = rootSpelling(pc, false)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(root) => onChange({ root })}
        className="self-start"
      />
      {INTERVAL_GROUP_IDS.map((group) => (
        <section key={group} aria-labelledby={`${id}-${group}`} className="flex flex-col gap-3">
          <h2 id={`${id}-${group}`} className="text-2xl">
            {t(`intervals.${group}`)}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTERVAL_GROUPS[group].map((name) => (
              <li key={name}>
                <IntervalCard
                  root={view.root}
                  name={name}
                  onShow={(next) => setPlayed({ root: view.root, shown: next })}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
