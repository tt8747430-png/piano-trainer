import { useTranslation } from 'react-i18next'
import {
  BUILT_SIZES,
  chordInversions,
  SEVENTH_DEGREE,
  seventhsOf,
  sizesOf,
  voicingTakesInversion,
  type BuiltSize,
  type PlacedChord,
  type Tone,
  type Triad,
} from '@/shared/lib/music'
import { partsFromParams } from '@/shared/lib'
import { noteFromParam, noteParam } from '@/shared/lib/music'
import {
  InversionChoice,
  Labelled,
  MenuPicker,
  NotePicker,
  PickerRow,
  Segmented,
} from '@/shared/ui'
import { isSuspended, takesTwoHands, type ChordView } from '../model/chord-view'
import { RightHandFrom } from './RightHandFrom'
import { VoicingField } from './VoicingField'

/** A chord's quality: its 3rd and 5th, or its 5th alone. A suspension is a field of its own. */
const QUALITIES = ['maj', 'min', 'aug', 'dim', 'power'] as const satisfies readonly Triad[]
/** The suspensions, each a major chord's 3rd taken by a 2nd or a 4th. */
const SUSPENSIONS = ['sus2', 'sus4'] as const satisfies readonly Triad[]

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
 * and its voicing; then its size, its suspension (a major chord's) and its 7th; then how it is held:
 * its inversion, and one hand or two. The tones it adds and alters are its colour notes' (A33).
 * A chord of five notes or more takes two hands (ADR 0046): in the inversion's place, where its right
 * hand starts, when it has more than one start. A choice the chord cannot take is not drawn (R30),
 * the rows after it closing up: no greyed option that looks broken.
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
  const close = chord.voicing === 'close'
  const twoHands = close && takesTwoHands(tones.length)
  const inverts = voicingTakesInversion(chord.voicing)
  const choosesSeventh = parts.size > 5 && sevenths.length > 1
  const inversions = chordInversions(tones).length
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
          options={BUILT_SIZES.filter((size) => sizesOf(quality).includes(size)).map((size) => ({
            value: size,
            label: t(`practice:chords.builder.sizes.${SIZE_NAMES[size]}`),
            title: t(`practice:chords.builder.sizeNames.${SIZE_NAMES[size]}`),
          }))}
          onChange={(size) => onChange({ size })}
        />
      </Labelled>
      {choosesSeventh ? (
        <Labelled label={t('practice:chords.builder.seventh')}>
          <Segmented
            label={t('practice:chords.builder.seventh')}
            value={parts.seventh}
            options={sevenths.map((seventh) => ({
              value: seventh,
              label: SEVENTH_DEGREE[seventh],
              title: t(`practice:chords.builder.sevenths.${seventh}`),
            }))}
            onChange={(seventh) => onChange({ seventh })}
          />
        </Labelled>
      ) : null}
      {suspensions.length > 0 ? (
        <Labelled label={t('practice:chords.builder.suspension')}>
          <Segmented<Triad>
            label={t('practice:chords.builder.suspension')}
            value={parts.triad}
            options={[
              { value: 'maj', label: t('practice:chords.builder.none') },
              ...suspensions.map((each) => ({
                value: each,
                label: each,
                title: t(`practice:chords.builder.triads.${each}`),
              })),
            ]}
            onChange={(triad) => onChange({ triad })}
          />
        </Labelled>
      ) : null}
      {twoHands && inversions > 1 ? (
        <Labelled label={t('practice:chords.builder.handFrom')}>
          <RightHandFrom
            tones={tones}
            value={chord.inversion}
            onChange={(inversion) => onChange({ inversion })}
          />
        </Labelled>
      ) : null}
      {inverts && !twoHands && inversions > 1 ? (
        <Labelled label={t('music:inversion.label')}>
          <InversionChoice
            notes={tones.length}
            value={chord.inversion}
            onChange={(inversion) => onChange({ inversion })}
          />
        </Labelled>
      ) : null}
      {close && !twoHands ? (
        <Labelled label={t('practice:hands')}>
          <Segmented
            label={t('practice:hands')}
            value={chord.hands}
            options={[
              { value: 'rh', label: t('common:handsShort.rh') },
              { value: 'both', label: t('common:handsShort.both') },
            ]}
            onChange={(hands) => onChange({ hands })}
          />
        </Labelled>
      ) : null}
    </div>
  )
}
