import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { OPEN_PLAINLY } from '@/shared/lib'
import { RowLink } from '@/shared/ui'
import { PRACTICE_PAGES, type PracticePageId } from '../model/practice-pages'
import { usePageWords } from './use-page-words'

/**
 * A page of Practice as a row, wherever it is listed (Practice, Search): its name, what it says of
 * itself, its tile. It opens as it was left.
 */
export function PageRow({ page, trailing }: { page: PracticePageId; trailing?: ReactNode }) {
  const words = usePageWords()
  const { title, about } = words(page)
  const { to, tile } = PRACTICE_PAGES[page]
  return (
    <RowLink
      title={title}
      detail={about}
      {...tile}
      trailing={trailing}
      render={<Link to={to} state={OPEN_PLAINLY} />}
    />
  )
}
