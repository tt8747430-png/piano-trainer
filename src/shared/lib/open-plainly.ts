/**
 * A link that opens a screen plainly, naming nothing to show (a row in Learn, a piece's Practise):
 * the screen comes back as the learner left it. A link that names what to show leaves this out, even
 * when what it names is the screen's default and so leaves the URL bare.
 */
export const OPEN_PLAINLY = { plain: true } as const

declare module '@tanstack/history' {
  interface HistoryState {
    /** Opened by `OPEN_PLAINLY`. */
    plain?: true
  }
}
