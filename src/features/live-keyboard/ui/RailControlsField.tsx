import {
  CaseSensitive,
  MoveHorizontal,
  Music2,
  Volume2,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { RAIL_CONTROLS, railControls, toggled, type RailControl } from '@/shared/lib'
import { SettingField, ToggleGrid, ToggleTile } from '@/shared/ui'
import { PedalIcon } from '@/shared/ui/icons/PedalIcon'

/** Each control as the rail draws it (R29 A26): its icon, the pedal's drawn as lucide's are. */
const PICTURE: Readonly<Record<RailControl, { icon: LucideIcon } | { glyph: ReactNode }>> = {
  zoom: { icon: ZoomIn },
  noteNames: { icon: CaseSensitive },
  chordNames: { icon: Music2 },
  midiSound: { icon: Volume2 },
  glissando: { icon: MoveHorizontal },
  pedal: { glyph: <PedalIcon aria-hidden className="size-5" /> },
}

/**
 * Which controls the keys' rail holds, chosen one by one: each a tile wearing the rail's own picture,
 * what it does its tooltip, on while the rail keeps it. Whatever the rail leaves out stays in Settings.
 */
export function RailControlsField() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const kept = useSettings((state) => selectKeyboard(state).railControls)
  return (
    <SettingField
      setting="keyboard.railControls"
      label={t('railControls.label')}
      info={t('railControls.detail')}
    >
      <ToggleGrid label={t('railControls.label')}>
        {RAIL_CONTROLS.map((control) => (
          <ToggleTile
            key={control}
            label={t(`railControls.${control}.label`)}
            tip={t(`railControls.${control}.detail`)}
            pressed={kept.includes(control)}
            onPressedChange={(on) =>
              setKeyboard(store, { railControls: railControls(toggled(kept, control, on), []) })
            }
            {...PICTURE[control]}
          />
        ))}
      </ToggleGrid>
    </SettingField>
  )
}
