import { MessageSquareWarning } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReportError } from '@/shared/lib/error-reports'
import { RowButton, say, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'

/** The longest report a learner may write. */
const REPORT_MAX = 2000

/**
 * Settings › Help's Report a problem (R29 B2: the legal pages' Contact): a sheet to say what went
 * wrong, sent with the app's error reports (Admin › Errors reads them), never asking who sent it.
 */
export function ReportProblem() {
  const { t } = useTranslation('settings')
  const report = useReportError()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const id = useId()
  const send = () => {
    report(`Report: ${text.trim()}`, window.location.pathname)
    setText('')
    setOpen(false)
    say(t('report.sent'))
  }
  return (
    <>
      <RowButton
        title={t('report.label')}
        icon={MessageSquareWarning}
        paint="lilac"
        onClick={() => setOpen(true)}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          title={t('report.label')}
          footer={
            <Button size="lg" className="w-full" disabled={text.trim() === ''} onClick={send}>
              {t('report.send')}
            </Button>
          }
        >
          <label htmlFor={id} className="text-sm text-muted-foreground">
            {t('report.what')}
          </label>
          <Textarea
            id={id}
            value={text}
            maxLength={REPORT_MAX}
            rows={5}
            onChange={(event) => setText(event.target.value)}
            className="min-h-32 rounded-control bg-card px-3.5 py-3 text-base md:text-base"
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
