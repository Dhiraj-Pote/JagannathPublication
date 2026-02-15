import type { Order } from '@/lib/types';

/**
 * Format a price from paise (smallest currency unit) to a display string.
 * e.g., 29900 → "₹299.00"
 */
export function formatPrice(priceInPaise: number): string {
  return `₹${(priceInPaise / 100).toFixed(2)}`;
}

/**
 * Format an ISO date string to a human-readable date.
 * e.g., "2024-06-15T10:30:00Z" → "15 June 2024"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Valid order statuses as defined in the database schema.
 */
export const VALID_ORDER_STATUSES: Order['status'][] = ['Pending', 'Paid', 'Shipped'];

/**
 * Get the CSS classes for a status badge based on order status.
 */
export function getStatusBadgeStyles(status: Order['status']): string {
  const styles: Record<Order['status'], string> = {
    Pending: 'bg-saffron/15 text-saffron-dark border-saffron/30',
    Paid: 'bg-green-50 text-green-700 border-green-200',
    Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return styles[status];
}
