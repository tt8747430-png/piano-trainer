import { createCn } from 'cn/config'

/**
 * Joins class names and resolves conflicting Tailwind utilities (the later wins). shadcn
 * primitives import the same `cn` package. A custom theme name its default tables do not know
 * (a new text size, radius or shadow) is registered here: an unknown radius keeps both classes and
 * the stylesheet's order decides, and an unknown text size is taken for a colour and dropped beside
 * one. The app's corners and text sizes (`theme.css`) are, so `rounded-control` on a kit button
 * overrides its variant's own corner and `text-footnote` holds beside `text-muted-foreground`.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      rounded: [
        {
          rounded: [
            'control',
            'card',
            'sheet',
            'menu',
            'pill',
            'keys',
            'key-black',
            'key-white',
            'thumb',
            'tile',
            'mark',
          ],
        },
      ],
      // The app's text sizes: unregistered, `text-footnote` reads as a colour and is dropped beside
      // `text-muted-foreground`, so the text falls back to 16.
      'font-size': [{ text: ['footnote', 'subhead', 'place', 'name'] }],
    },
  },
})
