import { useTranslation } from 'react-i18next'
import {
  addedOf,
  ALTERATION_SIGN,
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
import {
  InversionChoice,
  Labelled,
  NoteChoice,
  Segmented,
  StepStrip,
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
 * A chord's choices, every one in sight, each a labelled field in the order a chord is built, each
 * offered only what fits the fields before it: its root (letter and accidental), a row of its own; its
 * quality (major, minor, augmented, diminished), its size, its suspension (a major chord's); then its 7th, the tones it adds and its alterations as
 * chips, each only where the chord takes one; then how it is held: its inversion, and one hand or two.
 * A chord of five notes or more takes two hands (ADR 0046): in the inversion's place, where its right
 * hand starts, when it has more than one start.
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
  return (
    <div className="grid-fields gap-x-10 gap-y-5">
      <div className="col-span-full">
        <NoteChoice
          label={t('practice:root')}
          value={chord.root}
          onChange={(root) => onChange({ root })}
        />
      </div>
      <Labelled label={t('practice:chords.builder.quality')}>
        <StepStrip
          label={t('practice:chords.builder.quality')}
          value={quality}
          options={QUALITIES.map((each) => ({
            value: each,
            label: t(`practice:chords.builder.triads.${each}`),
          }))}
          onChange={(next) => onChange({ triad: next })}
        />
      </Labelled>
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
      {parts.size > 5 && sevenths.length > 1 ? (
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
      {added.length > 0 ? (
        <Labelled label={t('practice:chords.builder.added')}>
          <ToggleChips
            label={t('practice:chords.builder.added')}
            value={parts.added}
            options={added.map((tone) => ({ value: tone, label: ADDED_NAME[tone] }))}
            onChange={(chosen) => onChange(partsParams(withAdded(parts, chosen)))}
          />
        </Labelled>
      ) : null}
      {alterations.length > 0 ? (
        <Labelled label={t('practice:chords.builder.alterations')}>
          <ToggleChips
            label={t('practice:chords.builder.alterations')}
            value={parts.alterations}
            options={alterations.map((alteration) => ({
              value: alteration,
              label: ALTERATION_SIGN[alteration],
            }))}
            onChange={(chosen) => onChange(partsParams(withAlterations(parts, chosen)))}
          />
        </Labelled>
      ) : null}
      <VoicingField
        tones={tones}
        placed={placed}
        value={chord.voicing}
        onChange={(voicing) => onChange({ voicing })}
      />
      {twoHands ? (
        chordInversions(tones).length > 1 ? (
          <Labelled label={t('practice:chords.builder.handFrom')}>
            <RightHandFrom
              tones={tones}
              value={chord.inversion}
              onChange={(inversion) => onChange({ inversion })}
            />
          </Labelled>
        ) : null
      ) : (
        <Labelled label={t('music:inversion.label')}>
          <InversionChoice
            notes={Math.max(tones.length, 3)}
            disabled={!inverts}
            greyed={(inversion) =>
              inversion > lastInversion(tones.length)
                ? t('practice:chords.builder.powerInversion')
                : undefined
            }
            value={inverts ? chord.inversion : null}
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
