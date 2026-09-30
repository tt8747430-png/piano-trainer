import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import {
  keyParam,
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

/** A key's signature and notes, its relative (a key page) and the modes that share its notes (in Scales). */
export function KeyFacts({ value }: { value: Key }) {
  const { t } = useTranslation('learn')
  const scaleName = useScaleName()
  const signature = signatureNotes(value)
  const relative = relativeKey(value)
  const notes = spellScale(value.tonic, keyScale(value))
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('keys.signature')}>
        {signature.length === 0 ? t('keys.noSignature') : signature.map(noteName).join(' ')}
      </Fact>
      <Fact term={t('keys.notes')}>{notes.map((tone) => noteName(tone.note)).join(' ')}</Fact>
      <Fact term={t('about.relative')}>
        <ButtonLink
          variant="link"
          className="px-0"
          render={
            <Link
              from="/learn/keys"
              to="/learn/keys"
              search={(prev) => ({ ...prev, key: keyParam(relative) })}
              replace
            />
          }
        >
          {t(relative.minor ? 'keys.minor' : 'keys.major', { tonic: noteName(relative.tonic) })}
        </ButtonLink>
      </Fact>
      <Fact term={t('keys.modes')}>
        <span className="flex flex-wrap gap-x-4">
          {modesOfKey(value).map(({ root, kind }) => (
            <ButtonLink
              key={kind}
              variant="link"
              className="px-0"
              render={<Link to="/learn/scales" search={{ root: noteParam(root), kind }} />}
            >
              {scaleName(root, kind)}
            </ButtonLink>
          ))}
        </span>
      </Fact>
    </dl>
  )
}
