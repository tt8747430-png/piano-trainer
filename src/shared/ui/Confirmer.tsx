import { useSyncExternalStore } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { confirmQueue } from './confirm'

/** Shows what `confirm` asks, one question at a time (beside the app's `Toaster`). */
export function Confirmer() {
  const asked = useSyncExternalStore(
    confirmQueue.subscribe,
    confirmQueue.current,
    confirmQueue.current,
  )
  return (
    <ConfirmDialog
      open={asked !== null}
      onOpenChange={(open) => (open ? undefined : confirmQueue.answer(false))}
      title={asked?.title ?? ''}
      body={asked?.body ?? ''}
      action={asked?.action ?? ''}
      destructive={asked?.destructive ?? true}
      {...(asked?.typed === undefined ? {} : { typed: asked.typed })}
      onConfirm={() => confirmQueue.answer(true)}
    />
  )
}
