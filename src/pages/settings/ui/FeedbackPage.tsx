import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnline } from '@/shared/lib'
import { FEEDBACK_PREFIX, useReportError } from '@/shared/lib/error-reports'
import { say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { SettingsScreen } from '@/widgets/settings-screen'

/** The longest report a learner may write. */
const REPORT_MAX = 2000

/**
 * Settings › Support › Report a problem (R29 B2, R32): a page of its own, its field in sight, what to
 * include in the footnote, one Send report; sent with the app's error reports (Administration ›
 * Feedback reads them), never saying who sent it. Offline, Send report is greyed and says why.
 */
export function FeedbackPage() {
  const { t } = useTranslation('settings')
  const report = useReportError()
  const online = useOnline()
  const [text, setText] = useState('')
  const id = useId()
  const hint = useId()
  const send = () => {
    report(`${FEEDBACK_PREFIX}${text.trim()}`, window.location.pathname)
    setText('')
    say(t('report.sent'))
  }
  return (
    <SettingsScreen title={t('pages.feedback')}>
      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          if (online && text.trim() !== '') send()
        }}
      >
        <label htmlFor={id} className="px-3 text-sm font-semibold text-muted-foreground">
          {t('report.label')}
        </label>
        <Textarea
          id={id}
          value={text}
          maxLength={REPORT_MAX}
          rows={6}
          aria-describedby={hint}
          onChange={(event) => setText(event.target.value)}
          className="min-h-40 rounded-card bg-card px-4 py-3 text-base md:text-base"
        />
        <p id={hint} className="px-3 text-sm text-muted-foreground">
          {online ? t('report.footnote') : t('report.offline')}
        </p>
        <Button type="submit" size="lg" className="mt-4" disabled={!online || text.trim() === ''}>
          {t('report.send')}
        </Button>
      </form>
    </SettingsScreen>
  )
}
