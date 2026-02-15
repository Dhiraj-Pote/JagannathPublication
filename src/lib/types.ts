// Book / Product
export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  image_path: string;
  created_at: string;
}

// Cart Item
export interface CartItem {
  book: Book;
  quantity: number;
}

// Cart Context
export interface CartContextType {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

// Order Item
export interface OrderItem {
  book_id: string;
  title: string;
  price: number;
  quantity: number;
}

// Order
export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  shipping_name: string;
  shipping_address: string;
  shipping_pincode: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  status: 'Pending' | 'Paid' | 'Shipped';
  created_at: string;
}

// Pincode Delivery
export interface PincodeDelivery {
  pincode_start: string;
  pincode_end: string;
  delivery_days: string;
  zone: 'fast' | 'standard';
}

// Checkout Form
export interface CheckoutFormData {
  name: string;
  address: string;
  pincode: string;
}

// Razorpay Order (server-side creation response)
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

// Cart Action type for the cart reducer
export type CartAction =
  | { type: 'ADD_ITEM'; book: Book }
  | { type: 'REMOVE_ITEM'; bookId: string }
  | { type: 'UPDATE_QUANTITY'; bookId: string; quantity: number }
  | { type: 'CLEAR' };
