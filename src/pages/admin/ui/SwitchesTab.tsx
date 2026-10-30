import { Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeatureSwitch, Group, SwitchState } from '@/shared/api/admin'
import { useAdmin } from '@/shared/lib/admin'
import { FormField, InfoTip, RoundButton, Segmented } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'
import { useLoaded } from '../model/use-loaded'
import { useChangeProblem } from '../model/use-change-problem'
import { FailureLine, LoadedState } from './LoadedState'

const STATES = ['everyone', 'nobody', 'groups'] as const satisfies readonly SwitchState[]
const KEY = /^[a-z][a-z0-9-]{1,40}$/

/**
 * Feature switches: each on for everyone, no one or chosen groups; added by key and label, deleted
 * once asked.
 */
export function SwitchesTab() {
  const { t } = useTranslation('admin')
  const admin = useAdmin()
  const [key, setKey] = useState('')
  const [label, setLabel] = useState('')
  const [deleting, setDeleting] = useState<FeatureSwitch | null>(null)
  const load = useCallback(async () => {
    const [switches, groups] = await Promise.all([admin.switches(), admin.groups()])
    if (!switches.ok) return switches
    if (!groups.ok) return groups
    return { ok: true as const, value: { switches: switches.value, groups: groups.value } }
  }, [admin])
  const { loaded, reload } = useLoaded(load)
  const { problem, after } = useChangeProblem(reload)
  const save = (feature: FeatureSwitch) => void admin.saveSwitch(feature).then(after)
  const keyWrong = key !== '' && !KEY.test(key)
  return (
    <div className="flex flex-col gap-4">
      <h2 className="flex items-center gap-1 px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('switches.new')}
        <InfoTip name={t('tabs.switches')}>{t('switches.info')}</InfoTip>
      </h2>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          if (!KEY.test(key) || !label.trim()) return
          save({ key, label: label.trim(), state: 'nobody', groups: [] })
          setKey('')
          setLabel('')
        }}
      >
        <FormField
          className="sm:w-48"
          label={t('switches.key')}
          value={key}
          autoCapitalize="none"
          onChange={(event) => setKey(event.target.value)}
          error={keyWrong ? t('switches.invalidKey') : undefined}
        />
        <FormField
          className="min-w-0 flex-1"
          label={t('switches.label')}
          value={label}
          maxLength={120}
          onChange={(event) => setLabel(event.target.value)}
        />
        <Button type="submit" size="lg" disabled={!KEY.test(key) || !label.trim()}>
          {t('switches.add')}
        </Button>
      </form>
      {problem ? <FailureLine reason={problem} /> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {({ switches, groups }) =>
          switches.length === 0 ? (
            <p className="text-muted-foreground">{t('switches.none')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {switches.map((feature) => (
                <li key={feature.key} className="flex flex-col gap-3 card p-4">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{feature.label}</p>
                      <p className="truncate font-mono text-sm text-muted-foreground">
                        {feature.key}
                      </p>
                    </div>
                    <RoundButton
                      label={t('switches.delete')}
                      icon={Trash2}
                      onClick={() => setDeleting(feature)}
                    />
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
                    <SwitchGroups feature={feature} groups={groups} onChange={save} />
                  ) : null}
                </li>
              ))}
            </ul>
          )
        }
      </LoadedState>
      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('switches.deleteTitle', { label: deleting?.label ?? '' })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t('switches.deleteBody')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('switches.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) void admin.deleteSwitch(deleting.key).then(after)
                setDeleting(null)
              }}
            >
              {t('switches.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/** The groups a switch is on for, each with its own switch. */
function SwitchGroups({
  feature,
  groups,
  onChange,
}: {
  feature: FeatureSwitch
  groups: readonly Group[]
  onChange: (feature: FeatureSwitch) => void
}) {
  const { t } = useTranslation('admin')
  return (
    <fieldset className="flex flex-col">
      <legend className="text-sm text-muted-foreground">{t('switches.groups')}</legend>
      {groups.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t('switches.noGroups')}</p>
      ) : null}
      {groups.map((group) => (
        <label key={group.id} className="flex min-h-11 items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm">{group.name}</span>
          <Switch
            checked={feature.groups.includes(group.id)}
            onCheckedChange={(on) =>
              onChange({
                ...feature,
                groups: on
                  ? [...feature.groups, group.id]
                  : feature.groups.filter((id) => id !== group.id),
              })
            }
          />
        </label>
      ))}
    </fieldset>
  )
}
