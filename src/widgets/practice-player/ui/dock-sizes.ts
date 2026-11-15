/**
 * A transport button's size, a floating bar's 48px as the board draws it, on a phone held upright from
 * 390px too, where the tempo, ‹ ▶ ›, the loop, the Sound and the hands share its width; 40px on a
 * narrower phone and on a phone on its side, where the height is short. ‹ and › (`DOCK_STEP`) are
 * narrower still under 390px, an arrow needing less width than a picture, so the seven fit from
 * 320px (ADR 0105).
 */
export const DOCK_BUTTON = 'small-phone:size-10 landscape-phone:size-10'

/** ‹ and ›: a transport button, narrower under 390px and narrower again under 360px. */
export const DOCK_STEP = `${DOCK_BUTTON} w-11 small-phone:w-8 narrow-phone:w-7`

/**
 * A transport button with a caption under its picture (its canvas): as tall as `DOCK_BUTTON`, as
 * wide as its word; on a laptop its word beside its picture, 15px, as the board's PlayerDesk.
 */
export const DOCK_CAPTIONED =
  'small-phone:h-10 landscape-phone:h-10 lg:flex-row lg:gap-2 lg:ps-3 lg:pe-4 lg:text-[0.9375rem] lg:leading-normal'
