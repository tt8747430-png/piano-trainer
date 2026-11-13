import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

/**
 * A state with nothing to list (the canvas's empty state): a round muted mark, one bold line (and a
 * soft second where it teaches), one way on.
 */
export function Said({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action: ReactNode
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden />
        </EmptyMedia>
        {/* A long query breaks rather than run off the screen. */}
        <EmptyTitle role="status" className="break-words">
          {title}
        </EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  )
}
