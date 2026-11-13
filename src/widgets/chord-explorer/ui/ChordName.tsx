import { useTranslation } from 'react-i18next'
import { partsFromParams, qualityParams } from '@/shared/lib'
import {
  CHORD_FAMILIES,
  buildChord,
  chordInversions,
  noteFromParam,
  noteParam,
  placeChord,
  printedNote,
  printedSymbol,
  qualitiesIn,
  qualitySuffix,
  voicingTakesInversion,
  type ChordQuality,
  type Tone,
} from '@/shared/lib/music'
import { MenuPicker, NotePicker } from '@/shared/ui'
import { takesTwoHands, type ChordView } from '../model/chord-view'

/**
 * One part of the chord's name, the canvas's PART value for value: the serif at 44 (56 on a laptop)
 * and bold, on the fill, 14 round, 48 high at least, 2 8 4 12 inside, its ⌃⌄ faint beside it.
 */
const PART =
  'h-auto min-h-12 items-center gap-2 rounded-[14px] [&>span]:flex [&>span]:items-center border-0 bg-muted pt-0.5 pe-2 pb-1 ps-3 font-display text-[2.75rem] leading-[1.1] font-bold hover:bg-muted md:text-[3.5rem] [&>span]:font-bold [&>svg]:h-[0.9375rem] [&>svg]:w-2.5 [&>svg]:text-foreground [&>svg]:opacity-55'

/**
 * The chord's name made of its three pickers (R42, the canvas's NAME_A): its root, its type and the
 * note in its bass, centred over the staff, each opening its list. The type lists every chord the app
 * names, in the canvas's groups, each by its symbol on this root and then its full name; a major
 * triad's part says "major", quiet. The bass offers the inversions where the voicing takes one.
 */
export function ChordName({
  chord,
  tones,
  quality,
  onChange,
}: {
  chord: ChordView
  tones: readonly Tone[]
  /** The table's quality the chord is, where it is one. */
  quality: ChordQuality | undefined
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  const root = noteFromParam(chord.root)
  const parts = partsFromParams(chord)
  const suffix = (each: ChordQuality) => printedSymbol(qualitySuffix(each))
  const inverts =
    voicingTakesInversion(chord.voicing) &&
    !(chord.voicing === 'close' && takesTwoHands(tones.length))
  const inversions = inverts ? chordInversions(tones) : []
  const bass = (inversion: number) =>
    placeChord(tones, { inversion, bothHands: false }).rh[0]?.tone.note ?? root
  const shown = buildChord(root, parts)
  return (
    <div
      role="group"
      aria-label={printedNote(root) + printedSymbol(shown.suffix)}
      className="flex flex-wrap items-stretch justify-center gap-2"
    >
      <NotePicker
        bare
        label={t('practice:root')}
        value={root}
        onChange={(spelled) => onChange({ root: noteParam(spelled) })}
        className={PART}
      />
      <MenuPicker
        bare
        label={t('practice:chords.builder.chord')}
        value={quality ?? 'maj'}
        groups={CHORD_FAMILIES.map((family) => ({
          label: t(`music:family.${family}`),
          options: qualitiesIn(family).map((each) => ({
            value: each,
            label: printedNote(root) + suffix(each),
            detail: t(`music:quality.${each}`),
          })),
        }))}
        face={(each) =>
          qualitySuffix(each) ? (
            suffix(each)
          ) : (
            <span className="text-[0.5em] text-muted-foreground">
              {t('practice:chords.builder.major')}
            </span>
          )
        }
        onChange={(each) => onChange(qualityParams(each))}
        className={PART}
      />
      {inversions.length > 1 ? (
        <MenuPicker
          bare
          label={t('practice:chords.inTheBass.label')}
          value={chord.inversion}
          options={inversions.map((inversion) => ({
            value: inversion,
            label:
              inversion === 0
                ? t('music:inversionName.root')
                : t('practice:chords.inTheBass.inversion', {
                    inversion: t(`music:inversionName.${INVERSION_NAMES[inversion] ?? 'third'}`),
                    note: printedNote(bass(inversion)),
                  }),
          }))}
          face={(inversion) =>
            inversion === 0 ? (
              <span className="text-base text-muted-foreground">
                {t('practice:chords.inTheBass.root')}
              </span>
            ) : (
              `/${printedNote(bass(inversion))}`
            )
          }
          onChange={(inversion) => onChange({ inversion })}
          className={PART}
        />
      ) : null}
    </div>
  )
}

const INVERSION_NAMES = ['root', 'first', 'second', 'third'] as const
