import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { IntervalCard, intervalRoot, useShownKeys, writesInterval } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  noteFromParam,
  type IntervalGroup,
} from '@/shared/lib/music'
import { FoldGroup, NoteChoice, type ShownKeys } from '@/shared/ui'
import type { IntervalView } from '../model/interval-view'

/**
 * Every interval over a root, Clefs' cards, within the octave and past it, each group folding under
 * its heading as the learner left it (`useFold`, saved with the other explorers' sections): the
 * keys pinned over them show the one played last, or the root.
 */
export function IntervalExplorer({
  view,
  onChange,
}: {
  view: IntervalView
  onChange: (change: Partial<IntervalView>) => void
}) {
  const { t } = useTranslation('practice')
  const [shown, show] = useShownKeys(view.root, intervalRoot(noteFromParam(view.root)))
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <div className="grid-fields">
        <NoteChoice label={t('root')} value={view.root} onChange={(root) => onChange({ root })} />
      </div>
      {INTERVAL_GROUP_IDS.map((group) => (
        <IntervalGroupFold key={group} group={group} root={view.root} onShow={show} />
      ))}
    </div>
  )
}

/** One group's cards under its folding heading. */
function IntervalGroupFold({
  group,
  root,
  onShow,
}: {
  group: IntervalGroup
  root: IntervalView['root']
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('practice')
  const fold = useFold(`intervals.${group}`)
  return (
    <FoldGroup
      title={t(`intervals.${group}`)}
      open={fold.open}
      onToggle={fold.toggle}
      listClassName="grid-fields gap-4"
    >
      {/* An interval no letter writes over this root (the A9 over E♯) is left out. */}
      {INTERVAL_GROUPS[group]
        .filter((name) => writesInterval(noteFromParam(root), name))
        .map((name) => (
          <li key={name}>
            <IntervalCard root={root} name={name} onShow={onShow} />
          </li>
        ))}
    </FoldGroup>
  )
}
