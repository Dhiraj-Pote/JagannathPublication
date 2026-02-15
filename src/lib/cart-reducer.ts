import type { CartItem, CartAction } from './types';

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(item => item.book.id === action.book.id);
      if (existing) {
        return state.map(item =>
          item.book.id === action.book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { book: action.book, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.book.id !== action.bookId);
    case 'UPDATE_QUANTITY':
      return action.quantity <= 0
        ? state.filter(item => item.book.id !== action.bookId)
        : state.map(item =>
            item.book.id === action.bookId
              ? { ...item, quantity: action.quantity }
              : item
          );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}
