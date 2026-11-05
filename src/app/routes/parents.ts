import type { RegisteredRouter, RouteIds, ValidateNavigateOptions } from '@tanstack/react-router'
import type { Up } from '@/shared/lib'
import type { RouterContext } from '../router'
import { readChordsSearch, readProgressionsSearch, readScalesSearch } from './explorer-search'
import { isPracticeSettingsFrom, type PracticeSettingsFrom } from './practice-search'

// Back means up (rule 26, ADR 0052): each route names its parent here, and Back goes there (`useUp`).
// A place has none. The table is keyed by every route the router has, so a new route can't be added
// without its parent (`parents.test.ts` walks the router to prove it).

/** What a route's parent is worked out from: the route's own params and search, and the learner's. */
export interface UpFrom {
  readonly params: Readonly<Record<string, string>>
  readonly search: Readonly<Record<string, unknown>>
  readonly context: RouterContext
  /** Signed in: the account pages lead up to the account's Settings, else to the Profile. */
  readonly signedIn: boolean
  /** A laptop, where Settings sits at the sidebar's foot and is a place of its own. */
  readonly wide: boolean
}

/** A route's parent: where Back goes from it, or null for a place. */
type Parent = (from: UpFrom) => Up | null | Promise<Up | null>

/** The routes Back can be on: every route but the root and the two layouts. */
export type ScreenRouteId = Exclude<
  RouteIds<RegisteredRouter['routeTree']>,
  '__root__' | '/shell' | '/full-screen'
>

/** One parent, its params and search checked against the router as a link's are. */
function up<TOptions>(options: ValidateNavigateOptions<RegisteredRouter, TOptions>): Up
function up(options: ValidateNavigateOptions): Up {
  return options
}

const songs = () => import('./songs-screens')
const place: Parent = () => null
const param = (from: UpFrom, name: string) => from.params[name] ?? ''
const text = (value: unknown) => (typeof value === 'string' ? value : undefined)

/** A song's page, or a study's on Practice: where a piece's Player, editor or Settings go up to. */
async function pieceHome(from: UpFrom): Promise<Up> {
  const pieceId = param(from, 'pieceId')
  const { entryIn } = await songs()
  return entryIn(from.context.pieces.getState(), pieceId)?.kind === 'study'
    ? up({ to: '/practice/accompaniment/studies/$pieceId', params: { pieceId } })
    : up({ to: '/songs/$pieceId', params: { pieceId } })
}

/** The account pages: up to the account's Settings when signed in, else to the Profile. */
const accountUp: Parent = ({ signedIn }) =>
  signedIn ? up({ to: '/settings/account' }) : up({ to: '/profile' })

const toPractice: Parent = () => up({ to: '/practice' })
const toSettings: Parent = () => up({ to: '/settings' })
/** A page of Settings: up to its list on a phone; on a laptop the list stands beside it (R20). */
const settingsPage: Parent = ({ wide }) => (wide ? null : up({ to: '/settings' }))
/** Each Practice page, where its gear opens its Settings from. */
const PRACTICE_PAGES: Readonly<Record<PracticeSettingsFrom, Up>> = {
  chords: up({ to: '/practice/chords' }),
  scales: up({ to: '/practice/scales' }),
  intervals: up({ to: '/practice/intervals' }),
  progressions: up({ to: '/practice/progressions' }),
  accompaniment: up({ to: '/practice/accompaniment' }),
  'chord-finder': up({ to: '/practice/chord-finder' }),
  exercises: up({ to: '/practice/exercises' }),
  quiz: up({ to: '/practice/quiz' }),
}
/** A Practice page's Settings (A24): up to the page its gear was pressed on, else to Practice (R29:
 * Settings no longer lists them). */
const practiceSettings: Parent = (from) =>
  isPracticeSettingsFrom(from.search.from)
    ? PRACTICE_PAGES[from.search.from]
    : up({ to: '/practice' })
const toSongs: Parent = () => up({ to: '/songs' })
const toLessons: Parent = () => up({ to: '/', search: { view: 'lessons' } })
const toCourses: Parent = () => up({ to: '/', search: { view: 'courses' } })
const toLesson: Parent = (from) =>
  up({ to: '/lessons/$lessonId', params: { lessonId: param(from, 'lessonId') } })
const toCourse: Parent = (from) =>
  up({ to: '/courses/$courseId', params: { courseId: param(from, 'courseId') } })
const toCourseLesson: Parent = (from) =>
  up({
    to: '/courses/$courseId/$lessonId',
    params: { courseId: param(from, 'courseId'), lessonId: param(from, 'lessonId') },
  })
const toPattern: Parent = (from) =>
  up({
    to: '/practice/accompaniment/patterns/$patternRef',
    params: { patternRef: param(from, 'patternRef') },
  })
const toAccompaniment: Parent = () => up({ to: '/practice/accompaniment' })
/** A pattern up to the place of Accompaniment's library that lists it. */
const toPatternPlace: Parent = async (from) => {
  const { patternPlace } = await import('./accompaniment-screens')
  const place = patternPlace(from.context.patterns.getState(), param(from, 'patternRef'))
  return up({ to: '/practice/accompaniment', search: { place } })
}
const toStudy: Parent = (from) =>
  up({
    to: '/practice/accompaniment/studies/$pieceId',
    params: { pieceId: param(from, 'pieceId') },
  })

export const PARENTS: Readonly<Record<ScreenRouteId, Parent>> = {
  // The places: Learn, Songs, Practice, the Profile; on a laptop Settings and Search at the
  // sidebar's foot too (Search is the palette now: its link opens it over Learn).
  '/shell/': place,
  '/shell/songs': place,
  '/shell/practice': place,
  '/shell/profile': place,
  '/shell/search': place,
  '/shell/settings': ({ wide }) => (wide ? null : up({ to: '/profile' })),

  // The Profile's and Settings' pages.
  '/shell/profile/streak': () => up({ to: '/profile' }),
  '/shell/profile/badges': () => up({ to: '/profile' }),
  '/shell/profile/badges/$badgeId': () => up({ to: '/profile/badges' }),
  '/shell/profile/achievements': () => up({ to: '/profile' }),
  '/shell/profile/achievements/$achievementId': () => up({ to: '/profile/achievements' }),
  '/shell/profile/notifications': () => up({ to: '/profile' }),
  '/shell/settings/account/profile': () => up({ to: '/settings/account' }),
  '/shell/settings/account/password': () => up({ to: '/settings/account' }),
  '/shell/settings/privacy': () => up({ to: '/settings/account' }),
  '/shell/settings/general': settingsPage,
  '/shell/settings/select-toolbar': () => up({ to: '/settings/general' }),
  '/shell/settings/swipe-actions': () => up({ to: '/settings/general' }),
  '/shell/settings/on-screen-piano': settingsPage,
  '/shell/settings/computer-keys': settingsPage,
  '/shell/settings/player': settingsPage,
  '/shell/settings/storage': settingsPage,
  '/shell/settings/account': settingsPage,
  '/shell/settings/how-to-use': settingsPage,
  '/shell/settings/about': settingsPage,
  '/shell/settings/connect-piano': settingsPage,
  '/shell/settings/chords': practiceSettings,
  '/shell/settings/scales': practiceSettings,
  '/shell/settings/intervals': practiceSettings,
  '/shell/settings/progressions': practiceSettings,
  '/shell/settings/accompaniment': practiceSettings,
  '/shell/settings/chord-finder': practiceSettings,
  '/shell/settings/exercises-and-quiz': practiceSettings,
  '/shell/settings/connect-piano/log': () => up({ to: '/settings/connect-piano' }),
  '/shell/admin': toSettings,
  '/shell/legal/privacy': () => up({ to: '/settings/how-to-use' }),
  '/shell/legal/terms': () => up({ to: '/settings/how-to-use' }),
  '/shell/account/sign-in': accountUp,
  '/shell/account/create': accountUp,
  '/shell/account/forgot': accountUp,
  '/shell/account/new-password': accountUp,
  '/shell/auth/callback': accountUp,

  // Songs: a song up to the folder the library keeps it in, its pages up to it.
  '/shell/songs/$pieceId': async (from) => {
    const { folderOf } = await songs()
    const { pieces, library } = from.context
    const folderId = folderOf(pieces.getState(), library.getState(), param(from, 'pieceId'))
    return folderId
      ? up({ to: '/songs/folders/$folderId', params: { folderId } })
      : up({ to: '/songs' })
  },
  '/shell/songs/$pieceId/settings': pieceHome,
  // Groups (R30 S6): from Songs; a group and an invite link up to Groups; a shared folder up to its group.
  '/shell/songs/groups': toSongs,
  '/shell/songs/groups/join': () => up({ to: '/songs/groups' }),
  '/shell/songs/groups/$groupId': () => up({ to: '/songs/groups' }),
  '/shell/songs/shared-folders/$sharedId': toSongs,
  '/shell/songs/$pieceId/publish': pieceHome,
  '/shell/songs/$pieceId/sections/$section': (from) =>
    up({ to: '/songs/$pieceId', params: { pieceId: param(from, 'pieceId') } }),
  '/shell/songs/folders/$folderId': async (from) => {
    const { folderAbove } = await songs()
    const { pieces, library } = from.context
    const folderId = folderAbove(pieces.getState(), library.getState(), param(from, 'folderId'))
    return folderId
      ? up({ to: '/songs/folders/$folderId', params: { folderId } })
      : up({ to: '/songs' })
  },
  '/shell/songs/folders/$folderId/settings': (from) =>
    up({ to: '/songs/folders/$folderId', params: { folderId: param(from, 'folderId') } }),
  '/shell/songs/folders/$folderId/card-style': (from) =>
    up({ to: '/songs/folders/$folderId/settings', params: { folderId: param(from, 'folderId') } }),
  '/shell/songs/card-style': toSongs,
  '/shell/songs/folders/$folderId/archived': (from) =>
    up({ to: '/songs/folders/$folderId', params: { folderId: param(from, 'folderId') } }),
  '/shell/songs/archive': toSongs,
  '/shell/songs/shared': toSongs,
  '/shell/songs/public/$itemId': () => up({ to: '/songs', search: { view: 'explore' } }),

  // The Player and the score editor: up to the piece's page; the editor's Settings and a take up
  // to the editor.
  '/full-screen/play/$pieceId': pieceHome,
  '/full-screen/edit/$pieceId': pieceHome,
  '/shell/edit/$pieceId/takes/$takeId': (from) =>
    up({
      to: '/edit/$pieceId',
      params: { pieceId: param(from, 'pieceId') },
      search: { takes: true },
    }),
  '/full-screen/play/walk': ({ search }) =>
    up({
      to: '/practice/scales',
      search: readScalesSearch({ root: search.root, kind: search.kind, show: 'chords' }),
    }),
  '/full-screen/play/chromatic': toPractice,
  // The Player of a progression: up to its page, the library's where the line is the library's.
  '/full-screen/play/progression': async ({ search }) => {
    const line = readProgressionsSearch({ p: search.p, key: search.key })
    const { libraryLineId } = await import('./progression-place')
    const progressionId = libraryLineId(line.p, line.key)
    return progressionId
      ? up({
          to: '/practice/progressions/$progressionId',
          params: { progressionId },
          search: { key: line.key },
        })
      : up({ to: '/practice/progressions/line', search: line })
  },
  '/full-screen/play/exercise/$exerciseId': (from) =>
    up({
      to: '/practice/exercises/$exerciseId',
      params: { exerciseId: param(from, 'exerciseId') },
    }),
  // The Check: up to the explorer its step is done on, the step's panel open, where it was asked.
  '/full-screen/check': (from) => {
    const { search } = from
    const of = text(search.of) ?? ''
    if (of.startsWith('scale:')) {
      return up({
        to: '/practice/scales',
        search: readScalesSearch({ kind: of.slice('scale:'.length), step: of }),
      })
    }
    if (of.startsWith('chords:')) {
      return up({ to: '/practice/chords', search: readChordsSearch({ step: of }) })
    }
    return toLessons(from)
  },

  // Learn: a lesson up to its level, a course's lesson up to the course, the course up to the
  // Courses; Settings and Edit up to what they set or edit.
  // A lesson read in a course of the learner's goes up to that course; one of their own to Your
  // lessons (R30-5).
  '/shell/lessons/$lessonId': async (from) => {
    const { isOwnCourseId, isOwnLessonId, lessonPlace, OWN_LESSONS } =
      await import('./learn-screens')
    const course = text(from.search.course)
    if (course && isOwnCourseId(course))
      return up({ to: '/courses/$courseId', params: { courseId: course } })
    const lessonId = param(from, 'lessonId')
    const journey = isOwnLessonId(lessonId) ? OWN_LESSONS : lessonPlace(lessonId)?.journey.id
    return up({ to: '/', search: { view: 'lessons', ...(journey ? { journey } : {}) } })
  },
  '/shell/lessons/$lessonId/settings': toLesson,
  '/shell/lessons/$lessonId/publish': (from) =>
    up({ to: '/lessons/$lessonId/settings', params: { lessonId: param(from, 'lessonId') } }),
  '/shell/lessons/$lessonId/edit': toLesson,
  '/full-screen/lessons/$lessonId/example': ({ params, search }) => {
    const course = text(search.course)
    const lessonId = params.lessonId ?? ''
    return course
      ? up({ to: '/courses/$courseId/$lessonId/edit', params: { courseId: course, lessonId } })
      : up({ to: '/lessons/$lessonId/edit', params: { lessonId } })
  },
  '/shell/courses/$courseId': toCourses,
  '/shell/courses/$courseId/settings': toCourse,
  '/shell/courses/$courseId/publish': (from) =>
    up({ to: '/courses/$courseId/settings', params: { courseId: param(from, 'courseId') } }),
  '/shell/courses/$courseId/edit': toCourse,
  '/shell/courses/$courseId/$lessonId': toCourse,
  '/shell/courses/$courseId/$lessonId/settings': toCourseLesson,
  '/shell/courses/$courseId/$lessonId/edit': toCourseLesson,

  // Practice: each page up to Practice; a trainer up to the Quiz; a pattern up to Accompaniment,
  // its Edit and Publish up to it; a study and its sections the same.
  '/shell/practice/chords': toPractice,
  '/shell/practice/scales': toPractice,
  '/shell/practice/intervals': toPractice,
  '/shell/practice/progressions': toPractice,
  '/shell/practice/progressions/line': () => up({ to: '/practice/progressions' }),
  '/shell/practice/progressions/$progressionId': async (from) => {
    const { progressionPlace } = await import('./progression-place')
    const place = progressionPlace(param(from, 'progressionId'))
    return up({ to: '/practice/progressions', search: { place } })
  },
  // An editor's editor: up to the progression's page where the library has it, else the library.
  '/shell/practice/progressions/$progressionId/edit': async (from) => {
    const { progressionPlace } = await import('./progression-place')
    const progressionId = param(from, 'progressionId')
    return progressionPlace(progressionId) === 'all'
      ? up({ to: '/practice/progressions' })
      : up({ to: '/practice/progressions/$progressionId', params: { progressionId } })
  },
  '/shell/practice/progressions/$progressionId/settings': (from) =>
    up({
      to: '/practice/progressions/$progressionId/edit',
      params: { progressionId: param(from, 'progressionId') },
    }),
  '/shell/practice/progressions/$progressionId/publish': (from) =>
    up({
      to: '/practice/progressions/$progressionId/settings',
      params: { progressionId: param(from, 'progressionId') },
    }),
  '/shell/practice/chord-finder': toPractice,
  '/shell/practice/metronome': toPractice,
  '/shell/practice/metronome/settings': () => up({ to: '/practice/metronome' }),
  '/shell/practice/circle-of-fifths': toPractice,
  '/shell/practice/tuner': toPractice,
  '/shell/practice/tuner/settings': () => up({ to: '/practice/tuner' }),
  '/shell/practice/chord-player': toPractice,
  '/shell/practice/chord-player/settings': ({ search }) => {
    const sheet = text(search.sheet)
    return up({ to: '/practice/chord-player', search: sheet === undefined ? {} : { sheet } })
  },
  '/shell/practice/quiz': toPractice,
  '/shell/practice/quiz/$trainerId': () => up({ to: '/practice/quiz' }),
  '/shell/practice/exercises': toPractice,
  '/shell/practice/exercises/$exerciseId': () => up({ to: '/practice/exercises' }),
  '/shell/practice/accompaniment': toPractice,
  '/shell/practice/accompaniment/patterns/new': toAccompaniment,
  '/shell/practice/accompaniment/patterns/$patternRef': toPatternPlace,
  '/shell/practice/accompaniment/patterns/$patternRef/edit': toPattern,
  '/shell/practice/accompaniment/patterns/$patternRef/publish': toPattern,
  '/shell/practice/accompaniment/studies/$pieceId': async (from) => {
    const { studyPlace } = await import('./accompaniment-screens')
    return up({
      to: '/practice/accompaniment',
      search: { place: studyPlace(param(from, 'pieceId')) },
    })
  },
  '/shell/practice/accompaniment/studies/$pieceId/sections/$section': toStudy,
}

/** The route Back is on and what it was opened with. */
export interface UpMatch {
  readonly routeId: string
  readonly params: Readonly<Record<string, string>>
  /** The route's search as its validator read it. */
  readonly search: object
}

const isScreen = (id: string): id is ScreenRouteId => id in PARENTS

/**
 * Where Back goes from `match`: its route's parent, or null on a place. A route the table does not
 * know (none: the table names every route) goes up to Learn.
 */
export function parentOf(
  match: UpMatch,
  learner: Omit<UpFrom, 'params' | 'search'>,
): Up | null | Promise<Up | null> {
  if (!isScreen(match.routeId)) return up({ to: '/' })
  const search = match.search as Readonly<Record<string, unknown>>
  return PARENTS[match.routeId]({ ...learner, params: match.params, search })
}
