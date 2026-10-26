import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  notFound,
  redirect,
  rootRouteId,
  type AnyRoute,
  type RouterHistory,
} from '@tanstack/react-router'
import {
  isOwnPatternId,
  isPatternRef,
  selectOwnPattern,
  type PatternsStore,
} from '@/entities/pattern'
import { selectSetlist, type LibraryStore } from '@/entities/library'
import type { PiecesStore } from '@/entities/piece'
import type { TakesStore } from '@/entities/take'
import type { ViewsStore } from '@/entities/views'
import { rememberView } from '@/features/remember-view'
import { NotFoundPage, TakeNotFound, type NotFoundWay } from '@/pages/not-found'
import { scaleHasChords } from '@/shared/lib/music'
import { AppShell } from './AppShell'
import { FULL_SCREEN_SCROLL, FullScreenLayout } from './FullScreenLayout'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { RoutePending } from './RoutePending'
import {
  accompanimentSearch,
  readAccompanimentSearch,
  validateNewPatternSearch,
} from './routes/accompaniment-search'
import {
  CHORDS_KEPT,
  chordsSearch,
  intervalsSearch,
  progressionsSearch,
  readChordsSearch,
  readIntervalsSearch,
  readProgressionsSearch,
  readScalesSearch,
  SCALES_KEPT,
  scalesSearch,
} from './routes/explorer-search'
import {
  CHROMATIC_KEPT,
  chromaticSearch,
  editSearch,
  EXERCISE_KEPT,
  exerciseSearch,
  PLAYER_KEPT,
  playerSearch,
  PROGRESSION_KEPT,
  progressionPlayerSearch,
  readChromaticSearch,
  readExerciseSearch,
  readPlayerSearch,
  readProgressionPlayerSearch,
  readWalkSearch,
  WALK_KEPT,
  walkSearch,
} from './routes/player-search'
import { LEARN_KEPT, learnSearch, readLearnSearch } from './routes/learn-search'
import { readTrainerSearch, trainerSearch, validateCheckSearch } from './routes/practice-search'
import { searchSearch } from './routes/search-search'
import { setlistSearch, songsSearch, validateSharedSongSearch } from './routes/songs-search'
import { remembered, restoreView } from './routes/remember'
import { CHORD_FINDER_KEPT, chordFinderSearch, readChordFinderSearch } from './routes/tool-search'
import { ShellLayout } from './ShellLayout'

// Each screen module becomes one chunk, loaded when one of its routes is first matched. A route
// that names content asks its screens module whether it is there, so the content stays in that
// chunk and out of the first paint.
const homeScreens = () => import('./routes/home-screens')
const settingsScreens = () => import('./routes/settings-screens')
const searchScreens = () => import('./routes/search-screens')
const songsScreens = () => import('./routes/songs-screens')
const playerScreens = () => import('./routes/player-screens')
const learnScreens = () => import('./routes/learn-screens')
const explorerScreens = () => import('./routes/explorer-screens')
const toolScreens = () => import('./routes/tool-screens')
const accompanimentScreens = () => import('./routes/accompaniment-screens')
const practiceScreens = () => import('./routes/practice-screens')

/** An unknown address keeps the main navigation, so the learner is never stranded. */
function NotFoundScreen() {
  return (
    <AppShell>
      <NotFoundPage way="songs" />
    </AppShell>
  )
}

/** A route's not found, for a thing its URL names that is not there: the way back to its place. */
function notFoundIn(way: NotFoundWay) {
  return function PlaceNotFound() {
    return <NotFoundPage way={way} />
  }
}

/**
 * What every route is handed: the screens' remembered views (ADR 0022), the learner's patterns, which
 * say whether a pattern's page is there (ADR 0026), the learner's pieces, which say whether a piece,
 * its page or its editor is (ADR 0027), their takes, which say whether a take's page is (ADR 0034),
 * and their library, which says whether a setlist's page is (ADR 0103).
 */
export interface RouterContext {
  readonly views: ViewsStore
  readonly patterns: PatternsStore
  readonly pieces: PiecesStore
  readonly takes: TakesStore
  readonly library: LibraryStore
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundScreen,
})

// Screens reached from the main navigation.
const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'shell',
  component: ShellLayout,
})
// Learn, the first place (ADR 0053): the Lessons' journeys or the Courses, as its toggle says.
const learnRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/',
  ...learnSearch,
  ...remembered(readLearnSearch, LEARN_KEPT),
  component: lazyRouteComponent(homeScreens, 'LearnPage'),
})
const settingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings',
  component: lazyRouteComponent(settingsScreens, 'SettingsPage'),
})
// Search: every named thing the app has, found by name (ADR 0044).
const searchRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/search',
  ...searchSearch,
  component: lazyRouteComponent(searchScreens, 'SearchPage'),
})
const songsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs',
  ...songsSearch,
  component: lazyRouteComponent(songsScreens, 'SongsPage'),
})
const sharedSongRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/shared',
  validateSearch: validateSharedSongSearch,
  component: lazyRouteComponent(songsScreens, 'SharedSongPage'),
})
const pieceRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/$pieceId',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    const { entryIn, shelfOf } = await songsScreens()
    const entry = entryIn(context.pieces.getState(), params.pieceId)
    if (!entry || shelfOf(entry.kind) !== 'songs') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
// A setlist of the learner's library (ADR 0103): its songs in their order.
const setlistRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/setlists/$setlistId',
  notFoundComponent: notFoundIn('songs'),
  ...setlistSearch,
  beforeLoad: ({ params, context }) => {
    if (!selectSetlist(params.setlistId)(context.library.getState())) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'SetlistPage'),
})
// A section of a song, learned step by step (ADR 0100); a study's is on its shelf, below.
const sectionRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/$pieceId/sections/$section',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    const { sectionIn } = await songsScreens()
    const { pieceId, section } = params
    if (!sectionIn(context.pieces.getState(), pieceId, section, 'songs')) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'SectionPage'),
})

// Practice (ADR 0044): its list, then its training, Exercises and Quiz with its trainers.
const practiceRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice',
  component: lazyRouteComponent(practiceScreens, 'PracticePage'),
})
const quizRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/quiz',
  component: lazyRouteComponent(practiceScreens, 'QuizPage'),
})
const exercisesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/exercises',
  component: lazyRouteComponent(practiceScreens, 'ExercisesPage'),
})
// A trainer: each remembers its own level, rounds and Custom, under its own path. Its levels are its
// ladder's, which the validator cannot see: a level it does not have leaves the URL here.
const restoreTrainer = restoreView(readTrainerSearch, [])
const trainerRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/quiz/$trainerId',
  notFoundComponent: notFoundIn('quiz'),
  ...trainerSearch,
  staticData: { remembered: true },
  beforeLoad: async (context) => {
    const { isTrainerId, ownTrainerView, trainerOf } = await practiceScreens()
    const { trainerId } = context.params
    if (!isTrainerId(trainerId)) throw notFound()
    restoreTrainer(context)
    const own = ownTrainerView(trainerOf(trainerId), context.search)
    if (own !== context.search) {
      throw redirect({
        to: '/practice/quiz/$trainerId',
        params: { trainerId },
        search: own,
        replace: true,
      })
    }
  },
  component: lazyRouteComponent(practiceScreens, 'TrainerPage'),
})
const studyRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment/studies/$pieceId',
  notFoundComponent: notFoundIn('accompaniment'),
  beforeLoad: async ({ params, context }) => {
    const { entryIn } = await songsScreens()
    if (entryIn(context.pieces.getState(), params.pieceId)?.kind !== 'study') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
const studySectionRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment/studies/$pieceId/sections/$section',
  notFoundComponent: notFoundIn('accompaniment'),
  beforeLoad: async ({ params, context }) => {
    const { sectionIn } = await songsScreens()
    const { pieceId, section } = params
    if (!sectionIn(context.pieces.getState(), pieceId, section, 'practice')) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'SectionPage'),
})
// Practice's explorers: each page shows a thing on the keys.
const chordsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/chords',
  ...chordsSearch,
  ...remembered(readChordsSearch, CHORDS_KEPT),
  component: lazyRouteComponent(explorerScreens, 'ChordsPage'),
})
const scalesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/scales',
  ...scalesSearch,
  ...remembered(readScalesSearch, SCALES_KEPT),
  component: lazyRouteComponent(explorerScreens, 'ScalesPage'),
})
const intervalsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/intervals',
  ...intervalsSearch,
  ...remembered(readIntervalsSearch, []),
  component: lazyRouteComponent(explorerScreens, 'IntervalsPage'),
})
const progressionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions',
  ...progressionsSearch,
  ...remembered(readProgressionsSearch, []),
  component: lazyRouteComponent(explorerScreens, 'ProgressionsPage'),
})

// The Chord finder (ADR 0054): a tool of its own, any chord played or tapped named, spelled and written.
const chordFinderRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/chord-finder',
  ...chordFinderSearch,
  ...remembered(readChordFinderSearch, CHORD_FINDER_KEPT),
  component: lazyRouteComponent(toolScreens, 'ChordFinderPage'),
})

// Accompaniment: the patterns and their pieces, a page for each source (ADR 0033). A pattern is
// explained, starred, hidden on its own page; the learner's own are made and edited (ADR 0026).
const accompanimentRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment',
  ...accompanimentSearch,
  ...remembered(readAccompanimentSearch, []),
  component: lazyRouteComponent(accompanimentScreens, 'AccompanimentPage'),
})
/** Whether a ref names a pattern the book holds: every built-in, and the learner's own still kept. */
const inBook = (ref: string, patterns: PatternsStore) =>
  isPatternRef(ref) &&
  (!isOwnPatternId(ref) || selectOwnPattern(ref)(patterns.getState()) !== undefined)
const newPatternRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment/patterns/new',
  validateSearch: validateNewPatternSearch,
  component: lazyRouteComponent(accompanimentScreens, 'NewPatternPage'),
})
const patternRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment/patterns/$patternRef',
  notFoundComponent: notFoundIn('accompaniment'),
  beforeLoad: ({ params, context }) => {
    if (!inBook(params.patternRef, context.patterns)) throw notFound()
  },
  component: lazyRouteComponent(accompanimentScreens, 'PatternPage'),
})
const editPatternRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment/patterns/$patternRef/edit',
  notFoundComponent: notFoundIn('accompaniment'),
  beforeLoad: ({ params, context }) => {
    if (!isOwnPatternId(params.patternRef) || !inBook(params.patternRef, context.patterns)) {
      throw notFound()
    }
  },
  component: lazyRouteComponent(accompanimentScreens, 'EditPatternPage'),
})

// A lesson of the Lessons' journeys; a course and its own lessons (ADR 0053).
const lessonRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/lessons/$lessonId',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params }) => {
    const { lessonById, lessonPlace } = await learnScreens()
    if (!lessonById(params.lessonId) || !lessonPlace(params.lessonId)) throw notFound()
  },
  component: lazyRouteComponent(learnScreens, 'LessonPage'),
})
const courseRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params }) => {
    const { courseById } = await learnScreens()
    if (!courseById(params.courseId)) throw notFound()
  },
  component: lazyRouteComponent(learnScreens, 'CoursePage'),
})
const courseLessonRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId/$lessonId',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params }) => {
    const { courseLesson } = await learnScreens()
    if (!courseLesson(params.courseId, params.lessonId)) throw notFound()
  },
  component: lazyRouteComponent(learnScreens, 'CourseLessonPage'),
})

// Screens that take the whole screen, with their own way back.
const fullScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'full-screen',
  component: FullScreenLayout,
  staticData: { fullScreen: true },
})
// A piece and a walk check what they name first, then restore their view.
const restorePiece = restoreView(readPlayerSearch, PLAYER_KEPT)
const restoreWalk = restoreView(readWalkSearch, WALK_KEPT)
const restoreExercise = restoreView(readExerciseSearch, EXERCISE_KEPT)
const playerRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/$pieceId',
  notFoundComponent: notFoundIn('songs'),
  ...playerSearch,
  staticData: { remembered: true },
  beforeLoad: async (context) => {
    const { pieceIn } = await playerScreens()
    if (!pieceIn(context.context.pieces.getState(), context.params.pieceId)) throw notFound()
    restorePiece(context)
  },
  component: lazyRouteComponent(playerScreens, 'PlayerPage'),
})

const walkRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/walk',
  notFoundComponent: notFoundIn('scales'),
  ...walkSearch,
  staticData: { remembered: true },
  beforeLoad: (context) => {
    if (!scaleHasChords(context.search.kind)) throw notFound()
    restoreWalk(context)
  },
  component: lazyRouteComponent(playerScreens, 'WalkPlayerPage'),
})

const chromaticRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/chromatic',
  ...chromaticSearch,
  ...remembered(readChromaticSearch, CHROMATIC_KEPT),
  component: lazyRouteComponent(playerScreens, 'ChromaticPlayerPage'),
})

const progressionPlayerRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/progression',
  ...progressionPlayerSearch,
  ...remembered(readProgressionPlayerSearch, PROGRESSION_KEPT),
  component: lazyRouteComponent(playerScreens, 'ProgressionPlayerPage'),
})

// An exercise its own rule writes; each remembers its own view, under its own path.
const exerciseRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/exercise/$exerciseId',
  notFoundComponent: notFoundIn('exercises'),
  ...exerciseSearch,
  staticData: { remembered: true },
  beforeLoad: async (context) => {
    const { isExerciseId } = await playerScreens()
    if (!isExerciseId(context.params.exerciseId)) throw notFound()
    restoreExercise(context)
  },
  component: lazyRouteComponent(playerScreens, 'ExercisePlayerPage'),
})

// The score editor: the Player's chunk carries the engraver it writes on.
const editRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/edit/$pieceId',
  notFoundComponent: notFoundIn('songs'),
  ...editSearch,
  beforeLoad: async ({ params, context }) => {
    const { editableIn } = await playerScreens()
    if (!editableIn(context.pieces.getState(), params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'ScoreEditorPage'),
})

// A take's page, in the shell: a page to read and listen to, beside the editor that recorded it.
const takeRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/edit/$pieceId/takes/$takeId',
  notFoundComponent: TakeNotFound,
  beforeLoad: async ({ params, context }) => {
    const { editableIn, takeIn } = await playerScreens()
    // A song that is not there has no takes to lead back to: the address's own not found.
    if (!editableIn(context.pieces.getState(), params.pieceId)) {
      throw notFound({ routeId: rootRouteId })
    }
    if (!takeIn(context.takes.getState(), params.pieceId, params.takeId)) throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'TakePage'),
})

const checkRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/check',
  notFoundComponent: notFoundIn('learn'),
  validateSearch: validateCheckSearch,
  beforeLoad: async ({ search, context }) => {
    const { checkIn } = await practiceScreens()
    if (!search.of || !checkIn(context.pieces.getState(), search.of)) throw notFound()
  },
  component: lazyRouteComponent(practiceScreens, 'CheckPage'),
})

const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    learnRoute,
    settingsRoute,
    searchRoute,
    songsRoute,
    sharedSongRoute,
    pieceRoute,
    setlistRoute,
    sectionRoute,
    courseRoute,
    chordsRoute,
    scalesRoute,
    intervalsRoute,
    progressionsRoute,
    accompanimentRoute,
    newPatternRoute,
    patternRoute,
    editPatternRoute,
    lessonRoute,
    courseLessonRoute,
    practiceRoute,
    quizRoute,
    exercisesRoute,
    chordFinderRoute,
    trainerRoute,
    studyRoute,
    studySectionRoute,
    takeRoute,
  ]),
  fullScreenRoute.addChildren([
    playerRoute,
    walkRoute,
    chromaticRoute,
    progressionPlayerRoute,
    exerciseRoute,
    editRoute,
    checkRoute,
  ]),
])

/**
 * The app's router over `history` (the browser's by default), handed its context: a remembered
 * screen restores its view on entering, and saves it each time it changes.
 */
export function createAppRouter({
  history,
  views,
  patterns,
  pieces,
  takes,
  library,
}: RouterContext & { history?: RouterHistory }) {
  const router = createRouter({
    routeTree,
    history,
    context: { views, patterns, pieces, takes, library },
    defaultPreload: 'intent',
    defaultErrorComponent: RouteError,
    defaultPendingComponent: RoutePending,
    defaultPendingMs: 300,
    // Back returns to where the learner was on the screen they go back to; a new screen starts at
    // its top, the full screen's own scroll too.
    scrollRestoration: true,
    scrollToTopSelectors: [`[data-scroll-restoration-id="${FULL_SCREEN_SCROLL}"]`],
  })
  // A screen's view: the params its route reads, as the URL wrote them where the route read them so;
  // nothing else a link carried, and never a screen not found.
  router.subscribe('onResolved', ({ toLocation }) => {
    const match = router.state.matches.at(-1)
    if (!match?.staticData.remembered || match.status !== 'success') return
    const route: AnyRoute = router.routesById[match.routeId]
    const validate: unknown = route.options.validateSearch
    const read: Record<string, unknown> =
      typeof validate === 'function' ? validate(toLocation.search) : {}
    const own = Object.entries(toLocation.search).filter(
      ([param, value]) => param in read && JSON.stringify(read[param]) === JSON.stringify(value),
    )
    rememberView(views, toLocation.pathname, Object.fromEntries(own))
  })
  return router
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
  interface StaticDataRouteOption {
    /** A screen on its own (the Player, the Check), which nothing else is laid over. */
    fullScreen?: true
    /** A screen that comes back the learner's way (ADR 0022): its view saved in `pt-views`. */
    remembered?: true
  }
}
