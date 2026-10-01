import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  notFound,
  type RouterHistory,
} from '@tanstack/react-router'
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
  intervalsSearch,
  keysSearch,
  learnSearch,
  readChordsSearch,
  readIntervalsSearch,
  readKeysSearch,
  readScalesSearch,
  readTensionsSearch,
  SCALES_KEPT,
  scalesSearch,
  tensionsSearch,
} from './routes/learn-search'
import {
  CHROMATIC_KEPT,
  chromaticSearch,
  PLAYER_KEPT,
  playerSearch,
  PROGRESSION_KEPT,
  progressionPlayerSearch,
  readChromaticSearch,
  readPlayerSearch,
  readProgressionPlayerSearch,
  readWalkSearch,
  WALK_KEPT,
  walkSearch,
} from './routes/player-search'
import { validateCheckSearch } from './routes/practice-search'
import { songsSearch } from './routes/songs-search'
import { remembered, restoreView } from './routes/remember'
import {
  finderSearch,
  passingSearch,
  progressionsSearch,
  readFinderSearch,
  readPassingSearch,
  readProgressionsSearch,
  readReharmoniseSearch,
  reharmoniseSearch,
} from './routes/tools-search'
import { ShellLayout } from './ShellLayout'

// Each screen module becomes one chunk, loaded when one of its routes is first matched. A route
// that names content asks its screens module whether it is there, so the content stays in that
// chunk and out of the first paint.
const homeScreens = () => import('./routes/home-screens')
const settingsScreens = () => import('./routes/settings-screens')
const songsScreens = () => import('./routes/songs-screens')
const playerScreens = () => import('./routes/player-screens')
const learnScreens = () => import('./routes/learn-screens')
const practiceScreens = () => import('./routes/practice-screens')

/** An unknown address keeps the main navigation, so the learner is never stranded. */
function NotFoundScreen() {
  return (
    <AppShell>
      <NotFoundPage />
    </AppShell>
  )
}

/** What every route is handed: the screens' remembered views (ADR 0022). */
export interface RouterContext {
  readonly views: ViewsStore
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
  beforeLoad: async ({ params }) => {
    const { entryById, shelfOf } = await songsScreens()
    const entry = entryById(params.pieceId)
    if (!entry || shelfOf(entry.kind) !== 'songs') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})

// Practice, and the studies and progressions that are practised there.
const practiceRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice',
  component: lazyRouteComponent(practiceScreens, 'PracticePage'),
})
const quizRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/quiz/$quiz',
  beforeLoad: async ({ params }) => {
    const { isTheoryQuiz } = await practiceScreens()
    if (!isTheoryQuiz(params.quiz)) throw notFound()
  },
  component: lazyRouteComponent(practiceScreens, 'TheoryQuizPage'),
})
const studyRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/studies/$pieceId',
  beforeLoad: async ({ params }) => {
    const { pieceById } = await songsScreens()
    if (pieceById(params.pieceId)?.kind !== 'study') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
const progressionRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/$pieceId',
  beforeLoad: async ({ params }) => {
    const { pieceById } = await songsScreens()
    if (pieceById(params.pieceId)?.kind !== 'progression') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})

// Learn: its lessons and references.
const learnRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn',
  ...learnSearch,
  component: lazyRouteComponent(learnScreens, 'LearnPage'),
})
const chordsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/chords',
  ...chordsSearch,
  ...remembered(readChordsSearch, CHORDS_KEPT),
  component: lazyRouteComponent(learnScreens, 'ChordsPage'),
})
const scalesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/scales',
  ...scalesSearch,
  ...remembered(readScalesSearch, SCALES_KEPT),
  component: lazyRouteComponent(learnScreens, 'ScalesPage'),
})
const keysRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/keys',
  ...keysSearch,
  ...remembered(readKeysSearch, []),
  component: lazyRouteComponent(learnScreens, 'KeysPage'),
})
const intervalsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/intervals',
  ...intervalsSearch,
  ...remembered(readIntervalsSearch, []),
  component: lazyRouteComponent(learnScreens, 'IntervalsPage'),
})
const tensionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/tensions',
  ...tensionsSearch,
  ...remembered(readTensionsSearch, []),
  component: lazyRouteComponent(learnScreens, 'TensionsPage'),
})
const chordFinderRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/chord-finder',
  ...finderSearch,
  ...remembered(readFinderSearch, []),
  component: lazyRouteComponent(learnScreens, 'ChordFinderPage'),
})
const reharmoniseRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/reharmonise',
  ...reharmoniseSearch,
  ...remembered(readReharmoniseSearch, []),
  component: lazyRouteComponent(learnScreens, 'ReharmonisePage'),
})
const passingChordsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/passing-chords',
  ...passingSearch,
  ...remembered(readPassingSearch, []),
  component: lazyRouteComponent(learnScreens, 'PassingChordsPage'),
})
const progressionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/progressions',
  ...progressionsSearch,
  ...remembered(readProgressionsSearch, []),
  component: lazyRouteComponent(learnScreens, 'ProgressionsPage'),
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
const playerRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/$pieceId',
  ...playerSearch,
  staticData: { remembered: true },
  beforeLoad: async (context) => {
    const { pieceById } = await playerScreens()
    if (!pieceById(context.params.pieceId)) throw notFound()
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
    keysRoute,
    intervalsRoute,
    tensionsRoute,
    chordFinderRoute,
    reharmoniseRoute,
    passingChordsRoute,
    progressionsRoute,
    lessonRoute,
    practiceRoute,
    quizRoute,
    studyRoute,
    progressionRoute,
  ]),
  fullScreenRoute.addChildren([
    playerRoute,
    walkRoute,
    chromaticRoute,
    progressionPlayerRoute,
    checkRoute,
  ]),
])

/**
 * The app's router over `history` (the browser's by default), handed the screens' remembered views:
 * a remembered screen restores its view on entering, and saves it each time it changes.
 */
export function createAppRouter({
  history,
  views,
}: {
  history?: RouterHistory
  views: ViewsStore
}) {
  const router = createRouter({
    routeTree,
    history,
    context: { views },
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
