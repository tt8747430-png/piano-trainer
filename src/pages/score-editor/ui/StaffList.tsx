import { Eye, EyeOff, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import type { HiddenRow } from '@/entities/piece'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { InstrumentChoice } from './InstrumentChoice'

/** A row's Shown: an eye that hides the row and keeps its music, as a notation app's does. */
function ShownButton({ row, name }: { row: HiddenRow; name: string }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const hidden = useEditorState((state) => state.draft.hidden.includes(row))
  const label = t(hidden ? 'staves.show' : 'staves.hide', { name })
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      aria-pressed={!hidden}
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

/** One row of the list: its name (or its instrument's choice), then its buttons. */
function StaffRow({
  name,
  hidden,
  children,
  actions,
}: {
  name: string
  hidden: boolean
  children?: ReactNode
  actions: ReactNode
}) {
  return (
    <li className="flex min-h-14 items-center gap-2 border-b border-border py-1.5 last:border-b-0">
      <div className={hidden ? 'min-w-0 flex-1 opacity-55' : 'min-w-0 flex-1'}>
        {children ?? <span className="text-lg">{name}</span>}
      </div>
      <div className="flex shrink-0 items-center">{actions}</div>
    </li>
  )
}

/**
 * The score's rows as a notation app's instruments panel lists them (ADR 0072): the chord names, the
 * tune's staff and each more voice's, each with its instrument; an eye shows or hides a row and keeps
 * its music; Remove takes a part away with its notes. The piano's two staves are always there; a part
 * is added by the Song sheet's Add a part beside it (ADR 0080).
 */
export function StaffList() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const melodyStaff = useEditorState((state) => state.draft.melodyStaff)
  const voices = useEditorState((state) => state.draft.voices.length)
  const hiddenRows = useEditorState(useShallow((state) => state.draft.hidden))
  const hidden = (row: HiddenRow) => hiddenRows.includes(row)
  const chords = t('chordNames')
  const tune = t('layers.melody')
  return (
    <ul aria-label={t('staves.label')} className="flex flex-col">
      <StaffRow
        name={chords}
        hidden={hidden('chords')}
        actions={<ShownButton row="chords" name={chords} />}
      />
      {melodyStaff ? (
        <StaffRow
          name={tune}
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
    </ul>
  )
}
