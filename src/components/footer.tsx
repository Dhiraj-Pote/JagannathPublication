import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f0ede7]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* Single row on mobile: contact + links side by side */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-[11px] text-[#999] sm:text-xs">
          {/* Contact */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3 shrink-0" />
              <span>Mayapura Sevashrama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="size-3 shrink-0" />
              <span>+91 9022219327</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="size-3 shrink-0" />
              <span>contact@jagannathpublications.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-4">
            <Link href="/" className="transition-colors active:text-saffron">Home</Link>
            <Link href="/orders" className="transition-colors active:text-saffron">Orders</Link>
            <Link href="/contact" className="transition-colors active:text-saffron">Contact</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-3 border-t border-[#ddd8d0] pt-3 sm:mt-4 sm:pt-4">
          <p className="text-center text-[10px] text-[#bbb] sm:text-xs">
            &copy; {currentYear} Jagannath Publications. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
