import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { CopyPlus, Eye, EyeOff, Globe, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isOwnPatternId,
  isPatternId,
  isPatternRef,
  selectIsFavourite,
  selectIsHidden,
  usePatternBook,
  usePatterns,
  usePatternsStoreApi,
  usePartName,
  partOfShelf,
  type BookPattern,
  type OwnPatternId,
  type PatternBook,
} from '@/entities/pattern'
import { entryTitles, piecesPlaying } from '@/entities/piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { PianoButton } from '@/widgets/practice-pages'
import {
  deleteOwnPattern,
  restoreOwnPattern,
  toggleFavourite,
  toggleHidden,
} from '@/features/manage-patterns'
import { useMarkPracticeUsed } from '@/features/manage-practice-library'
import { useShownKeys } from '@/features/play-example'
import { Button } from '@/shared/ui/primitives/button'
import { localText, useLocale } from '@/shared/i18n'
import {
  ActionMenu,
  BackButton,
  ButtonLink,
  PractiseRow,
  PractiseRows,
  MoreMenu,
  NotFound,
  NameHeart,
  say,
  ScreenHeader,
  type MenuAction,
} from '@/shared/ui'
import { PatternPieces, PatternStaff, usePatternSample } from '@/widgets/pattern-music'
import { EntryRow } from '@/widgets/piece-list'
import { useForgetScreens } from '@/shared/lib'
import { C_MAJOR, keyParam, keysAround } from '@/shared/lib/music'
import { PROGRESSION } from '@/features/practice'
import { ProgressionPractice } from '@/widgets/progression-explorer'

/** How many songs and lessons Used in shows before Show all. */
const FOLDED = 5

/** The ♡ beside the name: a favourite comes first in the Player's list. */
function FavouriteButton({ pattern }: { pattern: BookPattern }) {
  const { t } = useTranslation('practice')
  const store = usePatternsStoreApi()
  const favourite = usePatterns(selectIsFavourite(pattern.ref))
  return (
    <NameHeart
      pressed={favourite}
      label={t('patterns.favourite')}
      onToggle={() => toggleFavourite(store, pattern.ref)}
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
 * A pattern's page, as its board (`r63_pattern.py`): Back · Pattern · the keys' tools · More; the keys
 * at the top lighting what it plays; its name in the serif with its ♡, its book and whether it is
 * built in; its bar on the grand staff with what it is; Practise in the Player, round and round in C
 * and through the keys (a tune's pattern, in its song); Used in; one floating bar Loop · Play ⌄ (Play
 * over a bar of C major or a song it is used in). On a laptop, one centred column 880 wide.
 */
function PatternView({ pattern, book }: { pattern: BookPattern; book: PatternBook }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  useMarkPracticeUsed('accompaniment', `pattern:${pattern.ref}`)
  const partName = usePartName()
  const pieces = isPatternId(pattern.ref) ? piecesPlaying(pattern.ref) : []
  const tune = pattern.pattern.rh.kind === 'tune'
  // What it is played over: a bar of C (none chosen), or a song it is used in.
  const [overId, setOverId] = useState<string | null>(tune ? (pieces[0]?.id ?? null) : null)
  const over = pieces.find((piece) => piece.id === overId)
  const sample = usePatternSample(pattern, book, over)
  const [shown, show] = useShownKeys(`${pattern.ref} ${overId ?? ''}`, sample.shown)
  const name = localText(pattern.name, locale)
  const more = usePatternActions(pattern, name)
  const own = isOwnPatternId(pattern.ref)
  const [allUses, setAllUses] = useState(false)
  const overs = [
    ...(tune ? [] : [{ id: null, label: t('patterns.barOfC') }]),
    ...pieces
      .slice(0, 4)
      .map((piece) => ({ id: piece.id, label: entryTitles(piece, locale).primary })),
  ]
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('patterns.title')}
        back={<BackButton />}
        settings={<PianoButton />}
        more={<MoreMenu actions={more.actions} />}
      />
      <PinnedKeyboard shown={shown} place="top" least={PATTERN_KEYS} />
      <div className="flex flex-col gap-4 lg:mx-auto lg:w-full lg:max-w-220 lg:gap-6">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-0.5">
              <h2 className="font-serif text-[2.25rem] leading-[1.1] font-bold tracking-[-0.02em] text-balance">
                {name}
              </h2>
              <FavouriteButton pattern={pattern} />
            </div>
            <p className="ms-0.5 text-[0.9375rem] text-muted-foreground">
              {own
                ? t('patterns.yours')
                : partName(partOfShelf(pattern.group))}
            </p>
          </div>
          {more.said}
          {/* Its bar on the grand staff at reading size, on the paper with its line under it as
              a caption, no card (canvas, "A pattern's grand staff at reading size"). */}
          <section className="flex flex-col gap-3">
            <PatternStaff sample={sample} />
            <p className="mx-1 max-w-[65ch] text-[0.9375rem] leading-[1.4] text-pretty text-muted-foreground">
              {localText(pattern.idea, locale)}
            </p>
          </section>
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
          {tune ? (
            sample.piece ? (
              <PractiseRows title={t('progressions.practiseRows')}>
                <PractiseRow
                  title={entryTitles(sample.piece, locale).primary}
                  detail={t('patterns.practise')}
                  render={
                    <Link
                      to="/play/$pieceId"
                      params={{ pieceId: sample.piece.id }}
                      search={{ pattern: pattern.ref }}
                    />
                  }
                />
              </PractiseRows>
            ) : null
          ) : (
            <ProgressionPractice
              musicKey={C_MAJOR}
              inPlayer={{ p: PROGRESSION.numerals, key: keyParam(C_MAJOR), pattern: pattern.ref }}
            />
          )}
          {pieces.length > 0 ? (
            <section className="flex flex-col gap-2">
              <h3 className="font-sans text-sm font-semibold text-foreground">
                {t('patterns.usedIn')}
              </h3>
              <ul className="card flex flex-col p-1.5">
                {(allUses ? pieces : pieces.slice(0, FOLDED)).map((piece) => (
                  <EntryRow key={piece.id} entry={piece} tile={false} />
                ))}
              </ul>
              {!allUses && pieces.length > FOLDED ? (
                <Button variant="soft" className="self-start" onClick={() => setAllUses(true)}>
                  {t('library.showAll', { count: pieces.length })}
                </Button>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
      <PatternPieces
        sample={sample}
        onShow={show}
        menuLabel={t('patterns.playOver')}
        menu={(trigger) => (
          <ActionMenu
            label={t('patterns.playOver')}
            align="end"
            render={trigger}
            trigger={null}
            actions={overs.map((each) => ({
              key: each.id ?? 'c',
              group: t('patterns.playOver'),
              label: each.label,
              checked: overId === each.id,
              onSelect: () => setOverId(each.id),
            }))}
          />
        )}
      />
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

/** The board's keys under both hands: C2 to A4 on a phone, F1 to C6 on a laptop. */
const PATTERN_KEYS = keysAround(48, [12, 21], [19, 36])
