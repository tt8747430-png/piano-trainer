import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { CopyPlus, Eye, EyeOff, Globe, PencilLine, Play, Star, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  isOwnPatternId,
  isPatternId,
  isPatternRef,
  LEFT_FIGURES,
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
import {
  deleteOwnPattern,
  restoreOwnPattern,
  toggleFavourite,
  toggleHidden,
} from '@/features/manage-patterns'
import { useShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import {
  BackButton,
  ButtonLink,
  MoreMenu,
  NotFound,
  RoundButton,
  say,
  ScreenHeader,
  type MenuAction,
} from '@/shared/ui'
import { PatternPlay, PatternStaff, usePatternSample } from '@/widgets/pattern-music'
import { PieceList } from '@/widgets/piece-list'
import { useForgetScreens } from '@/shared/lib'

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
      className="aria-pressed:bg-chosen aria-pressed:[&_svg]:fill-current"
    />
  )
}

/**
 * A pattern's actions for its bar's More: for a built-in one, a pattern of the learner's own from it
 * and hiding it from the Player; for the learner's own, Edit, Publish in library (a page of its own,
 * round 27) and Delete, last, done at once with Undo in its toast. What was done (a line) comes
 * with them.
 */
function usePatternActions(pattern: BookPattern, name: string) {
  const { t } = useTranslation(['practice', 'songs', 'editor'])
  const store = usePatternsStoreApi()
  const navigate = useNavigate()
  const forget = useForgetScreens()
  const own = isOwnPatternId(pattern.ref) ? pattern.ref : null
  const builtIn = isPatternId(pattern.ref) ? pattern.ref : null
  const hidden = usePatterns((state) => builtIn !== null && selectIsHidden(builtIn)(state))
  // Gone at once, with Undo in its toast (R38): nothing to ask, since the Undo puts it back whole.
  const remove = (id: OwnPatternId) => {
    // Leave the page first: it has nothing to show once the pattern is gone, nor Back its screens.
    forget(`/practice/accompaniment/patterns/${id}`)
    void navigate({
      to: '/practice/accompaniment',
      search: { place: 'mine' },
      replace: true,
    }).then(() => {
      const deleted = deleteOwnPattern(store, id)
      if (!deleted) return
      say(t('patterns.deleted', { name }), {
        label: t('patterns.undo'),
        onClick: () => restoreOwnPattern(store, deleted),
      })
    })
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
                // Edit is a mode of the pattern's page, not a page over it: Save and Cancel put the
                // page back in its place.
                replace: true,
              }),
          },
          {
            key: 'publish',
            label: t('editor:publishPage.open'),
            icon: Globe,
            onSelect: () =>
              void navigate({
                to: '/practice/accompaniment/patterns/$patternRef/publish',
                params: { patternRef: own },
              }),
          },
          {
            key: 'delete',
            label: t('patterns.delete'),
            icon: Trash2,
            destructive: true,
            onSelect: () => remove(own),
          },
        ]
  const said = (
    <>
      {hidden ? <p className="text-sm text-muted-foreground">{t('patterns.hiddenNote')}</p> : null}
    </>
  )
  return { actions, said }
}

/**
 * A pattern explained: its idea, what each hand plays, the pattern on the staff and heard on the keys,
 * its source's explanation and the music that plays it, in one column. Its bar holds the star and
 * More (its own actions); Practise in the Player is the page's one honey act, at its end.
 */
function PatternView({ pattern, book }: { pattern: BookPattern; book: PatternBook }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const sample = usePatternSample(pattern, book)
  const [shown, show] = useShownKeys(pattern.ref, sample.shown)
  const name = localText(pattern.name, locale)
  const pieces = isPatternId(pattern.ref) ? piecesPlaying(pattern.ref) : []
  const more = usePatternActions(pattern, name)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={name}
        back={<BackButton />}
        tools={<FavouriteButton pattern={pattern} />}
        more={<MoreMenu actions={more.actions} />}
      />
      <PinnedKeyboard shown={shown} />
      <div className="flex max-w-xl flex-col gap-5">
        <p className="text-xl text-balance">{localText(pattern.idea, locale)}</p>
        <section className="flex flex-col gap-4 card p-4">
          <PatternStaff sample={sample} />
          <PatternPlay sample={sample} onShow={show} variant="default" />
        </section>
        <dl className="flex flex-col divide-y divide-border card">
          {[
            [t('patterns.rightHand'), localText(RIGHT_FIGURES[pattern.rh].name, locale)],
            [t('patterns.leftHand'), localText(LEFT_FIGURES[pattern.lh].name, locale)],
          ].map(([term, value]) => (
            <div key={term} className="flex min-h-12 items-center justify-between gap-4 px-4 py-3">
              <dt>{term}</dt>
              <dd className="text-right text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
        {pattern.description ? (
          <p className="text-lg leading-relaxed text-pretty">
            {localText(pattern.description, locale)}
          </p>
        ) : null}
        {more.said}
        {pieces.length > 0 ? (
          <PieceList groups={[{ id: 'used-in', heading: t('patterns.usedIn'), entries: pieces }]} />
        ) : null}
        {/* The way on, the page's one honey act at its end: the pattern played in the Player. */}
        <ButtonLink
          size="lg"
          className="h-12 w-full rounded-pill text-base font-semibold [&_svg]:fill-current"
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
          <Play aria-hidden />
          {t('inPlayer')}
        </ButtonLink>
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
