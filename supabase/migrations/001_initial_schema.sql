-- ============================================================
-- Spiritual Bookstore - Initial Database Schema
-- Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
-- ============================================================

-- Users table (linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  auth_id UUID UNIQUE REFERENCES auth.users(id),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- price in paise (smallest currency unit)
  image_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  shipping_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Shipped')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pincode delivery mapping
CREATE TABLE pincode_delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pincode_start TEXT NOT NULL,
  pincode_end TEXT NOT NULL,
  delivery_days TEXT NOT NULL,
  zone TEXT NOT NULL CHECK (zone IN ('fast', 'standard'))
);

-- Seed products
INSERT INTO products (title, description, price, image_path) VALUES
(
  'How to Find Guru',
  'There are five essays: How to Find Guru – by Srila Bhaktisiddhanta Saraswati; Krishna will give you Guru – by Srila Prabhupada; How to Find a Sadhu, A Sadhu is Always Present, and Simplicity and Faith – by Srila Gour Govinda Swami.',
  29900,
  '/images/guru-find.jpg'
),
(
  'Guru Tattva',
  'After many of his Godbrothers fell from their positions as sannyāsīs and gurus, Śrīla Gour Govinda Mahārāja presented this paper to the GBC members in 1989 for the sole purpose of establishing the absolute conception of (sad-) guru and to console Śrīla Prabhupāda''s grand-disciples.',
  34900,
  '/images/guru-tattva.jpg'
);

-- Seed pincode delivery data
INSERT INTO pincode_delivery (pincode_start, pincode_end, delivery_days, zone) VALUES
('110001', '110099', '3 days', 'fast'),
('400001', '400099', '3 days', 'fast'),
('560001', '560099', '3 days', 'fast'),
('700001', '700099', '3 days', 'fast'),
('600001', '600099', '5-7 days', 'standard'),
('500001', '500099', '5-7 days', 'standard'),
('302001', '302099', '5-7 days', 'standard'),
('380001', '380099', '5-7 days', 'standard');

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pincode_delivery ENABLE ROW LEVEL SECURITY;

-- Products and pincode_delivery are publicly readable
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Pincode delivery is viewable by everyone" ON pincode_delivery FOR SELECT USING (true);

-- Users can only read their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Orders: users can only see their own orders; server can insert
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "Service role can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update orders" ON orders FOR UPDATE USING (true);
