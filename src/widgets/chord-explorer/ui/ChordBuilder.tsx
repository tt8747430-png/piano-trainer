import { useTranslation } from 'react-i18next'
import {
  BUILT_SIZES,
  buildChord,
  chordInversions,
  printedNote,
  seventhsOf,
  sizesOf,
  TRIADS,
  voicingTakesInversion,
  type BuiltSize,
  type PlacedChord,
  type Seventh,
  type Tone,
  type Triad,
} from '@/shared/lib/music'
import { partsFromParams } from '@/shared/lib'
import { noteFromParam, noteParam } from '@/shared/lib/music'
import {
  InversionChoice,
  HandsSegmented,
  Labelled,
  MenuPicker,
  NotePicker,
  PickerRow,
  Segmented,
} from '@/shared/ui'
import { takesTwoHands, type ChordView } from '../model/chord-view'
import { TopNote } from './TopNote'
import { VoicingField } from './VoicingField'

/** A chord of a size, by its triad and its 7th: one row of the Chord menu. */
interface ChordType {
  readonly triad: Triad
  readonly seventh: Seventh
}

/**
 * The chords of a size, as chord dictionaries list them by name (R29, Decided 22): every triad that
 * stacks to it, with each 7th it takes from a 7th chord up (Cmaj7, C7, Cm7, Cm(maj7), Cø7, C°7 …).
 */
const typesOf = (size: BuiltSize): readonly ChordType[] =>
  TRIADS.filter((triad) => sizesOf(triad).includes(size)).flatMap((triad) =>
    (size === 5 ? (['minor'] as const) : seventhsOf(triad, size)).map((seventh) => ({
      triad,
      seventh,
    })),
  )
const typeKey = ({ triad, seventh }: ChordType) => `${triad}:${seventh}`

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
  const close = chord.voicing === 'close'
  const twoHands = close && takesTwoHands(tones.length)
  const inverts = voicingTakesInversion(chord.voicing)
  const inversions = chordInversions(tones).length
  return (
    <div className="grid-fields gap-x-10 gap-y-5">
      <div className="col-span-full">
        <PickerRow label={t('practice:chords.voicing.label')}>
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
          }))}
          onChange={(size) => {
            // The chord's family kept where the size has it (Cm9 at 13th is Cm13), else its triad's.
            const next = typesOf(size)
            const kept =
              next.find((each) => each.triad === parts.triad && each.seventh === parts.seventh) ??
              next.find((each) => each.triad === parts.triad) ??
              next[0]
            onChange({ size, ...kept })
          }}
        />
      </Labelled>
      {twoHands && inversions > 1 ? (
        <Labelled label={t('practice:chords.builder.topNote')}>
          <TopNote
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
          <HandsSegmented
            label={t('practice:hands')}
            value={chord.hands}
            hands={['rh', 'both']}
            onChange={(hands) => onChange({ hands })}
          />
        </Labelled>
      ) : null}
    </div>
  )
}

/** The name's two pickers, large in the serif as the chord is written. */
const NAME_PICKER =
  'h-auto min-h-14 gap-1.5 rounded-card border-transparent bg-muted/60 px-3 py-1 font-display text-4xl font-semibold [&>span]:font-semibold'

/**
 * The chord's name, made of its pickers (R42): its root and its kind, each large in the serif with
 * ⌃⌄, each opening its picker ("C ⌃ maj7 ⌃"). The Chord picker lists every chord of the size, by
 * its symbol on the root chosen, and shows the kind alone beside the root.
 */
export function ChordName({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['practice'])
  const parts = partsFromParams(chord)
  const root = noteFromParam(chord.root)
  // Each chord of this size named as it is written on this root: C, Cm, C°, Cmaj7, Cm(maj9) …
  const types = typesOf(parts.size)
  const suffix = (type: ChordType) =>
    buildChord(root, { ...type, size: parts.size, added: [], alterations: [] }).suffix
  const current = types.find((each) => each.triad === parts.triad && each.seventh === parts.seventh)
  const byKey = new Map(types.map((type) => [typeKey(type), type]))
  return (
    <div className="flex flex-wrap items-center gap-2">
      <NotePicker
        bare
        label={t('practice:root')}
        value={root}
        onChange={(spelled) => onChange({ root: noteParam(spelled) })}
        className={NAME_PICKER}
      />
      <MenuPicker
        bare
        label={t('practice:chords.builder.chord')}
        value={typeKey(current ?? types[0] ?? { triad: 'maj', seventh: 'minor' })}
        options={types.map((type) => ({
          value: typeKey(type),
          label: printedNote(root) + suffix(type),
        }))}
        // Beside the root the kind alone ("maj7"); a major triad, which has none, says "maj".
        face={(key) => {
          const type = byKey.get(key)
          return (type ? suffix(type) : '') || t('practice:chords.builder.major')
        }}
        onChange={(key) => {
          const type = byKey.get(key)
          if (type) onChange(type)
        }}
        className={NAME_PICKER}
      />
    </div>
  )
}
