'use client';

import { Suspense, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, KeyRound, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithPhone, verifyOtp } from '@/lib/auth';
import { validatePhoneNumber } from '@/lib/validators';
import { createClient } from '@/lib/supabase/client';

type Step = 'phone' | 'otp' | 'success';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-saffron" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = useCallback(async () => {
    setError('');

    // Validate phone number
    const validation = validatePhoneNumber(phone);
    if (!validation.valid) {
      setError(validation.errors.phone);
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      const { error: authError } = await signInWithPhone(fullPhone);
      if (authError) {
        setError(authError.message || 'Failed to send OTP. Please try again.');
        return;
      }
      setStep('otp');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  const handleOtpSubmit = useCallback(async () => {
    setError('');

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be exactly 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      const { data, error: authError } = await verifyOtp(fullPhone, otp);

      if (authError) {
        setError(authError.message || 'Incorrect OTP, please try again');
        return;
      }

      if (!data?.user) {
        setError('Verification failed. Please try again.');
        return;
      }

      // Check for existing user profile and create if missing
      const supabase = createClient();
      if (supabase) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('phone_number', fullPhone)
          .single();

        if (!existingUser) {
          await supabase.from('users').insert({
            phone_number: fullPhone,
            auth_id: data.user.id,
          });
        }
      }

      // Show success briefly, then redirect
      setStep('success');
      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
      }, 1200);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [phone, otp, redirectTo, router]);

  const handleBackToPhone = useCallback(() => {
    setStep('phone');
    setOtp('');
    setError('');
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-3 py-8 sm:px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-lg shadow-gold/5 sm:rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-saffron/10 via-gold/5 to-cream px-5 py-6 text-center sm:px-6 sm:py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-saffron/15 sm:mb-4 sm:size-16"
            >
              {step === 'success' ? (
                <CheckCircle2 className="size-6 text-saffron sm:size-8" />
              ) : step === 'otp' ? (
                <KeyRound className="size-6 text-saffron sm:size-8" />
              ) : (
                <Phone className="size-6 text-saffron sm:size-8" />
              )}
            </motion.div>
            <h1 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {step === 'success'
                ? 'Welcome!'
                : step === 'otp'
                  ? 'Verify OTP'
                  : 'Login'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === 'success'
                ? 'You have been logged in successfully'
                : step === 'otp'
                  ? `Enter the 6-digit code sent to +91 ${phone}`
                  : 'Enter your phone number to continue'}
            </p>
          </div>

          {/* Body */}
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Phone Input */}
              {step === 'phone' && (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground/80">
                        Phone Number
                      </Label>
                      <div className="flex gap-2">
                        <div className="flex h-11 items-center rounded-md border border-input bg-secondary/50 px-3 text-base font-medium text-muted-foreground sm:h-9 sm:text-sm">
                          +91
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter 10-digit number"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setPhone(val);
                            if (error) setError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) handlePhoneSubmit();
                          }}
                          maxLength={10}
                          autoFocus
                          className="h-11 flex-1 text-base sm:h-9 sm:text-sm"
                          aria-invalid={!!error}
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <Button
                      onClick={handlePhoneSubmit}
                      disabled={isLoading || phone.length === 0}
                      className="w-full bg-saffron text-white hover:bg-saffron-dark"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: OTP Input */}
              {step === 'otp' && (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-foreground/80">
                        One-Time Password
                      </Label>
                      <Input
                        id="otp"
                        type="tel"
                        inputMode="numeric"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtp(val);
                          if (error) setError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isLoading) handleOtpSubmit();
                        }}
                        maxLength={6}
                        autoFocus
                        className="text-center text-lg tracking-[0.5em] h-11 sm:h-9"
                        aria-invalid={!!error}
                      />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <Button
                      onClick={handleOtpSubmit}
                      disabled={isLoading || otp.length === 0}
                      className="w-full bg-saffron text-white hover:bg-saffron-dark"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Login
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>

                    <button
                      onClick={handleBackToPhone}
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-saffron disabled:opacity-50"
                    >
                      <ArrowLeft className="size-3.5" />
                      Change phone number
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 'success' && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                  className="flex flex-col items-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
                    className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100"
                  >
                    <CheckCircle2 className="size-8 text-green-600" />
                  </motion.div>
                  <p className="text-center text-sm text-muted-foreground">
                    Redirecting you now...
                  </p>
                  <Loader2 className="mt-3 size-5 animate-spin text-saffron" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer hint */}
          {step !== 'success' && (
            <div className="border-t border-border bg-secondary/30 px-5 py-3 text-center sm:px-6 sm:py-4">
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
