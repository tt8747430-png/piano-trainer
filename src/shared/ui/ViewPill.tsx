import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'

/** One view of a screen's music: its name, its picture, and why it cannot be shown, where it cannot. */
export interface PillView<V extends string> {
  readonly value: V
  readonly label: string
  /** Its picture on a phone; without one, its word at every size. */
  readonly icon?: LucideIcon | undefined
  readonly reason?: string | undefined
}

/**
 * A screen's views as one pill in its bar's middle (the Player's canvas: Sheet · Diagrams · Grid ·
 * Lyrics; the editor's Play · Edit): a glass pill of 44 segments, the one shown filled in ink; each a picture on a phone, named by its tooltip and to a
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
      className="flex items-center rounded-pill glass"
    >
      {views.map(({ value: each, label: name, icon: Icon, reason }) => (
        <Radio.Root
          key={each}
          value={each}
          aria-label={name}
          title={reason ?? name}
          disabled={reason !== undefined}
          className={cn(
            'inline-flex h-11 min-w-11 cursor-default items-center justify-center gap-2 rounded-pill px-3.5 text-[0.9375rem] font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 ease-out select-none',
            'hover:text-foreground data-checked:bg-foreground data-checked:font-semibold data-checked:text-background data-disabled:opacity-40',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          {Icon ? <Icon aria-hidden className="size-5 sm:hidden" /> : null}
          <span className={Icon ? 'max-sm:hidden' : 'px-1'}>{name}</span>
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
