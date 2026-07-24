import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Star, Check, X, CornerDownRight } from 'lucide-react';

export const AdminReviewsManager: React.FC = () => {
  const { reviews, updateReviewStatus } = useStore();
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  const handleUpdateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    updateReviewStatus(id, status);
  };

  const handleSendReply = (id: string) => {
    const text = replyText[id];
    if (!text) return;
    setReplyText({ ...replyText, [id]: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-rose-500" /> Customer Reviews Moderation
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Approve or reject parent reviews and publish official store replies.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm">{r.customerName}</span>
                <span className="text-slate-400 ml-2">on {r.productName}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="flex text-amber-400">
              {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>

            <p className="font-bold text-white">{r.title}</p>
            <p className="text-slate-300 italic">"{r.comment}"</p>

            {r.adminReply && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-rose-300 flex items-start gap-2">
                <CornerDownRight className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Store Owner Reply:</strong> {r.adminReply}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Type official store reply..."
                  value={replyText[r.id] || ''}
                  onChange={e => setReplyText({ ...replyText, [r.id]: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
                <button
                  onClick={() => handleSendReply(r.id)}
                  className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-rose-500"
                >
                  Reply
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(r.id, 'Approved')}
                  className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-500 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                  className="bg-slate-800 text-slate-400 font-bold px-3 py-1.5 rounded-xl hover:bg-rose-600 hover:text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
