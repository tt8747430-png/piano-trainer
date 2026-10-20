import { ArrowLeft, ArrowRight, Delete } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { barAt, keyChords, keySevenths } from '@/features/score-editor'
import {
  CHORD_FAMILIES,
  chordSymbol,
  noteFromParam,
  noteParam,
  pitchClass,
  qualitiesIn,
  qualitySuffix,
  spellInKey,
  type Chord,
  type ChordQuality,
} from '@/shared/lib/music'
import { Dropdown, NoteChoice, ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { ChordField } from './ChordField'

/** No bass under the chord: its root is its lowest note. */
const NO_BASS = 'none'
const CHORD_KEY = 'font-display text-lg font-semibold'

/**
 * The chord names' tools (ADR 0064): the chord at the caret typed (any the app reads), or built from
 * its root, quality (every one the app knows, by family) and bass, each change set at once; the key's
 * triads and sevenths to tap; and Delete and the caret's steps along the row.
 */
export function ChordKeys() {
  const { t } = useTranslation(['editor', 'music'])
  const { actions } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const key = useEditorState((state) => state.draft.key)
  const caret = useEditorState((state) => state.caret)
  const current = useEditorState((state) => {
    const { start, bar } = barAt(state.draft, state.caret)
    return bar.chords.findLast((placed) => placed.at <= state.caret - start)?.chord
  })
  const symbol = current ? chordSymbol(current) : ''
  const chord: Chord = current ?? keyChords(key)[0] ?? { root: key.tonic, quality: 'maj' }
  const set = (next: Chord) => dispatch({ type: 'chord', chord: next, advance: 'stay' })
  const bassNotes = Array.from({ length: 12 }, (_, pc) => spellInKey(pitchClass(pc), key))
  const tap = (each: Chord) => (
    <ToolKey
      key={chordSymbol(each)}
      label={chordSymbol(each)}
      className={CHORD_KEY}
      onClick={() => dispatch({ type: 'chord', chord: each, advance: 'bar' })}
    >
      {chordSymbol(each)}
    </ToolKey>
  )
  return (
    <>
      <div className="col-span-full">
        <ChordField key={`${caret} ${symbol}`} symbol={symbol} />
      </div>
      <div className="col-span-full flex flex-col gap-3">
        <NoteChoice
          label={t('chord.root')}
          value={noteParam(chord.root)}
          onChange={(root) => set({ ...chord, root: noteFromParam(root) })}
        />
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
      <div
        role="group"
        aria-label={t('chord.keyChords')}
        className="col-span-full grid grid-cols-7 gap-1.5"
      >
        {keyChords(key).slice(0, 7).map(tap)}
        {keySevenths(key).map(tap)}
      </div>
      <ToolKey
        label={t('back')}
        onClick={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
      >
        <ArrowLeft aria-hidden />
      </ToolKey>
      <ToolKey label={t('on')} onClick={() => dispatch({ type: 'move', by: 'step', direction: 1 })}>
        <ArrowRight aria-hidden />
      </ToolKey>
      <ToolKey
        label={t('chord.delete')}
        span="wide"
        onClick={() => dispatch({ type: 'delete', back: true })}
      >
        <Delete aria-hidden />
      </ToolKey>
    </>
  )
}
