import { useState } from 'react';
import { ShoppingBag, Calendar, DollarSign, Download, Package } from 'lucide-react';
import UserLayout from '../UserLayout';
const MyOrders = () => {
  const [orders] = useState([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      items: ['Wellness Package - Premium', 'Meditation Cushion', 'Yoga Mat'],
      total: 149.99,
      status: 'delivered',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      items: ['Nutrition Guide Book', 'Healthy Recipe Collection'],
      total: 49.99,
      status: 'delivered',
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-08',
      items: ['Support Group Membership - Annual'],
      total: 299.99,
      status: 'processing',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-2023-045',
      date: '2023-12-20',
      items: ['Aromatherapy Kit', 'Essential Oils Set'],
      total: 79.99,
      status: 'delivered',
      paymentMethod: 'Debit Card'
    }
  ]);

  const statusStyles = {
    delivered: 'bg-green-500/10 text-green-600',
    processing: 'bg-blue-500/10 text-blue-600',
    cancelled: 'bg-red-500/10 text-red-600',
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter(o => o.status === "delivered").length;

  return (
    <UserLayout>
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          My Orders
        </h1>
        <p className="text-muted-foreground mt-1">Track and manage your purchases</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Total Orders */}
        <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <h3 className="text-2xl font-bold">{orders.length}</h3>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <h3 className="text-2xl font-bold">{completedOrders}</h3>
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <h3 className="text-2xl font-bold">${totalSpent.toFixed(2)}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-lg transition p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              {/* Order left section */}
              <div className="flex-1">

                {/* ID + Date + Status */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{order.id}</h3>

                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order items */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Items:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-4 text-sm mt-2">
                    <div>
                      <span className="text-muted-foreground">Payment: </span>
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row lg:flex-col gap-2 min-w-[120px]">
                <button className="w-full flex items-center justify-center gap-2 border border-border/60 rounded-lg px-3 py-2 text-sm hover:bg-accent transition">
                  <Download className="w-4 h-4" />
                  Invoice
                </button>

                {order.status === 'delivered' && (
                  <button className="w-full flex items-center justify-center gap-2 border border-border/60 rounded-lg px-3 py-2 text-sm hover:bg-accent transition">
                    Reorder
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No orders yet</h3>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </div>
      )}
    </div>
    </UserLayout>
  );
};

export default MyOrders;
