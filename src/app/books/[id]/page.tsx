import { notFound } from 'next/navigation';
import { getBookById } from '@/data/books';
import { BookDetailContent } from './book-detail-content';

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  return <BookDetailContent book={book} />;
}
