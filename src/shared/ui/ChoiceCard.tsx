import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'
import { RadioGroup, RadioGroupItem } from './primitives/radio-group'

/** One choice of a `ChoiceCard`: its name, and the one plain line that shows what it means. */
export interface CardOption<V extends string> {
  readonly value: V
  readonly label: string
  readonly example?: string
}

/**
 * A setting chosen among three or more, every choice in sight (Flat's settings, R29 Decided 23): the
 * setting's name over its choices, each a radio with its example under it, a row 44 high. What it
 * does sits in the ⓘ (`info`, or `description` as plain words), never a line under the name.
 * On/off stays a `SwitchRow`.
 */
export function ChoiceCard<V extends string>({
  title,
  description,
  setting,
  info,
  options,
  value,
  onChange,
}: {
  title: string
  /** What it does in plain words: its ⓘ where `info` is not given. */
  description?: string | undefined
  /** The preference it sets (`data-setting`): the one page drawing it is its home (R18). */
  setting?: string
  info?: ReactNode
  options: readonly CardOption<V>[]
  value: V
  onChange: (value: V) => void
}) {
  const id = useId()
  // Both given: the plain words, then the longer help, in the one ⓘ.
  const tip =
    info && description ? (
      <>
        <p>{description}</p>
        <p className="mt-2">{info}</p>
      </>
    ) : (
      (info ?? description)
    )
  return (
    <section data-setting={setting} className="card flex flex-col gap-3 px-5 py-4">
      <div className="flex items-center gap-1">
        <h2 id={id} className="font-sans text-base font-semibold">
          {title}
        </h2>
        {tip ? <InfoTip name={title}>{tip}</InfoTip> : null}
      </div>
      {description ? (
        <p id={`${id}-description`} className="sr-only">
          {description}
        </p>
      ) : null}
      <RadioGroup
        aria-labelledby={id}
        aria-describedby={description ? `${id}-description` : undefined}
        value={value}
        onValueChange={(next) => onChange(next as V)}
        className="gap-0"
      >
        {options.map((option) => {
          const optionId = `${id}-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex min-h-11 cursor-pointer items-center gap-3 py-1"
            >
              {/* The radio reaches the row's 44 (its ::before), as the row's label does. */}
              <RadioGroupItem
                id={optionId}
                value={option.value}
                className="relative before:absolute before:-inset-3.5 before:content-['']"
              />
              <span className="flex min-w-0 flex-col">
                <span className={cn('break-words')}>{option.label}</span>
                {option.example ? (
                  <span className="text-xs break-words text-muted-foreground">
                    {option.example}
                  </span>
                ) : null}
              </span>
            </label>
          )
        })}
      </RadioGroup>
    </section>
  )
}
