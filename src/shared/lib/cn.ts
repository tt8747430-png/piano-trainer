import { createCn } from 'cn/config'

/**
 * Joins class names and resolves conflicting Tailwind utilities (the later wins). shadcn
 * primitives import the same `cn` package. A custom theme name its default tables do not know
 * (a new text size, radius or shadow) is registered here, or cn() keeps both classes and the
 * stylesheet's order decides: the app's corners (`theme.css`) are, so `rounded-control` on a
 * kit button overrides its variant's `rounded-full`.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      rounded: [{ rounded: ['control', 'card', 'sheet', 'pill', 'key-black', 'key-white'] }],
    },
  },
})
