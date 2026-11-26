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
        className="flex flex-col gap-1.5"
        onSubmit={(event) => {
          event.preventDefault()
          if (online && text.trim() !== '') send()
        }}
      >
        <label htmlFor={id} className="px-1 text-footnote font-semibold text-muted-foreground">
          {t('report.label')}
        </label>
        <Textarea
          id={id}
          value={text}
          maxLength={REPORT_MAX}
          rows={7}
          placeholder={t('report.placeholder')}
          aria-describedby={hint}
          onChange={(event) => setText(event.target.value)}
          className="min-h-46 resize-none rounded-control border-border bg-card p-3 dark:bg-card text-base/[1.45] md:text-base/[1.45]"
        />
        <p id={hint} className="px-1 text-footnote text-pretty text-muted-foreground">
          {online ? t('report.footnote') : t('report.offline')}
        </p>
        <Button
          type="submit"
          size="lg"
          // The board's: a 50-tall pill, sand with soft ink until there is something to send.
          className="mt-2.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
          disabled={!online || text.trim() === ''}
        >
          {t('report.send')}
        </Button>
      </form>
    </SettingsScreen>
  )
}
