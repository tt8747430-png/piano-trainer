import { useTranslation } from 'react-i18next'
import {
  addedOf,
  ALTERATION_SIGN,
  alterationsOf,
  SEVENTH_DEGREE,
  seventhsOf,
  sizesOf,
  withAdded,
  withAlterations,
  type AddedTone,
  type BuiltSize,
  type Triad,
} from '@/shared/lib/music'
import { partsFromParams, partsParams } from '@/shared/lib'
import { InversionChoice, Labelled, NoteChoice, Segmented, ToggleChips } from '@/shared/ui'
import { isSuspended, type ChordView } from '../model/chord-view'

/** A chord's quality: its 3rd and 5th. A suspension is a field of its own. */
const QUALITIES = ['maj', 'min', 'aug', 'dim'] as const satisfies readonly Triad[]
/** The suspensions, each a major chord's 3rd taken by a 2nd or a 4th. */
const SUSPENSIONS = ['sus2', 'sus4'] as const satisfies readonly Triad[]

/** Each added tone as its chip names it: as a symbol writes it, the 6th too. */
const ADDED_NAME: Readonly<Record<AddedTone, string>> = {
  add2: 'add2',
  add4: 'add4',
  add6: 'add6',
  add9: 'add9',
  add11: 'add11',
  addS11: 'add#11',
  add13: 'add13',
}

/** Each size's name on screen. */
const SIZE_NAMES = {
  5: 'triad',
  7: 'seventh',
  9: 'ninth',
  11: 'eleventh',
  13: 'thirteenth',
} as const satisfies Record<BuiltSize, string>

/**
 * A chord's choices, every one in sight, each a labelled field in the order a chord is built, each
 * offered only what fits the fields before it: its root (letter and accidental), a row of its own; its
 * quality (major, minor, augmented, diminished), its size, its suspension (a major chord's); then its 7th, the tones it adds and its alterations as
 * chips, each only where the chord takes one; then how it is held: its inversion, and one hand or two.
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
  // The quality shown: a suspended chord is a major one with its 3rd suspended.
  const quality = isSuspended(parts.triad) ? 'maj' : parts.triad
  const suspensions =
    quality === 'maj' ? SUSPENSIONS.filter((each) => sizesOf(each).includes(parts.size)) : []
  const sevenths = seventhsOf(parts.triad, parts.size)
  const added = addedOf(parts)
  const alterations = alterationsOf(parts)
  return (
    <div className="grid-fields gap-x-10 gap-y-5">
      <div className="col-span-full">
        <NoteChoice
          label={t('learn:root')}
          value={chord.root}
          onChange={(root) => onChange({ root })}
        />
      </div>
      <Labelled label={t('learn:builder.quality')}>
        <Segmented
          label={t('learn:builder.quality')}
          value={quality}
          options={QUALITIES.map((each) => ({
            value: each,
            label: t(`learn:builder.triadShort.${each}`),
            title: t(`learn:builder.triads.${each}`),
          }))}
          onChange={(next) => onChange({ triad: next })}
        />
      </Labelled>
      <Labelled label={t('music:chordSize.label')}>
        <Segmented
          label={t('music:chordSize.label')}
          value={parts.size}
          options={sizesOf(quality).map((size) => ({
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
      {suspensions.length > 0 ? (
        <Labelled label={t('learn:builder.suspension')}>
          <Segmented<Triad>
            label={t('learn:builder.suspension')}
            value={parts.triad}
            options={[
              { value: 'maj', label: t('learn:builder.none') },
              ...suspensions.map((each) => ({
                value: each,
                label: each,
                title: t(`learn:builder.triads.${each}`),
              })),
            ]}
            onChange={(triad) => onChange({ triad })}
          />
        </Labelled>
      ) : null}
      {added.length > 0 ? (
        <Labelled label={t('learn:builder.added')}>
          <ToggleChips
            label={t('learn:builder.added')}
            value={parts.added}
            options={added.map((tone) => ({ value: tone, label: ADDED_NAME[tone] }))}
            onChange={(chosen) => onChange(partsParams(withAdded(parts, chosen)))}
          />
        </Labelled>
      ) : null}
      {alterations.length > 0 ? (
        <Labelled label={t('learn:builder.alterations')}>
          <ToggleChips
            label={t('learn:builder.alterations')}
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
