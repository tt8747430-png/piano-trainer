import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName, useScaleName } from '@/shared/i18n'
import { IN_PLACE } from '@/shared/lib'
import {
  degreeNames,
  keyScale,
  modesOfKey,
  noteName,
  noteParam,
  parallelKey,
  relativeKey,
  signatureNotes,
  spellScale,
  type Key,
} from '@/shared/lib/music'
import { ButtonLink, Fact } from '@/shared/ui'
import { DegreeList } from './DegreeList'

/** Another key, as a link that changes the scale to its scale in place, keeping the view's other choices. */
function KeyLink({ value, name }: { value: Key; name: string }) {
  return (
    <ButtonLink
      variant="link"
      className="px-0"
      render={
        <Link
          from="/practice/scales"
          to="/practice/scales"
          search={(prev) => ({ ...prev, root: noteParam(value.tonic), kind: keyScale(value) })}
          {...IN_PLACE}
        />
      }
    >
      {name}
    </ButtonLink>
  )
}

/**
 * A key's signature and notes (each degree named by its function), its relative and its parallel
 * (shown as keys too) and the modes that share its notes
 * (each as a scale). Every link changes the scale in place, keeping the view's other choices: a mode
 * has no Key view, so its page opens on its run.
 */
export function KeyFacts({ value }: { value: Key }) {
  const { t } = useTranslation('practice')
  const scaleName = useScaleName()
  const keyName = useKeyName()
  const signature = signatureNotes(value)
  const relative = relativeKey(value)
  const parallel = parallelKey(value)
  const names = degreeNames(keyScale(value))
  const notes = spellScale(value.tonic, keyScale(value))
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('scales.key.signature')}>
        {signature.length === 0 ? t('scales.key.noSignature') : signature.map(noteName).join(' ')}
      </Fact>
      <Fact term={t('scales.key.notes')}>
        <DegreeList
          items={notes.map((tone, at) => ({ top: noteName(tone.note), name: names?.[at] }))}
        />
      </Fact>
      <Fact term={t('scales.facts.relative')}>
        <KeyLink value={relative} name={keyName(relative)} />
      </Fact>
      <Fact term={t('scales.facts.parallel')}>
        <KeyLink value={parallel} name={keyName(parallel)} />
      </Fact>
      <Fact term={t('scales.key.modes')}>
        <span className="flex flex-wrap gap-x-4">
          {modesOfKey(value).map(({ root, kind }) => (
            <ButtonLink
              key={kind}
              variant="link"
              className="px-0"
              render={
                <Link
                  from="/practice/scales"
                  to="/practice/scales"
                  search={(prev) => ({ ...prev, root: noteParam(root), kind })}
                  {...IN_PLACE}
                />
              }
            >
              {scaleName(root, kind)}
            </ButtonLink>
          ))}
        </span>
      </Fact>
    </dl>
  )
}
