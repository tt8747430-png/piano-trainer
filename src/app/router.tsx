import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  notFound,
  redirect,
  stripSearchParams,
  type RouterHistory,
} from '@tanstack/react-router'
import { entryById, pieceById } from '@/entities/piece'
import { checkPlan } from '@/features/quiz'
import { NotFoundPage } from '@/pages/not-found'
import { AppShell } from './AppShell'
import { FullScreenLayout } from './FullScreenLayout'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { RoutePending } from './RoutePending'
import {
  CHORDS_DEFAULTS,
  PLAYER_DEFAULTS,
  QUIZ_DEFAULTS,
  SCALES_DEFAULTS,
  SONGS_DEFAULTS,
  validateCheckSearch,
  validateChordsSearch,
  validatePlayerSearch,
  validateQuizSearch,
  validateScalesSearch,
  validateSongsSearch,
} from './routes/search'
import { ShellLayout } from './ShellLayout'
import { TheoryLayout } from './TheoryLayout'

// Each screen module becomes one chunk, loaded when one of its routes is first matched.
const homeScreens = () => import('./routes/home-screens')
const songsScreens = () => import('./routes/songs-screens')
const playerScreens = () => import('./routes/player-screens')
const theoryScreens = () => import('./routes/theory-screens')

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
  beforeLoad: ({ params }) => {
    if (!entryById(params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})

const theoryRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/theory',
  component: TheoryLayout,
})
const theoryIndexRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/theory/chords' })
  },
})
const chordsRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'chords',
  validateSearch: validateChordsSearch,
  search: { middlewares: [stripSearchParams(CHORDS_DEFAULTS)] },
  component: lazyRouteComponent(theoryScreens, 'TheoryChordsPage'),
})
const scalesRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'scales',
  validateSearch: validateScalesSearch,
  search: { middlewares: [stripSearchParams(SCALES_DEFAULTS)] },
  component: lazyRouteComponent(theoryScreens, 'TheoryScalesPage'),
})
const symbolsRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'symbols',
  component: lazyRouteComponent(theoryScreens, 'TheorySymbolsPage'),
})
const quizRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'quiz',
  validateSearch: validateQuizSearch,
  search: { middlewares: [stripSearchParams(QUIZ_DEFAULTS)] },
  component: lazyRouteComponent(theoryScreens, 'TheoryQuizPage'),
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
  beforeLoad: ({ params }) => {
    if (!pieceById(params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'PlayerPage'),
})

const checkRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/check',
  validateSearch: validateCheckSearch,
  beforeLoad: ({ search }) => {
    if (!search.of || !checkPlan(search.of)) throw notFound()
  },
  component: lazyRouteComponent(theoryScreens, 'CheckPage'),
})

const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    pathRoute,
    settingsRoute,
    songsRoute,
    pieceRoute,
    theoryRoute.addChildren([theoryIndexRoute, chordsRoute, scalesRoute, symbolsRoute, quizRoute]),
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
