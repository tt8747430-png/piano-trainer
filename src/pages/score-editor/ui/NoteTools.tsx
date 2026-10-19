import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Delete, Ellipsis, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isHandLayer, NOTE_VALUES, takesDot } from '@/features/score-editor'
import { isCompound } from '@/shared/lib/music'
import { Segmented, ToolButton, ToolDivider } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { VALUE_GLYPHS, VALUE_WORDS } from '../model/value-words'
import { ActionMenu } from './ActionMenu'
import { HandBarTools } from './HandBarTools'
import { TrebleVoice } from './TrebleVoice'

/** A tool drawn as notation: a glyph of the music font, at a note value's size. */
const GLYPH = 'font-sans text-3xl leading-none'
/** A quarter rest, as the staff draws it. */
const REST = '𝄽'
/** What a laptop shows in its row, and a phone keeps in More tools. */
const LAPTOP_ONLY = 'contents max-lg:hidden'

/** A hairline between groups of tools, where they stand in one row: a phone's rows wrap without. */
export function Divider() {
  return (
    <span className={LAPTOP_ONLY}>
      <ToolDivider />
    </span>
  )
}

/** Triplet, but in a compound meter, whose beats are already split in three. */
function TripletTool() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const triplet = useEditorState((state) => state.value.triplet)
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  if (compound) return null
  return (
    <ToolButton
      label={t('triplet')}
      pressed={triplet}
      onClick={() => actions.dispatch({ type: 'triplet' })}
    >
      <span aria-hidden className="font-display text-xl font-semibold italic">
        3
      </span>
    </ToolButton>
  )
}

/** The notes at the caret a semitone up or down, or spelled the other way. */
function ShiftTools() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const dispatch = actions.dispatch
  return (
    <>
      <ToolButton label={t('up')} onClick={() => dispatch({ type: 'shift', semitones: 1 })}>
        <ArrowUp aria-hidden />
      </ToolButton>
      <ToolButton label={t('down')} onClick={() => dispatch({ type: 'shift', semitones: -1 })}>
        <ArrowDown aria-hidden />
      </ToolButton>
      <ToolButton label={t('respell')} onClick={() => dispatch({ type: 'respell' })}>
        <span aria-hidden className="text-xl font-semibold tracking-tight">
          ♯♭
        </span>
      </ToolButton>
    </>
  )
}

/** A phone's rare tools in one pull-down: Triplet, the shifts and respelling, and a hand bar's own. */
function MoreTools() {
  const { t } = useTranslation('editor')
  return (
    <ActionMenu
      label={t('moreTools')}
      align="end"
      render={
        <Button
          variant="outline"
          size="icon"
          aria-label={t('moreTools')}
          title={t('moreTools')}
          className="shrink-0"
        />
      }
      trigger={<Ellipsis aria-hidden />}
    >
      <div className="flex flex-wrap gap-1">
        <TripletTool />
        <ShiftTools />
      </div>
      <div className="flex flex-wrap items-end gap-2 empty:hidden">
        <HandBarTools />
      </div>
    </ActionMenu>
  )
}

/**
 * Writing notes, most used first: the value, Dot and Rest; the voice, Chord, the caret's arrows and
 * Delete. On a laptop every tool stands in sight in groups parted by a hairline (the voice first,
 * Triplet, the notes a semitone up or down, respelled, and a hand bar's own tools); a phone wraps
 * them in two rows and keeps those in More tools.
 */
export function NoteTools() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const value = useEditorState((state) => state.value)
  const chord = useEditorState((state) => state.chord)
  const hand = useEditorState((state) => isHandLayer(state.layer))
  const dottable = useEditorState((state) => takesDot(state.value.value, state.draft.meter))
  const dispatch = actions.dispatch
  return (
    <>
      <div className="w-61 shrink-0 lg:w-64">
        <Segmented
          label={t('values.label')}
          value={value.value}
          options={NOTE_VALUES.map((option) => ({
            value: option,
            label: '',
            icon: (
              <span aria-hidden className={GLYPH}>
                {VALUE_GLYPHS[option]}
              </span>
            ),
            title: t(`values.${VALUE_WORDS[option]}`),
          }))}
          onChange={(next) => dispatch({ type: 'value', value: next })}
        />
      </div>
      <Divider />
      <div role="group" aria-label={t('groups.value')} className="flex shrink-0 gap-1">
        <ToolButton
          label={t('dot')}
          pressed={value.dots === 1}
          disabled={!dottable}
          onClick={() => dispatch({ type: 'dot' })}
        >
          <span aria-hidden className={GLYPH}>
            {VALUE_GLYPHS[4]}.
          </span>
        </ToolButton>
        <span className={LAPTOP_ONLY}>
          <TripletTool />
        </span>
        <ToolButton label={t('rest')} onClick={() => dispatch({ type: 'rest' })}>
          <span aria-hidden className={GLYPH}>
            {REST}
          </span>
        </ToolButton>
      </div>
      <TrebleVoice />
      <ToolButton
        label={t('chordMode')}
        pressed={chord}
        onClick={() => dispatch({ type: 'chordMode' })}
      >
        <Layers aria-hidden />
      </ToolButton>
      <Divider />
      <div role="group" aria-label={t('groups.caret')} className="flex shrink-0 gap-1">
        <ToolButton
          label={t('back')}
          onClick={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
        >
          <ArrowLeft aria-hidden />
        </ToolButton>
        <ToolButton
          label={t('on')}
          onClick={() => dispatch({ type: 'move', by: 'step', direction: 1 })}
        >
          <ArrowRight aria-hidden />
        </ToolButton>
      </div>
      <Divider />
      <div role="group" aria-label={t('groups.notes')} className="flex shrink-0 gap-1">
        <span className={LAPTOP_ONLY}>
          <ShiftTools />
        </span>
        <ToolButton label={t('deleteNotes')} onClick={() => dispatch({ type: 'delete' })}>
          <Delete aria-hidden />
        </ToolButton>
      </div>
      {hand ? (
        <span className={LAPTOP_ONLY}>
          <ToolDivider />
          <HandBarTools />
        </span>
      ) : null}
      <span className="contents lg:hidden">
        <MoreTools />
      </span>
    </>
  )
}
