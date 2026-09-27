import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  notFound,
  stripSearchParams,
  type RouterHistory,
} from '@tanstack/react-router'
import { NotFoundPage } from '@/pages/not-found'
import { AppShell } from './AppShell'
import { FullScreenLayout } from './FullScreenLayout'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { RoutePending } from './RoutePending'
import {
  CHORDS_DEFAULTS,
  PLAYER_DEFAULTS,
  SCALES_DEFAULTS,
  SONGS_DEFAULTS,
  validateCheckSearch,
  validateChordsSearch,
  validatePlayerSearch,
  validateScalesSearch,
  validateSongsSearch,
} from './routes/search'
import { ShellLayout } from './ShellLayout'

// Each screen module becomes one chunk, loaded when one of its routes is first matched. A route
// that names content asks its screens module whether it is there, so the content stays in that
// chunk and out of the first paint.
const homeScreens = () => import('./routes/home-screens')
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

const rootRoute = createRootRoute({ component: RootLayout, notFoundComponent: NotFoundScreen })

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
  component: lazyRouteComponent(homeScreens, 'SettingsPage'),
})
const songsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs',
  validateSearch: validateSongsSearch,
  search: { middlewares: [stripSearchParams(SONGS_DEFAULTS)] },
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
  component: lazyRouteComponent(learnScreens, 'LearnPage'),
})
const chordsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/chords',
  validateSearch: validateChordsSearch,
  search: { middlewares: [stripSearchParams(CHORDS_DEFAULTS)] },
  component: lazyRouteComponent(learnScreens, 'ChordsPage'),
})
const scalesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/scales',
  validateSearch: validateScalesSearch,
  search: { middlewares: [stripSearchParams(SCALES_DEFAULTS)] },
  component: lazyRouteComponent(learnScreens, 'ScalesPage'),
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
})
const playerRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/$pieceId',
  validateSearch: validatePlayerSearch,
  search: { middlewares: [stripSearchParams(PLAYER_DEFAULTS)] },
  beforeLoad: async ({ params }) => {
    const { pieceById } = await playerScreens()
    if (!pieceById(params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'PlayerPage'),
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
    lessonRoute,
    practiceRoute,
    quizRoute,
    studyRoute,
    progressionRoute,
  ]),
  fullScreenRoute.addChildren([playerRoute, checkRoute]),
])

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    defaultErrorComponent: RouteError,
    defaultPendingComponent: RoutePending,
    defaultPendingMs: 300,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
}
