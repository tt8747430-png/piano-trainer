import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName, useScaleName } from '@/shared/i18n'
import { IN_PLACE } from '@/shared/lib'
import {
  keyScale,
  modesOfKey,
  noteName,
  noteParam,
  relativeKey,
  signatureNotes,
  spellScale,
  type Key,
} from '@/shared/lib/music'
import { ButtonLink, Fact } from '@/shared/ui'

/** A key's signature and notes, its relative (shown as a key too) and the modes that share its notes (each as a scale). */
export function KeyFacts({ value }: { value: Key }) {
  const { t } = useTranslation('practice')
  const scaleName = useScaleName()
  const keyName = useKeyName()
  const signature = signatureNotes(value)
  const relative = relativeKey(value)
  const notes = spellScale(value.tonic, keyScale(value))
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('scales.key.signature')}>
        {signature.length === 0 ? t('scales.key.noSignature') : signature.map(noteName).join(' ')}
      </Fact>
      <Fact term={t('scales.key.notes')}>{notes.map((tone) => noteName(tone.note)).join(' ')}</Fact>
      <Fact term={t('scales.facts.relative')}>
        <ButtonLink
          variant="link"
          className="px-0"
          render={
            <Link
              from="/practice/scales"
              to="/practice/scales"
              search={(prev) => ({
                ...prev,
                root: noteParam(relative.tonic),
                kind: keyScale(relative),
              })}
              {...IN_PLACE}
            />
          }
        >
          {keyName(relative)}
        </ButtonLink>
      </Fact>
      <Fact term={t('scales.key.modes')}>
        <span className="flex flex-wrap gap-x-4">
          {modesOfKey(value).map(({ root, kind }) => (
            <ButtonLink
              key={kind}
              variant="link"
              className="px-0"
              render={<Link to="/practice/scales" search={{ root: noteParam(root), kind }} />}
            >
              {scaleName(root, kind)}
            </ButtonLink>
          ))}
        </span>
      </Fact>
    </dl>
  )
}
