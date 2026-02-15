'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Package, ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { PageTransition } from '@/components/page-transition';
import { PincodeChecker } from '@/components/pincode-checker';
import { Button } from '@/components/ui/button';
import type { Book } from '@/lib/types';

interface BookDetailContentProps {
  book: Book;
}

function formatPrice(priceInPaise: number): string {
  return `₹${(priceInPaise / 100).toFixed(2)}`;
}

export function BookDetailContent({ book }: BookDetailContentProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(book);
  };

  const handleBuyNow = () => {
    addItem(book);
    router.push('/checkout');
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Back Navigation */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors active:text-saffron sm:mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Collection
        </Link>

        {/* Main Content — stacked on mobile, side-by-side on desktop */}
        <div className="mt-2 grid grid-cols-1 gap-5 sm:mt-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Book Image — smaller on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-[280px] sm:max-w-none"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-secondary shadow-lg sm:rounded-2xl">
              <Image
                src={book.image_path}
                alt={book.title}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-saffron/10 via-gold/5 to-cream">
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-saffron/10 sm:size-20">
                    <BookOpen className="size-8 text-saffron/60 sm:size-10" />
                  </div>
                  <span className="font-serif text-sm font-medium text-foreground/40 sm:text-lg">
                    {book.title}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col"
          >
            {/* Badge + Title */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-saffron/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-saffron sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                <Sparkles className="size-2.5 sm:size-3" />
                Spiritual Literature
              </span>
              <h1 className="mt-3 font-serif text-xl font-bold leading-tight tracking-tight text-foreground sm:mt-4 sm:text-3xl lg:text-5xl">
                {book.title}
              </h1>
            </div>

            {/* Price */}
            <div className="mb-4 flex items-baseline gap-2 sm:mb-6">
              <span className="text-2xl font-bold text-saffron sm:text-4xl">
                {formatPrice(book.price)}
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">Inclusive of all taxes</span>
            </div>

            <div className="mb-4 h-px w-full bg-gradient-to-r from-saffron/30 via-gold/20 to-transparent sm:mb-6" />

            {/* Description */}
            <div className="mb-5 sm:mb-8">
              <h2 className="mb-2 font-serif text-base font-semibold text-foreground sm:mb-3 sm:text-lg">
                About This Book
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{book.description}</p>
            </div>

            {/* Shipping Info */}
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3 sm:mb-8 sm:rounded-xl sm:p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-saffron/10 sm:size-10">
                <Package className="size-4 text-saffron sm:size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground sm:text-sm">Free Shipping Available</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Check delivery estimate for your pincode below
                </p>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="mb-5 rounded-lg border border-border bg-secondary/30 p-3 sm:mb-8 sm:rounded-xl sm:p-4">
              <p className="mb-2 text-xs font-medium text-foreground sm:mb-3 sm:text-sm">
                📍 Check Delivery Availability
              </p>
              <PincodeChecker />
            </div>

            {/* Action Buttons — full width stacked on mobile */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="w-full border-gold/30 py-3 text-foreground active:bg-gold/10 sm:flex-1"
              >
                <ShoppingCart className="size-5" />
                Add to Cart
              </Button>

              <Button
                onClick={handleBuyNow}
                size="lg"
                className="w-full bg-gradient-to-r from-saffron to-saffron-dark py-3 text-white shadow-md shadow-saffron/20 active:from-saffron-dark sm:flex-1"
              >
                <Zap className="size-5" />
                Buy Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
