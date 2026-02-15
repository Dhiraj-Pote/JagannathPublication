import type { Book } from '@/lib/types';

/**
 * Central book catalog — single source of truth.
 * Add new books here and they'll appear everywhere on the site.
 * Prices are in paise (₹299.00 = 29900).
 */
export const books: Book[] = [
  {
    id: '1',
    title: 'How to Find Guru',
    description:
      'There are five essays: How to Find Guru – by Srila Bhaktisiddhanta Saraswati; Krishna will give you Guru – by Srila Prabhupada; How to Find a Sadhu, A Sadhu is Always Present, and Simplicity and Faith – by Srila Gour Govinda Swami.',
    price: 5900,
    image_path: '/images/guru-find.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Guru Tattva',
    description:
      "After many of his Godbrothers fell from their positions as sannyāsīs and gurus, Śrīla Gour Govinda Mahārāja presented this paper to the GBC members in 1989 for the sole purpose of establishing the absolute conception of (sad-) guru and to console Śrīla Prabhupāda's grand-disciples.",
    price: 7900,
    image_path: '/images/guru-tattva.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Solid Gold Guru-tattva',
    description:
      'A brilliant lecture on guru-tattva by Sri Srimad Gour Govinda Swami Maharaja.',
    price: 6000,
    image_path: '/images/Solid-gold-guru-tattva.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'After the Disappearance of Sri Guru',
    description:
      'This booklet is a collection of lecture excerpts and conversations given by Gour Govinda Swami on the topic of what a disciple should do after the disappearance of one\'s guru.',
    price: 4000,
    image_path: '/images/after-guru-disappear.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Only by the Mercy of Sadhu Guru',
    description:
      'A wonderful lecture by Srila Gour Govinda Swami, explaining the importance of the association of a pure devotee in attaining the goal of human life, Krsna-prema.',
    price: 6000,
    image_path: '/images/only-by-guru-mercy.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    title: 'The Formidable Foe',
    description:
      'A lecture by Sri Srimad Gour Govinda Swami Maharaj on the subject of conquering lust.',
    price: 5900,
    image_path: '/images/the-formidable-foe.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    title: 'Mayapura 1979',
    description:
      'This small book places us in Māyāpura 1979, just prior to the Gaura Purnima Festival of that year. In a room of a building on the ISKCON property, a sannyāsī, a disciple of Śrīla AC Bhaktivedanta Swami Prabhupāda, was in a deep trance, barely breathing; displaying many amazing transformations.',
    price: 4900,
    image_path: '/images/mayapura-1979.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    title: 'When Good Fortune Arises',
    description:
      'Unless one gets the mercy of a sādhu, a pure devotee, one cannot get kṛṣṇa-bhakti. This is the only way.',
    price: 29900,
    image_path: '/images/when-good-fortune-arises.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
];

/** Find a book by its ID */
export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

/** Get all books */
export function getAllBooks(): Book[] {
  return books;
}
