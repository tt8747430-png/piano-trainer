import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  CopyPlus,
  Eye,
  EyeOff,
  Globe,
  GlobeLock,
  PencilLine,
  Play,
  Star,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isOwnPatternId,
  isPatternId,
  isPatternRef,
  LEFT_FIGURES,
  partOfShelf,
  RIGHT_FIGURES,
  selectIsFavourite,
  selectIsHidden,
  usePatternBook,
  usePatterns,
  usePatternsStoreApi,
  type BookPattern,
  type OwnPatternId,
  type PatternBook,
} from '@/entities/pattern'
import { piecesPlaying } from '@/entities/piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { deleteOwnPattern, toggleFavourite, toggleHidden } from '@/features/manage-patterns'
import { useShownKeys } from '@/features/play-example'
import { PublishDialog, PublishSaid, usePublish, type PublishItem } from '@/features/publish'
import { localText, useLocale } from '@/shared/i18n'
import {
  BackButton,
  ButtonLink,
  FabLink,
  Fact,
  FloatingActions,
  MoreMenu,
  NotFound,
  RoundButton,
  ScreenHeader,
  type MenuAction,
} from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { PatternPlay, PatternStaff, usePatternSample } from '@/widgets/pattern-music'
import { PieceList } from '@/widgets/piece-list'

/** The star in the bar: a favourite comes first in the Player's list. */
function FavouriteButton({ pattern }: { pattern: BookPattern }) {
  const { t } = useTranslation('practice')
  const store = usePatternsStoreApi()
  const favourite = usePatterns(selectIsFavourite(pattern.ref))
  return (
    <RoundButton
      label={t('patterns.favourite')}
      icon={Star}
      aria-pressed={favourite}
      onClick={() => toggleFavourite(store, pattern.ref)}
      className="aria-pressed:bg-muted aria-pressed:[&_svg]:fill-current"
    />
  )
}

/**
 * A pattern's actions for its bar's More: for a built-in one, a pattern of the learner's own from it
 * and hiding it from the Player; for the learner's own, Edit, its place in the Public library
 * (Publish, asked first; Update once it has changed; Remove) and Delete, asked first, last. What they
 * open (the dialogs) and what was done (a line) come with them.
 */
function usePatternActions(pattern: BookPattern, name: string) {
  const { t } = useTranslation(['practice', 'songs'])
  const store = usePatternsStoreApi()
  const navigate = useNavigate()
  const own = isOwnPatternId(pattern.ref) ? pattern.ref : null
  const builtIn = isPatternId(pattern.ref) ? pattern.ref : null
  const hidden = usePatterns((state) => builtIn !== null && selectIsHidden(builtIn)(state))
  const item = useMemo(
    (): PublishItem | null =>
      own === null
        ? null
        : {
            kind: 'pattern',
            sourceId: `pattern/${own}`,
            title: name,
            meta: { rh: pattern.rh, lh: pattern.lh },
            body: { name, rh: pattern.rh, lh: pattern.lh },
          },
    [own, pattern.rh, pattern.lh, name],
  )
  const publishing = usePublish(item)
  const [publishAsked, setPublishAsked] = useState(false)
  const [deleteAsked, setDeleteAsked] = useState(false)
  const remove = (id: OwnPatternId) => {
    // Leave the page first: it has nothing to show once the pattern is gone.
    void navigate({
      to: '/practice/accompaniment',
      search: { show: 'yours' },
      replace: true,
    }).then(() => deleteOwnPattern(store, id))
  }
  const actions: MenuAction[] =
    own === null
      ? builtIn === null
        ? []
        : [
            {
              key: 'own',
              label: t('patterns.makeOwn'),
              icon: CopyPlus,
              onSelect: () =>
                void navigate({
                  to: '/practice/accompaniment/patterns/new',
                  search: { from: builtIn },
                }),
            },
            {
              key: 'hide',
              label: t(hidden ? 'patterns.show' : 'patterns.hide'),
              icon: hidden ? Eye : EyeOff,
              onSelect: () => toggleHidden(store, builtIn),
            },
          ]
      : [
          {
            key: 'edit',
            label: t('patterns.edit'),
            icon: PencilLine,
            onSelect: () =>
              void navigate({
                to: '/practice/accompaniment/patterns/$patternRef/edit',
                params: { patternRef: own },
              }),
          },
          ...(publishing.state === 'unpublished'
            ? [
                {
                  key: 'publish',
                  label: t('songs:public.publish'),
                  icon: Globe,
                  onSelect: () => setPublishAsked(true),
                },
              ]
            : publishing.state === 'changed'
              ? [
                  {
                    key: 'publish',
                    label: t('songs:public.update'),
                    icon: Globe,
                    disabled: publishing.busy,
                    onSelect: () => void publishing.publish(),
                  },
                ]
              : []),
          ...(publishing.state === 'published' || publishing.state === 'changed'
            ? [
                {
                  key: 'unpublish',
                  label: t('songs:public.unpublish'),
                  icon: GlobeLock,
                  disabled: publishing.busy,
                  onSelect: () => void publishing.unpublish(),
                },
              ]
            : []),
          {
            key: 'delete',
            label: t('patterns.delete'),
            icon: Trash2,
            destructive: true,
            onSelect: () => setDeleteAsked(true),
          },
        ]
  const dialogs =
    own === null ? null : (
      <>
        <PublishDialog
          open={publishAsked}
          onOpenChange={setPublishAsked}
          title={name}
          authorName={publishing.authorName}
          signedIn={publishing.signedIn}
          busy={publishing.busy}
          onPublish={() => {
            setPublishAsked(false)
            void publishing.publish()
          }}
        />
        <AlertDialog open={deleteAsked} onOpenChange={setDeleteAsked}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('patterns.deleting.title', { name })}</AlertDialogTitle>
              <AlertDialogDescription>{t('patterns.deleting.says')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('patterns.deleting.cancel')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => remove(own)}>
                {t('patterns.deleting.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  const said = (
    <>
      <PublishSaid said={publishing.said} />
      {hidden ? <p className="text-sm text-muted-foreground">{t('patterns.hiddenNote')}</p> : null}
    </>
  )
  return { actions, dialogs, said }
}

/**
 * A pattern explained: its idea, what each hand plays, the pattern on the staff and heard on the keys,
 * its source's explanation and the music that plays it. Its bar holds the star and More (its own
 * actions); Practise in the Player floats.
 */
function PatternView({ pattern, book }: { pattern: BookPattern; book: PatternBook }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const sample = usePatternSample(pattern, book)
  const [shown, show] = useShownKeys(pattern.ref, sample.shown)
  const name = localText(pattern.name, locale)
  const pieces = isPatternId(pattern.ref) ? piecesPlaying(pattern.ref) : []
  // A hidden pattern is listed under Yours alone, no longer on its book's shelf.
  const { ref } = pattern
  const hidden = usePatterns((state) => isPatternId(ref) && selectIsHidden(ref)(state))
  const more = usePatternActions(pattern, name)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={name}
        back={
          <BackButton
            fallback={{
              to: '/practice/accompaniment',
              search: { show: hidden ? 'yours' : partOfShelf(pattern.group) },
            }}
          />
        }
        actions={
          <>
            <FavouriteButton pattern={pattern} />
            <MoreMenu actions={more.actions} />
          </>
        }
      />
      <PinnedKeyboard shown={shown} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="flex max-w-prose flex-col gap-5">
          <p className="text-xl text-balance">{localText(pattern.idea, locale)}</p>
          <dl className="flex flex-col gap-2">
            <Fact term={t('patterns.rightHand')}>
              {localText(RIGHT_FIGURES[pattern.rh].name, locale)}
            </Fact>
            <Fact term={t('patterns.leftHand')}>
              {localText(LEFT_FIGURES[pattern.lh].name, locale)}
            </Fact>
          </dl>
          <section className="flex flex-col gap-4 card p-4">
            <PatternStaff sample={sample} />
            <PatternPlay sample={sample} onShow={show} variant="default" />
          </section>
          {pattern.description ? (
            <p className="text-lg leading-relaxed">{localText(pattern.description, locale)}</p>
          ) : null}
          {more.said}
        </div>
        {pieces.length > 0 ? (
          <PieceList groups={[{ id: 'used-in', heading: t('patterns.usedIn'), entries: pieces }]} />
        ) : null}
      </div>
      {more.dialogs}
      {/* The way on: the pattern played in the Player, under its sample's music. */}
      <FloatingActions>
        <FabLink
          label={t('inPlayer')}
          icon={Play}
          className="[&_svg]:fill-current"
          render={
            sample.piece ? (
              <Link
                to="/play/$pieceId"
                params={{ pieceId: sample.piece.id }}
                search={{ pattern: pattern.ref }}
              />
            ) : (
              <Link to="/play/progression" search={{ pattern: pattern.ref }} />
            )
          }
        />
      </FloatingActions>
    </div>
  )
}

/** A pattern's page: the route's pattern, built-in or the learner's own (gone once deleted in another tab). */
export function PatternPage() {
  const { t } = useTranslation('common')
  const { patternRef } = useParams({ from: '/shell/practice/accompaniment/patterns/$patternRef' })
  const book = usePatternBook()
  const pattern = isPatternRef(patternRef) ? book.get(patternRef) : undefined
  return pattern ? (
    <PatternView key={pattern.ref} pattern={pattern} book={book} />
  ) : (
    <NotFound>
      <ButtonLink render={<Link to="/practice/accompaniment" />}>
        {t('notFound.toAccompaniment')}
      </ButtonLink>
    </NotFound>
  )
}
