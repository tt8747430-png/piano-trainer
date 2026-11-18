import { Lock } from 'lucide-react'
import { Fragment, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DraftActions, DraftStatus, PublishWord, type ContentDraft } from '@/features/edit-original'
import type { Locale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, ScreenHeader, type EditAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { languageActions } from './LanguageChoice'

/**
 * A screen saying why the form is not open (yet), as the app's route states draw theirs: a 72 lock
 * on the sand, its line 17 semibold, and what to do, 48 tall.
 */
export function NotOpen({ line, children }: { line: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-80 flex-1 flex-col items-center justify-center gap-2.5 p-6 text-center">
      <span
        aria-hidden
        className="flex size-18 items-center justify-center rounded-full bg-muted text-foreground"
      >
        <Lock className="size-7" />
      </span>
      <p role="status" className="max-w-[340px] text-[1.0625rem] font-semibold text-balance">
        {line}
      </p>
      {children ? (
        <div className="mt-2 flex flex-wrap justify-center gap-2 *:h-12 *:rounded-full *:px-5 *:text-base *:font-bold">
          {children}
        </div>
      ) : null}
    </div>
  )
}

/**
 * An editor's screen over a built-in item's draft (ADR 0116): its title and Back; once the draft is
 * open, where it stands, its Publish and menu at the bar's end (round 25: nothing under the bar); and the
 * form (`children`, given the draft as it opened). Until then, why not: opening, offline or failed with Try again, or, to anyone but an editor, that only an
 * editor edits it, with the way back.
 */
export function DraftScreen<T>({
  draft,
  heading,
  title,
  back,
  backTo,
  editorsOnly,
  unreadable,
  language,
  edit,
  settings,
  publishPage,
  oneTap = false,
  children,
}: {
  draft: ContentDraft<T>
  /** The screen's heading. */
  heading: string
  /** The item's name, said in the strip's dialogs. */
  title: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the item's own page, with its label. */
  backTo: { link: ReactElement; label: string }
  /** What anyone but an editor is told. */
  editorsOnly: string
  /** What is said where a publish is refused for a draft that does not read. */
  unreadable: string
  /** The language the document is written in: chosen in the draft's menu, ticked there. */
  language?: { value: Locale; onChange: (locale: Locale) => void }
  /** The item's Edit, in Edit: Done at the bar's end, the page in Edit rather than another page. */
  edit?: EditAction
  /** A router `Link` to the item's Settings, its gear in the bar. */
  settings?: ReactNode
  /** The item's Publish page (R29 B6), which the bar's Publish opens. */
  publishPage?: { readonly link: ReactElement; readonly open: () => void }
  /**
   * A Learn page's Edit (a lesson, a course; the kit's EDITR): its bar Publish and Done alone, Publish
   * one tap with Undo; Versions and Discard changes are its Settings', and it is written in the app's
   * language. Else the draft's status, its menu and Publish in the bar.
   */
  oneTap?: boolean
  children: (initial: T) => ReactNode
}) {
  const { t } = useTranslation('editor')
  const { t: words } = useTranslation('learn')
  const { account } = useAccount()
  const { load } = draft
  const editor = editsContent(account)
  const open = editor && load.state === 'ready'
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-8">
      <ScreenHeader
        title={heading}
        back={back}
        // The document shows the item's title large under the bar.
        titleOnPage
        // Where the draft stands, then Publish and the draft's menu, at the bar's end: nothing under
        // the bar (the language is the menu's, ticked there).
        tools={
          open && !oneTap ? (
            <>
              <DraftStatus draft={draft} className="me-1" />
              <DraftActions
                draft={draft}
                title={title}
                unreadable={unreadable}
                onReset={draft.reopen}
                publishPage={publishPage}
                more={language ? languageActions(language.value, language.onChange, words) : []}
              />
            </>
          ) : null
        }
        // Settings and Done only where the draft is open: to one who cannot edit, nothing is in Edit.
        settings={open ? settings : undefined}
        edit={
          open && edit
            ? oneTap
              ? {
                  ...edit,
                  publish: (
                    <PublishWord draft={draft} unreadable={unreadable} onReset={draft.reopen} />
                  ),
                }
              : edit
            : undefined
        }
      />
      {!editor ? (
        <NotOpen line={editorsOnly}>
          <ButtonLink render={backTo.link}>{backTo.label}</ButtonLink>
        </NotOpen>
      ) : load.state === 'loading' ? (
        <NotOpen line={t('original.opening')} />
      ) : load.state === 'failed' ? (
        <NotOpen line={t(load.reason === 'offline' ? 'original.offline' : 'original.failed')}>
          <Button onClick={draft.reopen}>{t('original.retry')}</Button>
        </NotOpen>
      ) : (
        <Fragment key={draft.opened}>{children(load.value)}</Fragment>
      )}
    </div>
  )
}
