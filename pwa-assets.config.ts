import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

/** The edge of the icon's charcoal ground, as in public/favicon.svg. */
const GROUND = '#1E1815'

/**
 * `npm run icons`: every PWA icon from public/favicon.svg. The tab's and a desktop install's icons
 * keep its rounded tile, since nothing else shapes them. The home screens cut their own shape, so
 * their icons fill the tile's corners with the ground and come square (Apple's guidance): Apple's
 * edge to edge, Android's maskable inset so the keys stay inside its safe circle.
 */
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      padding: 0.15,
      resizeOptions: { fit: 'contain', background: GROUND },
    },
    apple: {
      ...minimal2023Preset.apple,
      padding: 0,
      resizeOptions: { fit: 'contain', background: GROUND },
    },
  },
  images: ['public/favicon.svg'],
})
