import { Link, useNavigate } from '@tanstack/react-router'
import { BookmarkPlus, PencilLine, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { usePracticeLibraryStoreApi, type OwnProgression } from '@/entities/practice-library'
import type { LibraryProgression } from '@/entities/progression-library'
import { deleteProgression, PracticeFavouriteButton } from '@/features/manage-practice-library'
import { localText, useLocale } from '@/shared/i18n'
import { useForgetScreens } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  BackButton,
  ConfirmDialog,
  MoreMenu,
  RoundButton,
  RoundLink,
  ScreenHeader,
} from '@/shared/ui'
import { SettingsGear } from '@/widgets/practice-pages'
import {
  KeepProgressionSheet,
  ProgressionExplorer,
  type ProgressionsView,
} from '@/widgets/progression-explorer'

/** What a progression's page shows: the library's, the learner's own, or a line typed. */
export type ShownProgression =
  | { readonly kind: 'library'; readonly progression: LibraryProgression }
  | { readonly kind: 'own'; readonly progression: OwnProgression }
  | { readonly kind: 'line'; readonly title: string; readonly named?: LibraryProgression }

/** What is open over the page: nothing, the Keep or Edit sheet, or Delete's question. */
type Open = 'none' | 'keep' | 'delete'

/**
 * A progression's own page (R30-4): its name in the bar, its ♡ (a library's or the learner's own),
 * its gear to Progressions' Settings; the learner's own with Edit (its name and line) and More
 * (Delete, asked first); a line typed with Keep in Mine; an editor's pencil to the library's editor.
 * Under the bar what it is (how it sounds · its style), then the progression itself.
 */
export function ProgressionScreen({
  shown,
  view,
  onChange,
}: {
  shown: ShownProgression
  view: ProgressionsView
  onChange: (view: ProgressionsView) => void
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const { account } = useAccount()
  const navigate = useNavigate()
  const forget = useForgetScreens()
  const store = usePracticeLibraryStoreApi()
  const [open, setOpen] = useState<Open>('none')
  const library =
    shown.kind === 'library' ? shown.progression : shown.kind === 'line' ? shown.named : undefined
  const own = shown.kind === 'own' ? shown.progression : undefined
  const title = library
    ? localText(library.name, locale)
    : own
      ? own.name
      : shown.kind === 'line'
        ? shown.title
        : ''
  const about: ReactNode = library ? (
    <p className="text-lg text-muted-foreground">
      {localText(library.character, locale)} · {t(`progressions.style.${library.style}`)}
    </p>
  ) : null
  const tools = (
    <>
      {library || own ? (
        <PracticeFavouriteButton kind="progressions" id={(library ?? own)?.id ?? ''} />
      ) : (
        <RoundButton
          label={t('progressions.mine.keep')}
          icon={BookmarkPlus}
          onClick={() => setOpen('keep')}
        />
      )}
      {library && editsContent(account) ? (
        <RoundLink
          label={t('progressions.edit.open')}
          icon={PencilLine}
          render={
            <Link
              to="/practice/progressions/$progressionId/edit"
              params={{ progressionId: library.id }}
            />
          }
        />
      ) : null}
    </>
  )
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={title}
        large
        back={<BackButton />}
        tools={tools}
        {...(own
          ? {
              edit: {
                editing: false,
                label: t('progressions.mine.edit'),
                onEdit: () => setOpen('keep'),
                onDone: () => setOpen('none'),
              },
            }
          : {})}
        settings={<SettingsGear page="progressions" />}
        more={
          own ? (
            <MoreMenu
              label={t('progressions.mine.more')}
              actions={[
                {
                  key: 'delete',
                  label: t('progressions.mine.delete'),
                  icon: Trash2,
                  destructive: true,
                  onSelect: () => setOpen('delete'),
                },
              ]}
            />
          ) : null
        }
      />
      <ProgressionExplorer
        view={view}
        onChange={onChange}
        typed={shown.kind !== 'library'}
        about={about}
        note={library?.note ? localText(library.note, locale) : undefined}
      />
      {open === 'keep' ? (
        <KeepProgressionSheet
          open
          onOpenChange={(next) => setOpen(next ? 'keep' : 'none')}
          start={{
            name: own?.name ?? '',
            line: view.p,
            key: view.key,
            ...(view.mode ? { mode: view.mode } : {}),
          }}
          {...(own ? { editing: own.id } : {})}
          onKept={(progressionId, key) =>
            void navigate({
              to: '/practice/progressions/$progressionId',
              params: { progressionId },
              search: { key },
              replace: own !== undefined,
            })
          }
        />
      ) : null}
      {own ? (
        <ConfirmDialog
          open={open === 'delete'}
          onOpenChange={(next) => setOpen(next ? 'delete' : 'none')}
          title={t('progressions.mine.deleting', { name: own.name })}
          body={t('progressions.mine.deletingBody')}
          action={t('progressions.mine.delete')}
          onConfirm={() => {
            // Leave the page first: it has nothing to show once the progression is gone.
            forget(`/practice/progressions/${own.id}`)
            void navigate({
              to: '/practice/progressions',
              search: { place: 'mine' },
              replace: true,
            }).then(() => deleteProgression(store, own.id))
          }}
        />
      ) : null}
    </div>
  )
}
