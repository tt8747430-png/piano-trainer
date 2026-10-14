import { Link } from '@tanstack/react-router'
import { qualityParams } from '@/shared/lib'
import { keyParam, note, noteParam } from '@/shared/lib/music'
import { PAGE_TILES, RowLink } from '@/shared/ui'
import { PageRow } from '@/widgets/practice-pages'
import type { IndexTarget } from '../model/index-entries'

/**
 * An entry's row: its name, its line, the tile of the page it opens, and the link there, on what it
 * names. A song has its own row, the one Songs shows it in.
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
          render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: target.lesson }} />}
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
          render={<Link to="/play/exercise/$exerciseId" params={{ exerciseId: target.exercise }} />}
        />
      )
    case 'transpose':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.transpose}
          render={<Link to="/practice/progressions/transpose" search={{ chords: target.chords }} />}
        />
      )
    case 'trainer':
      return (
        <RowLink
          {...row}
          {...PAGE_TILES.quiz}
          render={<Link to="/practice/quiz/$trainerId" params={{ trainerId: target.trainer }} />}
        />
      )
  }
}
