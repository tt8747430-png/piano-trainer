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
import type { LibraryStore } from '@/entities/library'
import type { OwnLessonsStore } from '@/entities/own-lessons'
import type { PracticeLibraryStore } from '@/entities/practice-library'
import type { PiecesStore } from '@/entities/piece'
import type { TakesStore } from '@/entities/take'
import type { ViewsStore } from '@/entities/views'
import type { ContentPort } from '@/shared/api/content'
import { rememberView } from '@/features/remember-view'
import { NotFoundPage, TakeNotFound, type NotFoundWay } from '@/pages/not-found'
import { scaleHasChords } from '@/shared/lib/music'
import { AppShell } from './AppShell'
import { FULL_SCREEN_SCROLL, FullScreenLayout } from './FullScreenLayout'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { RoutePending } from './RoutePending'
import { callbackSearch } from './routes/account-search'
import { adminSearch } from './routes/admin-search'
import { ensureContent } from './routes/content'
import { validateNewPatternSearch } from './routes/accompaniment-search'
import {
  CHORDS_KEPT,
  chordsSearch,
  intervalsSearch,
  progressionSearch,
  progressionsSearch,
  readChordsSearch,
  readIntervalsSearch,
  readScalesSearch,
  SCALES_KEPT,
  scalesSearch,
} from './routes/explorer-search'
import {
  CHROMATIC_KEPT,
  chromaticSearch,
  editSearch,
  exampleSearch,
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
import { LEARN_KEPT, learnSearch, lessonSearch, readLearnSearch } from './routes/learn-search'
import {
  exercisePageSearch,
  PRACTICE_LIBRARY_KEPT,
  practiceLibrarySearch,
  readPracticeLibrarySearch,
  readTrainerSearch,
  trainerSearch,
  validateCheckSearch,
  validatePracticeSettingsSearch,
} from './routes/practice-search'
import { searchSearch } from './routes/search-search'
import {
  readSongsHomeSearch,
  SONGS_KEPT,
  songsHomeSearch,
  folderSearch,
  validateJoinGroupSearch,
  validateSharedSongSearch,
} from './routes/songs-search'
import { remembered, restoreView } from './routes/remember'
import {
  CHORD_FINDER_KEPT,
  chordFinderSearch,
  circleSearch,
  readChordFinderSearch,
} from './routes/tool-search'
import { chordPlayerSearch, chordPlayerSettingsSearch } from './routes/chord-player-search'
import { ShellLayout } from './ShellLayout'

// Each screen module becomes one chunk, loaded when one of its routes is first matched. A route
// that names content asks its screens module whether it is there, so the content stays in that
// chunk and out of the first paint.
const homeScreens = () => import('./routes/home-screens')
const settingsScreens = () => import('./routes/settings-screens')
const adminScreens = () => import('./routes/admin-screens')
const searchScreens = () => import('./routes/search-screens')
const songsScreens = () => import('./routes/songs-screens')
const groupsScreens = () => import('./routes/groups-screens')
const playerScreens = () => import('./routes/player-screens')
const learnScreens = () => import('./routes/learn-screens')
const lessonEditorScreens = () => import('./routes/lesson-editor-screens')
const explorerScreens = () => import('./routes/explorer-screens')
const toolScreens = () => import('./routes/tool-screens')
const chordPlayerScreens = () => import('./routes/chord-player-screens')
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
 * What every route is handed: the screens' remembered views (ADR 0038), the learner's patterns, which
 * say whether a pattern's page is there (ADR 0047), the learner's pieces, which say whether a piece,
 * its page or its editor is (ADR 0097), their takes, which say whether a take's page is (ADR 0034),
 * their library, which says whether a folder's page is (ADR 0106), and the content, which brings a
 * song's music or a lesson onto the device before its screen opens (ADR 0116).
 */
export interface RouterContext {
  readonly views: ViewsStore
  readonly patterns: PatternsStore
  readonly pieces: PiecesStore
  readonly takes: TakesStore
  readonly library: LibraryStore
  readonly practiceLibrary: PracticeLibraryStore
  readonly ownLessons: OwnLessonsStore
  readonly content: ContentPort
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
// The Admin area (ADR 0116): accounts, groups, feature switches, reports, activity; an admin's alone.
const adminRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/admin',
  ...adminSearch,
  component: lazyRouteComponent(adminScreens, 'AdminPage'),
})
// The Profile (round 3): the learner, the days they practised, their record.
const profileRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/profile',
  component: lazyRouteComponent(settingsScreens, 'ProfilePage'),
})
// The Profile's pages (B1): Streak, the badges and one badge, the achievements and one, the
// notifications.
const streakRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/profile/streak',
  component: lazyRouteComponent(settingsScreens, 'StreakPage'),
})
const badgesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/profile/badges',
  component: lazyRouteComponent(settingsScreens, 'BadgesPage'),
})
const badgeRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/profile/badges/$badgeId',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params: { badgeId } }) => {
    const { isBadgeId } = await settingsScreens()
    if (!isBadgeId(badgeId)) throw notFound()
  },
  component: lazyRouteComponent(settingsScreens, 'BadgePage'),
})
const achievementsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/profile/achievements',
  component: lazyRouteComponent(settingsScreens, 'AchievementsPage'),
})
const achievementRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/profile/achievements/$achievementId',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params: { achievementId } }) => {
    const { isMilestoneId } = await settingsScreens()
    if (!isMilestoneId(achievementId)) throw notFound()
  },
  component: lazyRouteComponent(settingsScreens, 'AchievementPage'),
})
const notificationsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/profile/notifications',
  component: lazyRouteComponent(settingsScreens, 'NotificationsPage'),
})
// Settings' pages (R20, R22): General, the on-screen piano, the computer keys, sound and recording,
// storage and backup, and the account's.
const generalRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/general',
  component: lazyRouteComponent(settingsScreens, 'GeneralPage'),
})
const onScreenPianoRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/on-screen-piano',
  component: lazyRouteComponent(settingsScreens, 'OnScreenPianoPage'),
})
/** Computer keys is a part of On-screen piano (R29): its old link opens there. */
const computerKeysRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/computer-keys',
  beforeLoad: () => {
    throw redirect({ to: '/settings/on-screen-piano', replace: true })
  },
  component: lazyRouteComponent(settingsScreens, 'OnScreenPianoPage'),
})
// The Player's kind page (B7, R18): how the Player always plays.
const playerSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/player',
  component: lazyRouteComponent(settingsScreens, 'PlayerSettingsPage'),
})
// The bars a learner arranges (R29 B10), General's pages.
const selectToolbarRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/select-toolbar',
  component: lazyRouteComponent(settingsScreens, 'SelectToolbarPage'),
})
const swipeActionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/swipe-actions',
  component: lazyRouteComponent(settingsScreens, 'SwipeActionsPage'),
})
const storageRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/storage',
  component: lazyRouteComponent(settingsScreens, 'StoragePage'),
})
// The app's Privacy and Terms (ADR 0116): read signed in or not, linked from Help and the account forms.
const privacyRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/legal/privacy',
  component: lazyRouteComponent(settingsScreens, 'PrivacyPage'),
})
const termsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/legal/terms',
  component: lazyRouteComponent(settingsScreens, 'TermsPage'),
})
const accountSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/account',
  component: lazyRouteComponent(settingsScreens, 'AccountSettingsPage'),
})
// The account's own pages (B1): Edit profile, Change password, and Privacy.
const editProfileRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/account/profile',
  component: lazyRouteComponent(settingsScreens, 'EditProfilePage'),
})
const changePasswordRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/account/password',
  component: lazyRouteComponent(settingsScreens, 'ChangePasswordPage'),
})
const profilePrivacyRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/privacy',
  component: lazyRouteComponent(settingsScreens, 'ProfilePrivacyPage'),
})
// How to use (ADR 0052): a short guide, reached from Settings' Help.
const howToUseRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/how-to-use',
  component: lazyRouteComponent(settingsScreens, 'HowToUsePage'),
})
// About (R29 B9): the version, the build, the licence and the credits, from Settings' Help.
const aboutRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/about',
  component: lazyRouteComponent(settingsScreens, 'AboutPage'),
})
// Connect a piano (ADR 0034): MIDI input, output, devices and playing, and its MIDI log under it.
const midiSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/connect-piano',
  component: lazyRouteComponent(settingsScreens, 'MidiSettingsPage'),
})
// Each Practice page's Settings (A24, R18): how it sounds and looks every time, reached from the
// page's gear (`from` naming it, for Back) and from Settings.
const chordsSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/chords',
  validateSearch: validatePracticeSettingsSearch,
  component: lazyRouteComponent(settingsScreens, 'ChordsSettingsPage'),
})
const scalesSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/scales',
  validateSearch: validatePracticeSettingsSearch,
  component: lazyRouteComponent(settingsScreens, 'ScalesSettingsPage'),
})
const intervalsSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/intervals',
  validateSearch: validatePracticeSettingsSearch,
  component: lazyRouteComponent(settingsScreens, 'IntervalsSettingsPage'),
})
const progressionsSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/progressions',
  validateSearch: validatePracticeSettingsSearch,
  component: lazyRouteComponent(settingsScreens, 'ProgressionsSettingsPage'),
})
const accompanimentSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/accompaniment',
  validateSearch: validatePracticeSettingsSearch,
  component: lazyRouteComponent(settingsScreens, 'AccompanimentSettingsPage'),
})
const chordFinderSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/chord-finder',
  validateSearch: validatePracticeSettingsSearch,
  component: lazyRouteComponent(settingsScreens, 'ChordFinderSettingsPage'),
})
const exercisesAndQuizSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/exercises-and-quiz',
  validateSearch: validatePracticeSettingsSearch,
  component: lazyRouteComponent(settingsScreens, 'TrainersSettingsPage'),
})
const midiLogRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/settings/connect-piano/log',
  component: lazyRouteComponent(settingsScreens, 'MidiLogPage'),
})
// The account pages (ADR 0116): signing in, a new account, a forgotten password, a new one.
const signInRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/account/sign-in',
  component: lazyRouteComponent(settingsScreens, 'SignInPage'),
})
const signUpRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/account/create',
  component: lazyRouteComponent(settingsScreens, 'SignUpPage'),
})
const forgotPasswordRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/account/forgot',
  component: lazyRouteComponent(settingsScreens, 'ForgotPasswordPage'),
})
const newPasswordRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/account/new-password',
  component: lazyRouteComponent(settingsScreens, 'NewPasswordPage'),
})
// Where the server's links come back: Google's sign-in, a confirmed email, a password reset.
const authCallbackRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/auth/callback',
  ...callbackSearch,
  component: lazyRouteComponent(settingsScreens, 'AuthCallbackPage'),
})
// Search: every named thing the app has, found by name (ADR 0052).
const searchRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/search',
  ...searchSearch,
  component: lazyRouteComponent(searchScreens, 'SearchPage'),
})
const songsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs',
  ...songsHomeSearch,
  ...remembered(readSongsHomeSearch, SONGS_KEPT, SONGS_KEPT),
  component: lazyRouteComponent(songsScreens, 'SongsPage'),
})
// A published song or pattern (ADR 0116), Explore's item: its path kept, so published links work.
const publicSongRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/public/$itemId',
  component: lazyRouteComponent(songsScreens, 'PublicSongPage'),
})
// Groups and the folders shared with them (R30 S6): a learner's groups, a group, an invite link, a
// shared folder.
const groupsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/groups',
  component: lazyRouteComponent(groupsScreens, 'GroupsPage'),
})
const joinGroupRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/groups/join',
  validateSearch: validateJoinGroupSearch,
  component: lazyRouteComponent(groupsScreens, 'JoinGroupPage'),
})
const groupRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/groups/$groupId',
  component: lazyRouteComponent(groupsScreens, 'GroupPage'),
})
const sharedFolderRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/shared-folders/$sharedId',
  component: lazyRouteComponent(groupsScreens, 'SharedFolderPage'),
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
    await ensureContent(context.content, 'piece', params.pieceId)
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
// A song's Settings and its Publish in library (round 26), pages of their own under its page.
const pieceSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/$pieceId/settings',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    // A song's, or a study's (its page on Practice has the same gear).
    const { entryIn } = await songsScreens()
    const entry = entryIn(context.pieces.getState(), params.pieceId)
    if (!entry || entry.kind === 'listing') throw notFound()
    await ensureContent(context.content, 'piece', params.pieceId)
  },
  component: lazyRouteComponent(songsScreens, 'SongSettingsPage'),
})
const piecePublishRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/$pieceId/publish',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    const { entryIn } = await songsScreens()
    if (!entryIn(context.pieces.getState(), params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PublishPage'),
})
// A folder of the library (ADR 0106): its songs, under the filters Home has; not found where the
// library has no such folder, or it is archived.
const folderRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/folders/$folderId',
  notFoundComponent: notFoundIn('songs'),
  ...folderSearch,
  beforeLoad: async ({ params, context }) => {
    const { folderIn } = await songsScreens()
    const { pieces, library } = context
    if (!folderIn(pieces.getState(), library.getState(), params.folderId)) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'FolderPage'),
})
// A folder's Settings (R29): its name and look, where it stands, Archive and Delete.
const folderSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/folders/$folderId/settings',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    const { folderIn } = await songsScreens()
    const { pieces, library } = context
    if (!folderIn(pieces.getState(), library.getState(), params.folderId)) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'FolderSettingsPage'),
})
// A place's Card style (R29 B9): a folder's from its Settings, Home's from Songs' Card style.
const folderCardStyleRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/folders/$folderId/card-style',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    const { folderIn } = await songsScreens()
    const { pieces, library } = context
    if (!folderIn(pieces.getState(), library.getState(), params.folderId)) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'FolderCardStylePage'),
})
const homeCardStyleRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/card-style',
  component: lazyRouteComponent(songsScreens, 'HomeCardStylePage'),
})
// A folder's Archived (D10, R29 B4): the songs archived from it, each to unarchive.
const folderArchivedRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/folders/$folderId/archived',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    const { folderIn } = await songsScreens()
    const { pieces, library } = context
    if (!folderIn(pieces.getState(), library.getState(), params.folderId)) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'FolderArchivedPage'),
})
// The library's archive (ADR 0106): what the learner archived, to restore.
const archiveRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/archive',
  component: lazyRouteComponent(songsScreens, 'ArchivePage'),
})
// A section of a song, learned step by step (ADR 0111); a study's is on its shelf, below.
const sectionRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/$pieceId/sections/$section',
  notFoundComponent: notFoundIn('songs'),
  beforeLoad: async ({ params, context }) => {
    const { sectionIn } = await songsScreens()
    const { pieceId, section } = params
    if (!sectionIn(context.pieces.getState(), pieceId, section, 'songs')) throw notFound()
    await ensureContent(context.content, 'piece', pieceId)
  },
  component: lazyRouteComponent(songsScreens, 'SectionPage'),
})

// Practice (ADR 0052): its list, then its training, Exercises and Quiz with its trainers.
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
  ...practiceLibrarySearch,
  ...remembered(readPracticeLibrarySearch, PRACTICE_LIBRARY_KEPT, PRACTICE_LIBRARY_KEPT),
  component: lazyRouteComponent(practiceScreens, 'ExercisesPage'),
})
// An exercise's page (A41): what it trains, how to play it, and what to start it at.
const exerciseInfoRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/exercises/$exerciseId',
  notFoundComponent: notFoundIn('exercises'),
  ...exercisePageSearch,
  beforeLoad: async (context) => {
    const { isExerciseId } = await practiceScreens()
    if (!isExerciseId(context.params.exerciseId)) throw notFound()
  },
  component: lazyRouteComponent(practiceScreens, 'ExercisePage'),
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
    await ensureContent(context.content, 'piece', params.pieceId)
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
    await ensureContent(context.content, 'piece', pieceId)
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
// Progressions (R30-4): the library, a progression's own page (the library's or the learner's own),
// and a line typed, which every link to a line of chords opens.
const progressionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions',
  ...practiceLibrarySearch,
  ...remembered(readPracticeLibrarySearch, PRACTICE_LIBRARY_KEPT, PRACTICE_LIBRARY_KEPT),
  component: lazyRouteComponent(explorerScreens, 'ProgressionsPage'),
})
const progressionLineRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/line',
  ...progressionsSearch,
  component: lazyRouteComponent(explorerScreens, 'ProgressionLinePage'),
})
const progressionRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/$progressionId',
  notFoundComponent: notFoundIn('progressions'),
  ...progressionSearch,
  beforeLoad: async ({ params, context }) => {
    const { isProgressionThere } = await explorerScreens()
    const own = context.practiceLibrary.getState().progressions
    if (!isProgressionThere(params.progressionId, own)) throw notFound()
  },
  component: lazyRouteComponent(explorerScreens, 'ProgressionPage'),
})
// An editor's progression editor (content as data, ADR 0116), and a new progression.
const progressionEditRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/$progressionId/edit',
  component: lazyRouteComponent(explorerScreens, 'ProgressionEditorPage'),
})
// A progression's Settings and Publish page (R29 B6), an editor's, from its editor's bar.
const progressionSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/$progressionId/settings',
  component: lazyRouteComponent(explorerScreens, 'ProgressionSettingsPage'),
})
const progressionPublishRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/$progressionId/publish',
  component: lazyRouteComponent(explorerScreens, 'ProgressionPublishPage'),
})

// The Chord finder (ADR 0052): a tool of its own, any chord played or tapped named, spelled and written.
const chordFinderRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/chord-finder',
  ...chordFinderSearch,
  ...remembered(readChordFinderSearch, CHORD_FINDER_KEPT),
  component: lazyRouteComponent(toolScreens, 'ChordFinderPage'),
})

// The Chord player (R29 CP1): a chord sheet of sections played by a band in a style; its own Settings.
const chordPlayerRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/chord-player',
  ...chordPlayerSearch,
  component: lazyRouteComponent(chordPlayerScreens, 'ChordPlayerPage'),
})
const chordPlayerSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/chord-player/settings',
  ...chordPlayerSettingsSearch,
  component: lazyRouteComponent(chordPlayerScreens, 'ChordPlayerSettingsPage'),
})

// The Metronome (ADR 0052): a steady beat at any tempo, its choices saved in pt-settings.
const metronomeRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/metronome',
  component: lazyRouteComponent(toolScreens, 'MetronomePage'),
})
// The tools (R29 B11): each a page of Practice's Tools on one layout, a Settings page where it has one.
const metronomeSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/metronome/settings',
  component: lazyRouteComponent(toolScreens, 'MetronomeSettingsPage'),
})
const circleOfFifthsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/circle-of-fifths',
  ...circleSearch,
  component: lazyRouteComponent(toolScreens, 'CircleOfFifthsPage'),
})
const tunerRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/tuner',
  component: lazyRouteComponent(toolScreens, 'TunerPage'),
})
const tunerSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/tuner/settings',
  component: lazyRouteComponent(toolScreens, 'TunerSettingsPage'),
})

// Accompaniment: the patterns and their pieces, a page for each source (ADR 0047). A pattern is
// explained, starred, hidden on its own page; the learner's own are made and edited (ADR 0047).
const accompanimentRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment',
  ...practiceLibrarySearch,
  ...remembered(readPracticeLibrarySearch, PRACTICE_LIBRARY_KEPT, PRACTICE_LIBRARY_KEPT),
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
// A pattern of the learner's own published to the Public library, on its own page (round 27).
const publishPatternRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/accompaniment/patterns/$patternRef/publish',
  notFoundComponent: notFoundIn('accompaniment'),
  beforeLoad: ({ params, context }) => {
    if (!isOwnPatternId(params.patternRef) || !inBook(params.patternRef, context.patterns)) {
      throw notFound()
    }
  },
  component: lazyRouteComponent(accompanimentScreens, 'PatternPublishPage'),
})

/**
 * A lesson's page is there for a lesson of a level, brought onto the device first (ADR 0116), or for
 * one of the learner's own while they keep it (R30-5); else it is not found.
 */
async function findLesson(context: RouterContext, lessonId: string): Promise<void> {
  const { isOwnLessonId, selectOwnLesson, lessonById, lessonPlace } = await learnScreens()
  if (isOwnLessonId(lessonId)) {
    if (!selectOwnLesson(lessonId)(context.ownLessons.getState())) throw notFound()
    return
  }
  if (!lessonById(lessonId) || !lessonPlace(lessonId)) throw notFound()
  await ensureContent(context.content, 'lesson', lessonId)
}

/** A course's page is there for one of the app's, or one of the learner's own while they keep it. */
async function findCourse(context: RouterContext, courseId: string): Promise<void> {
  const { isOwnCourseId, selectOwnCourse, courseById } = await learnScreens()
  const there = isOwnCourseId(courseId)
    ? selectOwnCourse(courseId)(context.ownLessons.getState()) !== undefined
    : courseById(courseId) !== undefined
  if (!there) throw notFound()
}

// A lesson of the Lessons' journeys; a course and its own lessons (ADR 0053).
const lessonRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/lessons/$lessonId',
  notFoundComponent: notFoundIn('learn'),
  ...lessonSearch,
  beforeLoad: ({ params, context }) => findLesson(context, params.lessonId),
  component: lazyRouteComponent(learnScreens, 'LessonPage'),
})
const courseRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: ({ params, context }) => findCourse(context, params.courseId),
  component: lazyRouteComponent(learnScreens, 'CoursePage'),
})
const courseLessonRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId/$lessonId',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params, context }) => {
    const { courseLesson } = await learnScreens()
    if (!courseLesson(params.courseId, params.lessonId)) throw notFound()
    // A course's lesson is the database's by its course and its id (ADR 0116).
    await ensureContent(context.content, 'lesson', `${params.courseId}/${params.lessonId}`)
  },
  component: lazyRouteComponent(learnScreens, 'CourseLessonPage'),
})
// A lesson's and a course's Settings (round 28), pages of their own under theirs, as a song's.
const lessonSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/lessons/$lessonId/settings',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: ({ params, context }) => findLesson(context, params.lessonId),
  component: lazyRouteComponent(learnScreens, 'LessonSettingsPage'),
})
// An item's Publish page (R29 B6): an editor's, from its Settings' Publish….
const lessonPublishRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/lessons/$lessonId/publish',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params, context }) => {
    const { lessonById, lessonPlace } = await learnScreens()
    if (!lessonById(params.lessonId) || !lessonPlace(params.lessonId)) throw notFound()
    await ensureContent(context.content, 'lesson', params.lessonId)
  },
  component: lazyRouteComponent(learnScreens, 'LessonPublishPage'),
})
const coursePublishRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId/publish',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params }) => {
    const { courseById } = await learnScreens()
    if (!courseById(params.courseId)) throw notFound()
  },
  component: lazyRouteComponent(learnScreens, 'CoursePublishPage'),
})
const courseSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId/settings',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: ({ params, context }) => findCourse(context, params.courseId),
  component: lazyRouteComponent(learnScreens, 'CourseSettingsPage'),
})
const courseLessonSettingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId/$lessonId/settings',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params, context }) => {
    const { courseLesson } = await learnScreens()
    if (!courseLesson(params.courseId, params.lessonId)) throw notFound()
    await ensureContent(context.content, 'lesson', `${params.courseId}/${params.lessonId}`)
  },
  component: lazyRouteComponent(learnScreens, 'CourseLessonSettingsPage'),
})

// An editor's lesson editor (ADR 0116): every text of a journey's or a course's lesson; a course's
// own title and summary in the course editor.
const courseEditRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId/edit',
  notFoundComponent: notFoundIn('learn'),
  // A course not yet published is there for its editor: the draft New course made. The learner's
  // own is theirs while they keep it.
  beforeLoad: async ({ params, context }) => {
    const { isOwnCourseId } = await learnScreens()
    if (isOwnCourseId(params.courseId)) await findCourse(context, params.courseId)
  },
  component: lazyRouteComponent(lessonEditorScreens, 'CourseEditorPage'),
})
const lessonEditRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/lessons/$lessonId/edit',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params, context }) => {
    const { isOwnLessonId } = await learnScreens()
    // The learner's own lesson while they keep it; any other is an editor's, one not yet published
    // there for its editor: the draft the journey editor made.
    if (isOwnLessonId(params.lessonId)) await findLesson(context, params.lessonId)
    else await ensureContent(context.content, 'lesson', params.lessonId)
  },
  component: lazyRouteComponent(lessonEditorScreens, 'LessonEditorPage'),
})
const courseLessonEditRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/courses/$courseId/$lessonId/edit',
  notFoundComponent: notFoundIn('learn'),
  beforeLoad: async ({ params, context }) => {
    // A lesson not yet published is there for its editor: the draft the course editor made.
    await ensureContent(context.content, 'lesson', `${params.courseId}/${params.lessonId}`)
  },
  component: lazyRouteComponent(lessonEditorScreens, 'CourseLessonEditorPage'),
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
    await ensureContent(context.context.content, 'piece', context.params.pieceId)
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
// A lesson's example of notes on its own score (round 27): the lesson's draft brought, an editor's.
const exampleEditRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/lessons/$lessonId/example',
  notFoundComponent: notFoundIn('learn'),
  ...exampleSearch,
  beforeLoad: async ({ params, context }) => {
    await ensureContent(context.content, 'lesson', params.lessonId)
  },
  component: lazyRouteComponent(playerScreens, 'ExampleEditorPage'),
})
const editRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/edit/$pieceId',
  notFoundComponent: notFoundIn('songs'),
  ...editSearch,
  beforeLoad: async ({ params, context }) => {
    const { editableIn } = await playerScreens()
    // A song not on this device may be an editor's made and not yet published, its draft the
    // server's: the page opens it, or says it is not there.
    if (!editableIn(context.pieces.getState(), params.pieceId)) return
    await ensureContent(context.content, 'piece', params.pieceId)
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
    await ensureContent(context.content, 'piece', params.pieceId)
  },
  component: lazyRouteComponent(playerScreens, 'TakePage'),
})

const checkRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/check',
  notFoundComponent: notFoundIn('learn'),
  validateSearch: validateCheckSearch,
  beforeLoad: async ({ search }) => {
    const { checkIn } = await practiceScreens()
    if (!search.of || !checkIn(search.of)) throw notFound()
  },
  component: lazyRouteComponent(practiceScreens, 'CheckPage'),
})

const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    learnRoute,
    profileRoute,
    streakRoute,
    badgesRoute,
    badgeRoute,
    achievementsRoute,
    achievementRoute,
    notificationsRoute,
    adminRoute,
    settingsRoute,
    generalRoute,
    onScreenPianoRoute,
    computerKeysRoute,
    playerSettingsRoute,
    selectToolbarRoute,
    swipeActionsRoute,
    storageRoute,
    privacyRoute,
    termsRoute,
    accountSettingsRoute,
    editProfileRoute,
    changePasswordRoute,
    profilePrivacyRoute,
    howToUseRoute,
    aboutRoute,
    midiSettingsRoute,
    midiLogRoute,
    chordsSettingsRoute,
    scalesSettingsRoute,
    intervalsSettingsRoute,
    progressionsSettingsRoute,
    accompanimentSettingsRoute,
    chordFinderSettingsRoute,
    exercisesAndQuizSettingsRoute,
    signInRoute,
    signUpRoute,
    forgotPasswordRoute,
    newPasswordRoute,
    authCallbackRoute,
    searchRoute,
    songsRoute,
    sharedSongRoute,
    groupsRoute,
    joinGroupRoute,
    groupRoute,
    sharedFolderRoute,
    publicSongRoute,
    pieceRoute,
    pieceSettingsRoute,
    piecePublishRoute,
    folderRoute,
    folderSettingsRoute,
    folderCardStyleRoute,
    homeCardStyleRoute,
    archiveRoute,
    folderArchivedRoute,
    sectionRoute,
    courseRoute,
    chordsRoute,
    scalesRoute,
    intervalsRoute,
    progressionsRoute,
    progressionLineRoute,
    progressionRoute,
    progressionEditRoute,
    progressionSettingsRoute,
    progressionPublishRoute,
    accompanimentRoute,
    newPatternRoute,
    patternRoute,
    editPatternRoute,
    publishPatternRoute,
    lessonRoute,
    courseLessonRoute,
    lessonSettingsRoute,
    courseSettingsRoute,
    lessonPublishRoute,
    coursePublishRoute,
    courseLessonSettingsRoute,
    lessonEditRoute,
    courseLessonEditRoute,
    courseEditRoute,
    practiceRoute,
    quizRoute,
    exercisesRoute,
    exerciseInfoRoute,
    chordFinderRoute,
    metronomeRoute,
    metronomeSettingsRoute,
    circleOfFifthsRoute,
    tunerRoute,
    tunerSettingsRoute,
    chordPlayerRoute,
    chordPlayerSettingsRoute,
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
    exampleEditRoute,
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
  practiceLibrary,
  ownLessons,
  content,
}: RouterContext & { history?: RouterHistory }) {
  const router = createRouter({
    routeTree,
    history,
    context: { views, patterns, pieces, takes, library, practiceLibrary, ownLessons, content },
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
    const only = match.staticData.remembered
    const own = Object.entries(toLocation.search).filter(
      ([param, value]) =>
        param in read &&
        (only === true || only.includes(param)) &&
        JSON.stringify(read[param]) === JSON.stringify(value),
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
    /**
     * A screen that comes back the learner's way (ADR 0038): its view saved in `pt-views`; every
     * param it reads, or those listed alone.
     */
    remembered?: true | readonly string[]
  }
}
