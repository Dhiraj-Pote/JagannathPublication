import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-saffron/10 bg-gradient-to-b from-cream to-[#F5EFE3]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Top row: brand + links + contact */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/jagannath-logo.png"
              alt="Jagannath"
              width={28}
              height={28}
              className="size-6 object-contain sm:size-7"
            />
            <div>
              <p className="font-serif text-sm font-semibold text-foreground sm:text-base">
                Jagannath Publications
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                Sacred literature for the soul
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-5 text-xs text-muted-foreground sm:gap-6 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-saffron active:text-saffron">Home</Link>
            <Link href="/orders" className="transition-colors hover:text-saffron active:text-saffron">Orders</Link>
            <Link href="/contact" className="transition-colors hover:text-saffron active:text-saffron">Contact</Link>
          </div>

          {/* Contact */}
          <div className="space-y-1.5 text-[11px] text-muted-foreground sm:text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3 shrink-0 text-saffron/50" />
              <span>Mayapura Sevashrama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="size-3 shrink-0 text-saffron/50" />
              <span>+91 9022219327</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="size-3 shrink-0 text-saffron/50" />
              <span>contact@jagannathpublications.com</span>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-5 flex items-center gap-3 sm:mt-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-saffron/15 to-transparent" />
          <p className="shrink-0 text-[10px] text-muted-foreground/60 sm:text-xs">
            &copy; {currentYear} Jagannath Publications
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-saffron/15 to-transparent" />
        </div>
      </div>
    </footer>
  );
}
