import { FileMusic, Hash, Layers, Type } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectPractice,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle, setScoreView } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

/**
 * What only practice has in the View (ADR 0094), after the switches the editor's has too: the
 * sheet music itself (off, the keys have the screen), the chord positions written beside the chord
 * symbols, finger numbers and note names.
 */
export function PracticeSwitches() {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const notation = useSettings((state) => selectScoreView(state).notation)
  const practice = useSettings(selectPractice)
  return (
    <>
      <SwitchRow
        icon={<FileMusic />}
        label={t('view.notation')}
        checked={notation}
        onCheckedChange={(on) => setScoreView(store, { notation: on })}
      />
      <SwitchRow
        icon={<Layers />}
        label={t('toggles.positions')}
        info={t('view.positionsDetail')}
        checked={practice.positions}
        onCheckedChange={(on) => setPracticeToggle(store, 'positions', on)}
      />
      <SwitchRow
        icon={<Hash />}
        label={t('toggles.fingerNumbers')}
        checked={practice.fingerNumbers}
        onCheckedChange={(on) => setPracticeToggle(store, 'fingerNumbers', on)}
      />
      <SwitchRow
        icon={<Type />}
        label={t('toggles.namedNotes')}
        checked={practice.namedNotes}
        onCheckedChange={(on) => setPracticeToggle(store, 'namedNotes', on)}
      />
    </>
  )
}
