import { useTranslation } from 'react-i18next'
import { barAt, keyChords, keySevenths } from '@/features/score-editor'
import {
  CHORD_FAMILIES,
  chordSymbol,
  LETTERS,
  note,
  noteParam,
  pitchClass,
  qualitiesIn,
  qualitySuffix,
  spellInKey,
  type Chord,
  type ChordQuality,
} from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { Dropdown, ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { ChordField } from './ChordField'

/** No bass under the chord: its root is its lowest note. */
const NO_BASS = 'none'
const CHORD_KEY = 'px-0 font-display text-lg font-semibold'
/** A root's key: its letter, or a sharp or flat on it. */
const ROOT_KEY = 'h-10 px-0 text-base font-semibold landscape-phone:h-9'

/**
 * The chord at the caret, or the key's first where there is none (a bar of no chord, ADR 0094):
 * what a part changed builds on; `symbol` empty where the caret has none.
 */
function useCaretChord(): { chord: Chord; symbol: string } {
  const key = useEditorState((state) => state.draft.key)
  const current = useEditorState((state) => {
    const { start, bar } = barAt(state.draft, state.caret)
    return bar.chords.findLast((placed) => placed.at <= state.caret - start)?.chord
  })
  return {
    chord: current ?? keyChords(key)[0] ?? { root: key.tonic, quality: 'maj' },
    symbol: current ? chordSymbol(current) : '',
  }
}

/** The chord typed (ADR 0089): the field over the chord keypad, opened at the caret's chord. */
export function ChordTyped({ focus }: { focus: boolean }) {
  const caret = useEditorState((state) => state.caret)
  const { symbol } = useCaretChord()
  return <ChordField key={`${caret} ${symbol}`} symbol={symbol} focus={focus} />
}

/** A key for one of the key's chords: set at the caret with a tap, the caret on to the next bar. */
function useChordKey() {
  const { actions } = useScoreEditorContext()
  return (each: Chord) => (
    <ToolKey
      key={chordSymbol(each)}
      label={chordSymbol(each)}
      className={cn(CHORD_KEY, chordSymbol(each).length > 3 && 'text-xs tracking-tight sm:text-sm')}
      onClick={() => actions.dispatch({ type: 'chord', chord: each, advance: 'bar' })}
    >
      {chordSymbol(each)}
    </ToolKey>
  )
}

/** The palette's quick row in the chord names' row: the key's triads, in reach as the values are. */
export function QuickChords() {
  const { t } = useTranslation('editor')
  const key = useEditorState((state) => state.draft.key)
  const tap = useChordKey()
  return (
    <div role="group" aria-label={t('chord.keyChords')} className="grid grid-cols-7 gap-1">
      {keyChords(key).slice(0, 7).map(tap)}
    </div>
  )
}

/** The key's triads and sevenths, each set at the caret with a tap, the caret on to the next bar. */
export function ChordsInKey() {
  const { t } = useTranslation('editor')
  const key = useEditorState((state) => state.draft.key)
  const tap = useChordKey()
  return (
    <div
      role="group"
      aria-label={t('chord.keyChords')}
      className="col-span-full grid grid-cols-7 gap-1.5"
    >
      {keyChords(key).slice(0, 7).map(tap)}
      {keySevenths(key).map(tap)}
    </div>
  )
}

/**
 * The chord built from its parts, as the app's chord explorer builds one: its root, its quality (every
 * one the app knows, by family) and its bass, each change set at the caret at once.
 */
export function ChordBuilt() {
  const { t } = useTranslation(['editor', 'music'])
  const { actions } = useScoreEditorContext()
  const key = useEditorState((state) => state.draft.key)
  const { chord, symbol } = useCaretChord()
  // Its parts pressed where the caret has a chord: a bar of no chord builds on the key's first.
  const built = symbol !== ''
  const set = (next: Chord) => actions.dispatch({ type: 'chord', chord: next, advance: 'stay' })
  const bassNotes = Array.from({ length: 12 }, (_, pc) => spellInKey(pitchClass(pc), key))
  return (
    <div className="col-span-full flex flex-col gap-2">
      <div role="group" aria-label={t('chord.root')} className="grid grid-cols-9 gap-1">
        {LETTERS.map((letter) => (
          <ToolKey
            key={letter}
            label={letter}
            pressed={built && chord.root.letter === letter}
            className={ROOT_KEY}
            onClick={() => set({ ...chord, root: note(letter, chord.root.accidental) })}
          >
            {letter}
          </ToolKey>
        ))}
        {([1, -1] as const).map((accidental) => (
          <ToolKey
            key={accidental}
            label={t(accidental > 0 ? 'music:note.sharp' : 'music:note.flat')}
            pressed={built && chord.root.accidental === accidental}
            className={cn(ROOT_KEY, 'text-lg')}
            onClick={() =>
              set({
                ...chord,
                root: note(
                  chord.root.letter,
                  chord.root.accidental === accidental ? 0 : accidental,
                ),
              })
            }
          >
            {accidental > 0 ? '♯' : '♭'}
          </ToolKey>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Dropdown<ChordQuality>
          label={t('chord.quality')}
          value={chord.quality}
          groups={CHORD_FAMILIES.map((family) => ({
            label: t(`music:family.${family}`),
            options: qualitiesIn(family).map((quality) => ({
              value: quality,
              label: qualitySuffix(quality) || t('music:major'),
              title: t(`music:quality.${quality}`),
              detail: t(`music:quality.${quality}`),
            })),
          }))}
          onChange={(quality) => set({ ...chord, quality })}
        />
        <Dropdown<string>
          label={t('chord.bass')}
          value={chord.bass ? noteParam(chord.bass) : NO_BASS}
          options={[
            { value: NO_BASS, label: t('chord.noBass') },
            ...bassNotes.map((bass) => ({
              value: noteParam(bass),
              label: `/${chordSymbol({ root: bass, quality: 'maj' })}`,
            })),
          ]}
          onChange={(bass) => {
            const { bass: _old, ...rest } = chord
            const under = bassNotes.find((each) => noteParam(each) === bass)
            set(under ? { ...rest, bass: under } : rest)
          }}
        />
      </div>
    </div>
  )
}
