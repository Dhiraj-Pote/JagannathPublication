import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Package, Calendar, IndianRupee } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate, getStatusBadgeStyles } from '@/lib/order-helpers';
import type { Order, OrderItem } from '@/lib/types';

function StatusBadge({ status }: { status: Order['status'] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(status)}`}
    >
      {status}
    </span>
  );
}

function EmptyOrders() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-saffron/10">
        <Package className="size-10 text-saffron/60" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">
        No orders yet
      </h2>
      <p className="mt-3 text-muted-foreground">
        Your spiritual journey through books awaits. Browse our sacred collection
        and place your first order.
      </p>
      <Button
        asChild
        className="mt-6 bg-saffron text-white hover:bg-saffron-dark"
      >
        <Link href="/">Browse Books</Link>
      </Button>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow sm:rounded-2xl sm:p-6">
      {/* Order Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/10 sm:size-10">
            <Package className="size-4 text-gold sm:size-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground sm:text-xs">Order ID</p>
            <p className="font-mono text-xs text-foreground sm:text-sm">
              {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <Separator className="my-3 sm:my-4" />

      {/* Order Items */}
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, index) => (
          <div
            key={`${order.id}-${item.book_id}-${index}`}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <BookOpen className="size-3.5 shrink-0 text-saffron/60 sm:size-4" />
              <span className="text-xs text-foreground sm:text-sm">{item.title}</span>
              <span className="text-[10px] text-muted-foreground sm:text-xs">
                × {item.quantity}
              </span>
            </div>
            <span className="shrink-0 text-xs font-medium text-foreground sm:text-sm">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-3 sm:my-4" />

      {/* Order Footer */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <Calendar className="size-3.5 sm:size-4" />
          <span>{formatDate(order.created_at)}</span>
        </div>
        <div className="flex items-center gap-1 text-base font-bold text-saffron sm:text-lg">
          <IndianRupee className="size-3.5 sm:size-4" />
          <span>{(order.total_amount / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default async function OrdersPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          Authentication is not configured yet. Please{' '}
          <Link href="/auth/login" className="text-saffron underline hover:text-saffron-dark">
            log in
          </Link>{' '}
          to view your orders.
        </p>
      </div>
    );
  }

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gracefully handle case where user is null (middleware should redirect, but just in case)
  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          Please{' '}
          <Link href="/auth/login" className="text-saffron underline hover:text-saffron-dark">
            log in
          </Link>{' '}
          to view your orders.
        </p>
      </div>
    );
  }

  // Look up the user's internal ID from the users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  let orders: Order[] = [];

  if (userProfile) {
    // Fetch all orders for this user, most recent first
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (ordersData) {
      orders = ordersData as Order[];
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      {/* Page Header */}
      <div className="mb-5 sm:mb-8">
        <h1 className="font-serif text-xl font-semibold text-foreground sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
          Track your spiritual book purchases.
        </p>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-saffron via-gold to-saffron-light sm:mt-4 sm:w-16" />
      </div>

      {/* Orders List or Empty State */}
      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
