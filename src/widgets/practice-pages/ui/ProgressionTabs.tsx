import { useTranslation } from 'react-i18next'
import { IN_PLACE, OPEN_PLAINLY } from '@/shared/lib'
import type { KeyParam } from '@/shared/lib/music'
import { NavTab, NavTabs } from '@/shared/ui'
import {
  passingBetween,
  progressionChords,
  type ProgressionsView,
} from '@/widgets/progression-explorer'

/** A tab of the Progressions workspace (ADR 0050). */
export type ProgressionTab = 'play' | 'passing' | 'reharmonise' | 'transpose'

/** A tab's link: what it opens on, or, naming nothing, plainly as it was left. */
const opening = <S extends object>(search: S | undefined) =>
  search ? { search } : { search: {}, state: OPEN_PLAINLY }

/**
 * The Progressions workspace's tabs: Play, then its tools. A tool opened from Play holds the
 * progression (Passing chords between its first two chords, Transpose its chords) and its key; one
 * opened from another tool holds the key; Play comes back as it was left.
 */
export function ProgressionTabs({
  current,
  progression,
  musicKey = progression?.key,
}: {
  current: ProgressionTab
  progression?: ProgressionsView
  musicKey?: KeyParam
}) {
  const { t } = useTranslation('practice')
  const inKey = musicKey ? { key: musicKey } : undefined
  const between = progression ? passingBetween(progression) : undefined
  const chords = progression ? progressionChords(progression).join(' ') : ''
  return (
    <NavTabs label={t('pages.progressions')}>
      <NavTab
        to="/practice/progressions"
        state={OPEN_PLAINLY}
        {...IN_PLACE}
        current={current === 'play'}
      >
        {t('tabs.play')}
      </NavTab>
      <NavTab
        to="/practice/progressions/passing"
        {...opening(between ?? inKey)}
        {...IN_PLACE}
        current={current === 'passing'}
      >
        {t('pages.passingChords')}
      </NavTab>
      <NavTab
        to="/practice/progressions/reharmonise"
        {...opening(inKey)}
        {...IN_PLACE}
        current={current === 'reharmonise'}
      >
        {t('pages.reharmonise')}
      </NavTab>
      <NavTab
        to="/practice/progressions/transpose"
        {...opening(chords ? { chords, ...inKey } : inKey)}
        {...IN_PLACE}
        current={current === 'transpose'}
      >
        {t('pages.transpose')}
      </NavTab>
    </NavTabs>
  )
}
