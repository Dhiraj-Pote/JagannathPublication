import type { CartItem } from './types';

/**
 * Serialize cart items to a JSON string for localStorage persistence.
 */
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

/**
 * Deserialize a JSON string from localStorage back to cart items.
 * Returns an empty array if parsing fails (e.g., corrupted data).
 */
export function deserializeCart(data: string): CartItem[] {
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}
