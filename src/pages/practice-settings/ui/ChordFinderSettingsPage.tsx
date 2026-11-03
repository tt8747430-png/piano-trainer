import { History, KeyRound, Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  REMEMBERED_CHORDS,
  selectChordFinder,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setChordFinder } from '@/features/set-preference'
import { SettingRows, SettingsGroup, SwitchRow } from '@/shared/ui'
import { PracticeSettingsScreen } from './PracticeSettingsScreen'

/**
 * The Chord finder's Settings (A24): whether it remembers the chords played, names an inversion over
 * its bass, shows the keys a chord is in, and paints the key's scale on the keys. The key it spells
 * in is what the page shows, so it stays there.
 */
export function ChordFinderSettingsPage() {
  const { t } = useTranslation('practice')
  const store = useSettingsStoreApi()
  const finder = useSettings(selectChordFinder)
  return (
    <PracticeSettingsScreen title={t('pages.chordFinder')}>
      <SettingsGroup>
        <SettingRows>
          <SwitchRow
            setting="chordFinder.remember"
            icon={<History />}
            label={t('chordFinder.remember')}
            info={t('chordFinder.rememberDetail', { count: REMEMBERED_CHORDS })}
            checked={finder.remember}
            onCheckedChange={(remember) => setChordFinder(store, { remember })}
          />
          <SwitchRow
            setting="chordFinder.slash"
            icon={<span className="font-display text-sm font-semibold">C/E</span>}
            label={t('chordFinder.slash')}
            checked={finder.slash}
            onCheckedChange={(slash) => setChordFinder(store, { slash })}
          />
          <SwitchRow
            setting="chordFinder.inKeys"
            icon={<KeyRound />}
            label={t('chordFinder.inKeysShown')}
            checked={finder.inKeys}
            onCheckedChange={(inKeys) => setChordFinder(store, { inKeys })}
          />
          <SwitchRow
            setting="chordFinder.scale"
            icon={<Piano />}
            label={t('chordFinder.scaleShown')}
            info={t('chordFinder.scaleShownDetail')}
            checked={finder.scale}
            onCheckedChange={(scale) => setChordFinder(store, { scale })}
          />
        </SettingRows>
      </SettingsGroup>
    </PracticeSettingsScreen>
  )
}
