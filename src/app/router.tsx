import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  notFound,
  type RouterHistory,
} from '@tanstack/react-router'
import {
  isOwnPatternId,
  isPatternRef,
  selectOwnPattern,
  type PatternsStore,
} from '@/entities/pattern'
import type { PiecesStore } from '@/entities/piece'
import type { ViewsStore } from '@/entities/views'
import { rememberView } from '@/features/remember-view'
import { NotFoundPage } from '@/pages/not-found'
import { scaleHasChords } from '@/shared/lib/music'
import { AppShell } from './AppShell'
import { FullScreenLayout } from './FullScreenLayout'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { RoutePending } from './RoutePending'
import {
  CHORDS_KEPT,
  chordsSearch,
  finderSearch,
  intervalsSearch,
  passingSearch,
  progressionsSearch,
  readChordsSearch,
  readFinderSearch,
  readIntervalsSearch,
  readPassingSearch,
  readProgressionsSearch,
  readReharmoniseSearch,
  readScalesSearch,
  readTensionsSearch,
  reharmoniseSearch,
  SCALES_KEPT,
  scalesSearch,
  tensionsSearch,
  validateNewPatternSearch,
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
import { readTrainerSearch, trainerSearch, validateCheckSearch } from './routes/practice-search'
import { songsSearch } from './routes/songs-search'
import { remembered, restoreView } from './routes/remember'
import { ShellLayout } from './ShellLayout'

// Each screen module becomes one chunk, loaded when one of its routes is first matched. A route
// that names content asks its screens module whether it is there, so the content stays in that
// chunk and out of the first paint.
const homeScreens = () => import('./routes/home-screens')
const settingsScreens = () => import('./routes/settings-screens')
const songsScreens = () => import('./routes/songs-screens')
const playerScreens = () => import('./routes/player-screens')
const learnScreens = () => import('./routes/learn-screens')
const explorerScreens = () => import('./routes/explorer-screens')
const practiceScreens = () => import('./routes/practice-screens')

/** An unknown address keeps the main navigation, so the learner is never stranded. */
function NotFoundScreen() {
  return (
    <AppShell>
      <NotFoundPage />
    </AppShell>
  )
}

/**
 * What every route is handed: the screens' remembered views (ADR 0022), the learner's patterns, which
 * say whether a pattern's page is there (ADR 0026), and the learner's pieces, which say whether a
 * piece, its page or its editor is (ADR 0027).
 */
export interface RouterContext {
  readonly views: ViewsStore
  readonly patterns: PatternsStore
  readonly pieces: PiecesStore
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
const pathRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/',
  component: lazyRouteComponent(homeScreens, 'PathPage'),
})
const settingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings',
  component: lazyRouteComponent(settingsScreens, 'SettingsPage'),
})
const songsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs',
  ...songsSearch,
  component: lazyRouteComponent(songsScreens, 'SongsPage'),
})
const pieceRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/$pieceId',
  beforeLoad: async ({ params, context }) => {
    const { entryIn, shelfOf } = await songsScreens()
    const entry = entryIn(context.pieces.getState(), params.pieceId)
    if (!entry || shelfOf(entry.kind) !== 'songs') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})

// Practice's seven places; Quiz with its trainers, Exercises, and the studies and progressions that
// are practised there.
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
const studiesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/studies',
  component: lazyRouteComponent(practiceScreens, 'StudiesPage'),
})
// A trainer: each remembers its own level, rounds and Custom, under its own path.
const restoreTrainer = restoreView(readTrainerSearch, [])
const trainerRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/trainers/$trainerId',
  ...trainerSearch,
  staticData: { remembered: true },
  beforeLoad: async (context) => {
    const { isTrainerId } = await practiceScreens()
    if (!isTrainerId(context.params.trainerId)) throw notFound()
    restoreTrainer(context)
  },
  component: lazyRouteComponent(practiceScreens, 'TrainerPage'),
})
const studyRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/studies/$pieceId',
  beforeLoad: async ({ params, context }) => {
    const { entryIn } = await songsScreens()
    if (entryIn(context.pieces.getState(), params.pieceId)?.kind !== 'study') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
const progressionRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/$pieceId',
  beforeLoad: async ({ params, context }) => {
    const { entryIn } = await songsScreens()
    if (entryIn(context.pieces.getState(), params.pieceId)?.kind !== 'progression') {
      throw notFound()
    }
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})

// Learn: its lessons.
const learnRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn',
  component: lazyRouteComponent(learnScreens, 'LearnPage'),
})
// What Practice explores with: each page shows a thing on the keys or works it out.
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
const tensionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/tensions',
  ...tensionsSearch,
  ...remembered(readTensionsSearch, []),
  component: lazyRouteComponent(explorerScreens, 'TensionsPage'),
})
const chordFinderRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/chord-finder',
  ...finderSearch,
  ...remembered(readFinderSearch, []),
  component: lazyRouteComponent(explorerScreens, 'ChordFinderPage'),
})
const reharmoniseRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/reharmonise',
  ...reharmoniseSearch,
  ...remembered(readReharmoniseSearch, []),
  component: lazyRouteComponent(explorerScreens, 'ReharmonisePage'),
})
const passingChordsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/passing-chords',
  ...passingSearch,
  ...remembered(readPassingSearch, []),
  component: lazyRouteComponent(explorerScreens, 'PassingChordsPage'),
})
const progressionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions',
  ...progressionsSearch,
  ...remembered(readProgressionsSearch, []),
  component: lazyRouteComponent(explorerScreens, 'ProgressionsPage'),
})

// Patterns: each explained, starred, hidden; the learner's own made and edited (ADR 0026).
const patternsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/patterns',
  component: lazyRouteComponent(explorerScreens, 'PatternsPage'),
})
/** Whether a ref names a pattern the book holds: every built-in, and the learner's own still kept. */
const inBook = (ref: string, patterns: PatternsStore) =>
  isPatternRef(ref) &&
  (!isOwnPatternId(ref) || selectOwnPattern(ref)(patterns.getState()) !== undefined)
const newPatternRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/patterns/new',
  validateSearch: validateNewPatternSearch,
  component: lazyRouteComponent(explorerScreens, 'NewPatternPage'),
})
const patternRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/patterns/$patternRef',
  beforeLoad: ({ params, context }) => {
    if (!inBook(params.patternRef, context.patterns)) throw notFound()
  },
  component: lazyRouteComponent(explorerScreens, 'PatternPage'),
})
const editPatternRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/patterns/$patternRef/edit',
  beforeLoad: ({ params, context }) => {
    if (!isOwnPatternId(params.patternRef) || !inBook(params.patternRef, context.patterns)) {
      throw notFound()
    }
  },
  component: lazyRouteComponent(explorerScreens, 'EditPatternPage'),
})

const lessonRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/lessons/$lessonId',
  beforeLoad: async ({ params }) => {
    const { lessonById } = await learnScreens()
    if (!lessonById(params.lessonId)) throw notFound()
  },
  component: lazyRouteComponent(learnScreens, 'LessonPage'),
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
  ...editSearch,
  beforeLoad: async ({ params, context }) => {
    const { editableIn } = await playerScreens()
    if (!editableIn(context.pieces.getState(), params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'ScoreEditorPage'),
})

const checkRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/check',
  validateSearch: validateCheckSearch,
  beforeLoad: async ({ search }) => {
    const { checkPlan } = await practiceScreens()
    if (!search.of || !checkPlan(search.of)) throw notFound()
  },
  component: lazyRouteComponent(practiceScreens, 'CheckPage'),
})

const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    pathRoute,
    settingsRoute,
    songsRoute,
    pieceRoute,
    learnRoute,
    chordsRoute,
    scalesRoute,
    intervalsRoute,
    tensionsRoute,
    chordFinderRoute,
    reharmoniseRoute,
    passingChordsRoute,
    progressionsRoute,
    patternsRoute,
    newPatternRoute,
    patternRoute,
    editPatternRoute,
    lessonRoute,
    practiceRoute,
    quizRoute,
    exercisesRoute,
    trainerRoute,
    studiesRoute,
    studyRoute,
    progressionRoute,
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
}: RouterContext & { history?: RouterHistory }) {
  const router = createRouter({
    routeTree,
    history,
    context: { views, patterns, pieces },
    defaultPreload: 'intent',
    defaultErrorComponent: RouteError,
    defaultPendingComponent: RoutePending,
    defaultPendingMs: 300,
    // Back returns to where the learner was on the screen they go back to.
    scrollRestoration: true,
  })
  router.subscribe('onResolved', ({ toLocation }) => {
    if (router.state.matches.at(-1)?.staticData.remembered) {
      rememberView(views, toLocation.pathname, toLocation.search)
    }
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
