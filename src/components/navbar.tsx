'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/providers/cart-provider';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-saffron/10 bg-gradient-to-r from-cream via-saffron/5 to-gold/5 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / Site Title */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <Image
              src="/images/jagannath-logo.png"
              alt="Jagannath"
              width={32}
              height={32}
              className="size-7 object-contain sm:size-9"
            />
            <span className="font-serif text-sm font-semibold tracking-tight text-foreground sm:text-xl">
              Jagannath Publications
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/orders">My Orders</NavLink>

            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:text-saffron"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="size-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-saffron text-[10px] font-bold text-white"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-gold/30 text-foreground/80 hover:border-gold hover:bg-gold/10 hover:text-gold-dark"
            >
              <Link href="/auth/login">
                <User className="size-4" />
                <span>Login</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-saffron/30 text-foreground/80 hover:border-saffron hover:bg-saffron/10 hover:text-saffron"
            >
              <Link href="/contact">
                <Mail className="size-4" />
                <span>Contact</span>
              </Link>
            </Button>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex items-center gap-0 md:hidden">
            <Link
              href="/cart"
              className="relative inline-flex size-10 items-center justify-center rounded-md text-foreground/70 active:bg-saffron/10"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="size-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute right-0 top-0.5 flex size-4.5 items-center justify-center rounded-full bg-saffron text-[9px] font-bold text-white"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/70 active:bg-saffron/10"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-cream md:hidden"
          >
            <div className="space-y-0.5 px-4 py-2">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/orders" onClick={() => setMobileMenuOpen(false)}>
                My Orders
              </MobileNavLink>
              <MobileNavLink href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <User className="size-4" />
                <span>Login</span>
              </MobileNavLink>
              <MobileNavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Mail className="size-4" />
                <span>Contact Us</span>
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-saffron"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-foreground/70 transition-colors active:bg-saffron/10"
    >
      {children}
    </Link>
  );
}
