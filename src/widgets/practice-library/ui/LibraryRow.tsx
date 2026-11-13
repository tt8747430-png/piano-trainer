import { useRender } from '@base-ui/react/use-render'
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

/**
 * A row of a practice library on a phone (canvas, Songs' row in its grouped card): its picture, name
 * and line, a link to its page; its level; its ♡, one tap; its More under a mouse, a swipe to the
 * right for Favourite under a finger.
 */
export function LibraryRow({ item }: { item: LibraryItem }) {
  const { t } = useTranslation('common')
  const favourite = item.actions.find((action) => action.key === 'favourite')
  const body = useRender({
    render: item.link,
    props: {
      className: cn(ROW_BODY, ROW_LIBRARY_FACE),
      children: (
        <>
          <LibraryTile picture={item.picture} />
          <RowFace
            title={item.name}
            detail={item.detail}
            trailing={
              item.trailing || item.stage ? (
                <span className="flex shrink-0 items-center gap-2">
                  {item.trailing}
                  {item.stage ? <LevelMark stage={item.stage} /> : null}
                </span>
              ) : undefined
            }
          />
        </>
      ),
    },
  })
  return (
    <li className="min-w-0">
      <SwipeRow leading={swipeOf(item.actions, LEADING)} className="h-full">
        <div className={cn(ROW_FLAT, 'has-[>a:hover]:bg-muted')}>
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
