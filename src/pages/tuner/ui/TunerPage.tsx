import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ToolPage } from '@/widgets/tool-page'
import { TunerReadout } from '@/widgets/tuner'

/**
 * The Tuner (R29 B11), a tool of its own on the tools' layout: B8's tuner large, listening while the
 * page is open: the note heard, the needle, its frequency. Its A4 is its Settings page's, off the gear.
 */
export function TunerPage() {
  const { t } = useTranslation('practice')
  return (
    <ToolPage title={t('pages.tuner')} settings={<Link to="/practice/tuner/settings" />}>
      <TunerReadout listening large />
    </ToolPage>
  )
}
