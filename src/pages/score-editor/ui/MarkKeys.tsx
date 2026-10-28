import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { chosenNotes, hasMark, type MarkChoice } from '@/features/score-editor'
import { DYNAMICS, type Pedal } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useNotesChosen } from '../model/use-notes-chosen'
import type { Tool } from '../model/shortcuts'
import { PaletteKey } from './palette-keys'
import { usePaletteReason } from './palette-reason'

/** A glyph of the music font (Noto Music), at a key's size. */
const MUSIC = 'font-music text-3xl leading-none'
/** Words as a score prints them: a serif's bold italic. */
const PRINTED = 'font-serif text-lg font-bold italic leading-none'
/** A black notehead with its mark above it, as a score draws an articulation. */
function OnHead({ mark }: { mark: string }) {
  return (
    <span aria-hidden className="flex flex-col items-center gap-0.5 leading-none">
      <span className="text-sm font-bold">{mark}</span>
      <svg viewBox="0 0 14 10" className="h-2.5 w-3.5">
        <ellipse cx="7" cy="5" rx="6" ry="3.8" transform="rotate(-20 7 5)" fill="currentColor" />
      </svg>
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

/** Whether every note chosen wears the mark: its key then stands pressed. */
const useMarkOn = (mark: MarkChoice): boolean =>
  useEditorState((state) => {
    const notes = chosenNotes(state)
    return notes.length > 0 && notes.every((n) => hasMark(n.marks, mark))
  })

/** One mark's key: on and off on the notes chosen; greyed with none chosen, saying why. */
function MarkKey({
  mark,
  label,
  tool,
  children,
}: {
  mark: MarkChoice
  label: string
  tool?: Tool
  children: ReactNode
}) {
  const { actions } = useScoreEditorContext()
  return (
    <PaletteKey
      label={label}
      tool={tool}
      reason={usePaletteReason()}
      pressed={useMarkOn(mark)}
      disabled={!useNotesChosen()}
      onClick={() => actions.dispatch({ type: 'mark', mark })}
    >
      {children}
    </PaletteKey>
  )
}

/** The Articulations' marks (Flat's order): how a note is struck, and held under a fermata. */
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
    </>
  )
}

/** The Ornaments (Flat's): the trill, the tremolo, the rolled chord, the mordents and the turn. */
export function OrnamentKeys() {
  const { t } = useTranslation('editor')
  return (
    <>
      <MarkKey mark={{ kind: 'ornament', ornament: 'trill' }} label={t('marks.trill')} tool="trill">
        <span aria-hidden className={PRINTED}>
          tr
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'ornament', ornament: 'tremolo' }} label={t('marks.tremolo')}>
        {/* Flat's: a note, strokes across its stem. */}
        <Drawn>
          <ellipse
            cx="9"
            cy="18.5"
            rx="3.6"
            ry="2.6"
            transform="rotate(-20 9 18.5)"
            fill="currentColor"
            stroke="none"
          />
          <path d="M12.3 18V3" strokeWidth="1.5" />
          <path d="M8 10 L16.5 7.5 M8 14 L16.5 11.5" strokeWidth="2.25" />
        </Drawn>
      </MarkKey>
      <MarkKey mark={{ kind: 'arpeggio' }} label={t('marks.arpeggio')}>
        <Drawn>
          <path d="M12 2 C9 4 15 6 12 8 C9 10 15 12 12 14 C9 16 15 18 12 20 M9 19 L12 22 L15 19" />
        </Drawn>
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
    </>
  )
}

/** The pedal's marks, drawn as printed: pressed, changed, let up. */
const PEDALS = [
  { pedal: 'down', glyph: '𝆮', label: 'marks.pedalDown' },
  { pedal: 'change', glyph: '𝆯𝆮', label: 'marks.pedalChange' },
  { pedal: 'up', glyph: '𝆯', label: 'marks.pedalUp' },
] as const satisfies readonly { pedal: Pedal; glyph: string; label: string }[]

/**
 * The pedal (Flat's, in Dynamics): pressed under the note chosen, let up under the last of a span
 * chosen; changed; let up.
 */
export function PedalKeys() {
  const { t } = useTranslation('editor')
  return PEDALS.map(({ pedal, glyph, label }) => (
    <MarkKey
      key={pedal}
      mark={{ kind: 'pedal', pedal }}
      label={t(label)}
      tool={pedal === 'down' ? 'pedal' : undefined}
    >
      <span aria-hidden className={MUSIC}>
        {glyph}
      </span>
    </MarkKey>
  ))
}

/** The Dynamics: pianissimo to fortissimo, each set from the note it stands under. */
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
