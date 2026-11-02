import type { RegisteredRouter, RouteIds, ValidateNavigateOptions } from '@tanstack/react-router'
import type { RouterContext } from '../router'
import { readScalesSearch } from './explorer-search'

// Back means up (rule 26, ADR 0052): each route names its parent here, and Back goes there. A place
// has none. The table is keyed by every route the router has, so a new route can't be added without
// its parent (`parents.test.ts` walks the router to prove it).

/** Where Back goes: a link's options, checked when the table names them. */
export type Up = ValidateNavigateOptions

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
const toStudy: Parent = (from) =>
  up({
    to: '/practice/accompaniment/studies/$pieceId',
    params: { pieceId: param(from, 'pieceId') },
  })
const toEditor: Parent = (from) =>
  up({ to: '/edit/$pieceId', params: { pieceId: param(from, 'pieceId') } })

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
  '/shell/profile/activity': () => up({ to: '/profile' }),
  '/shell/settings/playing': toSettings,
  '/shell/settings/data': toSettings,
  '/shell/settings/account': toSettings,
  '/shell/settings/how-to-use': toSettings,
  '/shell/settings/midi': toSettings,
  '/shell/settings/midi/log': () => up({ to: '/settings/midi' }),
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
  '/shell/songs/$pieceId/publish': pieceHome,
  '/shell/songs/$pieceId/sections/$section': (from) =>
    up({ to: '/songs/$pieceId', params: { pieceId: param(from, 'pieceId') } }),
  '/shell/songs/folders/$folderId': toSongs,
  '/shell/songs/archive': toSongs,
  '/shell/songs/shared': toSongs,
  '/shell/songs/public': toSongs,
  '/shell/songs/public/$itemId': () => up({ to: '/songs/public' }),

  // The Player and the score editor: up to the piece's page; the editor's Settings and a take up
  // to the editor.
  '/full-screen/play/$pieceId': pieceHome,
  '/full-screen/edit/$pieceId': pieceHome,
  '/full-screen/edit/$pieceId/settings': toEditor,
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
  '/full-screen/play/progression': () => up({ to: '/practice/progressions' }),
  '/full-screen/play/exercise/$exerciseId': () => up({ to: '/practice/exercises' }),
  '/full-screen/check': toLessons,

  // Learn: a lesson up to its level, a course's lesson up to the course, the course up to the
  // Courses; Settings and Edit up to what they set or edit.
  '/shell/lessons/$lessonId': toLessons,
  '/shell/lessons/$lessonId/settings': toLesson,
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
  '/shell/courses/$courseId/edit': toCourse,
  '/shell/courses/$courseId/$lessonId': toCourse,
  '/shell/courses/$courseId/$lessonId/settings': toCourseLesson,
  '/shell/courses/$courseId/$lessonId/edit': toCourseLesson,
  '/shell/courses/manage': toCourses,
  '/shell/journeys/$journeyId/edit': (from) =>
    up({ to: '/', search: { view: 'lessons', journey: param(from, 'journeyId') } }),

  // Practice: each page up to Practice; a trainer up to the Quiz; a pattern up to Accompaniment,
  // its Edit and Publish up to it; a study and its sections the same.
  '/shell/practice/chords': toPractice,
  '/shell/practice/scales': toPractice,
  '/shell/practice/intervals': toPractice,
  '/shell/practice/progressions': toPractice,
  '/shell/practice/progressions/$progressionId/edit': () => up({ to: '/practice/progressions' }),
  '/shell/practice/chord-finder': toPractice,
  '/shell/practice/metronome': toPractice,
  '/shell/practice/quiz': toPractice,
  '/shell/practice/quiz/$trainerId': () => up({ to: '/practice/quiz' }),
  '/shell/practice/exercises': toPractice,
  '/shell/practice/accompaniment': toPractice,
  '/shell/practice/accompaniment/patterns/new': toAccompaniment,
  '/shell/practice/accompaniment/patterns/$patternRef': toAccompaniment,
  '/shell/practice/accompaniment/patterns/$patternRef/edit': toPattern,
  '/shell/practice/accompaniment/patterns/$patternRef/publish': toPattern,
  '/shell/practice/accompaniment/studies/$pieceId': toAccompaniment,
  '/shell/practice/accompaniment/studies/$pieceId/sections/$section': toStudy,
}

/** The route Back is on and what it was opened with. */
export interface UpMatch {
  readonly routeId: string
  readonly params: Readonly<Record<string, string>>
  readonly search: Readonly<Record<string, unknown>>
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
  return PARENTS[match.routeId]({ ...learner, params: match.params, search: match.search })
}
