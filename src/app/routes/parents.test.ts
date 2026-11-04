// @vitest-environment jsdom
import type { AnyRoute } from '@tanstack/react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { FOLDER_PAINTS, FOLDER_PICTURES, libraryCatalog } from '@/entities/library'
import { makeFolder } from '@/features/manage-library'
import { stubMatchMedia } from '@/shared/test/match-media'
import { testContext, testRouter } from '../testing/test-context'
import { PARENTS, parentOf, type UpFrom } from './parents'

const LAYOUTS = new Set(['__root__', '/shell', '/full-screen'])
const PLACES = ['/shell/', '/shell/songs', '/shell/practice', '/shell/profile', '/shell/search']

/** The router's every screen: each route but the root and the layouts. */
const screensOf = (router: ReturnType<typeof testRouter>) =>
  Object.values(router.routesById as Record<string, AnyRoute>).filter(
    (route) => !LAYOUTS.has(route.id),
  )

/** A route's params, each named after itself: enough to build a link to it. */
const paramsOf = (route: AnyRoute): Record<string, string> =>
  Object.fromEntries(
    [...String(route.fullPath).matchAll(/\$(\w+)/g)].map(([, name]) => [name, `x-${name}`]),
  )

type Learner = Omit<UpFrom, 'params' | 'search'>
let learners: Learner[] = []
beforeEach(() => {
  // The stores read the pointer as they are made: jsdom has no matchMedia of its own.
  stubMatchMedia({ dark: false })
  learners = [true, false].flatMap((signedIn) =>
    [true, false].map((wide) => ({ context: testContext(), signedIn, wide })),
  )
})

describe('parents', () => {
  it('names a parent for every route the router has, and no route it does not have', () => {
    const screens = screensOf(testRouter())
    expect(screens.map((route) => route.id).sort()).toEqual(Object.keys(PARENTS).sort())
  })

  it('leads each route up to a real route, never to itself', async () => {
    const router = testRouter()
    const screens = screensOf(router)
    for (const route of screens) {
      for (const learner of learners) {
        const parent = await parentOf(
          { routeId: route.id, params: paramsOf(route), search: {} },
          learner,
        )
        if (!parent) continue
        const { pathname } = router.buildLocation(parent)
        const matched = router.matchRoutes(pathname, {}).at(-1)
        expect(matched?.routeId, `${route.id} → ${pathname}`).not.toBe('__root__')
        expect(matched?.routeId, `${route.id} → ${pathname}`).not.toBe(route.id)
      }
    }
  })

  it('has no parent on a place, and Settings is one on a laptop only', async () => {
    for (const routeId of PLACES) {
      expect(await parentOf({ routeId, params: {}, search: {} }, learners[0]!)).toBeNull()
    }
    const settings = { routeId: '/shell/settings', params: {}, search: {} }
    const [wide, narrow] = [learners[0]!, learners[1]!]
    expect(await parentOf(settings, wide)).toBeNull()
    expect(await parentOf(settings, narrow)).toMatchObject({ to: '/profile' })
  })

  it('leads the account pages to the account when signed in, else to the Profile', async () => {
    const signIn = { routeId: '/shell/account/sign-in', params: {}, search: {} }
    expect(await parentOf(signIn, learners[0]!)).toMatchObject({ to: '/settings/account' })
    expect(await parentOf(signIn, learners[2]!)).toMatchObject({ to: '/profile' })
  })

  it('leads an Explore item up to Explore', async () => {
    const [learner] = learners
    expect(
      await parentOf(
        { routeId: '/shell/songs/public/$itemId', params: { itemId: 'p-1' }, search: {} },
        learner!,
      ),
    ).toMatchObject({ to: '/songs', search: { view: 'explore' } })
  })

  it('leads a song to its folder, a study to Accompaniment, and their Player to their page', async () => {
    const [learner] = learners
    const { library } = learner!.context
    const look = { picture: FOLDER_PICTURES[0], paint: FOLDER_PAINTS[0] }
    const folderId = makeFolder(
      library,
      libraryCatalog({ ownSongs: [] }),
      {
        name: 'Hymns',
        ...look,
      },
      { songs: ['bz5'] },
    )
    const song = (routeId: string, pieceId: string) =>
      parentOf({ routeId, params: { pieceId }, search: {} }, learner!)
    expect(await song('/shell/songs/$pieceId', 'bz5')).toMatchObject({
      to: '/songs/folders/$folderId',
      params: { folderId },
    })
    // A built-in song stands in its collection's folder until the learner moves it.
    expect(await song('/shell/songs/$pieceId', 'lightly-row')).toMatchObject({
      to: '/songs/folders/$folderId',
    })
    expect(await song('/shell/songs/$pieceId', 'no-such-song')).toMatchObject({ to: '/songs' })
    expect(await song('/full-screen/play/$pieceId', 'bz5')).toMatchObject({
      to: '/songs/$pieceId',
    })
    expect(await song('/full-screen/edit/$pieceId', 'ex3')).toMatchObject({
      to: '/practice/accompaniment/studies/$pieceId',
    })
  })

  it('leads a lesson to its level and a course’s lesson through its course to the Courses', async () => {
    const at = (routeId: string, params: Record<string, string>, search = {}) =>
      parentOf({ routeId, params, search }, learners[0]!)
    expect(await at('/shell/lessons/$lessonId', { lessonId: 'triads' })).toMatchObject({
      to: '/',
      search: { view: 'lessons' },
    })
    const lesson = { courseId: 'gorshkov', lessonId: 'chord-pulse' }
    expect(await at('/shell/courses/$courseId/$lessonId', lesson)).toMatchObject({
      to: '/courses/$courseId',
    })
    expect(await at('/shell/courses/$courseId', lesson)).toMatchObject({
      search: { view: 'courses' },
    })
    expect(
      await at('/full-screen/lessons/$lessonId/example', lesson, { course: 'gorshkov' }),
    ).toMatchObject({ to: '/courses/$courseId/$lessonId/edit' })
  })
})
