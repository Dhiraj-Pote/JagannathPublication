# Requirements Document

## Introduction

A full-stack ecommerce bookstore website for "Sri Srimad Gour Govinda Swami Maharaj's Books." The site follows a spiritual minimalist design philosophy with a cream, saffron, and gold color palette. It provides a Flipkart-style phone OTP authentication flow, a two-book product catalog, pincode-based shipping estimation, Razorpay payment integration, and order management. The tech stack is Next.js 14+ (App Router), Supabase (PostgreSQL + Auth), Razorpay (Test Mode), Tailwind CSS, Shadcn/UI, and Framer Motion.

## Glossary

- **Bookstore_App**: The Next.js 14+ full-stack ecommerce web application
- **Home_Page**: The landing page displaying a hero banner and featured books
- **Auth_System**: The Supabase Auth-based phone OTP authentication module
- **OTP**: A 6-digit one-time password sent to a user's phone number for verification
- **Product_Catalog**: The collection of books available for purchase, stored in Supabase
- **Book_Detail_Page**: A dedicated page for a single book showing description, image, and purchase actions
- **Cart**: The shopping cart holding items a user intends to purchase
- **Checkout_Flow**: The process of collecting shipping details and completing payment
- **Razorpay_Gateway**: The Razorpay payment integration operating in Test Mode
- **Pincode_Checker**: A module that estimates delivery time based on a given pincode
- **Order**: A record of a completed purchase stored in Supabase with status tracking
- **My_Orders_Page**: A page displaying order history for the logged-in user
- **Supabase_DB**: The PostgreSQL database hosted on Supabase storing users, products, orders, cart, and pincode data
- **Hero_Banner**: The prominent image section at the top of the Home_Page featuring Sri Srimad Gour Govinda Swami

## Requirements

### Requirement 1: Home Page Display

**User Story:** As a visitor, I want to see an inviting home page with a hero banner and featured books, so that I can quickly understand the bookstore's offerings and spiritual aesthetic.

#### Acceptance Criteria

1. WHEN a visitor loads the Home_Page, THE Bookstore_App SHALL display a Hero_Banner section with a background image sourced from `/public/images/banner.jpg`
2. WHEN a visitor loads the Home_Page, THE Bookstore_App SHALL display a featured books section listing all books from the Product_Catalog
3. THE Bookstore_App SHALL apply the spiritual minimalist color palette: Soft Cream (#FDFBF7) background, Deep Saffron (#FF9933) accents, and Gold (#D4AF37) buttons
4. WHEN a book card is hovered, THE Bookstore_App SHALL animate the card using Framer Motion with a gentle scale and shadow transition
5. WHEN the Home_Page is navigated to, THE Bookstore_App SHALL apply a Framer Motion fade-in page transition
6. WHEN the viewport width changes, THE Bookstore_App SHALL render the Home_Page responsively with a mobile-first layout

### Requirement 2: Phone OTP Authentication

**User Story:** As a user, I want to log in using only my phone number and a one-time password, so that I can access the bookstore without managing a password.

#### Acceptance Criteria

1. WHEN a user initiates login, THE Auth_System SHALL present an input field for a 10-digit phone number
2. WHEN a user submits a valid phone number, THE Auth_System SHALL trigger a 6-digit OTP and display an OTP input field
3. WHEN a user submits a valid 6-digit OTP, THE Auth_System SHALL verify the OTP and create an authenticated session via Supabase Auth
4. WHEN the OTP verification succeeds and no user profile exists, THE Auth_System SHALL automatically create a user record in Supabase_DB linked to the phone number
5. IF a user submits an invalid OTP, THEN THE Auth_System SHALL display an error message indicating the OTP is incorrect and allow retry
6. WHILE in local development mode, THE Auth_System SHALL accept any 6-digit code as a valid OTP without requiring an SMS service
7. IF a user submits a phone number that is not exactly 10 digits, THEN THE Auth_System SHALL display a validation error and prevent OTP dispatch

### Requirement 3: Product Catalog and Book Detail Pages

**User Story:** As a visitor, I want to browse the book catalog and view detailed information about each book, so that I can make an informed purchase decision.

#### Acceptance Criteria

1. THE Product_Catalog SHALL contain two books stored in Supabase_DB: "How to Find Guru" and "Guru Tattva"
2. WHEN a visitor selects a book from the Product_Catalog, THE Bookstore_App SHALL navigate to the Book_Detail_Page displaying the book title, description, image, price, "Buy Now" button, and "Add to Cart" button
3. WHEN a visitor clicks "Add to Cart" on the Book_Detail_Page, THE Bookstore_App SHALL add the selected book to the Cart
4. WHEN a visitor clicks "Buy Now" on the Book_Detail_Page, THE Bookstore_App SHALL add the book to the Cart and redirect to the Checkout_Flow

### Requirement 4: Pincode-Based Shipping Estimation

**User Story:** As a buyer, I want to check delivery time for my pincode, so that I can know when to expect my order.

#### Acceptance Criteria

1. WHEN a user enters a pincode on the Book_Detail_Page or Checkout_Flow, THE Pincode_Checker SHALL look up the pincode against a delivery mapping stored in Supabase_DB
2. WHEN the pincode matches a fast-delivery zone, THE Pincode_Checker SHALL display "Delivered in 3 days"
3. WHEN the pincode matches a standard-delivery zone, THE Pincode_Checker SHALL display "Delivered in 5-7 days"
4. IF the pincode does not match any delivery zone, THEN THE Pincode_Checker SHALL display "Delivery not available for this pincode"
5. IF the pincode is not exactly 6 digits, THEN THE Pincode_Checker SHALL display a validation error and prevent lookup

### Requirement 5: Shopping Cart Management

**User Story:** As a buyer, I want to manage items in my shopping cart, so that I can adjust my order before checkout.

#### Acceptance Criteria

1. WHEN a user adds a book to the Cart, THE Bookstore_App SHALL store the item with its quantity and display an updated cart count in the navigation
2. WHEN a user increases or decreases the quantity of a cart item, THE Bookstore_App SHALL update the item quantity and recalculate the cart total
3. WHEN a user removes an item from the Cart, THE Bookstore_App SHALL remove the item and recalculate the cart total
4. WHEN the Cart is empty, THE Bookstore_App SHALL display a message indicating the cart is empty and provide a link to the Product_Catalog
5. THE Bookstore_App SHALL persist the Cart state so that items are retained during the user session

### Requirement 6: Checkout and Payment

**User Story:** As a buyer, I want to complete my purchase through a simple checkout form and Razorpay payment, so that I can place my order quickly.

#### Acceptance Criteria

1. WHEN a user proceeds to checkout, THE Checkout_Flow SHALL display a form collecting Name, Address, and Pincode
2. WHEN a user submits the checkout form with valid details, THE Checkout_Flow SHALL initiate a Razorpay_Gateway payment popup in Test Mode
3. WHEN the Razorpay_Gateway returns a successful payment response, THE Bookstore_App SHALL create an Order record in Supabase_DB with status "Paid" and clear the Cart
4. IF the Razorpay_Gateway returns a failed payment response, THEN THE Bookstore_App SHALL display a payment failure message and retain the Cart contents
5. IF the user submits the checkout form with missing or invalid fields, THEN THE Checkout_Flow SHALL display validation errors for each invalid field and prevent payment initiation
6. WHEN the checkout form is submitted, THE Checkout_Flow SHALL validate that the Pincode is serviceable using the Pincode_Checker before initiating payment

### Requirement 7: Order Management

**User Story:** As a buyer, I want to view my past orders and their statuses, so that I can track my purchases.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to the My_Orders_Page, THE Bookstore_App SHALL fetch and display all orders associated with the user's phone number from Supabase_DB
2. WHEN displaying an order, THE Bookstore_App SHALL show the order date, items purchased, total amount, and current status
3. THE Bookstore_App SHALL support three order statuses: "Pending", "Paid", and "Shipped"
4. WHEN no orders exist for the user, THE Bookstore_App SHALL display a message indicating no orders have been placed
5. IF an unauthenticated user attempts to access the My_Orders_Page, THEN THE Bookstore_App SHALL redirect the user to the Auth_System login flow

### Requirement 8: Supabase Database Schema

**User Story:** As a developer, I want a well-structured database schema in Supabase, so that all application data is stored reliably and relationships are maintained.

#### Acceptance Criteria

1. THE Supabase_DB SHALL contain a Users table linked to Supabase Auth with phone number as the unique identifier
2. THE Supabase_DB SHALL contain a Products table storing book title, description, price, and image path
3. THE Supabase_DB SHALL contain an Orders table with references to the user, order items, total amount, shipping address, pincode, and status
4. THE Supabase_DB SHALL contain a Pincode_Delivery table mapping pincode ranges to delivery time estimates
5. WHEN a new user is authenticated, THE Supabase_DB SHALL store the user record with the phone number linked to the Supabase Auth user ID
6. THE Supabase_DB SHALL enforce referential integrity between Users, Orders, and Products tables

### Requirement 9: Responsive Design and Animations

**User Story:** As a user on any device, I want the bookstore to look and feel premium with smooth animations, so that I have a pleasant browsing experience.

#### Acceptance Criteria

1. THE Bookstore_App SHALL use a mobile-first responsive layout that adapts to mobile, tablet, and desktop viewports
2. WHEN navigating between pages, THE Bookstore_App SHALL apply Framer Motion fade transitions
3. WHEN a user hovers over interactive elements such as book cards and buttons, THE Bookstore_App SHALL apply Framer Motion scale and shadow animations
4. THE Bookstore_App SHALL use Tailwind CSS for all styling with the Shadcn/UI component library for form elements, buttons, and dialogs
