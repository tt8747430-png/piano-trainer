import { cn } from 'cn'
import { Loader2Icon } from 'lucide-react'

/** Decorative: whatever waits names itself (a status region, a button's text), in the learner's language. */
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      data-slot="spinner"
      aria-hidden="true"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
