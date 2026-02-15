'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  User,
  Home,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { validateCheckoutForm } from '@/lib/validators';
import { PincodeChecker } from '@/components/pincode-checker';
import { PageTransition } from '@/components/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { CheckoutFormData } from '@/lib/types';

function formatPrice(priceInPaise: number): string {
  return `₹${(priceInPaise / 100).toFixed(2)}`;
}

type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    address: '',
    pincode: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingPincode, setCheckingPincode] = useState(false);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const checkPincodeServiceability = async (pincode: string): Promise<boolean> => {
    setCheckingPincode(true);
    try {
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await response.json();
      if (!response.ok || !data.available) return false;
      return true;
    } catch {
      return false;
    } finally {
      setCheckingPincode(false);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFormErrors({});

    const validation = validateCheckoutForm(formData);
    if (!validation.valid) { setFormErrors(validation.errors); return; }

    setStatus('processing');
    const isServiceable = await checkPincodeServiceability(formData.pincode);
    if (!isServiceable) {
      setStatus('error');
      setErrorMessage('Delivery is not available for this pincode.');
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setStatus('error');
      setErrorMessage('Payment service is temporarily unavailable.');
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        book_id: item.book.id, title: item.book.title,
        price: item.book.price, quantity: item.quantity,
      }));

      const createOrderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount, items: orderItems,
          shipping_name: formData.name.trim(),
          shipping_address: formData.address.trim(),
          shipping_pincode: formData.pincode.trim(),
          user_id: user?.id ?? '',
        }),
      });

      if (!createOrderRes.ok) {
        setStatus('error');
        setErrorMessage('Unable to initiate payment, please try again.');
        return;
      }

      const orderData = await createOrderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount, currency: 'INR',
        name: "Jagannath Publications",
        description: 'Book Purchase',
        order_id: orderData.razorpay_order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                db_order_id: orderData.order_id,
              }),
            });
            if (verifyRes.ok) { clearCart(); setStatus('success'); }
            else { setStatus('error'); setErrorMessage('Payment verification failed.'); }
          } catch { setStatus('error'); setErrorMessage('Payment verification failed.'); }
        },
        modal: {
          ondismiss: function () {
            setStatus('error');
            setErrorMessage('Payment was cancelled. Your cart items are still saved.');
          },
        },
        prefill: { contact: user?.phone ?? '' },
        theme: { color: '#FF9933' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      setStatus('error');
      setErrorMessage('Unable to initiate payment, please try again.');
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center text-center"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 sm:size-20">
              <CheckCircle2 className="size-8 text-green-600 sm:size-10" />
            </div>
            <h1 className="mt-5 font-serif text-xl font-semibold text-foreground sm:mt-6 sm:text-3xl">
              Order Placed Successfully!
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground sm:mt-3 sm:text-base">
              Thank you for your purchase. Hare Krishna! 🙏
            </p>
            <div className="mt-6 flex gap-3 sm:mt-8 sm:gap-4">
              <Button asChild variant="outline" className="border-saffron/30 text-saffron">
                <Link href="/orders">View Orders</Link>
              </Button>
              <Button asChild className="bg-saffron text-white">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-saffron/10 sm:size-20">
              <ShoppingBag className="size-8 text-saffron/60 sm:size-10" />
            </div>
            <h1 className="mt-5 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              Your cart is empty
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Add some books before checking out.</p>
            <Button asChild className="mt-5 bg-saffron text-white">
              <Link href="/">Browse Books</Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/cart"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground active:text-saffron sm:mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Cart
        </Link>

        <h1 className="mb-5 font-serif text-xl font-semibold text-foreground sm:mb-8 sm:text-3xl">
          Checkout
        </h1>

        {/* On mobile: single column, order summary first then form */}
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
                <h2 className="flex items-center gap-2 font-serif text-base font-semibold text-foreground sm:text-lg">
                  <Home className="size-4 text-saffron sm:size-5" />
                  Shipping Details
                </h2>
                <Separator className="my-3 sm:my-4" />

                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <User className="size-3 text-muted-foreground sm:size-3.5" />
                      Full Name
                    </Label>
                    <Input
                      id="name" type="text" placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`h-11 text-base sm:h-9 sm:text-sm ${formErrors.name ? 'border-destructive' : ''}`}
                    />
                    {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <Home className="size-3 text-muted-foreground sm:size-3.5" />
                      Delivery Address
                    </Label>
                    <Input
                      id="address" type="text" placeholder="Enter your full delivery address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`h-11 text-base sm:h-9 sm:text-sm ${formErrors.address ? 'border-destructive' : ''}`}
                    />
                    {formErrors.address && <p className="text-xs text-destructive">{formErrors.address}</p>}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="pincode" className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <MapPin className="size-3 text-muted-foreground sm:size-3.5" />
                      Pincode
                    </Label>
                    <Input
                      id="pincode" type="text" inputMode="numeric"
                      placeholder="Enter 6-digit pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange('pincode', value);
                      }}
                      maxLength={6}
                      className={`h-11 text-base sm:h-9 sm:text-sm ${formErrors.pincode ? 'border-destructive' : ''}`}
                    />
                    {formErrors.pincode && <p className="text-xs text-destructive">{formErrors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Check */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
                <h2 className="flex items-center gap-2 font-serif text-base font-semibold text-foreground sm:text-lg">
                  <MapPin className="size-4 text-saffron sm:size-5" />
                  Check Delivery
                </h2>
                <Separator className="my-3 sm:my-4" />
                <PincodeChecker />
              </div>

              {/* Error */}
              <AnimatePresence>
                {status === 'error' && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 sm:px-4 sm:py-3"
                  >
                    <AlertCircle className="size-4 shrink-0 text-destructive sm:size-5" />
                    <p className="text-xs text-destructive sm:text-sm">{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pay Button */}
              <Button
                type="submit" size="lg"
                disabled={status === 'processing' || checkingPincode}
                className="w-full bg-gold py-3.5 text-white active:bg-gold-dark disabled:opacity-50 sm:py-3"
              >
                {status === 'processing' || checkingPincode ? (
                  <><Loader2 className="size-4 animate-spin sm:size-5" /> Processing...</>
                ) : (
                  <><CreditCard className="size-4 sm:size-5" /> Pay Now — {formatPrice(totalAmount)}</>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
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
              <p className="mt-3 text-center text-[10px] text-muted-foreground sm:mt-4 sm:text-xs">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
