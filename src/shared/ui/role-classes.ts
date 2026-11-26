import type { ChordRole } from '@/shared/lib/music'

/** Complete class strings per chord role, so Tailwind sees every one (CODE_STYLE §4). */
export const ROLE_BG: Readonly<Record<ChordRole, string>> = {
  root: 'bg-role-root',
  '3rd': 'bg-role-3rd',
  '5th': 'bg-role-5th',
  '7th': 'bg-role-7th',
  '9th': 'bg-role-9th',
  '11th': 'bg-role-11th',
  '13th': 'bg-role-13th',
}
