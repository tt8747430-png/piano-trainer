import { Minimize } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, setFocusMode, useFocusMode } from '@/shared/lib'
import { Button } from './primitives/button'
import { RoundButton } from './RoundButton'
import { NO_BAR_SIZE, useScreenBar } from './screen-bar'
import { usePageHeading } from './use-page-heading'

/**
 * A screen's Edit (the canvas's EDITR; Apple HIG, Edit buttons): the glass word Edit at the bar's end;
 * while editing, Done in its place, so the control never moves between modes, and the screen's
 * Publish (`publish`), a glass word that acts in one tap, just before it. The screen enters Edit in
 * place; it passes only the acts that apply while editing.
 */
export interface EditAction {
  readonly editing: boolean
  readonly onEdit: () => void
  readonly onDone: () => void
  /** Done waits (a take recording, a save under way). */
  readonly disabled?: boolean
  /** What Edit edits, where Edit alone would not say: a song's page edits its score (R31-S). */
  readonly label?: string
  /** While editing, the glass word before Done: Publish, Published once done (a lesson, a course). */
  readonly publish?: ReactNode
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
   * The page reads in the 672 column (`page-column`): the bar's row stands on the same column, so the
   * title and the content share their left edge at every width (craft-details, every width holds).
   * `until-laptop` for a page whose column widens to the window from 64rem (Profile).
   */
  column?: boolean | 'until-laptop'
  /** The page shows its title itself, large under the bar (a document, read or in Edit): the bar
   * keeps it for a screen reader alone, never saying it twice, and leaves its room to the tools.
   * `phone`: only on a phone; a laptop's 88 bar names the page (a level's, a course's). */
  titleOnPage?: boolean | 'phone'
  /** A large title that is a name and may wrap (a course's, Your lessons and courses): 24 on a phone. */
  named?: boolean
  /** A place (Learn, Songs, Practice) or a detail page: its title set larger in the same row. */
  large?: boolean
}

/**
 * A screen's bar: one row of one height on every screen, Back, the title (one line, cut short with an
 * ellipsis) and at most two actions, More holding the rest; never a second row (R29-P1: a page's
 * views are a segmented control in its content). A place (Learn, Songs, Practice) or a detail page (a
 * song, a course) is `large`: the same one row, its title set larger and allowed a second line. It
 * stays at the top while the page scrolls under it, clear of the notch, glass with no band or line
 * (`DESIGN.md`, Placement).
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
  large = false,
  titleOnPage = false,
  named = false,
  column = false,
}: ScreenHeaderProps) {
  const { report } = useScreenBar()
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
    }
  }, [report])
  const header = (
    <header
      ref={bar}
      data-slot="screen-bar"
      className={cn(
        // The boards' floating bar (data-float): it stays while the page scrolls under it, its buttons
        // the glass and its title fading as the page leaves the top (craft-details, Bars stay,
        // quietly); a laptop's bar stands over the page on its paper.
        'pointer-events-none sticky top-0 z-30 -mx-gutter -mt-safe px-gutter pt-safe *:pointer-events-auto lg:bg-background print:static print:mx-0 print:px-0',
        // The laptop boards' three heads: a place's 88 head, its title on the 56 column (LPLACEBAR);
        // a sub-page's 56 bar flush at the top, Back 40 in and its last button 28 from the trailing edge
        // (LPAD, LTITLEBAR), its title large after Back or a page's own. Each Back's -4 optical inset is
        // the row's. A bar on the page's column keeps the page's even gutter, so the column centres
        // where the page's does and Back stands on the content's edge.
        large && !back ? '' : column === true ? 'lg:pt-0' : 'lg:pr-7 lg:pl-11 lg:pt-0',
      )}
    >
      {large ? (
        <div
          className={cn(
            'flex min-h-14 items-center py-1',
            // after Back the title stands 12 off it (TITLEBAR, LTITLEBAR)
            back ? 'gap-3' : 'gap-1.5 sm:gap-2',
            column && 'page-column',
            column === 'until-laptop' && 'lg:mx-0 lg:max-w-none',
          )}
        >
          <ExitFocus />
          {back ? <div className="-ms-1 shrink-0 print:hidden">{back}</div> : null}
          <div className="flex min-w-0 flex-1 items-center gap-0.5">
            <h1
              {...pageHeading}
              className={cn(
                'bar-title min-w-0 font-sans outline-none',
                large
                  ? 'line-clamp-2 text-3xl lg:text-[1.875rem] leading-[1.15] font-bold tracking-[-0.01em] text-balance wrap-break-word hyphens-auto'
                  : 'truncate text-lg font-semibold',
                // A name that may wrap takes a step down on a phone, as the boards' TITLEBAR (24 to 28).
                large && named && 'max-sm:text-2xl',
                titleOnPage === true && 'sr-only',
                titleOnPage === 'phone' && 'max-lg:sr-only',
              )}
            >
              {title}
            </h1>
          </div>
          {tools || settings || more || edit ? (
            <div className="ms-auto -me-1 flex shrink-0 items-center gap-2 lg:me-0 print:hidden">
              {edit?.editing ? null : tools}
              {edit?.editing ? null : settings}
              {edit?.editing ? null : more}
              {edit ? <EditWord action={edit} /> : null}
            </div>
          ) : null}
        </div>
      ) : (
        // The canvas's TOP: Back at the start, the title 8 after it (never centred: bars.md, Apple's
        // Toolbars), the acts at the end, 56 tall.
        <div
          className={cn(
            'flex min-h-14 items-center',
            column && 'page-column',
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
                'bar-title min-w-0 font-sans outline-none lg:text-[1.875rem] lg:leading-[1.15] lg:font-bold lg:tracking-[-0.01em]',
                large
                  ? 'line-clamp-2 text-3xl lg:text-[1.875rem] leading-[1.15] font-bold tracking-[-0.01em] text-balance wrap-break-word hyphens-auto'
                  : 'truncate text-lg font-semibold',
                // A name that may wrap takes a step down on a phone, as the boards' TITLEBAR (24 to 28).
                large && named && 'max-sm:text-2xl',
                titleOnPage === true && 'sr-only',
                titleOnPage === 'phone' && 'max-lg:sr-only',
              )}
            >
              {title}
            </h1>
          </div>
          {/* The bar's glass circles stand 8 apart, as the boards' IB; on a phone the last 12 from the
              edge, as Back stands at the start (TOP's 12). */}
          <div className="ms-2 -me-1 flex shrink-0 items-center gap-2 lg:me-0 print:hidden">
            {edit?.editing ? null : tools}
            {edit?.editing ? null : settings}
            {edit?.editing ? null : more}
            {edit ? <EditWord action={edit} /> : null}
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

/**
 * Edit at the bar's end, a glass word; while editing, Done in the same place, the screen's Publish
 * before it (the canvas's EDITR).
 */
function EditWord({ action }: { action: EditAction }) {
  const { t } = useTranslation('common')
  if (!action.editing)
    return (
      <Button variant="bar" className="shrink-0 px-4" onClick={action.onEdit}>
        {action.label ?? t('editMode.edit')}
      </Button>
    )
  return (
    <>
      {action.publish}
      <Button
        variant="bar"
        disabled={action.disabled}
        className="shrink-0 px-4"
        onClick={action.onDone}
      >
        {t('editMode.done')}
      </Button>
    </>
  )
}
