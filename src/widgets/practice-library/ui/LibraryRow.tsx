import { useRender } from '@base-ui/react/use-render'
import { useTranslation } from 'react-i18next'
import { FavouriteMark, menuOf, ROW_BODY, RowFace, RowMore, swipeOf, SwipeRow } from '@/shared/ui'
import type { LibraryItem } from '../model/library-view'
import { LevelMark } from './LevelMark'

/** What a row's swipe to the right does: Favourite, as its More's first action. */
const LEADING = ['favourite'] as const

/**
 * A row of a practice library on a phone (R30-4, Songs' row in a grouped card): its picture, name and line, a link to
 * its page; its level; its ♡ while a favourite; its More (Favourite first) at every size, and a swipe
 * to the right for Favourite on a touch screen.
 */
export function LibraryRow({ item }: { item: LibraryItem }) {
  const { t } = useTranslation('common')
  const body = useRender({
    render: item.link,
    props: {
      className: ROW_BODY,
      children: (
        <RowFace
          title={item.name}
          detail={item.phoneDetail ?? item.detail}
          icon={item.icon}
          paint={item.paint}
          trailing={
            item.trailing || item.stage ? (
              <span className="flex shrink-0 items-center gap-2">
                {item.trailing}
                {item.stage ? <LevelMark stage={item.stage} /> : null}
              </span>
            ) : undefined
          }
        />
      ),
    },
  })
  return (
    <li className="min-w-0">
      <SwipeRow leading={swipeOf(item.actions, LEADING)} className="h-full">
        <div className="flex h-full min-w-0 items-center gap-1 rounded-card bg-card pr-1 transition-colors duration-200 ease-out has-[>a:hover]:bg-muted">
          {body}
          {item.favourite ? <FavouriteMark /> : null}
          <RowMore
            label={t('library.moreOf', { name: item.name })}
            actions={menuOf(item.actions)}
          />
        </div>
      </SwipeRow>
    </li>
  )
}
