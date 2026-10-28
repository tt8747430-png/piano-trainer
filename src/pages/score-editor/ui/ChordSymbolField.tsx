import { WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chordSuggestions, chordWrittenAt } from '@/features/score-editor'
import { chordSymbol, printedSymbol, readChordSymbol, type Chord } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { wizardOf } from '../model/chord-wizard'
import { useFieldText } from '../model/use-field-text'
import { ChordWizard } from './ChordWizard'
import { SheetField } from './SheetField'

/**
 * The chord-symbol field (ADR 0096, Flat's): the chord written at the caret's beat, typed over the
 * chord row where it is printed. What is typed is written as the field goes on or is left
 * (`readChordSymbol`): Enter or → a beat on, ← a beat back, Escape out; a symbol that cannot be read
 * is marked and written nowhere; emptied, the chord there comes off (a bar may hold none, ADR 0114).
 * Under it, the chords to tap, those starting as typed: the key's, I to vii, triads then sevenths,
 * then the song's own; a tap writes one and goes on.
 */
export function ChordSymbolField({ anchor }: { anchor: HTMLElement | null }) {
  const { t } = useTranslation('editor')
  const {
    actions: { dispatch },
    view,
  } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const at = String(caret)
  const written = chordWrittenAt(draft, caret)
  const shown = written ? chordSymbol(written) : ''
  // What was typed marked where it cannot be read, until it changes.
  const { text, setText, wrong, markWrong } = useFieldText(shown, at)
  const typed = text.trim()

  /** What is typed written at the caret's beat; false where it cannot be read. */
  const write = (): boolean => {
    if (typed === shown) return true
    if (typed === '') {
      if (written) dispatch({ type: 'delete' })
      return true
    }
    const chord = readChordSymbol(typed)
    if (!chord) return false
    dispatch({ type: 'chord', chord })
    return true
  }
  const go = (direction: -1 | 1) => {
    if (!write()) markWrong()
    else dispatch({ type: 'move', by: 'step', direction })
  }
  const choose = (chord: Chord) => {
    dispatch({ type: 'chord', chord })
    dispatch({ type: 'move', by: 'step', direction: 1 })
  }
  // Every chord offered over what is written there; those starting as typed once one types.
  const offered = chordSuggestions(draft, caret, text === shown ? '' : text)
  // The chord wizard (Flat's) in the suggestions' place, built from what is typed.
  const [wizard, setWizard] = useState(false)
  return (
    <SheetField
      kind="chord"
      anchor={anchor}
      label={t('chord.symbol')}
      text={text}
      onText={setText}
      at={at}
      error={wrong ? t('chord.invalid') : undefined}
      onGo={go}
      onClose={() => {
        write()
        view.openField(null)
      }}
      beside={
        <button
          type="button"
          aria-label={t('chord.wizard')}
          title={t('chord.wizard')}
          aria-pressed={wizard}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => setWizard(!wizard)}
          className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground aria-pressed:bg-[color-mix(in_oklab,var(--color-link)_14%,var(--color-card))] aria-pressed:text-link"
        >
          <WandSparkles aria-hidden className="size-5" />
        </button>
      }
    >
      {wizard ? (
        <ChordWizard
          from={wizardOf(readChordSymbol(typed))}
          onChord={(chord) => setText(chordSymbol(chord))}
          onAdd={() => go(1)}
        />
      ) : offered.length > 0 ? (
        <div
          role="group"
          aria-label={t('chord.suggested')}
          className="fade-scroll-x flex max-w-[min(22rem,calc(100vw-2rem))] gap-1 overflow-x-auto scrollbar-none"
        >
          {offered.map((chord) => {
            const symbol = chordSymbol(chord)
            return (
              <button
                key={symbol}
                type="button"
                // A tap leaves the cursor in the field: a phone's own keyboard stays up.
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(chord)}
                className="h-11 shrink-0 rounded-xl border border-border bg-card px-2.5 font-display text-lg font-semibold whitespace-nowrap text-card-foreground transition-colors duration-200 ease-out hover:bg-chosen focus-visible:-outline-offset-3"
              >
                {printedSymbol(symbol)}
              </button>
            )
          })}
        </div>
      ) : null}
    </SheetField>
  )
}
