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
          {/* Fallback gradient */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-saffron/10 via-gold/5 to-cream">
            <div className="flex flex-col items-center gap-2 px-3 text-center sm:gap-3 sm:px-6">
              <div className="flex size-10 items-center justify-center rounded-full bg-saffron/10 sm:size-16">
                <svg className="size-5 text-saffron/60 sm:size-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <span className="font-serif text-xs font-medium text-foreground/40 sm:text-sm">{book.title}</span>
            </div>
          </div>
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
