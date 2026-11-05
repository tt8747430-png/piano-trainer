/**
 * What begins a learner's own report (Settings › Report a problem), sent with the app's error reports
 * and told apart from an error by it: Administration › Feedback lists these, the Error log the rest.
 */
export const FEEDBACK_PREFIX = 'Report: '

/** Whether an error report is a learner's own report, and its text if so. */
export const feedbackText = (message: string): string | null =>
  message.startsWith(FEEDBACK_PREFIX) ? message.slice(FEEDBACK_PREFIX.length) : null
