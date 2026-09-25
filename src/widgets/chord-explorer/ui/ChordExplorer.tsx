import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  CHORD_FAMILIES,
  chordFamily,
  chordRootSpelling,
  chordSymbol,
  keyboardRange,
  lastInversion,
  MIDDLE_C,
  midi,
  noteFromParam,
  noteName,
  noteParam,
  pitchClass,
  placeChord,
  qualitiesIn,
  qualitySuffix,
  spellChord,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { usePlayChord } from '@/shared/lib/services'
import { ChipRow, PianoKeyboard, ROLE_BG, RoleLegend, Segmented, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { ChordView } from '../model/chord-view'

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
/** Two octaves from middle C: the keyboard grows past them only for a chord that needs it. */
const AT_LEAST: KeyRange = { from: MIDDLE_C, to: midi(83) }
/** Root position and the first three inversions, with the name each has on screen. */
const INVERSIONS = [
  { value: 0, name: 'root' },
  { value: 1, name: 'first' },
  { value: 2, name: 'second' },
  { value: 3, name: 'third' },
] as const

/** Any chord on any root: its keys by role and degree, inversions, one hand or two, played. */
export function ChordExplorer({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['theory', 'common'])
  const playChord = usePlayChord()
  const root = noteFromParam(chord.root)
  const placed = placeChord(root, chord.quality, {
    inversion: chord.inversion,
    bothHands: chord.hands === 'both',
  })
  const keys = [...placed.lh, ...placed.rh]
  const tones = spellChord(root, chord.quality)
  const family = chordFamily(chord.quality)
  const marks = new Map<Midi, KeyMark>(
    keys.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }]),
  )
  const sound = (view: ChordView, arpeggio = false) =>
    playChord(
      { root: noteFromParam(view.root), quality: view.quality },
      { inversion: view.inversion, bothHands: view.hands === 'both', arpeggio },
    )
  const change = (next: Partial<ChordView>) => {
    onChange(next)
    sound({ ...chord, ...next })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-6xl font-extrabold tracking-tight">
          {chordSymbol({ root, quality: chord.quality })}
        </h2>
        <p className="text-right text-muted-foreground">{t(`theory:quality.${chord.quality}`)}</p>
      </div>
      <ChipRow
        label={t('theory:root')}
        value={chord.root}
        options={PITCH_CLASSES.map((pc) => {
          const spelled = chordRootSpelling(pc, chord.quality)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(value) => change({ root: value })}
      />
      <ChipRow
        label={t('theory:familyLabel')}
        value={family}
        options={CHORD_FAMILIES.map((f) => ({ value: f, label: t(`theory:family.${f}`) }))}
        onChange={(next) => {
          const [first] = qualitiesIn(next)
          if (first) change({ quality: first, inversion: 0 })
        }}
      />
      <ChipRow
        label={t('theory:qualityLabel')}
        value={chord.quality}
        options={qualitiesIn(family).map((q) => ({
          value: q,
          label: qualitySuffix(q) || t('theory:major'),
          title: t(`theory:quality.${q}`),
        }))}
        onChange={(quality) => change({ quality, inversion: 0 })}
      />
      <PianoKeyboard
        label={t('common:keyboard')}
        range={keyboardRange(
          keys.map((key) => key.midi),
          AT_LEAST,
        )}
        marks={marks}
        className="h-44"
      />
      <RoleLegend roles={[...new Set(tones.map((tone) => tone.role))]} />
      <ol className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <li
            key={tone.degree}
            className="flex items-center gap-2 rounded-full bg-card py-1 pr-3 pl-1 ring-1 ring-border"
          >
            <span
              className={cn(
                'grid size-7 place-items-center rounded-full text-sm font-bold text-on-role',
                ROLE_BG[tone.role],
              )}
            >
              {tone.degree}
            </span>
            <span className="font-semibold">{noteName(tone.note)}</span>
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Segmented
          label={t('theory:inversionLabel')}
          value={chord.inversion}
          options={INVERSIONS.filter(({ value }) => value <= lastInversion(chord.quality)).map(
            ({ value, name }) => ({ value, label: t(`theory:inversion.${name}`) }),
          )}
          onChange={(inversion) => change({ inversion })}
        />
        <Segmented
          label={t('theory:handsLabel')}
          value={chord.hands}
          options={[
            { value: 'rh', label: t('common:hands.rh') },
            { value: 'both', label: t('common:hands.both') },
          ]}
          onChange={(hands) => change({ hands })}
        />
      </div>
      <div className="flex gap-3">
        <Button size="pill" className="flex-1" onClick={() => sound(chord)}>
          {t('theory:play')}
        </Button>
        <Button size="pill" variant="soft" className="flex-1" onClick={() => sound(chord, true)}>
          {t('theory:arpeggio')}
        </Button>
      </div>
    </div>
  )
}
