import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import {
  keyMode,
  noteFromParam,
  SCALE_FAMILIES,
  scaleHasChords,
  scaleKindsIn,
  scaleRootSpelling,
} from '@/shared/lib/music'
import { Dropdown, NoteDropdown, Segmented } from '@/shared/ui'
import { SCALE_SHOWS, type ScaleShow, type ScaleView } from '../model/scale-view'

/** The views a scale has: its run always, its chords with seven notes, its key where it is one's scale. */
const HAS_SHOW: Readonly<Record<ScaleShow, (kind: ScaleView['kind']) => boolean>> = {
  scale: () => true,
  chords: scaleHasChords,
  key: (kind) => keyMode(kind) !== null,
}

/** Which scale: its name, its root and kind from pop-up buttons, and Scale · Chords · Key, each where the scale has it. */
export function ScaleChoice({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const scaleName = useScaleName()
  const shows = SCALE_SHOWS.filter((show) => HAS_SHOW[show](scale.kind))
  return (
    <>
      <h2 className="text-5xl">{scaleName(noteFromParam(scale.root), scale.kind)}</h2>
      <div className="flex flex-wrap gap-2">
        <NoteDropdown
          label={t('learn:root')}
          value={scale.root}
          spell={(pc) => scaleRootSpelling(pc, scale.kind)}
          onChange={(root) => onChange({ root })}
        />
        <Dropdown
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
        />
      </div>
      {shows.length > 1 ? (
        <Segmented
          label={t('learn:show.label')}
          value={scale.show}
          options={shows.map((value) => ({ value, label: t(`learn:show.${value}`) }))}
          onChange={(show) => onChange({ show })}
        />
      ) : null}
    </>
  )
}
