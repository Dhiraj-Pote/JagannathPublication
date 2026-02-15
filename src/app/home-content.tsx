'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { PageTransition } from '@/components/page-transition';
import { BookCard } from '@/components/book-card';
import { Input } from '@/components/ui/input';
import { quotes } from '@/data/quotes';
import type { Book } from '@/lib/types';

interface HomeContentProps {
  books: Book[];
}

export function HomeContent({ books }: HomeContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentQuote = quotes[quoteIndex];

  const goToPrevQuote = () => {
    setQuoteIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  const goToNextQuote = () => {
    setQuoteIndex((prev) => (prev === quotes.length - 1 ? 0 : prev + 1));
  };

  return (
    <PageTransition>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-right-top bg-no-repeat opacity-60" style={{ backgroundImage: "url('/images/banner.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream/70" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-20 lg:px-8 lg:py-36">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="font-serif text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-6xl"
            >
              <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">
                Jagannath
              </span>{' '}
              Publications
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
              className="mt-3 max-w-lg font-serif text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
            >
              Explore the transcendental teachings of{' '}
              <span className="font-semibold text-saffron">Sri Srimad Gour Govinda Swami Maharaj</span>{' '}
              through his sacred books
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
              className="mt-4 flex items-center gap-3 sm:mt-8"
            >
              <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-saffron to-gold/40 sm:w-16" />
              <Sparkles className="size-3.5 text-gold sm:size-5" />
              <div className="h-0.5 w-10 rounded-full bg-gradient-to-l from-saffron to-gold/40 sm:w-16" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
              className="mt-5 sm:mt-10"
            >
              <a
                href="#featured-books"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron to-gold px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-saffron/20 transition-all duration-300 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base"
              >
                Browse Collection
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Books Section with Search */}
      <section id="featured-books" className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-4 sm:mb-12"
        >
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-4 sm:size-5" />
            <Input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-full border-saffron/20 bg-white pl-10 pr-4 text-sm shadow-sm transition-shadow focus:border-saffron focus:shadow-md focus:shadow-saffron/10 sm:h-12 sm:pl-12 sm:text-base"
            />
          </div>
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No books found matching &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </section>

      {/* Quote of the Day */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl border border-saffron/15 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF5E6] p-6 shadow-sm sm:p-10"
        >
          {/* Decorative top accent */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-saffron via-gold to-saffron-light" />

          {/* Decorative quote marks */}
          <div className="absolute right-4 top-4 font-serif text-6xl leading-none text-saffron/10 sm:right-8 sm:top-6 sm:text-8xl">
            &ldquo;
          </div>

          <div className="relative">
            {/* Top: avatar + label centered */}
            <div className="mb-5 flex flex-col items-center gap-2 sm:mb-6">
              <div className="relative size-10 overflow-hidden rounded-full border-2 border-saffron/30 sm:size-12">
                <Image
                  src="/images/maharaj-face.jpg"
                  alt="Śrīla Gour Govinda Swami Mahārāja"
                  fill
                  className="object-cover object-top"
                  sizes="48px"
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-saffron/70 sm:text-xs">
                  Quote of the Day
                </p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Śrīla Gour Govinda Swami Mahārāja
                </p>
              </div>
            </div>

            {/* Quote — horizontal slide animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="text-center"
              >
                <blockquote className="mx-auto max-w-xl">
                  <p className="font-serif text-base font-medium leading-relaxed text-foreground/85 sm:text-lg md:text-xl">
                    &ldquo;{currentQuote.text}&rdquo;
                  </p>
                </blockquote>

                <p className="mt-3 text-[10px] italic text-muted-foreground sm:mt-4 sm:text-xs">
                  — {currentQuote.source}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-center gap-4 sm:mt-8">
              <button
                onClick={goToPrevQuote}
                className="flex size-8 items-center justify-center rounded-full border border-saffron/20 text-saffron/60 transition-colors active:bg-saffron/10 sm:size-9"
                aria-label="Previous quote"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[10px] tabular-nums text-muted-foreground sm:text-xs">
                {quoteIndex + 1} of {quotes.length}
              </span>
              <button
                onClick={goToNextQuote}
                className="flex size-8 items-center justify-center rounded-full border border-saffron/20 text-saffron/60 transition-colors active:bg-saffron/10 sm:size-9"
                aria-label="Next quote"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
