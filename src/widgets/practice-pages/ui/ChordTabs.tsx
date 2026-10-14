import { useTranslation } from 'react-i18next'
import { IN_PLACE, keyListParam, OPEN_PLAINLY } from '@/shared/lib'
import { NavTab, NavTabs } from '@/shared/ui'
import { chordKeys, type ChordView } from '@/widgets/chord-explorer'

/** A tab of the Chords workspace (ADR 0050). */
export type ChordTab = 'build' | 'find'

/**
 * The Chords workspace's tabs: Build, the chord made part by part, and Find, the Chord finder. Find
 * opened from Build holds the chord's keys; Build comes back as it was left.
 */
export function ChordTabs({ current, chord }: { current: ChordTab; chord?: ChordView }) {
  const { t } = useTranslation('practice')
  return (
    <NavTabs label={t('pages.chords')}>
      <NavTab
        to="/practice/chords"
        state={OPEN_PLAINLY}
        {...IN_PLACE}
        current={current === 'build'}
      >
        {t('tabs.build')}
      </NavTab>
      <NavTab
        to="/practice/chords/find"
        search={chord ? { keys: keyListParam(chordKeys(chord)) } : {}}
        {...(chord ? {} : { state: OPEN_PLAINLY })}
        {...IN_PLACE}
        current={current === 'find'}
      >
        {t('tabs.find')}
      </NavTab>
    </NavTabs>
  )
}
