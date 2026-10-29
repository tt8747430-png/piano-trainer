import {
  AllAppleDeviceNames,
  appleSplashScreenSizes,
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'
import { THEME_COLORS } from './src/shared/config/theme-colors'

/** The edge of the icon's charcoal ground, as in public/favicon.svg. */
const GROUND = '#1E1815'

/** Every iPhone screen size once: iOS shows its launch image (and else a white screen) only on a match. */
const IPHONES = AllAppleDeviceNames.filter((name) => name.startsWith('iPhone')).filter(
  (name, i, names) => {
    const { width, height } = appleSplashScreenSizes[name]
    return (
      names.findIndex((other) => {
        const size = appleSplashScreenSizes[other]
        return size.width === width && size.height === height
      }) === i
    )
  },
)

/**
 * `npm run icons`: every PWA icon from public/favicon.svg. The tab's and a desktop install's icons
 * keep its rounded tile, since nothing else shapes them. The home screens cut their own shape, so
 * their icons fill the tile's corners with the ground and come square (Apple's guidance): Apple's
 * edge to edge, Android's maskable inset so the keys stay inside its safe circle. The iPhone's launch
 * images: the icon on the app's own background, light and dark (`THEME_COLORS`), every iPhone size.
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
    appleSplashScreens: createAppleSplashScreens(
      {
        padding: 0.35,
        resizeOptions: { fit: 'contain', background: THEME_COLORS.light },
        darkResizeOptions: { fit: 'contain', background: THEME_COLORS.dark },
        linkMediaOptions: { log: true, addMediaScreen: true, basePath: '/', xhtml: false },
        png: { compressionLevel: 9, quality: 70 },
      },
      IPHONES,
    ),
  },
  images: ['public/favicon.svg'],
})
