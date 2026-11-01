import type { ReactNode } from 'react'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

/** A screen in the editor's place saying why it is not open yet: its line, and what to do. */
export function NotOpen({ line, children }: { line: string; children?: ReactNode }) {
  return (
    <Empty className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <p role="status" className="text-lg">
            {line}
          </p>
        </EmptyTitle>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}
