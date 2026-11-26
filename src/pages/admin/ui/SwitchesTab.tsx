import { Flag, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeatureSwitch, Group, SwitchState } from '@/shared/api/admin'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { useAdmin } from '@/shared/lib/admin'
import {
  Fab,
  FloatingActions,
  NewSheet,
  Said,
  Segmented,
  SettingsGroup,
  SheetPart,
  ToggleChips,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { SettingsScreen } from '@/widgets/settings-screen'
import { useChangeProblem } from '../model/use-change-problem'
import { useLoaded } from '@/shared/lib'
import { FailureLine, LoadedState } from './LoadedState'

const STATES = ['everyone', 'nobody', 'groups'] as const satisfies readonly SwitchState[]
const KEY = /^[a-z][a-z0-9-]{1,40}$/

/** A flag's key from what it turns on: "Hands at the keys, 3D" is `hands-at-the-keys-3d`. */
const slug = (words: string) =>
  words
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 41)

/**
 * Administration › Feature flags (the Admin board): one card of flags, each what it turns on and its
 * key, Enabled for Everyone · No one · Groups, and with Groups the groups as chips that toggle; New
 * flag floats at the foot on a phone and stands in the pane's row on a laptop, opening a New sheet:
 * what it turns on, and its key, made from those words until it is typed.
 */
export function SwitchesTab() {
  const { t } = useTranslation('admin')
  const admin = useAdmin()
  const laptop = useMediaQuery(LAPTOP)
  const load = useCallback(async () => {
    const [switches, groups] = await Promise.all([admin.switches(), admin.groups()])
    if (!switches.ok) return switches
    if (!groups.ok) return groups
    return { ok: true as const, value: { switches: switches.value, groups: groups.value } }
  }, [admin])
  const { loaded, reload } = useLoaded(load)
  const { problem, after } = useChangeProblem(reload)
  const save = (feature: FeatureSwitch) => void admin.saveSwitch(feature).then(after)
  const [naming, setNaming] = useState<string | null>(null)
  const [typedKey, setTypedKey] = useState<string | null>(null)
  const label = (naming ?? '').trim()
  const key = typedKey ?? slug(label)
  const open = () => {
    setNaming('')
    setTypedKey(null)
  }
  const create = () => {
    if (!label || !KEY.test(key)) return
    void admin.saveSwitch({ key, label, state: 'nobody', groups: [] }).then((result) => {
      if (result.ok) setNaming(null)
      after(result)
    })
  }
  return (
    <SettingsScreen
      title={t('sections.flags')}
      actions={laptop ? <Button onClick={open}>{t('switches.new')}</Button> : null}
    >
      {laptop ? null : (
        <FloatingActions>
          <Fab label={t('switches.new')} icon={Plus} onClick={open} />
        </FloatingActions>
      )}
      {problem ? <FailureLine reason={problem} /> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {({ switches, groups }) =>
          switches.length === 0 ? (
            <Said
              icon={Flag}
              title={t('switches.none')}
              primary
              action={<Button onClick={open}>{t('switches.new')}</Button>}
            />
          ) : (
            <SettingsGroup flush>
              {switches.map((feature) => (
                <div key={feature.key} className="flex flex-col gap-3 py-3 ps-4 pe-3">
                  <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
                    <span className="truncate font-semibold">{feature.label}</span>
                    <span className="truncate font-mono text-footnote text-muted-foreground">
                      {feature.key}
                    </span>
                  </div>
                  <Segmented
                    label={`${t('switches.state')}: ${feature.label}`}
                    value={feature.state}
                    options={STATES.map((state) => ({
                      value: state,
                      label: t(`switches.states.${state}`),
                    }))}
                    onChange={(state) => save({ ...feature, state })}
                  />
                  {feature.state === 'groups' ? (
                    <GroupChips feature={feature} groups={groups} onChange={save} />
                  ) : null}
                </div>
              ))}
            </SettingsGroup>
          )
        }
      </LoadedState>
      <NewSheet
        open={naming !== null}
        onOpenChange={(next) => (next ? open() : setNaming(null))}
        title={t('switches.new')}
        nameLabel={t('switches.turnsOn')}
        name={naming ?? ''}
        maxLength={120}
        onName={setNaming}
        createLabel={t('switches.create')}
        onCreate={create}
      >
        <SheetPart title={t('switches.key')}>
          <Input
            aria-label={t('switches.key')}
            value={key}
            autoCapitalize="none"
            spellCheck={false}
            className="font-mono"
            aria-invalid={key !== '' && !KEY.test(key)}
            onChange={(event) => setTypedKey(event.target.value)}
          />
          {key !== '' && !KEY.test(key) ? (
            <p className="text-sm text-destructive">{t('switches.invalidKey')}</p>
          ) : null}
        </SheetPart>
      </NewSheet>
    </SettingsScreen>
  )
}

/** The groups a flag is on for, as the kit's toggle chips, a tap toggling each. */
function GroupChips({
  feature,
  groups,
  onChange,
}: {
  feature: FeatureSwitch
  groups: readonly Group[]
  onChange: (feature: FeatureSwitch) => void
}) {
  const { t } = useTranslation('admin')
  if (groups.length === 0)
    return <p className="text-sm text-muted-foreground">{t('switches.noGroups')}</p>
  return (
    <ToggleChips
      label={t('switches.groups')}
      value={feature.groups}
      options={groups.map((group) => ({ value: group.id, label: group.name }))}
      onChange={(ids) => onChange({ ...feature, groups: ids })}
    />
  )
}
