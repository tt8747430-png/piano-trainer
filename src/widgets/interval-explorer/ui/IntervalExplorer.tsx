import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { IntervalCard, intervalRoot, useShownKeys } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  noteFromParam,
  rootSpelling,
} from '@/shared/lib/music'
import { NotePicker } from '@/shared/ui'
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
  const [shown, show] = useShownKeys(view.root, intervalRoot(noteFromParam(view.root)))
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard shown={shown} />
      <div className="grid-fields">
        <NotePicker
          label={t('root')}
          value={view.root}
          spell={(pc) => rootSpelling(pc, false)}
          onChange={(root) => onChange({ root })}
        />
      </div>
      {INTERVAL_GROUP_IDS.map((group) => (
        <section key={group} aria-labelledby={`${id}-${group}`} className="flex flex-col gap-3">
          <h2 id={`${id}-${group}`} className="text-2xl">
            {t(`intervals.${group}`)}
          </h2>
          <ul className="grid-fields gap-4">
            {INTERVAL_GROUPS[group].map((name) => (
              <li key={name}>
                <IntervalCard root={view.root} name={name} onShow={show} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
