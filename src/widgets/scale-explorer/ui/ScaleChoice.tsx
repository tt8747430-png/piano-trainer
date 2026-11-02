import { useTranslation } from 'react-i18next'
import { noteFromParam, noteParam, SCALE_FAMILIES, scaleKindsIn } from '@/shared/lib/music'
import { MenuPicker, NotePicker, PickerRow } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'

/** Which scale, the first row of every view: its root as written and its kind by family, one row of pickers. */
export function ScaleChoice({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  return (
    <div className="col-span-full">
      <PickerRow label={t('practice:scales.which')}>
        <NotePicker
          label={t('practice:root')}
          value={noteFromParam(scale.root)}
          onChange={(root) => onChange({ root: noteParam(root) })}
        />
        <MenuPicker
          label={t('practice:scales.label')}
          value={scale.kind}
          groups={SCALE_FAMILIES.map((family) => ({
            label: t(`music:scaleFamily.${family}`),
            options: scaleKindsIn(family).map((kind) => ({
              value: kind,
              label: t(`music:scaleKind.${kind}`),
            })),
          }))}
          onChange={(kind) => onChange({ kind })}
        />
      </PickerRow>
    </div>
  )
}
