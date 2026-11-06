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
 * The Chord finder's Settings (A24), grouped by what each changes (R32): Chord names (an inversion
 * written as a slash chord), Analysis (the keys that contain the chord, the key's scale marked on the
 * keyboard), History (the chords played kept on the staff). The key it spells in is what the page
 * shows, so it stays there.
 */
export function ChordFinderSettingsPage() {
  const { t } = useTranslation('practice')
  const store = useSettingsStoreApi()
  const finder = useSettings(selectChordFinder)
  return (
    <PracticeSettingsScreen title={t('pages.chordFinder')}>
      <SettingsGroup title={t('chordFinder.groups.names')}>
        <SettingRows>
          <SwitchRow
            setting="chordFinder.slash"
            icon={<span className="font-display text-sm font-semibold">C/E</span>}
            label={t('chordFinder.slash')}
            checked={finder.slash}
            onCheckedChange={(slash) => setChordFinder(store, { slash })}
          />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('chordFinder.groups.analysis')}>
        <SettingRows>
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
      <SettingsGroup title={t('chordFinder.groups.history')}>
        <SettingRows>
          <SwitchRow
            setting="chordFinder.remember"
            icon={<History />}
            label={t('chordFinder.remember')}
            info={t('chordFinder.rememberDetail', { count: REMEMBERED_CHORDS })}
            checked={finder.remember}
            onCheckedChange={(remember) => setChordFinder(store, { remember })}
          />
        </SettingRows>
      </SettingsGroup>
    </PracticeSettingsScreen>
  )
}
