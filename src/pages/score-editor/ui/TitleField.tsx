import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { TITLE_MAX } from '@/entities/piece'
import { cn } from '@/shared/lib'
import { SheetTitle, type TitlePlace } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'
import { usePaletteBeside } from '../model/use-palette-beside'

/** The title: at the line's head across, else centred, its field as wide as the sheet. */
const PLACED = { across: '', centred: 'text-center' } as const
/**
 * The room the palette leaves beside the sheet, which it covers at its right (ADR 0094): the title
 * keeps to it, as the dock does; a page's title is the page's.
 */
const BESIDE = 'pr-84 landscape-phone:pr-80 xl:pr-96'

/**
 * The title printed at the sheet's head (ADR 0094), edited where it is, as Flat's: a click turns it
 * into a field in its place, the title chosen; Enter or leaving the field saves what it holds with the
 * music (an own song's title, or a version's in place of the catalog's), Escape keeps the title it
 * had, and an empty field changes nothing. Nothing is printed under it the learner did not write: a
 * version says it is theirs on the song's page (ADR 0096).
 */
export function TitleField({ place }: { place: TitlePlace }) {
  const { t } = useTranslation('editor')
  const { actions, meta } = useScoreEditorContext()
  const beside = usePaletteBeside() && place !== 'page'
  // What the field holds while it is open; null while the title is printed.
  const [typed, setTyped] = useState<string | null>(null)
  const editing = typed !== null
  const field = useRef<HTMLInputElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  // Closed by Enter or Escape: the title takes the focus back, and the field's blur saves nothing.
  const settled = useRef(false)
  useEffect(() => {
    if (editing) {
      field.current?.focus()
      field.current?.select()
    } else if (settled.current) button.current?.focus()
  }, [editing])
  const close = (save: boolean) => {
    if (typed === null) return
    // The title as it was is no title of the learner's own: a catalog song keeps no version for it.
    if (save && typed.trim() !== meta.title) actions.dispatch({ type: 'title', title: typed })
    setTyped(null)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') return
    event.preventDefault()
    settled.current = true
    close(event.key === 'Enter')
  }
  return (
    <div className={cn(place === 'across' ? PLACED.across : PLACED.centred, beside && BESIDE)}>
      <SheetTitle title={meta.title} place={place}>
        {editing ? (
          // In place, at the title's size, as wide as what it holds (a copy of it, unseen, sizes
          // the cell the field fills): no box round it, its line under it, so a phone's handles
          // stay on the text and nothing under the title is covered (ADR 0110).
          <span className="inline-grid max-w-full align-top">
            <span aria-hidden className="invisible col-start-1 row-start-1 px-1 whitespace-pre">
              {typed === '' ? ' ' : typed}
            </span>
            <input
              ref={field}
              aria-label={t('song.title')}
              value={typed}
              maxLength={TITLE_MAX}
              // Its own width the copy's, never the browser's twenty characters.
              size={1}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              onChange={(event) => setTyped(event.target.value)}
              onKeyDown={onKeyDown}
              onBlur={() => {
                if (!settled.current) close(true)
              }}
              className={cn(
                'col-start-1 row-start-1 w-full min-w-0 rounded-none border-0 bg-transparent px-1 font-[inherit] leading-[inherit] text-inherit shadow-[inset_0_-2px_0_var(--color-ring)] outline-none',
                place !== 'across' && 'text-center',
              )}
            />
          </span>
        ) : (
          <button
            ref={button}
            type="button"
            title={t('printed.rename')}
            onClick={() => {
              settled.current = false
              setTyped(meta.title)
            }}
            className="max-w-full cursor-text rounded-lg px-1 text-balance wrap-break-word transition-colors duration-200 ease-out hover:bg-foreground/5"
          >
            {meta.title}
          </button>
        )}
      </SheetTitle>
    </div>
  )
}
