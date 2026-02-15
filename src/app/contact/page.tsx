'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 sm:size-20">
              <CheckCircle2 className="size-8 text-green-600 sm:size-10" />
            </div>
            <h1 className="mt-5 font-serif text-xl font-semibold text-foreground sm:mt-6 sm:text-3xl">
              Message Sent!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
              Thank you for reaching out. We&apos;ll get back to you soon. Hare Krishna! 🙏
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="mt-6 bg-saffron text-white active:bg-saffron-dark sm:mt-8"
            >
              Send Another Message
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="font-serif text-2xl font-bold text-foreground sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            We&apos;d love to hear from you.
          </p>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-saffron via-gold to-saffron-light sm:mt-6 sm:w-16" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-8">
              <h2 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name" type="text" placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11 text-base sm:h-9 sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email" type="email" placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11 text-base sm:h-9 sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone" type="tel" placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11 text-base sm:h-9 sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message" rows={4} placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
                  />
                </div>
                <Button type="submit" className="w-full bg-saffron py-3 text-white active:bg-saffron-dark">
                  <Send className="size-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="space-y-4 sm:space-y-6"
          >
            <ContactInfoCard
              icon={<MapPin className="size-5 text-saffron sm:size-6" />}
              title="Visit Us"
              detail="Mayapura Sevashrama"
            />
            <ContactInfoCard
              icon={<Phone className="size-5 text-saffron sm:size-6" />}
              title="Call Us"
              detail="+91 9022219327"
            />
            <ContactInfoCard
              icon={<Mail className="size-5 text-saffron sm:size-6" />}
              title="Email Us"
              detail="contact@jagannathpublications.com"
            />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function ContactInfoCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-saffron/10 sm:size-12">
          {icon}
        </div>
        <div>
          <h3 className="font-serif text-base font-semibold text-foreground sm:text-lg">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground sm:mt-2">{detail}</p>
        </div>
      </div>
    </div>
  );
}
