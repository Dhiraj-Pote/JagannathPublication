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
];

/** Find a book by its ID */
export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

/** Get all books */
export function getAllBooks(): Book[] {
  return books;
}
