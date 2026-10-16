import { useId, type ReactNode } from 'react'

/**
 * One choice in Settings: its name as a row's text (the group around it has the heading), a line
 * saying what it does where its name alone does not, and its control under them.
 */
export function SettingField({
  label,
  detail,
  children,
}: {
  label: string
  detail?: string | undefined
  children: ReactNode
}) {
  const detailId = useId()
  return (
    <div className="flex flex-col gap-2" aria-describedby={detail ? detailId : undefined}>
      <div className="flex flex-col">
        <span className="text-foreground">{label}</span>
        {detail ? (
          <span id={detailId} className="text-sm text-muted-foreground">
            {detail}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}
