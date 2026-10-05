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
import {
  Dropdown,
  InversionChoice,
  Labelled,
  MultiDropdown,
  NotePicker,
  Segmented,
} from '@/shared/ui'
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
 * A chord's choices, each a labelled field in the order a chord is built: its root among the twelve
 * notes, its triad, its size; then its 7th, the tone a triad adds, or a dominant's alterations, each
 * only where the chord takes one; then how it is held: its inversion, and one hand or two.
 */
export function ChordBuilder({
  chord,
  notes,
  onChange,
}: {
  chord: ChordView
  /** How many notes the chord has: it has that many positions. */
  notes: number
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const parts = partsFromParams(chord)
  const sevenths = seventhsOf(parts.triad, parts.size)
  const added = addedOf(parts.triad)
  const alterations = alterationsOf(parts)
  return (
    <div className="grid-fields gap-x-10 gap-y-5">
      <NotePicker
        label={t('learn:root')}
        value={chord.root}
        spell={(pc) => builtRootSpelling(pc, parts)}
        onChange={(root) => onChange({ root })}
      />
      <Labelled label={t('learn:builder.triad')}>
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
      </Labelled>
      <Labelled label={t('music:chordSize.label')}>
        <Segmented
          label={t('music:chordSize.label')}
          value={parts.size}
          options={sizesOf(parts.triad).map((size) => ({
            value: size,
            label: t(`learn:builder.sizes.${SIZE_NAMES[size]}`),
          }))}
          onChange={(size) => onChange({ size })}
        />
      </Labelled>
      {parts.size > 5 && sevenths.length > 1 ? (
        <Labelled label={t('learn:builder.seventh')}>
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
        </Labelled>
      ) : null}
      {parts.size === 5 && added.length > 1 ? (
        <Labelled label={t('learn:builder.added')}>
          <Dropdown
            label={t('learn:builder.added')}
            value={parts.added}
            options={added.map((tone) => ({
              value: tone,
              label: tone === 'none' ? t('learn:builder.none') : ADDED_SYMBOL[tone],
            }))}
            onChange={(tone) => onChange({ added: tone })}
            className="w-full"
          />
        </Labelled>
      ) : null}
      {alterations.length > 0 ? (
        <Labelled label={t('learn:builder.alterations')}>
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
        </Labelled>
      ) : null}
      <Labelled label={t('music:inversion.label')}>
        <InversionChoice
          notes={notes}
          value={chord.inversion}
          onChange={(inversion) => onChange({ inversion })}
        />
      </Labelled>
      <Labelled label={t('learn:handsLabel')}>
        <Segmented
          label={t('learn:handsLabel')}
          value={chord.hands}
          options={[
            { value: 'rh', label: t('common:hands.rh') },
            { value: 'both', label: t('common:hands.both') },
          ]}
          onChange={(hands) => onChange({ hands })}
        />
      </Labelled>
    </div>
  )
}
