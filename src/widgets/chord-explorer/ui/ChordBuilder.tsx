import { useTranslation } from 'react-i18next'
import {
  ADDED_SYMBOL,
  addedOf,
  ALTERATION_SIGN,
  alterationsOf,
  builtRootSpelling,
  noteName,
  noteParam,
  partsFromParams,
  partsParams,
  PITCH_CLASSES,
  SEVENTH_DEGREE,
  seventhsOf,
  sizesOf,
  TRIADS,
  triadSuffix,
  withAlterations,
  type BuiltSize,
} from '@/shared/lib/music'
import { Dropdown, MultiDropdown, Segmented } from '@/shared/ui'
import type { ChordView } from '../model/chord-view'

/** Each size's name on screen. */
const SIZE_NAMES = {
  5: 'triad',
  7: 'seventh',
  9: 'ninth',
  11: 'eleventh',
  13: 'thirteenth',
} as const satisfies Record<BuiltSize, string>

/**
 * A chord's parts, each a choice: its root, triad and size; then its 7th, the tone a triad adds, or a
 * dominant's alterations, each only where the chord takes one.
 */
export function ChordBuilder({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const parts = partsFromParams(chord)
  const sevenths = seventhsOf(parts.triad, parts.size)
  const added = addedOf(parts.triad)
  const alterations = alterationsOf(parts)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Dropdown
          label={t('learn:root')}
          value={chord.root}
          options={PITCH_CLASSES.map((pc) => {
            const spelled = builtRootSpelling(pc, parts)
            return { value: noteParam(spelled), label: noteName(spelled) }
          })}
          onChange={(root) => onChange({ root })}
        />
        <Dropdown
          label={t('learn:builder.triad')}
          value={parts.triad}
          options={TRIADS.map((triad) => ({
            value: triad,
            label: t(`learn:builder.triads.${triad}`),
            detail: triadSuffix(triad) || t('music:major'),
          }))}
          onChange={(triad) => onChange({ triad })}
        />
        <Dropdown
          label={t('learn:chordSize.label')}
          value={parts.size}
          options={sizesOf(parts.triad).map((size) => ({
            value: size,
            label: t(`learn:builder.sizes.${SIZE_NAMES[size]}`),
          }))}
          onChange={(size) => onChange({ size })}
        />
      </div>
      {parts.size > 5 && sevenths.length > 1 ? (
        <div className="flex items-center gap-3">
          <span aria-hidden className="shrink-0 text-muted-foreground">
            {t('learn:builder.seventh')}
          </span>
          <Segmented
            label={t('learn:builder.seventh')}
            value={parts.seventh}
            options={sevenths.map((seventh) => ({
              value: seventh,
              label: SEVENTH_DEGREE[seventh],
              title: t(`learn:builder.sevenths.${seventh}`),
            }))}
            onChange={(seventh) => onChange({ seventh })}
          />
        </div>
      ) : null}
      {parts.size === 5 && added.length > 1 ? (
        <Dropdown
          label={t('learn:builder.added')}
          value={parts.added}
          options={added.map((tone) => ({
            value: tone,
            label: tone === 'none' ? t('learn:builder.none') : ADDED_SYMBOL[tone],
          }))}
          onChange={(tone) => onChange({ added: tone })}
        />
      ) : null}
      {alterations.length > 0 ? (
        <MultiDropdown
          label={t('learn:builder.alterations')}
          none={t('learn:builder.none')}
          value={parts.alterations}
          options={alterations.map((alteration) => ({
            value: alteration,
            label: ALTERATION_SIGN[alteration],
          }))}
          onChange={(chosen) => onChange(partsParams(withAlterations(parts, chosen)))}
        />
      ) : null}
    </div>
  )
}
