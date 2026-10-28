import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { IN_PLACE } from '@/shared/lib'
import {
  enharmonicKey,
  keyScale,
  keySymbol,
  modesOfKey,
  neighbourKeys,
  parallelKey,
  noteName,
  noteParam,
  relativeKey,
  signatureNotes,
  spellScale,
  type Key,
} from '@/shared/lib/music'
import { ButtonLink, Fact } from '@/shared/ui'
import { KeyLink } from './KeyLink'

/**
 * A key's signature and notes; its relative and parallel keys, its other spelling where the circle's
 * ends meet, and the keys beside it on the circle (each shown as a key too); and the modes that share
 * its notes (each as a scale). Every link changes the scale in place, keeping the view's other choices: a mode
 * has no Key view, so its page opens on its run.
 */
export function KeyFacts({ value }: { value: Key }) {
  const { t } = useTranslation('practice')
  const scaleName = useScaleName()
  const signature = signatureNotes(value)
  const relative = relativeKey(value)
  const enharmonic = enharmonicKey(value)
  const notes = spellScale(value.tonic, keyScale(value))
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('scales.key.signature')}>
        {signature.length === 0 ? t('scales.key.noSignature') : signature.map(noteName).join(' ')}
      </Fact>
      <Fact term={t('scales.key.notes')}>{notes.map((tone) => noteName(tone.note)).join(' ')}</Fact>
      <Fact term={t('scales.facts.relative')}>
        <KeyLink value={relative} />
      </Fact>
      <Fact term={t('scales.key.parallel')}>
        <KeyLink value={parallelKey(value)} />
      </Fact>
      {enharmonic ? (
        <Fact term={t('scales.key.enharmonic')}>
          <KeyLink value={enharmonic} />
        </Fact>
      ) : null}
      <Fact term={t('scales.key.neighbours')}>
        <span className="flex flex-wrap gap-x-4">
          {neighbourKeys(value).map((each) => (
            <KeyLink key={keySymbol(each)} value={each} />
          ))}
        </span>
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
