import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { hasMark, notesAt, type MarkChoice } from '@/features/score-editor'
import { DYNAMICS } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** A glyph of the music font (Noto Music), at a key's size. */
const MUSIC = 'font-music text-3xl leading-none'
/** Words as a score prints them: a serif's bold italic. */
const PRINTED = 'font-serif text-lg font-bold italic leading-none'
/** A black notehead, under the articulation it carries. */
const HEAD = '𝅘'

/** A notehead with its mark above it, as a score draws an articulation. */
function OnHead({ mark }: { mark: string }) {
  return (
    <span aria-hidden className="flex flex-col items-center leading-none">
      <span className="text-base font-bold">{mark}</span>
      <span className="font-music text-2xl leading-none">{HEAD}</span>
    </span>
  )
}

/** A small drawing, where the font has no glyph of its own. */
function Drawn({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      {children}
    </svg>
  )
}

const MORDENT = 'M3 15 L7 9 L10 14 L14 8 L17 13 L21 7'

/** Whether every note at the caret wears the mark: its key then stands pressed. */
const useMarkOn = (mark: MarkChoice): boolean =>
  useEditorState((state) => {
    if (state.layer === 'chords') return false
    const notes = notesAt(state.draft, state.layer, state.caret)
    return notes.length > 0 && notes.every((n) => hasMark(n.marks, mark))
  })

/** One mark's key: on and off at the caret, over the bars chosen. */
function MarkKey({
  mark,
  label,
  children,
}: {
  mark: MarkChoice
  label: string
  children: ReactNode
}) {
  const { actions } = useScoreEditorContext()
  return (
    <ToolKey
      label={label}
      pressed={useMarkOn(mark)}
      onClick={() => actions.dispatch({ type: 'mark', mark })}
    >
      {children}
    </ToolKey>
  )
}

/** The Articulations tab: how a note is struck, then the ornaments that decorate it and a rolled chord. */
export function ArticulationKeys() {
  const { t } = useTranslation('editor')
  return (
    <>
      <MarkKey
        mark={{ kind: 'articulation', articulation: 'staccato' }}
        label={t('marks.staccato')}
      >
        <OnHead mark="•" />
      </MarkKey>
      <MarkKey
        mark={{ kind: 'articulation', articulation: 'staccatissimo' }}
        label={t('marks.staccatissimo')}
      >
        <OnHead mark="▾" />
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'accent' }} label={t('marks.accent')}>
        <OnHead mark=">" />
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'tenuto' }} label={t('marks.tenuto')}>
        <OnHead mark="—" />
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'marcato' }} label={t('marks.marcato')}>
        <OnHead mark="^" />
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'fermata' }} label={t('marks.fermata')}>
        <span aria-hidden className={MUSIC}>
          𝄐
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'ornament', ornament: 'trill' }} label={t('marks.trill')}>
        <span aria-hidden className={PRINTED}>
          tr
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'ornament', ornament: 'mordent' }} label={t('marks.mordent')}>
        <Drawn>
          <path d={MORDENT} />
        </Drawn>
      </MarkKey>
      <MarkKey
        mark={{ kind: 'ornament', ornament: 'lower-mordent' }}
        label={t('marks.lowerMordent')}
      >
        <Drawn>
          <path d={MORDENT} />
          <path d="M12 4 L12 19" />
        </Drawn>
      </MarkKey>
      <MarkKey mark={{ kind: 'ornament', ornament: 'turn' }} label={t('marks.turn')}>
        <span aria-hidden className={MUSIC}>
          𝆗
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'ornament', ornament: 'tremolo' }} label={t('marks.tremolo')}>
        <Drawn>
          <path d="M5 9 L19 5 M5 14 L19 10 M5 19 L19 15" />
        </Drawn>
      </MarkKey>
      <MarkKey mark={{ kind: 'arpeggio' }} label={t('marks.arpeggio')}>
        <Drawn>
          <path d="M12 2 C9 4 15 6 12 8 C9 10 15 12 12 14 C9 16 15 18 12 20 M9 19 L12 22 L15 19" />
        </Drawn>
      </MarkKey>
    </>
  )
}

/** The Lines tab: slurs, a tie to the next note, octave lines and hairpins. */
export function LineKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  return (
    <>
      <MarkKey mark={{ kind: 'slurStart' }} label={t('marks.slurStart')}>
        <Drawn>
          <circle cx="5" cy="17" r="2" fill="currentColor" />
          <path d="M5 13 C9 5 17 5 21 11" />
        </Drawn>
      </MarkKey>
      <MarkKey mark={{ kind: 'slurEnd' }} label={t('marks.slurEnd')}>
        <Drawn>
          <circle cx="19" cy="17" r="2" fill="currentColor" />
          <path d="M3 11 C7 5 15 5 19 13" />
        </Drawn>
      </MarkKey>
      <ToolKey label={t('marks.tie')} onClick={() => actions.dispatch({ type: 'tie' })}>
        <Drawn>
          <circle cx="5" cy="9" r="2" fill="currentColor" />
          <circle cx="19" cy="9" r="2" fill="currentColor" />
          <path d="M5 13 C9 18 15 18 19 13" />
        </Drawn>
      </ToolKey>
      <MarkKey mark={{ kind: 'octave', octave: '8va' }} label={t('marks.ottava')}>
        <span aria-hidden className={PRINTED}>
          8<sup>va</sup>
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'octave', octave: '8vb' }} label={t('marks.ottavaBassa')}>
        <span aria-hidden className={PRINTED}>
          8<sup>vb</sup>
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'hairpin', hairpin: 'cresc' }} label={t('marks.cresc')}>
        <Drawn>
          <path d="M21 6 L3 12 L21 18" />
        </Drawn>
      </MarkKey>
      <MarkKey mark={{ kind: 'hairpin', hairpin: 'dim' }} label={t('marks.dim')}>
        <Drawn>
          <path d="M3 6 L21 12 L3 18" />
        </Drawn>
      </MarkKey>
      <MarkKey mark={{ kind: 'hairpin', hairpin: 'end' }} label={t('marks.hairpinEnd')}>
        <Drawn>
          <path d="M3 6 L15 12 L3 18 M20 5 L20 19" />
        </Drawn>
      </MarkKey>
    </>
  )
}

/** The Dynamics tab: pianissimo to fortissimo, each set from the note it stands under. */
export function DynamicKeys() {
  const { t } = useTranslation('editor')
  return (
    <>
      {DYNAMICS.map((dynamic) => (
        <MarkKey key={dynamic} mark={{ kind: 'dynamic', dynamic }} label={t(`marks.${dynamic}`)}>
          <span aria-hidden className="font-serif text-xl font-bold italic leading-none">
            {dynamic}
          </span>
        </MarkKey>
      ))}
    </>
  )
}
