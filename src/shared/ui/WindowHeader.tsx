import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import { DialogClose, DialogTitle } from './primitives/dialog'

/**
 * A laptop window's bar, as the boards' Settings and THINGWIN draw it: 56 tall, its title (17,
 * semibold) after Back where a page inside has one, a 44 close × at its end, the line under it. The
 * app's Settings sit 24 in (`inset="app"`), a thing's window 32 (12 with Back), as their boards.
 */
export function WindowHeader({
  title,
  back,
  closeLabel,
  inset = 'thing',
}: {
  title: ReactNode
  back?: ReactNode
  closeLabel: string
  inset?: 'app' | 'thing'
}) {
  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center gap-1 border-b border-border pr-2',
        back ? 'pl-3' : inset === 'app' ? 'pl-6' : 'pl-8',
      )}
    >
      {back}
      <DialogTitle className="flex-1 font-sans text-lg leading-normal font-semibold">
        {title}
      </DialogTitle>
      <DialogClose
        render={<Button variant="ghost" size="icon" aria-label={closeLabel} title={closeLabel} />}
      >
        <X aria-hidden />
      </DialogClose>
    </header>
  )
}
