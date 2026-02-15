'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import type { Book, CartItem, CartContextType } from '@/lib/types';
import { cartReducer } from '@/lib/cart-reducer';
import { serializeCart, deserializeCart } from '@/lib/cart-serialization';

const CART_STORAGE_KEY = 'spiritual-bookstore-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate cart from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const savedItems = deserializeCart(stored);
      for (const item of savedItems) {
        dispatch({ type: 'ADD_ITEM', book: item.book });
        if (item.quantity > 1) {
          dispatch({ type: 'UPDATE_QUANTITY', bookId: item.book.id, quantity: item.quantity });
        }
      }
    }
    setHydrated(true);
  }, []);

  // Sync to localStorage on every state change (only after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
    }
  }, [items, hydrated]);

  const addItem = (book: Book) => {
    dispatch({ type: 'ADD_ITEM', book });
  };

  const removeItem = (bookId: string) => {
    dispatch({ type: 'REMOVE_ITEM', bookId });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', bookId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.book.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
