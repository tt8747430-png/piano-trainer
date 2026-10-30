import { Fragment, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DraftActions, DraftStatus, type ContentDraft } from '@/features/edit-original'
import type { Locale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { languageActions } from './LanguageChoice'

/** A screen saying why the form is not open (yet): its line, and what to do. */
export function NotOpen({ line, children }: { line: string; children?: ReactNode }) {
  return (
    <Empty className="min-h-80">
      <EmptyHeader>
        <EmptyTitle>
          <p role="status" className="text-lg">
            {line}
          </p>
        </EmptyTitle>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
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
  modes,
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
  /** The item's Read · Edit switch (`ReadEditSwitch`): the page in Edit, not another page. */
  modes?: ReactNode
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
        titleOnPage={modes !== undefined}
        // Where the draft stands, then Publish and the draft's menu, at the bar's end: nothing under
        // the bar (the language is the menu's, ticked there).
        actions={
          open ? (
            <>
              <DraftStatus draft={draft} className="me-1" />
              {modes}
              <DraftActions
                draft={draft}
                title={title}
                unreadable={unreadable}
                onReset={draft.reopen}
                more={language ? languageActions(language.value, language.onChange, words) : []}
              />
            </>
          ) : (
            modes
          )
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
