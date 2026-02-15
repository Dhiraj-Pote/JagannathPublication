import { describe, it, expect } from 'vitest';
import { cartReducer } from '@/lib/cart-reducer';
import type { Book, CartItem } from '@/lib/types';
import { serializeCart, deserializeCart } from '@/lib/cart-serialization';

// Helper to create a test book
function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: 'book-1',
    title: 'How to Find Guru',
    description: 'A spiritual guide',
    price: 29900,
    image_path: '/images/guru-find.jpg',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('cartReducer', () => {
  describe('ADD_ITEM', () => {
    it('adds a new book to an empty cart with quantity 1', () => {
      const book = makeBook();
      const result = cartReducer([], { type: 'ADD_ITEM', book });
      expect(result).toHaveLength(1);
      expect(result[0].book.id).toBe('book-1');
      expect(result[0].quantity).toBe(1);
    });

    it('increments quantity when adding an existing book', () => {
      const book = makeBook();
      const state: CartItem[] = [{ book, quantity: 2 }];
      const result = cartReducer(state, { type: 'ADD_ITEM', book });
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(3);
    });

    it('adds a different book without affecting existing items', () => {
      const book1 = makeBook({ id: 'book-1' });
      const book2 = makeBook({ id: 'book-2', title: 'Guru Tattva', price: 34900 });
      const state: CartItem[] = [{ book: book1, quantity: 1 }];
      const result = cartReducer(state, { type: 'ADD_ITEM', book: book2 });
      expect(result).toHaveLength(2);
      expect(result[0].book.id).toBe('book-1');
      expect(result[0].quantity).toBe(1);
      expect(result[1].book.id).toBe('book-2');
      expect(result[1].quantity).toBe(1);
    });
  });

  describe('REMOVE_ITEM', () => {
    it('removes an item by bookId', () => {
      const book = makeBook();
      const state: CartItem[] = [{ book, quantity: 2 }];
      const result = cartReducer(state, { type: 'REMOVE_ITEM', bookId: 'book-1' });
      expect(result).toHaveLength(0);
    });

    it('does nothing when removing a non-existent bookId', () => {
      const book = makeBook();
      const state: CartItem[] = [{ book, quantity: 1 }];
      const result = cartReducer(state, { type: 'REMOVE_ITEM', bookId: 'non-existent' });
      expect(result).toHaveLength(1);
      expect(result[0].book.id).toBe('book-1');
    });

    it('only removes the targeted item, leaving others intact', () => {
      const book1 = makeBook({ id: 'book-1' });
      const book2 = makeBook({ id: 'book-2' });
      const state: CartItem[] = [
        { book: book1, quantity: 1 },
        { book: book2, quantity: 3 },
      ];
      const result = cartReducer(state, { type: 'REMOVE_ITEM', bookId: 'book-1' });
      expect(result).toHaveLength(1);
      expect(result[0].book.id).toBe('book-2');
      expect(result[0].quantity).toBe(3);
    });
  });

  describe('UPDATE_QUANTITY', () => {
    it('updates the quantity of an existing item', () => {
      const book = makeBook();
      const state: CartItem[] = [{ book, quantity: 1 }];
      const result = cartReducer(state, { type: 'UPDATE_QUANTITY', bookId: 'book-1', quantity: 5 });
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
      const book = makeBook();
      const state: CartItem[] = [{ book, quantity: 3 }];
      const result = cartReducer(state, { type: 'UPDATE_QUANTITY', bookId: 'book-1', quantity: 0 });
      expect(result).toHaveLength(0);
    });

    it('removes the item when quantity is negative', () => {
      const book = makeBook();
      const state: CartItem[] = [{ book, quantity: 2 }];
      const result = cartReducer(state, { type: 'UPDATE_QUANTITY', bookId: 'book-1', quantity: -1 });
      expect(result).toHaveLength(0);
    });

    it('does not affect other items when updating one', () => {
      const book1 = makeBook({ id: 'book-1' });
      const book2 = makeBook({ id: 'book-2' });
      const state: CartItem[] = [
        { book: book1, quantity: 1 },
        { book: book2, quantity: 2 },
      ];
      const result = cartReducer(state, { type: 'UPDATE_QUANTITY', bookId: 'book-2', quantity: 10 });
      expect(result).toHaveLength(2);
      expect(result[0].quantity).toBe(1);
      expect(result[1].quantity).toBe(10);
    });
  });

  describe('CLEAR', () => {
    it('returns an empty array', () => {
      const book1 = makeBook({ id: 'book-1' });
      const book2 = makeBook({ id: 'book-2' });
      const state: CartItem[] = [
        { book: book1, quantity: 1 },
        { book: book2, quantity: 5 },
      ];
      const result = cartReducer(state, { type: 'CLEAR' });
      expect(result).toEqual([]);
    });

    it('returns an empty array when cart is already empty', () => {
      const result = cartReducer([], { type: 'CLEAR' });
      expect(result).toEqual([]);
    });
  });

  describe('unknown action', () => {
    it('returns the current state for an unknown action type', () => {
      const state: CartItem[] = [{ book: makeBook(), quantity: 1 }];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = cartReducer(state, { type: 'UNKNOWN' } as any);
      expect(result).toBe(state);
    });
  });
});

describe('cart-serialization', () => {
  describe('serializeCart', () => {
    it('serializes an empty cart', () => {
      const result = serializeCart([]);
      expect(result).toBe('[]');
    });

    it('serializes cart items to JSON', () => {
      const items: CartItem[] = [{ book: makeBook(), quantity: 2 }];
      const result = serializeCart(items);
      const parsed = JSON.parse(result);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].book.id).toBe('book-1');
      expect(parsed[0].quantity).toBe(2);
    });
  });

  describe('deserializeCart', () => {
    it('deserializes valid JSON back to cart items', () => {
      const items: CartItem[] = [{ book: makeBook(), quantity: 3 }];
      const json = JSON.stringify(items);
      const result = deserializeCart(json);
      expect(result).toHaveLength(1);
      expect(result[0].book.id).toBe('book-1');
      expect(result[0].quantity).toBe(3);
    });

    it('returns empty array for invalid JSON', () => {
      const result = deserializeCart('not valid json');
      expect(result).toEqual([]);
    });

    it('returns empty array for non-array JSON', () => {
      const result = deserializeCart('{"key": "value"}');
      expect(result).toEqual([]);
    });

    it('returns empty array for empty string', () => {
      const result = deserializeCart('');
      expect(result).toEqual([]);
    });
  });
});
