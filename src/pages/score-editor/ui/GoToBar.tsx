import { useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, barsOf } from '@/features/score-editor'
import { PanelPopover } from '@/shared/ui'
import { Input } from '@/shared/ui/primitives/input'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * Go to bar (research F11, Flat's and Dorico's ⌘G; the EditorLaptop board's card): a small card
 * hung under the sheet's head, the caret's bar in its field and how many there are beside it; Enter
 * takes the caret to that bar's first beat, on the row it is on, and closes it, as a click outside
 * or Escape does.
 */
export function GoToBar() {
  const { t } = useTranslation('editor')
  const { view, actions } = useScoreEditorContext()
  const count = useEditorState((state) => barsOf(state.draft).length)
  const here = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null)
  const field = useRef<HTMLInputElement>(null)
  const go = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const typed = Number.parseInt(field.current?.value ?? '', 10)
    if (Number.isFinite(typed)) actions.goToBar(Math.min(Math.max(typed, 1), count))
    view.setGoingTo(false)
  }
  return (
    <>
      <div ref={setAnchor} aria-hidden className="absolute top-0 left-1/2 size-0" />
      <PanelPopover
        title={t('goToBar.title')}
        open={view.goingTo}
        onOpenChange={view.setGoingTo}
        anchor={anchor}
        initialFocus={field}
        className="w-65"
      >
        <form onSubmit={go} className="flex items-center gap-3">
          <Input
            ref={field}
            defaultValue={String(here)}
            inputMode="numeric"
            enterKeyHint="go"
            aria-label={t('goToBar.bar')}
            onFocus={(event) => event.currentTarget.select()}
            className="h-12 w-24 rounded-control px-4 text-lg tabular-nums"
          />
          <span className="text-subhead text-muted-foreground tabular-nums">
            {t('goToBar.of', { count })}
          </span>
        </form>
      </PanelPopover>
    </>
  )
}
