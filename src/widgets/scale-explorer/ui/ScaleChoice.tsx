import { useTranslation } from 'react-i18next'
import { SCALE_FAMILIES, scaleKindsIn } from '@/shared/lib/music'
import { Labelled, NoteChoice, StepStrip } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'

/** Which scale, the first two fields of every view: its root among the twelve notes, a row of its own, and its kind by family. */
export function ScaleChoice({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  return (
    <>
      <div className="col-span-full">
        <NoteChoice
          label={t('practice:root')}
          value={scale.root}
          onChange={(root) => onChange({ root })}
        />
      </div>
      <div className="col-span-full">
        <Labelled label={t('practice:scales.label')}>
          <StepStrip
            label={t('practice:scales.label')}
            value={scale.kind}
            options={SCALE_FAMILIES.flatMap((family) =>
              scaleKindsIn(family).map((kind) => ({
                value: kind,
                label: t(`music:scaleKind.${kind}`),
              })),
            )}
            onChange={(kind) => onChange({ kind })}
          />
        </Labelled>
      </div>
    </>
  )
}
