import { useTranslation } from 'react-i18next'
import { SCALE_FAMILIES, scaleKindsIn } from '@/shared/lib/music'
import { Dropdown, Labelled, NoteChoice } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'

/** Which scale, the first two fields of every view: its root among the twelve notes, a row of its own, and its kind by family. */
export function ScaleChoice({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  return (
    <>
      <div className="col-span-full">
        <NoteChoice
          label={t('learn:root')}
          value={scale.root}

          onChange={(root) => onChange({ root })}
        />
      </div>
      <Labelled label={t('learn:scaleLabel')}>
        <Dropdown
          bare
          label={t('learn:scaleLabel')}
          value={scale.kind}
          groups={SCALE_FAMILIES.map((family) => ({
            label: t(`music:scaleFamily.${family}`),
            options: scaleKindsIn(family).map((kind) => ({
              value: kind,
              label: t(`music:scaleKind.${kind}`),
            })),
          }))}
          onChange={(kind) => onChange({ kind })}
          className="w-full"
        />
      </Labelled>
    </>
  )
}
