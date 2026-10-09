/** Where a key typed goes into a field: no shortcut fires, nothing plays. */
const FIELDS = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])'

/** A pop-up's own keys are its own: a sheet, a popover, a menu, a list. */
const POP_UPS = ['dialog', 'alertdialog', 'menu', 'listbox'].map((role) => `[role="${role}"]`)

/** What Space or Enter presses when it has the focus. */
const CONTROLS = [
  'a[href]',
  'button',
  'summary',
  ...[
    'button',
    'switch',
    'slider',
    'radio',
    'checkbox',
    'tab',
    'menuitem',
    'option',
    'combobox',
    'listbox',
  ].map((role) => `[role="${role}"]`),
].join(', ')

const within = (target: EventTarget | null, selector: string) =>
  target instanceof Element && target.closest(selector) !== null

/** A key pressed here is typed into a field. */
export const isTyping = (target: EventTarget | null): boolean => within(target, FIELDS)

/** A key pressed here is inside a pop-up. */
export const inPopUp = (target: EventTarget | null): boolean => within(target, POP_UPS.join(', '))

/** Space or Enter pressed here has a job of its own: a field types it, a control is pressed by it. */
export const takesKey = (target: EventTarget | null): boolean =>
  isTyping(target) || within(target, CONTROLS)
