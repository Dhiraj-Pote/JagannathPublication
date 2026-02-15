'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validatePincode } from '@/lib/validators';

interface PincodeResult {
  available: boolean;
  delivery_days?: string;
  zone?: string;
  message?: string;
}

export function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    // Reset previous state
    setResult(null);
    setError(null);

    // Client-side validation
    const validation = validatePincode(pincode);
    if (!validation.valid) {
      setError(validation.errors.pincode);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data: PincodeResult = await response.json();

      if (!response.ok) {
        setError(data.message ?? 'Unable to check delivery, please try again');
        return;
      }

      setResult(data);
    } catch {
      setError('Unable to check delivery, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) => {
              // Only allow digits, max 6 characters
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setPincode(value);
              // Clear previous results when input changes
              if (result || error) {
                setResult(null);
                setError(null);
              }
            }}
            onKeyDown={handleKeyDown}
            maxLength={6}
            className="pl-9"
            aria-label="Pincode"
          />
        </div>
        <Button
          onClick={handleCheck}
          disabled={loading}
          variant="outline"
          className="border-saffron/30 text-saffron hover:border-saffron hover:bg-saffron/10"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Check'
          )}
        </Button>
      </div>

      {/* Result Display */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
          >
            <AlertCircle className="size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {result && !result.available && (
          <motion.div
            key="unavailable"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2 rounded-lg border border-muted bg-secondary/50 px-3 py-2"
          >
            <AlertCircle className="size-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </motion.div>
        )}

        {result && result.available && (
          <motion.div
            key="available"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2"
          >
            <CheckCircle2 className="size-4 shrink-0 text-green-600" />
            <div className="flex items-center gap-1.5">
              <Truck className="size-4 text-green-600" />
              <p className="text-sm font-medium text-green-700">
                Delivered in {result.delivery_days}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
