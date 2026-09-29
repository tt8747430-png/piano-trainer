/** A choice's value: an id, a note, or a number such as an inversion or a level. */
export type OptionValue = string | number

export interface Option<V extends OptionValue> {
  readonly value: V
  readonly label: string
  /** The accessible name, when the label alone is not enough (`7` → "Dominant 7th"). */
  readonly title?: string
  /** A pop-up item's second word, in soft ink after its label ("Minor 7th · m7"). */
  readonly detail?: string
}

/** Options under a name: a pop-up button's group (a chord family). */
export interface OptionGroup<V extends OptionValue> {
  readonly label: string
  readonly options: readonly Option<V>[]
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

/** A group of a pop-up's options, under its label where it has one. */
export interface ChoiceGroup<V extends OptionValue> {
  readonly label?: string
  readonly options: readonly Option<V>[]
}

/** A pop-up's choices: a list of options, or groups of them under their labels. */
export type Choices<V extends OptionValue> =
  | { readonly options: readonly Option<V>[]; readonly groups?: never }
  | { readonly groups: readonly OptionGroup<V>[]; readonly options?: never }

/** The groups a pop-up lists: its own, or one unlabelled group of its options. */
export const choiceGroups = <V extends OptionValue>(
  choices: Choices<V>,
): readonly ChoiceGroup<V>[] => choices.groups ?? [{ options: choices.options }]
