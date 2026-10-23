import { Eye, EyeOff, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import type { HiddenRow } from '@/entities/piece'
import { keepsAStaff, rowShown } from '@/features/score-editor'
import { cn } from '@/shared/lib'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { InstrumentChoice } from './InstrumentChoice'

/**
 * A row's Shown: an eye that hides the row and keeps its music, as a notation app's does; the last
 * staff in sight's cannot hide it (ADR 0083).
 */
function ShownButton({ row, name }: { row: HiddenRow; name: string }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const hidden = useEditorState((state) => state.draft.hidden.includes(row))
  const locked = useEditorState(
    (state) => !hidden && !keepsAStaff(state.draft, [...state.draft.hidden, row]),
  )
  const label = t(hidden ? 'staves.show' : 'staves.hide', { name })
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={locked ? t('staves.lastStaff') : label}
      aria-pressed={!hidden}
      disabled={locked}
      className="rounded-full text-muted-foreground aria-pressed:text-foreground"
      onClick={() => actions.dispatch({ type: 'hide', row, hidden: !hidden })}
    >
      {hidden ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
    </Button>
  )
}

/** A part's Remove: its staff and every note on it taken away (undone by Undo). */
function RemoveButton({ name, onRemove }: { name: string; onRemove: () => void }) {
  const { t } = useTranslation('editor')
  const label = t('staves.remove', { name })
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="rounded-full text-muted-foreground hover:text-destructive"
      onClick={onRemove}
    >
      <Trash2 aria-hidden />
    </Button>
  )
}

/** One row of the list: its name (or its instrument's choice) over what it is, then its buttons. */
function StaffRow({
  name,
  detail,
  hidden,
  children,
  actions,
}: {
  name: string
  /** What the part is, in a line. */
  detail: string
  hidden: boolean
  children?: ReactNode
  actions: ReactNode
}) {
  return (
    <li className="flex min-h-14 items-center gap-2 border-b border-border py-2 last:border-b-0">
      <div className={cn('flex min-w-0 flex-1 flex-col gap-1', hidden && 'opacity-55')}>
        {children ?? <span className="text-lg">{name}</span>}
        <span className="text-sm text-muted-foreground">{detail}</span>
      </div>
      <div className="flex shrink-0 items-center">{actions}</div>
    </li>
  )
}

/**
 * The score's parts as a notation app's instruments panel lists them, top down as the score writes
 * them (ADR 0072, 0083): the chord names, the tune's staff and each more voice's, each with its
 * instrument, and the piano; each says in a line what it is. An eye shows or hides a row and keeps
 * its music, never the last staff in sight; Remove takes a sung part away with its notes. A part is
 * added by the Song sheet's Add a part beside it (ADR 0080).
 */
export function StaffList() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const melodyStaff = useEditorState((state) => state.draft.melodyStaff)
  const voices = useEditorState((state) => state.draft.voices.length)
  const hiddenRows = useEditorState(useShallow((state) => state.draft.hidden))
  // Whether one staff is the last in sight: its eye is kept, and the list says why.
  const lastStaff = useEditorState((state) =>
    (['melody', ...EXTRA_VOICES, 'piano'] as const).some(
      (row) =>
        rowShown(state.draft, row) && !keepsAStaff(state.draft, [...state.draft.hidden, row]),
    ),
  )
  const hidden = (row: HiddenRow) => hiddenRows.includes(row)
  const chords = t('chordNames')
  const tune = t('layers.melody')
  const piano = t('staves.piano')
  return (
    <>
      <ul aria-label={t('staves.label')} className="flex flex-col">
        <StaffRow
          name={chords}
          detail={t('staves.detail.chords')}
          hidden={hidden('chords')}
          actions={<ShownButton row="chords" name={chords} />}
        />
        {melodyStaff ? (
          <StaffRow
            name={tune}
            detail={t('staves.detail.melody')}
            hidden={hidden('melody')}
            actions={
              <>
                <ShownButton row="melody" name={tune} />
                <RemoveButton
                  name={tune}
                  onRemove={() => actions.dispatch({ type: 'melodyStaff', on: false })}
                />
              </>
            }
          >
            <InstrumentChoice part={0} label={tune} />
          </StaffRow>
        ) : null}
        {EXTRA_VOICES.slice(0, voices).map((voice, i) => {
          const name = t(`layers.${voice}`)
          return (
            <StaffRow
              key={voice}
              name={name}
              detail={t('staves.detail.voice')}
              hidden={hidden(voice)}
              actions={
                <>
                  <ShownButton row={voice} name={name} />
                  <RemoveButton
                    name={name}
                    onRemove={() => actions.dispatch({ type: 'voiceStaff', voice, on: false })}
                  />
                </>
              }
            >
              <InstrumentChoice part={i + 1} label={name} />
            </StaffRow>
          )
        })}
        <StaffRow
          name={piano}
          detail={t('staves.detail.piano')}
          hidden={hidden('piano')}
          actions={<ShownButton row="piano" name={piano} />}
        />
      </ul>
      {lastStaff ? <p className="text-sm text-muted-foreground">{t('staves.lastStaff')}</p> : null}
    </>
  )
}
