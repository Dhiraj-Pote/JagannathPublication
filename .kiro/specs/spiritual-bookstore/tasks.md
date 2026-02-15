                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        # Implementation Plan: Spiritual Bookstore

## Overview

Incremental implementation of the spiritual bookstore ecommerce app using Next.js 14+ App Router, Supabase, Razorpay, Tailwind CSS, Shadcn/UI, and Framer Motion. Tasks are ordered so each step builds on the previous, with no orphaned code. Property-based tests use fast-check, unit tests use Vitest.

## Tasks

- [x] 1. Project setup and configuration
  - [x] 1.1 Initialize Next.js 14+ project with App Router, Tailwind CSS, and TypeScript
    - Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router, and src directory
    - Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `razorpay`, `framer-motion`, `fast-check`, `vitest`, `@testing-library/react`
    - Initialize Shadcn/UI with `npx shadcn@latest init` and add components: Button, Input, Dialog, Label, Separator, Card
    - _Requirements: 9.4_

  - [x] 1.2 Configure environment variables and Supabase client
    - Create `.env.local.example` with all required env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_MOCK_OTP)
    - Create `lib/supabase/client.ts` for browser Supabase client
    - Create `lib/supabase/server.ts` for server-side Supabase client using `@supabase/ssr`
    - Create `lib/supabase/middleware.ts` for auth session refresh in middleware
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 1.3 Create Supabase SQL migration file
    - Create `supabase/migrations/001_initial_schema.sql` with the full schema from the design: users, products, orders, pincode_delivery tables, RLS policies, and seed data
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 1.4 Set up Tailwind theme with spiritual color palette
    - Configure `tailwind.config.ts` with custom colors: cream (#FDFBF7), saffron (#FF9933), gold (#D4AF37)
    - Set cream as the default background in `globals.css`
    - Configure default font (serif for headings, sans-serif for body)
    - _Requirements: 1.3, 9.1_

  - [x] 1.5 Configure Vitest for the project
    - Create `vitest.config.ts` with path aliases matching `tsconfig.json`
    - Add test scripts to `package.json`
    - Create `__tests__/` directory structure: `unit/`, `property/`, `integration/`
    - _Requirements: Testing Strategy_

- [x] 2. Core types, validators, and cart logic
  - [x] 2.1 Define TypeScript interfaces and types
    - Create `lib/types.ts` with Book, CartItem, CartContextType, Order, OrderItem, PincodeDelivery, CheckoutFormData, RazorpayOrder interfaces as specified in the design
    - _Requirements: 3.1, 5.1, 6.1, 7.2, 4.1_

  - [x] 2.2 Implement validation functions
    - Create `lib/validators.ts` with `validatePhoneNumber(phone: string)`, `validatePincode(pincode: string)`, and `validateCheckoutForm(data: CheckoutFormData)` functions
    - Phone validation: exactly 10 decimal digits
    - Pincode validation: exactly 6 decimal digits
    - Checkout form: all fields non-empty, pincode valid
    - _Requirements: 2.7, 4.5, 6.5_

  - [ ]* 2.3 Write property tests for validators
    - **Property 2: Phone number validation rejects invalid inputs**
    - **Validates: Requirements 2.7**
    - **Property 6: Pincode validation rejects invalid formats**
    - **Validates: Requirements 4.5**
    - **Property 11: Checkout form validation catches invalid inputs**
    - **Validates: Requirements 6.5**

  - [x] 2.4 Implement cart reducer and CartProvider context
    - Create `lib/cart-reducer.ts` with the cartReducer function (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR actions)
    - Create `components/providers/cart-provider.tsx` with React Context, useReducer, localStorage sync, and computed totalAmount/totalItems
    - Create `lib/cart-serialization.ts` with serialize/deserialize functions for localStorage
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ]* 2.5 Write property tests for cart
    - **Property 7: Cart operations maintain correct total (Invariant)**
    - **Validates: Requirements 5.1, 5.2, 5.3**
    - **Property 8: Cart persistence round trip**
    - **Validates: Requirements 5.5**

- [x] 3. Checkpoint - Core logic tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Layout, navigation, and page transitions
  - [x] 4.1 Create root layout with providers and global styles
    - Create `app/layout.tsx` with CartProvider, AuthProvider wrapper, metadata, and font configuration
    - Set the cream background and spiritual aesthetic in the root layout
    - _Requirements: 1.3, 9.1_

  - [x] 4.2 Build Navbar component
    - Create `components/navbar.tsx` as a client component with logo/site title, cart icon with item count badge, and login/profile button
    - Style with Tailwind using saffron accents and gold for interactive elements
    - _Requirements: 5.1, 1.3_

  - [x] 4.3 Build Footer component
    - Create `components/footer.tsx` as a server component with site info
    - _Requirements: 1.3_

  - [x] 4.4 Build PageTransition wrapper component
    - Create `components/page-transition.tsx` using Framer Motion `AnimatePresence` and `motion.div` for fade-in transitions
    - _Requirements: 1.5, 9.2_

- [x] 5. Home page and book cards
  - [x] 5.1 Build BookCard component with hover animations
    - Create `components/book-card.tsx` as a client component using Framer Motion `whileHover` for scale and shadow animation
    - Display book image, title, price, and link to detail page
    - Style with gold accent on hover, cream card background
    - _Requirements: 1.4, 9.3_

  - [x] 5.2 Build Home page with hero banner and featured books
    - Create `app/page.tsx` as a server component that fetches all products from Supabase
    - Render Hero_Banner section with background image from `/images/banner.jpg`
    - Render featured books section using BookCard components
    - Wrap in PageTransition for fade-in
    - Mobile-first responsive grid layout
    - _Requirements: 1.1, 1.2, 1.6_

- [x] 6. Authentication system
  - [x] 6.1 Create Supabase Auth provider and helpers
    - Create `components/providers/auth-provider.tsx` wrapping Supabase auth session listener
    - Create `lib/auth.ts` with helper functions: `signInWithPhone`, `verifyOtp`, `signOut`, `getSession`
    - Implement mock OTP logic: when `NEXT_PUBLIC_MOCK_OTP=true`, `verifyOtp` accepts any 6-digit code
    - _Requirements: 2.2, 2.3, 2.6_

  - [x] 6.2 Build OTP Login page
    - Create `app/auth/login/page.tsx` as a client component with two-step flow: phone input → OTP input
    - Use Shadcn/UI Input, Button, and Label components
    - Integrate phone validation from `lib/validators.ts`
    - On successful OTP, check for existing user profile and create one if missing
    - Redirect to previous page or home after login
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

  - [x] 6.3 Create auth middleware for protected routes
    - Create `middleware.ts` that checks Supabase session for `/checkout` and `/orders` routes
    - Redirect unauthenticated users to `/auth/login` with a `redirectTo` query param
    - _Requirements: 7.5_

- [x] 7. Product catalog and book detail pages
  - [x] 7.1 Build Book Detail page
    - Create `app/books/[id]/page.tsx` as a server component that fetches a single product by ID from Supabase
    - Display title, description, image, price
    - Include client-side "Add to Cart" and "Buy Now" buttons that use CartProvider
    - Include PincodeChecker component
    - Handle 404 for invalid book IDs
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 8. Pincode checker
  - [x] 8.1 Create pincode API route and checker component
    - Create `app/api/pincode/route.ts` that queries `pincode_delivery` table by range
    - Create `components/pincode-checker.tsx` as a client component with pincode input, check button, and delivery estimate display
    - Integrate pincode validation from `lib/validators.ts`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 8.2 Write property tests for pincode checker
    - **Property 5: Pincode checker returns correct delivery estimate**
    - **Validates: Requirements 4.2, 4.3, 4.4**

- [x] 9. Shopping cart page
  - [x] 9.1 Build Cart page
    - Create `app/cart/page.tsx` as a client component displaying cart items with quantity controls and remove buttons
    - Show item subtotals and cart total
    - Display empty cart message with link to home when cart is empty
    - Include "Proceed to Checkout" button
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10. Checkout and Razorpay payment
  - [x] 10.1 Create Razorpay API routes
    - Create `app/api/razorpay/create-order/route.ts` that creates a Razorpay order using the server-side SDK and inserts a Pending order in Supabase
    - Create `app/api/razorpay/verify/route.ts` that verifies the Razorpay payment signature using HMAC and updates the order status to "Paid"
    - _Requirements: 6.2, 6.3_

  - [x] 10.2 Build Checkout page with payment flow
    - Create `app/checkout/page.tsx` as a client component (auth-guarded via middleware)
    - Render checkout form with Name, Address, Pincode fields using Shadcn/UI
    - Integrate checkout form validation from `lib/validators.ts`
    - Integrate PincodeChecker to verify serviceability before payment
    - On valid submission, call create-order API, then open Razorpay checkout popup
    - On successful payment, call verify API, clear cart, show success message
    - On failed payment, show error message, retain cart
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 10.3 Write property tests for payment flow
    - **Property 9: Successful payment creates a Paid order**
    - **Validates: Requirements 6.3**
    - **Property 10: Failed payment retains cart contents**
    - **Validates: Requirements 6.4**

- [x] 11. Checkpoint - Full flow verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Order management
  - [x] 12.1 Build My Orders page
    - Create `app/orders/page.tsx` as a server component (auth-guarded via middleware)
    - Fetch all orders for the authenticated user from Supabase
    - Display each order with date, items, total amount, and status badge (Pending/Paid/Shipped)
    - Display empty state message when no orders exist
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 12.2 Write property tests for order display
    - **Property 12: Orders page displays all user orders with required fields**
    - **Validates: Requirements 7.1, 7.2**
    - **Property 13: Order status constraint**
    - **Validates: Requirements 7.3**

- [x] 13. Final checkpoint - All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases using Vitest
- Supabase migration file should be run manually against the Supabase project
- Razorpay Test Mode keys are used throughout — no real payments are processed
- OTP is mocked in development — any 6-digit code works when NEXT_PUBLIC_MOCK_OTP=true
