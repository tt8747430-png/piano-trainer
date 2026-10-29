import { Bell, Music, Piano, Plus, Settings, SunMoon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ButtonLink,
  ChoiceChips,
  ChoiceRow,
  Dropdown,
  ProgressMeter,
  ProgressRing,
  RoundButton,
  RowButton,
  Segmented,
  SettingsGroup,
  SwitchRow,
  TileMark,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

/** A kind of component, its examples on one card. */
function Kind({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SettingsGroup title={title}>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </SettingsGroup>
  )
}

/**
 * The Admin area's Components (the kit's gallery, as memory-palaces' kitchen sink): every piece the
 * screens are built from, by kind, in its states, so a change to one is seen once for all.
 */
export function ComponentsTab() {
  const { t } = useTranslation('admin')
  const [choice, setChoice] = useState<'one' | 'two' | 'three'>('one')
  const [on, setOn] = useState(true)
  const options = (['one', 'two', 'three'] as const).map((value) => ({
    value,
    label: t(`components.options.${value}`),
  }))
  return (
    <div className="flex max-w-3xl flex-col gap-7">
      <Kind title={t('components.actions')}>
        <Button>{t('components.primary')}</Button>
        <Button variant="outline">{t('components.secondary')}</Button>
        <Button variant="soft">{t('components.soft')}</Button>
        <Button variant="ghost">{t('components.quiet')}</Button>
        <Button variant="destructive">{t('components.danger')}</Button>
        <Button disabled>{t('components.disabled')}</Button>
        <RoundButton label={t('components.round')} icon={Settings} />
        <RoundButton label={t('components.add')} icon={Plus} />
        <ButtonLink variant="link" href="#components">
          {t('components.link')}
        </ButtonLink>
      </Kind>
      <SettingsGroup title={t('components.rows')} flush>
        <RowButton
          title={t('components.rowTitle')}
          detail={t('components.rowDetail')}
          icon={Music}
          paint="sand"
          onClick={() => undefined}
        />
        <ChoiceRow title={t('components.choiceRow')} icon={SunMoon} paint="sky">
          <Dropdown
            label={t('components.choiceRow')}
            bare
            align="end"
            value={choice}
            options={options}
            onChange={setChoice}
          />
        </ChoiceRow>
        <SwitchRow
          icon={<TileMark icon={Bell} paint="grass" />}
          label={t('components.switchRow')}
          checked={on}
          onCheckedChange={setOn}
          className="border-0 pr-3 pl-2 font-semibold"
        />
      </SettingsGroup>
      <Kind title={t('components.choices')}>
        <Segmented
          label={t('components.segmented')}
          value={choice}
          options={options}
          onChange={setChoice}
        />
        <ChoiceChips
          label={t('components.chips')}
          value={choice}
          options={options}
          onChange={setChoice}
        />
        <Dropdown
          label={t('components.dropdown')}
          value={choice}
          options={options}
          onChange={setChoice}
        />
      </Kind>
      <Kind title={t('components.progress')}>
        <div className="w-64">
          <ProgressMeter
            done={3}
            total={8}
            count={t('components.count', { done: 3, total: 8 })}
            said={t('components.count', { done: 3, total: 8 })}
          />
        </div>
        <ProgressRing share={0.6}>
          <Piano aria-hidden className="size-5" />
        </ProgressRing>
      </Kind>
      <Kind title={t('components.feedback')}>
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyTitle>{t('components.empty')}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button>{t('components.primary')}</Button>
          </EmptyContent>
        </Empty>
      </Kind>
    </div>
  )
}
