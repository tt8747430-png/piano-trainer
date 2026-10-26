/**
 * A transport button's size, a floating bar's 48px: the 44px target on a phone held upright from
 * 390px, where the tempo, ‹ ▶ ›, the loop, the Sound and the hands share its width; 40px on a
 * narrower phone and on a phone on its side, where the height is short. ‹ and › (`DOCK_STEP`) are
 * narrower still under 390px, an arrow needing less width than a picture, so the seven fit from
 * 320px (ADR 0105).
 */
export const DOCK_BUTTON = 'max-sm:size-11 small-phone:size-10 landscape-phone:size-10'

/** ‹ and ›: a transport button, narrower under 390px and narrower again under 360px. */
export const DOCK_STEP = `${DOCK_BUTTON} small-phone:w-8 narrow-phone:w-7`
