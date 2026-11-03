import type { ReactNode } from 'react'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { SettingsList } from './SettingsList'

/**
 * A page of Settings (R20), as macOS's System Settings and iOS's Settings lay one out. On a phone, one
 * column: the page's title with Back to Settings, its groups one under the other. On a laptop, two
 * panes: Settings' list (20rem) beside the page chosen (about 700px), neither with Back, the bar
 * naming the page shown. A page under a page (the MIDI log) keeps its Back to the page it is under
 * (`sub`).
 */
export function SettingsScreen({
  title,
  sub = false,
  actions,
  children,
}: {
  title: string
  sub?: boolean
  /** The bar's own actions (a page's ⓘ). */
  actions?: ReactNode
  children: ReactNode
}) {
  const wide = useMediaQuery(LAPTOP)
  const page = <div className="flex min-w-0 flex-col gap-7">{children}</div>
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={title}
        back={!wide || sub ? <BackButton /> : undefined}
        actions={actions}
      />
      {wide ? (
        <div className="grid grid-cols-[20rem_minmax(0,44rem)] items-start gap-10">
          <div className="sticky top-4">
            <SettingsList />
          </div>
          {page}
        </div>
      ) : (
        <div className="mx-auto w-full max-w-2xl">{page}</div>
      )}
    </div>
  )
}
