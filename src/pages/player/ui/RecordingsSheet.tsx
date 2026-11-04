import { Circle, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { useLocale } from '@/shared/i18n'
import { RowButton, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { PlayerTakes } from '../model/use-player-takes'

/**
 * My recordings (R29 B8), from the foot bar's Recordings and the Tools sheet: the Recorder's Record
 * (Stop while a take records; it records from a connected piano, from the bar the cursor is in),
 * then the song's takes, the newest first, each opening its feedback on the score.
 */
export function RecordingsSheet({
  takes,
  piano,
  open,
  onOpenChange,
}: {
  takes: PlayerTakes
  /** Whether a MIDI keyboard is connected: a take records from it alone. */
  piano: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const recording = takes.stage !== 'idle'
  const made = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  const name = (take: Take) => take.name ?? made.format(take.made)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('recordings.title')}>
        <div className="flex flex-col gap-4">
          <Button
            variant={recording ? 'secondary' : 'default'}
            disabled={!piano && !recording}
            onClick={() => {
              if (recording) takes.stop()
              else {
                takes.record()
                onOpenChange(false)
              }
            }}
          >
            {recording ? <Square data-icon="inline-start" /> : <Circle data-icon="inline-start" />}
            {recording ? t('recordings.stop') : t('recordings.record')}
          </Button>
          {!piano && !recording ? (
            <p className="text-sm text-muted-foreground">{t('recordings.needsPiano')}</p>
          ) : null}
          {takes.list.length === 0 ? (
            <p className="text-muted-foreground">{t('recordings.none')}</p>
          ) : (
            <ul aria-label={t('recordings.title')} className="flex flex-col gap-1">
              {takes.list.map((take) => (
                <li key={take.id}>
                  <RowButton
                    title={name(take)}
                    detail={t('recordings.fromBar', { bar: take.fromBar })}
                    current={takes.shown?.id === take.id}
                    onClick={() => {
                      takes.show(take.id)
                      onOpenChange(false)
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
