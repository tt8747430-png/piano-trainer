import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { chosenNotes, hasMark, type MarkChoice } from '@/features/score-editor'
import { DYNAMICS } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useNotesChosen } from '../model/use-notes-chosen'
import { GlyphGrid, PaletteKey } from './palette-keys'
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

/** A quarter note with a tremolo's strokes across its stem, as Flat's keys draw them. */
function Stroked({ strokes }: { strokes: 1 | 2 | 3 }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <ellipse cx="9" cy="19" rx="4" ry="2.8" transform="rotate(-20 9 19)" />
      <rect x="12.4" y="2" width="1.4" height="17" />
      {Array.from({ length: strokes }, (_, i) => (
        <path
          key={i}
          d={`M9 ${9 + i * 3.4} L17 ${6.5 + i * 3.4}`}
          stroke="currentColor"
          strokeWidth="1.8"
        />
      ))}
    </svg>
  )
}

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
  children,
}: {
  mark: MarkChoice
  label: string
  children: ReactNode
}) {
  const { actions } = useScoreEditorContext()
  return (
    <PaletteKey
      label={label}
      reason={usePaletteReason()}
      pressed={useMarkOn(mark)}
      disabled={!useNotesChosen()}
      onClick={() => actions.dispatch({ type: 'mark', mark })}
    >
      {children}
    </PaletteKey>
  )
}

/** The Articulations tab: how a note is struck, then the ornaments that decorate it and a rolled chord. */
export function ArticulationKeys() {
  const { t } = useTranslation('editor')
  return (
    <GlyphGrid>
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
      <MarkKey mark={{ kind: 'articulation', articulation: 'portato' }} label={t('marks.portato')}>
        <OnHead mark="•̲" />
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'marcato' }} label={t('marks.marcato')}>
        <OnHead mark="^" />
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'fermata' }} label={t('marks.fermata')}>
        <span aria-hidden className={MUSIC}>
          𝄐
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'breath' }} label={t('marks.breath')}>
        <span aria-hidden className="font-serif text-3xl font-bold leading-none">
          ’
        </span>
      </MarkKey>
      <MarkKey mark={{ kind: 'articulation', articulation: 'caesura' }} label={t('marks.caesura')}>
        <Drawn>
          <path d="M7 19 L12 5 M12 19 L17 5" />
        </Drawn>
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
      <MarkKey
        mark={{ kind: 'ornament', ornament: 'inverted-turn' }}
        label={t('marks.invertedTurn')}
      >
        <span aria-hidden className={`${MUSIC} relative`}>
          𝆗
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
        </span>
      </MarkKey>
      {([1, 2, 3] as const).map((strokes) => (
        <MarkKey
          key={strokes}
          mark={{ kind: 'ornament', ornament: `tremolo-${strokes}` }}
          label={t(`marks.tremolo${strokes}`)}
        >
          <Stroked strokes={strokes} />
        </MarkKey>
      ))}
      <MarkKey mark={{ kind: 'arpeggio' }} label={t('marks.arpeggio')}>
        <Drawn>
          <path d="M12 2 C9 4 15 6 12 8 C9 10 15 12 12 14 C9 16 15 18 12 20 M9 19 L12 22 L15 19" />
        </Drawn>
      </MarkKey>
    </GlyphGrid>
  )
}

/**
 * The Dynamics, Flat's eighteen: ppp to fff, each set from the note it stands under, then the accents
 * (sforzando, forte-piano …), each on its note alone (ADR 0097).
 */
export function DynamicKeys() {
  const { t } = useTranslation('editor')
  return (
    <GlyphGrid>
      {DYNAMICS.map((dynamic) => (
        <MarkKey key={dynamic} mark={{ kind: 'dynamic', dynamic }} label={t(`marks.${dynamic}`)}>
          <span aria-hidden className="font-serif text-xl font-bold italic leading-none">
            {dynamic}
          </span>
        </MarkKey>
      ))}
    </GlyphGrid>
  )
}
