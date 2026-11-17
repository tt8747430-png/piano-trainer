import { Minimize, PencilLine } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, setFocusMode, useFocusMode } from '@/shared/lib'
import { Button } from './primitives/button'
import { RoundButton } from './RoundButton'
import { NO_BAR_SIZE, useScreenBar } from './screen-bar'
import { usePageHeading } from './use-page-heading'

/**
 * A screen's Edit (iOS's Edit · Done, Notion's in-place edit): the pencil right after the title, so it
 * reads as "edit this"; while editing, Done in its place, so the control never moves between modes.
 * The screen enters Edit in place; it passes only the acts that apply while editing.
 */
export interface EditAction {
  readonly editing: boolean
  readonly onEdit: () => void
  readonly onDone: () => void
  /** Done waits (a take recording, a save under way). */
  readonly disabled?: boolean
  /** What ✎ edits, where Edit alone would not say: a song's page edits its score (R31-S). */
  readonly label?: string
}

export type ScreenHeaderProps = {
  /** The screen's name: its title and the page's. */
  title: string
  back?: ReactNode
  /**
   * The bar's end, always in this order whatever order they are given (A3, DESIGN.md Placement): the
   * screen's tools (Search, MIDI, an act on the item such as a lesson's Learned), its Settings (the
   * gear) and More (⋯, commands only).
   */
  tools?: ReactNode
  settings?: ReactNode
  more?: ReactNode
  /** The screen's Edit: its pencil beside the title, Done in its place while editing. */
  edit?: EditAction
  /**
   * The page reads in the 672 column (`max-w-2xl`): the bar's row stands on the same column, so the
   * title and the content share their left edge at every width (craft-details, every width holds).
   * `until-laptop` for a page whose column widens to the window from 64rem (Profile).
   */
  column?: boolean | 'until-laptop'
  /** The page shows its title itself, large under the bar (a document, read or in Edit): the bar
   * keeps it for a screen reader alone, never saying it twice, and leaves its room to the tools. */
  titleOnPage?: boolean
  /** A large title that is a name and may wrap (a course's, Your lessons and courses): 24 on a phone. */
  named?: boolean
} & (
  | {
      /** A place's title, set larger in the same row. */
      large: true
      /**
       * A place's views (R31-S): its title's place in the bar taken by their words (a `TitleTabs`), on
       * a phone and a laptop alike; the title is still the page's heading, to a screen reader.
       */
      views?: ReactNode
    }
  | { large?: false; views?: never }
)

/**
 * A screen's bar: one row of one height on every screen, Back, the title (one line, cut short with an
 * ellipsis) and at most two actions, More holding the rest; never a second row (R29-P1: a page's
 * views are a segmented control in its content). A place (Learn, Songs, Practice) or a detail page (a
 * song, a course) is `large`: the same one row, its title set larger and allowed a second line; a
 * place's views (`views`, Learn's Lessons · Courses, Songs' My songs · Explore) stand as its title, a
 * tab each (R31-S). A hairline marks the bar once the page runs
 * under it. It stays at the top, clear of the notch, slides away while reading down
 * and comes back as soon as the page turns up; it stays while focus is inside it.
 *
 * It must be a child of the page's root: a sticky bar goes no further than its parent does.
 */
export function ScreenHeader({
  title,
  back,
  tools,
  settings,
  more,
  edit,
  views,
  large = false,
  titleOnPage = false,
  named = false,
  column = false,
}: ScreenHeaderProps) {
  const { shown, report, hold } = useScreenBar()
  const bar = useRef<HTMLElement>(null)
  const pageHeading = usePageHeading<HTMLHeadingElement>(title)
  useEffect(() => {
    const element = bar.current
    if (!element) return
    // What stays at the top sits under the bar's rows; the page scrolls past its whole box.
    const observer = new ResizeObserver(([entry]) =>
      report({
        rows: entry?.contentBoxSize[0]?.blockSize ?? 0,
        box: entry?.borderBoxSize[0]?.blockSize ?? 0,
      }),
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      report(NO_BAR_SIZE)
      hold(false)
    }
  }, [report, hold])
  const header = (
    <header
      ref={bar}
      data-slot="screen-bar"
      data-hidden={shown ? undefined : ''}
      // A control focused holds the bar; the heading, focused as the screen opens, does not.
      onFocus={(event) => hold(event.target !== pageHeading.ref.current)}
      onBlur={(event) =>
        hold(
          event.relatedTarget !== pageHeading.ref.current &&
            event.currentTarget.contains(event.relatedTarget),
        )
      }
      className={cn(
        // The boards' bar: the page's own paper under it, no band and no line, its buttons the glass.
        'sticky top-0 z-30 -mx-gutter -mt-safe bg-background px-gutter pt-safe print:static print:mx-0 print:translate-y-0 print:px-0 duration-200 ease-out motion-safe:transition-[translate] data-hidden:-translate-y-full',
      )}
    >
      {large ? (
        <div
          className={cn(
            'flex min-h-14 items-center gap-1.5 py-1 sm:gap-2',
            column && 'mx-auto w-full max-w-2xl',
            column === 'until-laptop' && 'lg:mx-0 lg:max-w-none',
          )}
        >
          <ExitFocus />
          {back ? <div className="-ms-1 shrink-0 print:hidden">{back}</div> : null}
          <div className="flex min-w-0 flex-1 items-center gap-0.5">
            <h1
              {...pageHeading}
              className={cn(
                'min-w-0 font-sans outline-none',
                large
                  ? 'line-clamp-2 text-[1.75rem] leading-[1.15] font-bold tracking-[-0.01em] text-balance wrap-break-word hyphens-auto'
                  : 'truncate text-[1.0625rem] font-semibold',
                // A name that may wrap takes a step down on a phone, as the boards' TITLEBAR (24 to 28).
                large && named && 'max-sm:text-2xl',
                titleOnPage && 'sr-only',
                // A place's views say where it is: its name stays the page's heading, unseen.
                views && 'sr-only',
              )}
            >
              {title}
            </h1>
            {views}
            {edit ? (
              edit.editing ? (
                <EditDone action={edit} />
              ) : (
                <EditPencil onEdit={edit.onEdit} label={edit.label} />
              )
            ) : null}
          </div>
          {tools || settings || more ? (
            <div className="ms-auto flex shrink-0 items-center gap-2 print:hidden">
              {tools}
              {settings}
              {more}
            </div>
          ) : null}
        </div>
      ) : (
        // The canvas's TOP: Back at the start, the title 8 after it (never centred: bars.md, Apple's
        // Toolbars), the acts at the end, 56 tall.
        <div
          className={cn(
            'flex min-h-14 items-center',
            column && 'mx-auto w-full max-w-2xl',
            column === 'until-laptop' && 'lg:mx-0 lg:max-w-none',
          )}
        >
          <ExitFocus />
          {back ? <div className="-ms-1 flex shrink-0 print:hidden">{back}</div> : null}
          <div
            className={cn(
              'flex min-w-0 flex-1 items-center gap-0.5',
              back ? 'ms-2 lg:ms-3' : 'ms-1 lg:ms-0',
            )}
          >
            <h1
              {...pageHeading}
              className={cn(
                // A laptop page's title is its 30 bold, as the boards' LPAD.
                'min-w-0 font-sans outline-none lg:text-[1.875rem] lg:font-bold lg:tracking-[-0.01em]',
                large
                  ? 'line-clamp-2 text-[1.75rem] leading-[1.15] font-bold tracking-[-0.01em] text-balance wrap-break-word hyphens-auto'
                  : 'truncate text-[1.0625rem] font-semibold',
                // A name that may wrap takes a step down on a phone, as the boards' TITLEBAR (24 to 28).
                large && named && 'max-sm:text-2xl',
                titleOnPage && 'sr-only',
                // A place's views say where it is: its name stays the page's heading, unseen.
                views && 'sr-only',
              )}
            >
              {title}
            </h1>
            {views}
            {edit ? (
              edit.editing ? (
                <EditDone action={edit} />
              ) : (
                <EditPencil onEdit={edit.onEdit} label={edit.label} />
              )
            ) : null}
          </div>
          {/* The bar's glass circles stand 8 apart, as the boards' IB. */}
          <div className="ms-2 flex shrink-0 items-center gap-2 print:hidden">
            {tools}
            {settings}
            {more}
          </div>
        </div>
      )}
    </header>
  )
  return header
}

/**
 * While Focus is on, the bar's first button (canvas v398): it leaves Focus, before Back or the title,
 * where the sidebar's own Focus button stood; Esc leaves it too. A page that draws its own title row
 * (Songs and Settings on a wide screen) puts it first there.
 */
export function ExitFocus({ className }: { className?: string }) {
  const { t } = useTranslation('common')
  const on = useFocusMode()
  if (!on) return null
  return (
    <div className={cn('-ms-1 me-3 hidden shrink-0 lg:flex print:hidden', className)}>
      <RoundButton label={t('nav.exitFocus')} icon={Minimize} onClick={() => setFocusMode(false)} />
    </div>
  )
}

/** The pencil beside the title: quiet, the title's own act, a 44px target. */
function EditPencil({ onEdit, label: named }: { onEdit: () => void; label?: string }) {
  const { t } = useTranslation('common')
  const label = named ?? t('editMode.edit')
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="shrink-0 text-muted-foreground print:hidden"
      onClick={onEdit}
    >
      <PencilLine aria-hidden />
    </Button>
  )
}

/** Done, in the pencil's place beside the title while the screen is in Edit. */
function EditDone({ action }: { action: EditAction }) {
  const { t } = useTranslation('common')
  return (
    <Button
      variant="bar"
      disabled={action.disabled}
      className="ms-1 shrink-0 rounded-pill px-4 font-semibold"
      onClick={action.onDone}
    >
      {t('editMode.done')}
    </Button>
  )
}
