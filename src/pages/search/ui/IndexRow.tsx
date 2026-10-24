import { Link } from '@tanstack/react-router'
import { OPEN_PLAINLY, qualityParams } from '@/shared/lib'
import { keyParam, note, noteParam } from '@/shared/lib/music'
import { PAGE_TILES, RowLink } from '@/shared/ui'
import { PageRow } from '@/widgets/practice-pages'
import type { IndexTarget } from '../model/index-entries'

/**
 * An entry's row: its name, its line, the tile of the page it opens, and the link there, on what it
 * names. A song has its own row, the one Songs shows it in. A trainer and an exercise, named alone,
 * open as they were left (`OPEN_PLAINLY`), as their own pages' rows open them.
 */
export function IndexRow({
  title,
  detail,
  target,
}: {
  title: string
  detail: string | undefined
  target: Exclude<IndexTarget, { readonly opens: 'piece' }>
}) {
  const row = { title, detail }
  switch (target.opens) {
    case 'page':
      return <PageRow page={target.page} />
    case 'lesson':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.lesson}
          render={<Link to="/lessons/$lessonId" params={{ lessonId: target.lesson }} />}
        />
      )
    case 'course':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.course}
          render={<Link to="/courses/$courseId" params={{ courseId: target.course }} />}
        />
      )
    case 'course-lesson':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.lesson}
          render={
            <Link
              to="/courses/$courseId/$lessonId"
              params={{ courseId: target.course, lessonId: target.lesson }}
            />
          }
        />
      )
    case 'chord':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.chords}
          render={
            <Link
              to="/practice/chords"
              search={{ root: noteParam(target.root), ...qualityParams(target.quality) }}
            />
          }
        />
      )
    case 'scale':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.scales}
          render={<Link to="/practice/scales" search={{ kind: target.scale }} />}
        />
      )
    case 'progression':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.progressions}
          render={
            <Link
              to="/practice/progressions"
              search={{
                p: target.p,
                key: keyParam({ tonic: note('C'), minor: target.minor }),
                ...(target.size ? { size: target.size } : {}),
              }}
            />
          }
        />
      )
    case 'pattern':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.patterns}
          render={
            <Link
              to="/practice/accompaniment/patterns/$patternRef"
              params={{ patternRef: target.ref }}
            />
          }
        />
      )
    case 'exercise':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.exercises}
          render={
            <Link
              to="/play/exercise/$exerciseId"
              params={{ exerciseId: target.exercise }}
              state={OPEN_PLAINLY}
            />
          }
        />
      )
    case 'typed-line':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.progressions}
          render={<Link to="/practice/progressions" search={{ key: target.key, p: target.p }} />}
        />
      )
    case 'trainer':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.quiz}
          render={
            <Link
              to="/practice/quiz/$trainerId"
              params={{ trainerId: target.trainer }}
              state={OPEN_PLAINLY}
            />
          }
        />
      )
  }
}
