/** A choice's value: an id, a note, or a number such as an inversion or a level. */
export type OptionValue = string | number

export interface Option<V extends OptionValue> {
  readonly value: V
  readonly label: string
  /** The accessible name, when the label alone is not enough (`7` → "Dominant 7th"). */
  readonly title?: string
}

/** A toggle's value is a string; this is the one place an option's value becomes one. */
export const toggleValue = (value: OptionValue): string => String(value)

/**
 * The option a toggle group's change picked: the one newly pressed. Pressing the chosen toggle
 * again picks nothing, so one option stays chosen.
 */
export const pickedOption = <V extends OptionValue>(
  options: readonly Option<V>[],
  current: V,
  pressed: readonly string[],
): Option<V> | undefined =>
  options.find((option) => option.value !== current && pressed.includes(toggleValue(option.value)))
