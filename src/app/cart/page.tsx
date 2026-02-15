'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, BookOpen } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { PageTransition } from '@/components/page-transition';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function formatPrice(priceInPaise: number): string {
  return `₹${(priceInPaise / 100).toFixed(2)}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-saffron/10 sm:size-24">
              <ShoppingBag className="size-10 text-saffron/60 sm:size-12" />
            </div>
            <h1 className="mt-5 font-serif text-xl font-semibold text-foreground sm:mt-6 sm:text-3xl">
              Your cart is empty
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground sm:mt-3 sm:text-base">
              Discover our collection of spiritual books by Sri Srimad Gour Govinda Swami Maharaj.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 bg-saffron text-white active:bg-saffron-dark sm:mt-8"
            >
              <Link href="/">
                <BookOpen className="size-5" />
                Browse Books
              </Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="font-serif text-xl font-semibold text-foreground sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Mobile: stacked layout. Desktop: sidebar */}
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.book.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="flex gap-3 py-4 sm:gap-6 sm:py-6">
                    {/* Book Image */}
                    <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-40 sm:w-28">
                      <Image
                        src={item.book.image_path}
                        alt={item.book.title}
                        fill
                        sizes="(max-width: 640px) 72px, 112px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-saffron/10 via-gold/5 to-cream">
                        <BookOpen className="size-6 text-saffron/40 sm:size-8" />
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/books/${item.book.id}`}
                          className="font-serif text-sm font-semibold text-foreground line-clamp-2 sm:text-lg"
                        >
                          {item.book.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                          {formatPrice(item.book.price)} each
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-2 sm:mt-3 sm:gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.book.title}`}
                            className="size-7 border-border active:bg-saffron/10 sm:size-6"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-7 text-center text-xs font-medium text-foreground sm:w-8 sm:text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.book.title}`}
                            className="size-7 border-border active:bg-saffron/10 sm:size-6"
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        {/* Remove */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.book.id)}
                          aria-label={`Remove ${item.book.title}`}
                          className="h-7 px-1.5 text-muted-foreground active:text-destructive sm:px-2"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>

                        {/* Subtotal */}
                        <span className="ml-auto text-sm font-bold text-saffron sm:text-lg">
                          {formatPrice(item.book.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary — sticky on desktop, bottom card on mobile */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:rounded-2xl">
              <h2 className="font-serif text-base font-semibold text-foreground sm:text-lg">
                Order Summary
              </h2>
              <Separator className="my-3 sm:my-4" />

              <div className="space-y-2 sm:space-y-3">
                {items.map((item) => (
                  <div key={item.book.id} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="truncate text-muted-foreground">
                      {item.book.title} × {item.quantity}
                    </span>
                    <span className="shrink-0 font-medium text-foreground">
                      {formatPrice(item.book.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-3 sm:my-4" />

              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold text-foreground sm:text-base">Total</span>
                <span className="text-lg font-bold text-saffron sm:text-xl">{formatPrice(totalAmount)}</span>
              </div>

              <Button
                asChild
                size="lg"
                className="mt-4 w-full bg-gold py-3 text-white active:bg-gold-dark sm:mt-6"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="size-4 sm:size-5" />
                </Link>
              </Button>

              <div className="mt-3 text-center sm:mt-4">
                <Link href="/" className="text-xs text-muted-foreground active:text-saffron sm:text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
