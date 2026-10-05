import { useTranslation } from 'react-i18next'
import {
  ADDED_SYMBOL,
  addedOf,
  ALTERATION_SIGN,
  alterationsOf,
  builtRootSpelling,
  SEVENTH_DEGREE,
  seventhsOf,
  sizesOf,
  TRIADS,
  withAlterations,
  type BuiltSize,
} from '@/shared/lib/music'
import { partsFromParams, partsParams } from '@/shared/lib'
import { Dropdown, MultiDropdown, NamedSegmented, NotePicker, Segmented } from '@/shared/ui'
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
 * A chord's parts, each a choice: its root among the twelve notes, its triad and its size, all in
 * sight and a tap each; then its 7th, the tone a triad adds, or a dominant's alterations, each only
 * where the chord takes one.
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
      <NotePicker
        label={t('learn:root')}
        value={chord.root}
        spell={(pc) => builtRootSpelling(pc, parts)}
        onChange={(root) => onChange({ root })}
      />
      <Segmented
        label={t('learn:builder.triad')}
        value={parts.triad}
        options={TRIADS.map((triad) => ({
          value: triad,
          label: t(`learn:builder.triadShort.${triad}`),
          title: t(`learn:builder.triads.${triad}`),
        }))}
        onChange={(triad) => onChange({ triad })}
      />
      <Segmented
        label={t('music:chordSize.label')}
        value={parts.size}
        options={sizesOf(parts.triad).map((size) => ({
          value: size,
          label: t(`learn:builder.sizes.${SIZE_NAMES[size]}`),
        }))}
        onChange={(size) => onChange({ size })}
      />
      {parts.size > 5 && sevenths.length > 1 ? (
        <NamedSegmented
          label={t('learn:builder.seventh')}
          value={parts.seventh}
          options={sevenths.map((seventh) => ({
            value: seventh,
            label: SEVENTH_DEGREE[seventh],
            title: t(`learn:builder.sevenths.${seventh}`),
          }))}
          onChange={(seventh) => onChange({ seventh })}
        />
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
