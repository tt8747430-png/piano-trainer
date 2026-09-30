/**
 * The browser looks for a new version only when the app is opened, and an installed app is resumed
 * far more often than it is opened: so the app looks each time it comes back to the screen. Offline,
 * the look fails, and the next return looks again.
 */
export function checkOnReturn(
  registration: { update(): Promise<unknown> },
  page: EventTarget & Pick<Document, 'visibilityState'> = document,
): void {
  page.addEventListener('visibilitychange', () => {
    if (page.visibilityState === 'visible') registration.update().catch(() => undefined)
  })
}
