import { useTranslation } from 'react-i18next'
import {
  ADDED_TONES,
  addedOf,
  ALTERATION_SIGN,
  ALTERATIONS,
  BUILT_SIZES,
  lastInversion,
  alterationsOf,
  chordInversions,
  SEVENTH_DEGREE,
  seventhsOf,
  sizesOf,
  withAdded,
  withAlterations,
  voicingTakesInversion,
  type AddedTone,
  type BuiltSize,
  type PlacedChord,
  type Tone,
  type Triad,
} from '@/shared/lib/music'
import { partsFromParams, partsParams } from '@/shared/lib'
import { noteFromParam, noteParam } from '@/shared/lib/music'
import {
  InversionChoice,
  Labelled,
  MenuPicker,
  NotePicker,
  PickerRow,
  Segmented,
  ToggleChips,
} from '@/shared/ui'
import { isSuspended, takesTwoHands, type ChordView } from '../model/chord-view'
import { RightHandFrom } from './RightHandFrom'
import { VoicingField } from './VoicingField'

/** A chord's quality: its 3rd and 5th, or its 5th alone. A suspension is a field of its own. */
const QUALITIES = ['maj', 'min', 'aug', 'dim', 'power'] as const satisfies readonly Triad[]
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
 * A chord's choices in the order a chord is built, each offered only what fits the fields before it:
 * one row of pickers for its root as written, its quality (major, minor, augmented, diminished, power)
 * and its voicing; then its size, its suspension (a major chord's); then its 7th, the tones it adds and its alterations as
 * chips, each only where the chord takes one; then how it is held: its inversion, and one hand or two.
 * A chord of five notes or more takes two hands (ADR 0046): in the inversion's place, where its right
 * hand starts, when it has more than one start. Every row stays in its place whatever the chord: one
 * the chord cannot take is greyed, never taken away, so nothing under it moves as it changes (A31).
 */
export function ChordBuilder({
  chord,
  tones,
  placed,
  onChange,
}: {
  chord: ChordView
  /** The chord's tones: how many say its inversions, and whether one hand holds it. */
  tones: readonly Tone[]
  /** Its keys in the voicing chosen: what the voicing's ⓘ spells. */
  placed: PlacedChord
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['practice', 'music', 'common'])
  const parts = partsFromParams(chord)
  // The quality shown: a suspended chord is a major one with its 3rd suspended.
  const quality = isSuspended(parts.triad) ? 'maj' : parts.triad
  const suspensions =
    quality === 'maj' ? SUSPENSIONS.filter((each) => sizesOf(each).includes(parts.size)) : []
  const sevenths = seventhsOf(parts.triad, parts.size)
  const added = addedOf(parts)
  const alterations = alterationsOf(parts)
  const close = chord.voicing === 'close'
  const twoHands = close && takesTwoHands(tones.length)
  const inverts = voicingTakesInversion(chord.voicing)
  const choosesSeventh = parts.size > 5 && sevenths.length > 1
  return (
    <div className="grid-fields gap-x-10 gap-y-5">
      <div className="col-span-full">
        <PickerRow label={t('practice:chords.builder.chord')}>
          <NotePicker
            label={t('practice:root')}
            value={noteFromParam(chord.root)}
            onChange={(root) => onChange({ root: noteParam(root) })}
          />
          <MenuPicker
            label={t('practice:chords.builder.quality')}
            value={quality}
            options={QUALITIES.map((each) => ({
              value: each,
              label: t(`practice:chords.builder.triads.${each}`),
            }))}
            onChange={(next) => onChange({ triad: next })}
          />
          <VoicingField
            tones={tones}
            placed={placed}
            value={chord.voicing}
            onChange={(voicing) => onChange({ voicing })}
          />
        </PickerRow>
      </div>
      <Labelled label={t('music:chordSize.label')}>
        <Segmented
          label={t('music:chordSize.label')}
          value={parts.size}
          options={BUILT_SIZES.map((size) => ({
            value: size,
            label: t(`practice:chords.builder.sizes.${SIZE_NAMES[size]}`),
            title: t(`practice:chords.builder.sizeNames.${SIZE_NAMES[size]}`),
            reason: sizesOf(quality).includes(size)
              ? undefined
              : t(`practice:chords.builder.sizeNot.${quality === 'power' ? 'power' : 'stops'}`, {
                  quality: t(`practice:chords.builder.triads.${quality}`).toLocaleLowerCase(),
                }),
          }))}
          onChange={(size) => onChange({ size })}
        />
      </Labelled>
      <Labelled label={t('practice:chords.builder.seventh')}>
        <Segmented
          label={t('practice:chords.builder.seventh')}
          value={choosesSeventh ? parts.seventh : null}
          disabled={!choosesSeventh}
          options={(choosesSeventh ? sevenths : seventhsOf('maj', 9)).map((seventh) => ({
            value: seventh,
            label: SEVENTH_DEGREE[seventh],
            title: t(`practice:chords.builder.sevenths.${seventh}`),
          }))}
          onChange={(seventh) => onChange({ seventh })}
        />
      </Labelled>
      <Labelled label={t('practice:chords.builder.suspension')}>
        <Segmented<Triad>
          label={t('practice:chords.builder.suspension')}
          value={suspensions.length > 0 ? parts.triad : null}
          disabled={suspensions.length === 0}
          options={[
            { value: 'maj', label: t('practice:chords.builder.none') },
            ...(suspensions.length > 0 ? suspensions : SUSPENSIONS).map((each) => ({
              value: each,
              label: each,
              title: t(`practice:chords.builder.triads.${each}`),
            })),
          ]}
          onChange={(triad) => onChange({ triad })}
        />
      </Labelled>
      <Labelled label={t('practice:chords.builder.added')}>
        <ToggleChips
          label={t('practice:chords.builder.added')}
          value={parts.added}
          disabled={added.length === 0}
          // Two rows of chips held, so the rows under it stay as the tones on offer change.
          className="min-h-24 content-start"
          options={(added.length > 0 ? added : ADDED_TONES).map((tone) => ({
            value: tone,
            label: ADDED_NAME[tone],
          }))}
          onChange={(chosen) => onChange(partsParams(withAdded(parts, chosen)))}
        />
      </Labelled>
      <Labelled label={t('practice:chords.builder.alterations')}>
        <ToggleChips
          label={t('practice:chords.builder.alterations')}
          value={parts.alterations}
          disabled={alterations.length === 0}
          options={(alterations.length > 0 ? alterations : ALTERATIONS).map((alteration) => ({
            value: alteration,
            label: ALTERATION_SIGN[alteration],
          }))}
          onChange={(chosen) => onChange(partsParams(withAlterations(parts, chosen)))}
        />
      </Labelled>
      {twoHands && chordInversions(tones).length > 1 ? (
        <Labelled label={t('practice:chords.builder.handFrom')}>
          {/* As tall as the inversions' pictures it stands in for, so Hands under it holds still. */}
          <div className="flex min-h-17.5 flex-col">
            <RightHandFrom
              tones={tones}
              value={chord.inversion}
              onChange={(inversion) => onChange({ inversion })}
            />
          </div>
        </Labelled>
      ) : (
        <Labelled label={t('music:inversion.label')}>
          <InversionChoice
            notes={Math.max(tones.length, 3)}
            disabled={!inverts || twoHands}
            greyed={(inversion) =>
              inversion > lastInversion(tones.length)
                ? t('practice:chords.builder.powerInversion')
                : undefined
            }
            value={inverts && !twoHands ? chord.inversion : null}
            onChange={(inversion) => onChange({ inversion })}
          />
        </Labelled>
      )}
      <Labelled label={t('practice:hands')}>
        <Segmented
          label={t('practice:hands')}
          value={close ? (twoHands ? 'both' : chord.hands) : null}
          disabled={!close || twoHands}
          options={[
            { value: 'rh', label: t('common:handsShort.rh') },
            { value: 'both', label: t('common:handsShort.both') },
          ]}
          onChange={(hands) => onChange({ hands })}
        />
      </Labelled>
    </div>
  )
}
