import type { RegisteredRouter, ValidateNavigateOptions } from '@tanstack/react-router'
import { Music } from 'lucide-react'
import { OPEN_PLAINLY, qualityParams, type Up } from '@/shared/lib'
import { keyParam, note, noteParam } from '@/shared/lib/music'
import { PAGE_TILES, type Tile } from '@/shared/ui'
import { PRACTICE_PAGES } from '@/widgets/practice-pages'
import type { IndexTarget } from './index-entries'

/** One link's options, checked against the router as a `<Link>`'s are. */
function opens<TOptions>(options: ValidateNavigateOptions<RegisteredRouter, TOptions>): Up
function opens(options: ValidateNavigateOptions): Up {
  return options
}

/** A song's tile: no page of Practice wears it. */
const SONG_TILE: Tile = { icon: Music, paint: 'lilac' }

/**
 * Where a result opens (each on what it names, as the pages' own rows open them), and the tile it
 * wears. A page of Practice, a trainer and an exercise, named alone, open as they were left.
 */
export function targetLink(target: IndexTarget): { readonly link: Up; readonly tile: Tile } {
  switch (target.opens) {
    case 'page': {
      const { to, tile } = PRACTICE_PAGES[target.page]
      return { link: opens({ to, state: OPEN_PLAINLY }), tile }
    }
    case 'piece': {
      const params = { pieceId: target.entry.id }
      return {
        link:
          target.entry.kind === 'study'
            ? opens({ to: '/practice/accompaniment/studies/$pieceId', params })
            : opens({ to: '/songs/$pieceId', params }),
        tile: SONG_TILE,
      }
    }
    case 'folder':
      return {
        link: opens({ to: '/songs/folders/$folderId', params: { folderId: target.folder } }),
        tile: PAGE_TILES.folder,
      }
    case 'lesson':
      return {
        link: opens({ to: '/lessons/$lessonId', params: { lessonId: target.lesson } }),
        tile: PAGE_TILES.lesson,
      }
    case 'course':
      return {
        link: opens({ to: '/courses/$courseId', params: { courseId: target.course } }),
        tile: PAGE_TILES.course,
      }
    case 'course-lesson':
      return {
        link: opens({
          to: '/courses/$courseId/$lessonId',
          params: { courseId: target.course, lessonId: target.lesson },
        }),
        tile: PAGE_TILES.lesson,
      }
    case 'chord':
      return {
        link: opens({
          to: '/practice/chords',
          search: { root: noteParam(target.root), ...qualityParams(target.quality) },
        }),
        tile: PAGE_TILES.chords,
      }
    case 'scale':
      return {
        link: opens({ to: '/practice/scales', search: { kind: target.scale } }),
        tile: PAGE_TILES.scales,
      }
    case 'progression':
      return {
        link: opens({
          to: '/practice/progressions',
          search: {
            p: target.p,
            key: keyParam({ tonic: note('C'), minor: target.minor }),
            ...(target.size ? { size: target.size } : {}),
          },
        }),
        tile: PAGE_TILES.progressions,
      }
    case 'typed-line':
      return {
        link: opens({ to: '/practice/progressions', search: { key: target.key, p: target.p } }),
        tile: PAGE_TILES.progressions,
      }
    case 'pattern':
      return {
        link: opens({
          to: '/practice/accompaniment/patterns/$patternRef',
          params: { patternRef: target.ref },
        }),
        tile: PAGE_TILES.patterns,
      }
    case 'exercise':
      return {
        link: opens({
          to: '/play/exercise/$exerciseId',
          params: { exerciseId: target.exercise },
          state: OPEN_PLAINLY,
        }),
        tile: PAGE_TILES.exercises,
      }
    case 'trainer':
      return {
        link: opens({
          to: '/practice/quiz/$trainerId',
          params: { trainerId: target.trainer },
          state: OPEN_PLAINLY,
        }),
        tile: PAGE_TILES.quiz,
      }
  }
}
