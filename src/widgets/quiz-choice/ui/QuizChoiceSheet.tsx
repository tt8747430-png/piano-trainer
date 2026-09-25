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
import type { QuizMode } from '@/features/quiz'
import { setQuizFamilies, setQuizScales } from '@/features/set-preference'
import { CHORD_FAMILIES, SCALE_KINDS } from '@/shared/lib/music'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'

const toggled = <T,>(list: readonly T[], item: T, on: boolean): T[] =>
  on ? [...list, item] : list.filter((x) => x !== item)

/** What a mode asks from: chord families for building or naming chords, scales for Build scale. */
const asksFrom = (mode: QuizMode, choice: QuizChoice): readonly unknown[] =>
  mode === 'build-scale' ? choice.scales : choice.families

/** Which chord families and scales the open-ended quiz asks: switches, then Apply. */
export function QuizChoiceSheet({ mode }: { mode: QuizMode }) {
  const { t } = useTranslation(['quiz', 'theory', 'common'])
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
  const row = (label: string, checked: boolean, onChange: (on: boolean) => void) => (
    <label
      key={label}
      className="flex min-h-13 items-center justify-between gap-4 border-b border-border text-lg"
    >
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )

  return (
    <Sheet open={open} onOpenChange={openWith}>
      <SheetTrigger render={<Button variant="soft" />}>
        <SlidersHorizontal data-icon="inline-start" />
        {t('quiz:choice.open')}
      </SheetTrigger>
      <SheetContent
        title={t('quiz:choice.open')}
        footer={
          <Button size="pill" onClick={apply} disabled={asksFrom(mode, draft).length === 0}>
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
        {CHORD_FAMILIES.map((family) =>
          row(t(`theory:family.${family}`), draft.families.includes(family), (on) =>
            setDraft((d) => ({ ...d, families: toggled(d.families, family, on) })),
          ),
        )}
        <h3 className="pt-4 text-sm font-semibold text-muted-foreground">
          {t('quiz:choice.scales')}
        </h3>
        {SCALE_KINDS.map((kind) =>
          row(t(`theory:scaleKind.${kind}`), draft.scales.includes(kind), (on) =>
            setDraft((d) => ({ ...d, scales: toggled(d.scales, kind, on) })),
          ),
        )}
        <SheetClose className="sr-only">{t('common:close')}</SheetClose>
      </SheetContent>
    </Sheet>
  )
}
