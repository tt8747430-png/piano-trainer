/**
 * A short knock under the finger where the device has one (the Vibration API): a swipe arming its
 * edge action, or firing it. Silent where there is none.
 */
export function impact(): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function')
    navigator.vibrate(16)
}
