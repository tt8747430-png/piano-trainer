import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Star } from 'lucide-react'
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
  type PatternId,
} from '@/entities/pattern'
import { piecesPlaying } from '@/entities/piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { deleteOwnPattern, toggleFavourite, toggleHidden } from '@/features/manage-patterns'
import { useShownKeys } from '@/features/play-example'
import { PublishDialog, PublishSaid, usePublish, type PublishItem } from '@/features/publish'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, ButtonLink, Fact, NotFound, RoundButton, ScreenHeader } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
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

/** A built-in pattern's own actions: a pattern of the learner's own from it, and hiding it from the Player. */
function BuiltInActions({ id }: { id: PatternId }) {
  const { t } = useTranslation('practice')
  const store = usePatternsStoreApi()
  const hidden = usePatterns(selectIsHidden(id))
  return (
    <>
      <ButtonLink
        variant="outline"
        render={<Link to="/practice/accompaniment/patterns/new" search={{ from: id }} />}
      >
        {t('patterns.makeOwn')}
      </ButtonLink>
      <Button variant="outline" onClick={() => toggleHidden(store, id)}>
        {hidden ? t('patterns.show') : t('patterns.hide')}
      </Button>
      {hidden ? (
        <p className="basis-full text-sm text-muted-foreground">{t('patterns.hiddenNote')}</p>
      ) : null}
    </>
  )
}

/**
 * The learner's pattern in the Public library (ADR 0116): Publish (asked first), Update once it has
 * changed, Remove; what was done said under it.
 */
function PublishActions({ pattern, name }: { pattern: BookPattern; name: string }) {
  const { t } = useTranslation('songs')
  const item = useMemo(
    (): PublishItem => ({
      kind: 'pattern',
      sourceId: `pattern/${pattern.ref}`,
      title: name,
      meta: { rh: pattern.rh, lh: pattern.lh },
      body: { name, rh: pattern.rh, lh: pattern.lh },
    }),
    [pattern.ref, pattern.rh, pattern.lh, name],
  )
  const publishing = usePublish(item)
  const [asked, setAsked] = useState(false)
  return (
    <>
      {publishing.state === 'unpublished' ? (
        <Button variant="outline" onClick={() => setAsked(true)}>
          {t('public.publish')}
        </Button>
      ) : publishing.state === 'changed' ? (
        <Button
          variant="outline"
          disabled={publishing.busy}
          onClick={() => void publishing.publish()}
        >
          {t('public.update')}
        </Button>
      ) : null}
      {publishing.state === 'published' || publishing.state === 'changed' ? (
        <Button
          variant="outline"
          disabled={publishing.busy}
          onClick={() => void publishing.unpublish()}
        >
          {t('public.unpublish')}
        </Button>
      ) : null}
      <div className="basis-full empty:hidden">
        <PublishSaid said={publishing.said} />
      </div>
      <PublishDialog
        open={asked}
        onOpenChange={setAsked}
        title={name}
        authorName={publishing.authorName}
        signedIn={publishing.signedIn}
        busy={publishing.busy}
        onPublish={() => {
          setAsked(false)
          void publishing.publish()
        }}
      />
    </>
  )
}

/** The learner's pattern's own actions: Edit, Delete once asked, and its place in the Public library. */
function OwnActions({
  pattern,
  id,
  name,
}: {
  pattern: BookPattern
  id: OwnPatternId
  name: string
}) {
  const { t } = useTranslation('practice')
  const store = usePatternsStoreApi()
  const navigate = useNavigate()
  const [asking, setAsking] = useState(false)
  const remove = () => {
    // Leave the page first: it has nothing to show once the pattern is gone.
    void navigate({
      to: '/practice/accompaniment',
      search: { show: 'yours' },
      replace: true,
    }).then(() => deleteOwnPattern(store, id))
  }
  return (
    <>
      <ButtonLink
        variant="outline"
        render={
          <Link
            to="/practice/accompaniment/patterns/$patternRef/edit"
            params={{ patternRef: id }}
          />
        }
      >
        {t('patterns.edit')}
      </ButtonLink>
      <PublishActions pattern={pattern} name={name} />
      <AlertDialog open={asking} onOpenChange={setAsking}>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          {t('patterns.delete')}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('patterns.deleting.title', { name })}</AlertDialogTitle>
            <AlertDialogDescription>{t('patterns.deleting.says')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('patterns.deleting.cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              {t('patterns.deleting.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

/**
 * A pattern explained: its idea, what each hand plays, the pattern on the staff and heard on the keys,
 * its source's explanation, the music that plays it, and the ways on: the Player, and a pattern of
 * the learner's own from it (or, for their own, Edit and Delete).
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
        actions={<FavouriteButton pattern={pattern} />}
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
          <div className="flex flex-wrap gap-3">
            <ButtonLink
              variant="outline"
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
            >
              {t('inPlayer')}
            </ButtonLink>
            {isOwnPatternId(pattern.ref) ? (
              <OwnActions pattern={pattern} id={pattern.ref} name={name} />
            ) : (
              <BuiltInActions id={pattern.ref} />
            )}
          </div>
        </div>
        {pieces.length > 0 ? (
          <PieceList groups={[{ id: 'used-in', heading: t('patterns.usedIn'), entries: pieces }]} />
        ) : null}
      </div>
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
