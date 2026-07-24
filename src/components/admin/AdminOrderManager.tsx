import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { ShoppingBag, Search, Printer, Truck, Check, Eye } from 'lucide-react';

export const AdminOrderManager: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking } = useStore();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
  };

  const handleUpdateTracking = (id: string, trackingNumber: string, trackingCarrier: string) => {
    updateOrderTracking(id, trackingNumber, [
      { status: `Shipped via ${trackingCarrier}`, timestamp: new Date().toLocaleString(), completed: true }
    ]);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search);
    const matchesStatus = !selectedStatus || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white font-serif">
            Order Fulfillment & Invoice Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage customer shipments, update courier tracking numbers, and print GST tax invoices.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4 text-xs">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Order ID</span>
                <p className="font-mono font-black text-white text-sm">{order.orderNumber}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Customer</span>
                <p className="font-bold text-white">{order.customer.name} ({order.customer.phone})</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Grand Total</span>
                <p className="font-bold text-emerald-400 text-sm">₹{order.total}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Status:</span>
                <select
                  value={order.status}
                  onChange={e => handleUpdateStatus(order.id, e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-rose-400 font-bold px-3 py-1 rounded-xl focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Items summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Items Ordered ({order.items.length})</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-8 h-10 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} | Size: {item.size} | ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-500">Delivery Address</p>
                <p className="text-slate-300">
                  {order.customer.address.street}, {order.customer.address.city}, {order.customer.address.state} - {order.customer.address.zip}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveInvoiceOrder(order)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tax Invoice Modal */}
      {activeInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 space-y-6 my-8 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black font-serif text-slate-900">TAX INVOICE</h2>
                <p className="text-xs text-slate-500 font-mono">Invoice #: {activeInvoiceOrder.orderNumber}</p>
              </div>

              <div className="text-right">
                <p className="font-black text-rose-600 text-lg">Akshvik Tiny Trends</p>
                <p className="text-[11px] text-slate-500">GSTIN: 36AAAC0000A1Z5</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px]">Billed & Shipped To:</p>
                <p className="font-bold text-slate-900">{activeInvoiceOrder.customer.name}</p>
                <p>{activeInvoiceOrder.customer.address.street}</p>
                <p>{activeInvoiceOrder.customer.address.city}, {activeInvoiceOrder.customer.address.state} - {activeInvoiceOrder.customer.address.zip}</p>
                <p>Phone: {activeInvoiceOrder.customer.phone}</p>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px]">Shipment Details:</p>
                <p><strong>Courier:</strong> {activeInvoiceOrder.trackingCarrier}</p>
                <p><strong>Tracking #:</strong> {activeInvoiceOrder.trackingNumber}</p>
                <p><strong>Payment Method:</strong> {activeInvoiceOrder.paymentMethod}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-[10px] border-y border-slate-200">
                  <th className="p-2">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Size</th>
                  <th className="p-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeInvoiceOrder.items.map((it, i) => (
                  <tr key={i}>
                    <td className="p-2 font-bold">{it.name}</td>
                    <td className="p-2">{it.quantity}</td>
                    <td className="p-2">{it.size}</td>
                    <td className="p-2 text-right font-bold">₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-slate-800"
              >
                🖨️ Print Label / Invoice
              </button>

              <button
                onClick={() => setActiveInvoiceOrder(null)}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
