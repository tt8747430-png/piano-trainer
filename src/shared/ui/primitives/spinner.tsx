import { cn } from '@/shared/lib'
import { LoaderCircle } from 'lucide-react'

/** Decorative: whatever waits names itself (a status region, a button's text), in the learner's language. */
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderCircle
      data-slot="spinner"
      aria-hidden="true"
      className={cn('size-4 motion-safe:animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
