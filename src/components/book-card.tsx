'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
}

function formatPrice(priceInPaise: number): string {
  return `₹${(priceInPaise / 100).toFixed(2)}`;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`} className="block">
      <motion.article
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm active:shadow-md sm:rounded-xl"
      >
        {/* Book Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
          <Image
            src={book.image_path}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

        </div>

        {/* Book Info */}
        <div className="p-2 sm:p-3">
          <h3 className="font-serif text-xs font-semibold leading-snug tracking-tight text-foreground line-clamp-2 sm:text-sm">
            {book.title}
          </h3>
          <div className="mt-1.5 flex items-center justify-between sm:mt-2">
            <span className="text-sm font-bold text-saffron sm:text-base">{formatPrice(book.price)}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-saffron via-gold to-saffron-light transition-transform duration-300 group-hover:scale-x-100" />
      </motion.article>
    </Link>
  );
}
