import type { Book } from '@/lib/types';
import { HomeContent } from './home-content';
import { getAllBooks } from '@/data/books';

export default function Home() {
  const books = getAllBooks();
  return <HomeContent books={books} />;
}
