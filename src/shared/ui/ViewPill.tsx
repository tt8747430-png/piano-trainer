import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'

/** One view of a screen's music: its name, its picture, and why it cannot be shown, where it cannot. */
export interface PillView<V extends string> {
  readonly value: V
  readonly label: string
  readonly icon: LucideIcon
  readonly reason?: string | undefined
}

/**
 * A screen's views as one pill in its bar's middle (the Player's canvas: Sheet · Diagrams · Grid ·
 * Lyrics): the one shown filled in ink; each a picture on a phone, named by its tooltip and to a
 * screen reader, its word from 640px. A view the music cannot show is greyed, saying why. A radio
 * group: the arrows move to a view and show it.
 */
export function ViewPill<V extends string>({
  label,
  value,
  views,
  onChange,
}: {
  label: string
  value: V
  views: readonly PillView<V>[]
  onChange: (value: V) => void
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const picked = views.find((view) => view.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className="flex items-center gap-0.5 rounded-pill border border-border bg-card p-1 elevation-1"
    >
      {views.map(({ value: each, label: name, icon: Icon, reason }) => (
        <Radio.Root
          key={each}
          value={each}
          aria-label={name}
          title={reason ?? name}
          disabled={reason !== undefined}
          className={cn(
            'inline-flex h-9 min-w-11 cursor-default items-center justify-center gap-2 rounded-pill px-3 text-sm font-semibold whitespace-nowrap text-foreground transition-colors duration-200 ease-out select-none',
            'relative before:absolute before:inset-x-0 before:-inset-y-1 before:content-[""]',
            'hover:bg-muted data-checked:bg-foreground data-checked:text-background data-disabled:opacity-40',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          <Icon aria-hidden className="size-5 sm:hidden" />
          <span className="max-sm:hidden">{name}</span>
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
