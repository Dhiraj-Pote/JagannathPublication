import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatDate,
  getStatusBadgeStyles,
  VALID_ORDER_STATUSES,
} from '@/lib/order-helpers';

describe('formatPrice', () => {
  it('converts paise to rupees with two decimal places', () => {
    expect(formatPrice(29900)).toBe('₹299.00');
  });

  it('handles zero amount', () => {
    expect(formatPrice(0)).toBe('₹0.00');
  });

  it('handles amounts with fractional paise', () => {
    expect(formatPrice(100)).toBe('₹1.00');
    expect(formatPrice(150)).toBe('₹1.50');
    expect(formatPrice(99)).toBe('₹0.99');
  });

  it('handles large amounts', () => {
    expect(formatPrice(1000000)).toBe('₹10000.00');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string to a readable date', () => {
    const result = formatDate('2024-06-15T10:30:00Z');
    // en-IN locale: "15 June 2024"
    expect(result).toContain('June');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('formats another date correctly', () => {
    const result = formatDate('2025-01-01T00:00:00Z');
    expect(result).toContain('January');
    expect(result).toContain('2025');
  });
});

describe('getStatusBadgeStyles', () => {
  it('returns saffron styles for Pending status', () => {
    const styles = getStatusBadgeStyles('Pending');
    expect(styles).toContain('saffron');
  });

  it('returns green styles for Paid status', () => {
    const styles = getStatusBadgeStyles('Paid');
    expect(styles).toContain('green');
  });

  it('returns blue styles for Shipped status', () => {
    const styles = getStatusBadgeStyles('Shipped');
    expect(styles).toContain('blue');
  });

  it('returns distinct styles for each status', () => {
    const pendingStyles = getStatusBadgeStyles('Pending');
    const paidStyles = getStatusBadgeStyles('Paid');
    const shippedStyles = getStatusBadgeStyles('Shipped');
    expect(pendingStyles).not.toBe(paidStyles);
    expect(paidStyles).not.toBe(shippedStyles);
    expect(pendingStyles).not.toBe(shippedStyles);
  });
});

describe('VALID_ORDER_STATUSES', () => {
  it('contains exactly three statuses', () => {
    expect(VALID_ORDER_STATUSES).toHaveLength(3);
  });

  it('contains Pending, Paid, and Shipped', () => {
    expect(VALID_ORDER_STATUSES).toContain('Pending');
    expect(VALID_ORDER_STATUSES).toContain('Paid');
    expect(VALID_ORDER_STATUSES).toContain('Shipped');
  });
});
