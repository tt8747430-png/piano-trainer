import { useTranslation } from 'react-i18next'
import { noteFromParam, noteParam, SCALE_FAMILIES, scaleKindsIn } from '@/shared/lib/music'
import { MenuPicker, NotePicker } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'

/**
 * Which scale, as its name made of its two pickers (canvas 174, as the Chords page's name): its Tonic
 * as written and its Scale by family, "G ⌃⌄ major ⌃⌄"; no "Root" to puzzle over.
 */
export function ScaleChoice({
  scale,
  name,
  onChange,
}: {
  scale: ScaleView
  /** The scale's (or the key's) whole name, the heading's to a screen reader. */
  name: string
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  return (
    <h2 aria-label={name} className="flex min-w-0 flex-wrap items-stretch gap-2">
      <NotePicker
        title
        label={t('practice:scales.tonic')}
        value={noteFromParam(scale.root)}
        onChange={(root) => onChange({ root: noteParam(root) })}
      />
      <MenuPicker
        title
        label={t('practice:scales.label')}
        value={scale.kind}
        groups={SCALE_FAMILIES.map((family) => ({
          label: t(`music:scaleFamily.${family}`),
          options: scaleKindsIn(family).map((kind) => ({
            value: kind,
            label: t(`music:scaleKind.${kind}`),
          })),
        }))}
        // The name as it follows its tonic, as a musician writes it: G major, D Dorian.
        face={(kind) => t(`music:scaleName.${kind}`)}
        onChange={(kind) => onChange({ kind })}
      />
    </h2>
  )
}
