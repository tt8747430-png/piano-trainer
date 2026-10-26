import { Layers, Type } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

/**
 * What only practice has in the View (ADR 0094), after the switches the editor's has too, while the
 * sheet music is shown: the chord positions written beside the chord symbols and note names.
 */
export function PracticeSwitches() {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const practice = useSettings(selectPractice)
  return (
    <>
      <SwitchRow
        icon={<Layers />}
        label={t('toggles.positions')}
        info={t('view.positionsDetail')}
        checked={practice.positions}
        onCheckedChange={(on) => setPracticeToggle(store, 'positions', on)}
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
