import AxeBuilder from '@axe-core/playwright'
import { test as base, expect, type Page } from '@playwright/test'
import { SETTINGS_VERSION } from '../src/entities/settings/model/store'

/** The app as a returning learner opens it: the welcome already seen. */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript((version) => {
      if (!localStorage.getItem('pt-settings'))
        localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version }))
    }, SETTINGS_VERSION)
    await provide(page)
  },
})

/** The page's serious and critical accessibility violations, by rule and where. */
export async function violations(page: Page) {
  const { violations: found } = await new AxeBuilder({ page }).analyze()
  return found
    .filter((each) => each.impact === 'serious' || each.impact === 'critical')
    .map((each) => ({
      rule: each.id,
      targets: each.nodes.slice(0, 3).map((node) => node.target.join(' ')),
    }))
}

export { expect }
