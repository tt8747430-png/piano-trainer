import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
  type RouterHistory,
} from '@tanstack/react-router'
import { NotFoundPage } from '@/pages/not-found'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { TheoryLayout } from './TheoryLayout'

// Each screen module becomes one chunk, loaded when one of its routes is first matched.
const homeScreens = () => import('./routes/home-screens')
const songsScreens = () => import('./routes/songs-screens')
const playerScreens = () => import('./routes/player-screens')
const theoryScreens = () => import('./routes/theory-screens')

const rootRoute = createRootRoute({ component: RootLayout, notFoundComponent: NotFoundPage })

const pathRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(homeScreens, 'PathPage'),
})
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: lazyRouteComponent(homeScreens, 'SettingsPage'),
})
const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/songs',
  component: lazyRouteComponent(songsScreens, 'SongsPage'),
})
const pieceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/songs/$pieceId',
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/$pieceId',
  component: lazyRouteComponent(playerScreens, 'PlayerPage'),
})

const theoryRoute = createRoute({
  getParentRoute: () => rootRoute,
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
  component: lazyRouteComponent(theoryScreens, 'TheoryChordsPage'),
})
const scalesRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'scales',
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
  component: lazyRouteComponent(theoryScreens, 'TheoryQuizPage'),
})

const routeTree = rootRoute.addChildren([
  pathRoute,
  settingsRoute,
  songsRoute,
  pieceRoute,
  playerRoute,
  theoryRoute.addChildren([theoryIndexRoute, chordsRoute, scalesRoute, symbolsRoute, quizRoute]),
])

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    defaultErrorComponent: RouteError,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
}
