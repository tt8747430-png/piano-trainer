import { CircleAlert, LoaderCircle, Lock, Pencil, WifiOff } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  DraftActions,
  DraftStatus,
  PublishWord,
  type ContentDraft,
  type DraftLoad,
} from '@/features/edit-original'
import type { Locale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, Said, ScreenHeader, type EditAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { languageActions } from './LanguageChoice'

/** Each reason the form is not open, its picture (the boards' EMPTYICON: ✎, …, ⌁, !). */
const WHY_ICONS = {
  editors: Pencil,
  admins: Lock,
  opening: LoaderCircle,
  offline: WifiOff,
  failed: CircleAlert,
  missing: CircleAlert,
} as const

/**
 * A screen saying why the form is not open (yet), as the editor boards draw it (`r55_editor_draft`): the
 * kit's one empty state, its picture for the reason, what stops it, a line on what happens or what to do,
 * and the way on: the honey pill (Try again, the way back to one who cannot edit), or the quiet one back
 * while offline.
 */
export function NotOpen({
  kind = 'editors',
  line,
  why,
  quiet = false,
  children,
}: {
  kind?: keyof typeof WHY_ICONS
  line: string
  /** What to do instead; opening, offline and failed say their own. */
  why?: string
  /** The way on is the quiet pill (back, while offline), not the honey one. */
  quiet?: boolean
  children?: ReactNode
}) {
  const { t } = useTranslation('editor')
  const detail =
    why ??
    (kind === 'opening' || kind === 'offline' || kind === 'failed'
      ? t(`original.${kind}Why`)
      : undefined)
  return (
    <Said
      icon={WHY_ICONS[kind]}
      title={line}
      {...(detail ? { description: detail } : {})}
      action={children}
      primary={!quiet}
      quiet={quiet}
    />
  )
}

/**
 * Why a draft's form is not open yet, or nothing once it is (the boards' `r55_editor_draft`): opening;
 * offline, with the quiet way on (`back` where the screen has one, else Try again); failed, with the
 * honey Try again. Every editor over a draft says it this one way.
 */
export function DraftGate({
  load,
  reopen,
  back,
}: {
  load: DraftLoad<unknown>
  reopen: () => void
  back?: ReactNode
}) {
  const { t } = useTranslation('editor')
  if (load.state === 'ready') return null
  if (load.state === 'loading') return <NotOpen kind="opening" line={t('original.opening')} />
  const retry = <Button onClick={reopen}>{t('original.retry')}</Button>
  return load.reason === 'offline' ? (
    <NotOpen kind="offline" line={t('original.offline')} quiet>
      {back ?? retry}
    </NotOpen>
  ) : (
    <NotOpen kind="failed" line={t('original.failed')}>
      {retry}
    </NotOpen>
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
  form = false,
  title,
  back,
  backTo,
  editorsOnly,
  editorsWhy,
  unreadable,
  language,
  edit,
  settings,
  toPublish,
  oneTap = false,
  children,
}: {
  draft: ContentDraft<T>
  /** The screen's heading. */
  heading: string
  /** A form whose fields hold the name (a progression), as its board's LCOL: on a laptop the bar names
   * the page and the column stands on the 56 edge, 704 at most; otherwise a document showing its title
   * large under the bar (a lesson), its column centred. */
  form?: boolean
  /** The item's name, said in the strip's dialogs. */
  title: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the item's own page, with its label. */
  backTo: { link: ReactElement; label: string }
  /** What anyone but an editor is told… */
  editorsOnly: string
  /** …and what they can do instead. */
  editorsWhy?: string
  /** What is said where a publish is refused for a draft that does not read. */
  unreadable: string
  /** The language the document is written in: chosen in the draft's menu, ticked there. */
  language?: { value: Locale; onChange: (locale: Locale) => void }
  /** The item's Edit, in Edit: Done at the bar's end, the page in Edit rather than another page. */
  edit?: EditAction
  /** A router `Link` to the item's Settings, its gear in the bar. */
  settings?: ReactNode
  /** The item's Publish page (R29 B6), which the bar's Publish opens. */
  toPublish?: { readonly link: ReactElement; readonly open: () => void }
  /**
   * A Learn page's Edit (a lesson, a course; the kit's EDITR): its bar Publish and Done alone, Publish
   * one tap with Undo; Versions and Discard changes are its Settings', and it is written in the app's
   * language. Else the draft's status, its menu and Publish in the bar.
   */
  oneTap?: boolean
  children: (initial: T) => ReactNode
}) {
  const { t: words } = useTranslation('learn')
  const { account } = useAccount()
  const { load } = draft
  const editor = editsContent(account)
  const open = editor && load.state === 'ready'
  const gate = !editor ? (
    <NotOpen line={editorsOnly} {...(editorsWhy ? { why: editorsWhy } : {})}>
      <ButtonLink render={backTo.link}>{backTo.label}</ButtonLink>
    </NotOpen>
  ) : load.state === 'ready' ? null : (
    <DraftGate
      load={load}
      reopen={draft.reopen}
      back={<ButtonLink render={backTo.link}>{backTo.label}</ButtonLink>}
    />
  )
  return (
    <div className={cn('flex w-full flex-col gap-4 pb-8', !form && 'mx-auto max-w-3xl')}>
      <ScreenHeader
        title={heading}
        back={back}
        // A document shows the item's title large under the bar; a form's fields hold its name.
        titleOnPage={form ? 'phone' : true}
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
                toPublish={toPublish}
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
      {gate ? (
        // The gate stands where the boards' column starts: 8 under the bar on a phone (NARROW), on
        // its foot on a laptop (WIDE), not the form's 16.
        <div className="-mt-2 lg:-mt-4">{gate}</div>
      ) : load.state === 'ready' ? (
        <div key={draft.opened} className={cn(form && '-mt-2 lg:mt-2 lg:max-w-176')}>
          {children(load.value)}
        </div>
      ) : null}
    </div>
  )
}
