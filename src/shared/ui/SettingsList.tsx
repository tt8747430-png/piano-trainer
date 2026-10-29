import { useId, type ReactNode } from 'react'

/**
 * A titled group of a settings page's rows, as an app's settings read (iOS's grouped list,
 * memory-palaces' `SettingsSection`): its name small over one card of rows, each a `RowLink` to a
 * page, a `ChoiceRow` or a `SwitchRow` changed in place. Untitled, it is the page's first card (the
 * account).
 */
export function SettingsList({ title, children }: { title?: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={title ? id : undefined} className="flex flex-col gap-2">
      {title ? (
        <h2 id={id} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
          {title}
        </h2>
      ) : null}
      <div className="flex flex-col card p-1.5">{children}</div>
    </section>
  )
}
