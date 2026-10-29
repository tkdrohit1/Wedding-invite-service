'use client';

import React, { useState } from 'react';
import { Heart, Send, MessageCircle } from 'lucide-react';
import { BlessingItem, ThemeDefinition } from '@/lib/types';

interface BlessingsWallProps {
  slug: string;
  initialMessages: BlessingItem[];
  theme: ThemeDefinition;
}

export function BlessingsWall({ slug, initialMessages, theme }: BlessingsWallProps) {
  const [messages, setMessages] = useState<BlessingItem[]>(initialMessages || []);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch(`/api/invites/${slug}/blessing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, message }),
      });
      const data = await res.json();
      if (data.success && data.blessing) {
        setMessages([data.blessing, ...messages]);
        setAuthor('');
        setMessage('');
        setStatus('Thank you for your heartfelt blessing! ✨');
      } else {
        setStatus(data.error || 'Failed to submit blessing');
      }
    } catch {
      setStatus('Network error, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <span
          className="text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
          style={{ color: theme.primaryColor }}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Blessings & Wishes</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 text-white">
          Guestbook of Blessings
        </h2>
        <div
          className="w-16 h-0.5 mx-auto mt-3"
          style={{ backgroundColor: theme.primaryColor }}
        />
      </div>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-xl shadow-2xl mb-8"
        style={{ backgroundColor: theme.cardBg || 'rgba(15,15,15,0.85)' }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Ramesh Uncle / Priya Sharma"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
              Your Blessing / Message
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your prayers, heartfelt wishes, and love for the couple..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-semibold tracking-wider text-xs uppercase flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
            style={{
              backgroundColor: theme.primaryColor,
              color: '#000',
            }}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Sending Blessing...' : 'Send Warm Blessing'}</span>
          </button>
        </div>
        {status && (
          <p className="mt-3 text-xs text-center text-amber-200 font-medium">
            {status}
          </p>
        )}
      </form>

      {/* Message Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-zinc-500 py-6 italic">
            Be the first to leave a warm blessing for the couple!
          </p>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-4 sm:p-5 border border-white/5 bg-white/[0.03] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-serif font-bold text-sm text-amber-200 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current text-amber-400" />
                  {item.author}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
