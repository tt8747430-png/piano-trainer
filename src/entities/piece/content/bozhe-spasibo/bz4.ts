import { defineListing } from '../../model/types'

export default defineListing({
  id: 'bz4',
  title: 'Как лань желает',
  titleEn: 'As the deer longs (Psalm 42)',
  credits: [{ role: 'authors', names: 'Ю. Пастернак' }],
  source: { book: 'bozhe-spasibo', number: 4, page: 14 },
  key: 'Cm',
  meter: '3/4',
  note: {
    en: 'The score has finger numbers for both hands.',
    ru: 'В нотах есть аппликатура для обеих рук.',
  },
})
