import { Keyboard, Volume2, Waves, ZoomIn, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { RAIL_CONTROLS, railControls, toggled, type RailControl } from '@/shared/lib'
import { SettingField, ToggleGrid, ToggleTile } from '@/shared/ui'
import { PEDAL_MARK } from './PedalToggle'

/** Each control as the rail draws it: its icon, or the glyph its button wears. */
const PICTURE: Readonly<Record<RailControl, { icon: LucideIcon } | { glyph: ReactNode }>> = {
  zoom: { icon: ZoomIn },
  noteNames: { glyph: 'CDE' },
  chordNames: { glyph: 'Cm7' },
  typing: { icon: Keyboard },
  midiSound: { icon: Volume2 },
  glissando: { icon: Waves },
  pedal: { glyph: <span className="font-music text-3xl leading-none">{PEDAL_MARK}</span> },
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
    <SettingField label={t('railControls.label')} info={t('railControls.detail')}>
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
