interface Choice<Value extends string> {
  value: Value
  label: string
}

/** One fieldset of radio choices; the whole row is the target, at least 44px tall. */
export function ChoiceGroup<Value extends string>({
  legend,
  name,
  value,
  choices,
  onChange,
}: {
  legend: string
  name: string
  value: Value
  choices: readonly Choice<Value>[]
  onChange: (value: Value) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {choices.map((choice) => (
          <label
            key={choice.value}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 transition-colors hover:bg-accent has-checked:border-primary"
          >
            <input
              type="radio"
              name={name}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
              className="size-4 accent-primary"
            />
            {choice.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
