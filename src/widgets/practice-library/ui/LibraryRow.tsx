import { useRender } from '@base-ui/react/use-render'
import type { CSSProperties, ReactNode, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  HeartToggle,
  menuOf,
  POINTER_ONLY,
  ROW_BODY,
  ROW_FLAT,
  ROW_LIBRARY_FACE,
  RowFace,
  RowMore,
  swipeOf,
  SwipeRow,
} from '@/shared/ui'
import type { LibraryItem } from '../model/library-view'
import { LevelMark } from './LevelMark'
import { LibraryTile } from './LibraryTile'

/** What a row's swipe to the right does: Favourite, as its More's first action. */
const LEADING = ['favourite'] as const

/** A row in Edit (the board's): its handle where its heart stood, its face as it reads, no link. */
export interface RowArranging {
  readonly handle: ReactNode
  readonly node: Ref<HTMLLIElement>
  readonly style: CSSProperties
  readonly lifted: boolean
}

/**
 * A row of a practice library on a phone (canvas, Songs' row in its grouped card): its picture, name
 * and line, its level (or a progression's key) at its right in words (the board's), a link to its page; its ♡, one tap; its More under a mouse, a swipe to the
 * right for Favourite under a finger.
 */
export function LibraryRow({ item, arrange }: { item: LibraryItem; arrange?: RowArranging }) {
  const { t } = useTranslation('common')
  const favourite = item.actions.find((action) => action.key === 'favourite')
  const body = useRender({
    render: arrange ? <div /> : item.link,
    props: {
      className: cn(ROW_BODY, ROW_LIBRARY_FACE, 'pl-3'),
      children: (
        <>
          <LibraryTile picture={item.picture} />
          <RowFace
            title={item.name}
            detail={item.detail}
            trailing={
              item.trailing ??
              (item.stage ? (
                <LevelMark stage={item.stage} short />
              ) : item.third ? (
                <span className="shrink-0 text-sm whitespace-nowrap text-muted-foreground">
                  {item.third}
                </span>
              ) : undefined)
            }
          />
        </>
      ),
    },
  })
  if (arrange) {
    const { node, style, lifted, handle } = arrange
    return (
      <li ref={node} style={style} className={cn('min-w-0 bg-card', lifted && 'opacity-0')}>
        <div className={cn(ROW_FLAT, 'gap-3')}>
          {body}
          {handle}
        </div>
      </li>
    )
  }
  return (
    <li className="min-w-0">
      <SwipeRow leading={swipeOf(item.actions, LEADING)} className="h-full">
        {/* the board's row: its picture 12 in, 12 between its level and its heart (r41_lib) */}
        <div className={cn(ROW_FLAT, 'gap-3 has-[>a:hover]:bg-muted')}>
          {body}
          {favourite ? (
            <HeartToggle
              pressed={item.favourite}
              label={favourite.label}
              onToggle={() => favourite.onSelect()}
            />
          ) : null}
          <RowMore
            label={t('library.moreOf', { name: item.name })}
            actions={menuOf(item.actions)}
            className={POINTER_ONLY}
          />
        </div>
      </SwipeRow>
    </li>
  )
}
