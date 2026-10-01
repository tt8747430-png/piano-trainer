import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_QUIZ_CHOICE,
  selectQuizChoice,
  useSettings,
  useSettingsStoreApi,
  type QuizChoice,
} from '@/entities/settings'
import { chosenSkills, type QuizMode } from '@/features/quiz'
import { setQuizFamilies, setQuizScales } from '@/features/set-preference'
import { toggled } from '@/shared/lib'
import { CHORD_FAMILIES, SCALE_KINDS } from '@/shared/lib/music'
import { Sheet, SheetClose, SheetContent, SheetTrigger, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Which chord families and scales the open-ended quiz asks: switches, then Apply. */
export function QuizChoiceSheet({ mode }: { mode: QuizMode }) {
  const { t } = useTranslation(['quiz', 'music', 'common'])
  const store = useSettingsStoreApi()
  const saved = useSettings(selectQuizChoice)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<QuizChoice>(saved)

  const openWith = (next: boolean) => {
    if (next) setDraft(saved)
    setOpen(next)
  }
  const apply = () => {
    setQuizFamilies(store, draft.families)
    setQuizScales(store, draft.scales)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={openWith}>
      <SheetTrigger render={<Button variant="soft" />}>
        <SlidersHorizontal data-icon="inline-start" />
        {t('quiz:choice.open')}
      </SheetTrigger>
      <SheetContent
        title={t('quiz:choice.open')}
        footer={
          <Button size="pill" onClick={apply} disabled={chosenSkills(mode, draft).length === 0}>
            {t('quiz:choice.apply')}
          </Button>
        }
      >
        <div className="flex gap-4 pb-2">
          <Button variant="link" className="px-0" onClick={() => setDraft(DEFAULT_QUIZ_CHOICE)}>
            {t('quiz:choice.common')}
          </Button>
          <Button
            variant="link"
            className="px-0"
            onClick={() => setDraft({ families: [], scales: [] })}
          >
            {t('quiz:choice.clear')}
          </Button>
        </div>
        <h3 className="pt-2 text-sm font-semibold text-muted-foreground">
          {t('quiz:choice.families')}
        </h3>
        {CHORD_FAMILIES.map((family) => (
          <SwitchRow
            key={family}
            label={t(`music:family.${family}`)}
            checked={draft.families.includes(family)}
            onCheckedChange={(on) =>
              setDraft((d) => ({ ...d, families: toggled(d.families, family, on) }))
            }
          />
        ))}
        <h3 className="pt-4 text-sm font-semibold text-muted-foreground">
          {t('quiz:choice.scales')}
        </h3>
        {SCALE_KINDS.map((kind) => (
          <SwitchRow
            key={kind}
            label={t(`music:scaleKind.${kind}`)}
            checked={draft.scales.includes(kind)}
            onCheckedChange={(on) =>
              setDraft((d) => ({ ...d, scales: toggled(d.scales, kind, on) }))
            }
          />
        ))}
        <SheetClose className="sr-only">{t('common:close')}</SheetClose>
      </SheetContent>
    </Sheet>
  )
}
