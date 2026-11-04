import { useTranslation } from 'react-i18next'
import { noteFromParam, noteParam, SCALE_FAMILIES, scaleKindsIn } from '@/shared/lib/music'
import { MenuPicker, NotePicker } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'

/** A picker set in the heading's type: no box, a dotted underline and its ⌃⌄ say it opens. */
const IN_TITLE =
  'h-auto border-0 bg-transparent px-0 font-display text-3xl sm:text-4xl underline decoration-dotted decoration-2 underline-offset-6 hover:bg-transparent data-popup-open:bg-transparent'

/**
 * Which scale, as its name (R29-P8, Chord Trainer's "C ⌃⌄ Natural ⌃⌄ Major ⌃⌄"): the heading itself is
 * two menus, its Tonic as written and its Scale by family, reading "B ⌃⌄ natural minor ⌃⌄"; no
 * "Root" to puzzle over and no second title under it.
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
    <h2 aria-label={name} className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
      <NotePicker
        bare
        label={t('practice:scales.tonic')}
        value={noteFromParam(scale.root)}
        onChange={(root) => onChange({ root: noteParam(root) })}
        className={IN_TITLE}
      />
      <MenuPicker
        bare
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
        className={IN_TITLE}
      />
    </h2>
  )
}
