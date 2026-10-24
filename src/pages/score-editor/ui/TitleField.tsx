import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { TITLE_MAX } from '@/entities/piece'
import { cn } from '@/shared/lib'
import { SheetTitle, type TitlePlace } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'
import { usePaletteBeside } from '../model/use-palette-beside'

/** The title over Your version: at the line's head across, else centred, its field as wide as the sheet. */
const STACKED = {
  across: 'flex flex-col gap-0.5',
  centred: 'flex flex-col gap-0.5 text-center',
} as const
/**
 * The room the palette leaves beside the sheet, which it covers at its right (ADR 0094): the title
 * keeps to it, as the dock does; a page's title is the page's.
 */
const BESIDE = 'pr-84 landscape-phone:pr-80 xl:pr-96'

/**
 * The title printed at the sheet's head (ADR 0094), edited where it is, as Flat's: a click turns it
 * into a field in its place, the title chosen; Enter or leaving the field saves what it holds with the
 * music (an own song's title, or a version's in place of the catalog's), Escape keeps the title it
 * had, and an empty field changes nothing.
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
    // A version of a catalog song says so under its title, as its page does.
    <div className={cn(place === 'across' ? STACKED.across : STACKED.centred, beside && BESIDE)}>
      <SheetTitle title={meta.title} place={place}>
        {editing ? (
          <input
            ref={field}
            aria-label={t('song.title')}
            value={typed}
            maxLength={TITLE_MAX}
            autoComplete="off"
            enterKeyHint="done"
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => {
              if (!settled.current) close(true)
            }}
            className={
              place === 'across'
                ? 'w-full min-w-0 rounded-lg border border-input bg-card px-1'
                : 'w-full min-w-0 rounded-lg border border-input bg-card px-1 text-center'
            }
          />
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
      {meta.hasVersion ? <p className="text-sm text-muted-foreground">{t('yourVersion')}</p> : null}
    </div>
  )
}
