import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { TileMark, type Paint } from '@/shared/ui'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

/** A state with nothing to list: its tile, one line (and a second where it teaches), one way on. */
export function Said({
  icon,
  paint,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  paint: Paint
  title: string
  description?: string
  action: ReactNode
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <TileMark icon={icon} paint={paint} />
        </EmptyMedia>
        {/* A long query breaks rather than run off the screen. */}
        <EmptyTitle role="status" className="text-base break-words">
          {title}
        </EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  )
}
