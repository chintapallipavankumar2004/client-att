import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';

export const AdminCustomerManager: React.FC = () => {
  const { customers } = useStore();

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-500" /> Customer CRM Directory
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          View registered parents, purchase history totals, and shipping details.
        </p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3.5">Customer Name</th>
              <th className="p-3.5">Contact Details</th>
              <th className="p-3.5">Total Orders</th>
              <th className="p-3.5">Lifetime Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-3.5 font-bold text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-xs">
                    {c.name.charAt(0)}
                  </div>
                  {c.name}
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-400">
                  <p>{c.email}</p>
                  <p>{c.phone}</p>
                </td>
                <td className="p-3.5 font-bold">{c.totalOrders} Orders</td>
                <td className="p-3.5 font-bold text-emerald-400">₹{c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
