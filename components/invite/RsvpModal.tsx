'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, HeartHandshake, PhoneCall } from 'lucide-react';
import { ThemeDefinition, WeddingInvite } from '@/lib/types';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  invite: WeddingInvite;
  theme: ThemeDefinition;
}

export function RsvpModal({ isOpen, onClose, invite, theme }: RsvpModalProps) {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(2);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/invites/${invite.slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          attending,
          guestCount,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden"
            style={{ backgroundColor: theme.cardBg || '#140505' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border mb-4"
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                >
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  RSVP Received!
                </h3>
                <p className="text-sm text-zinc-300 max-w-sm mx-auto mb-6">
                  {attending
                    ? 'Thank you! We eagerly look forward to celebrating this joyous milestone with you.'
                    : 'Thank you for letting us know. You will be missed!'}
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-full font-semibold text-xs tracking-wider uppercase"
                  style={{ backgroundColor: theme.primaryColor, color: '#000' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <span
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: theme.primaryColor }}
                  >
                    Kindly Respond
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-white mt-1">
                    RSVP to the Wedding
                  </h3>
                  {invite.rsvp.deadline && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Please respond by {invite.rsvp.deadline}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Your Full Name / Family Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Anand & Kavita Iyer"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                    Will You Be Attending?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttending(true)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${
                        attending
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-white/10 bg-white/5 text-zinc-400'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Joyfully Accept</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending(false)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${
                        !attending
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-white/10 bg-white/5 text-zinc-400'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Regretfully Decline</span>
                    </button>
                  </div>
                </div>

                {attending && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                      Number of Guests Attending
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestCount(num)}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            guestCount === num
                              ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                              : 'border-white/10 bg-white/5 text-zinc-400'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Special Note / Dietary Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Vegetarian / Jain meal / Arrival timing..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm resize-none"
                  />
                </div>

                {invite.rsvp.phone && (
                  <p className="text-xs text-center text-zinc-400 flex items-center justify-center gap-1.5 pt-2">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Or reach out at: {invite.rsvp.phone}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-semibold tracking-wider text-xs uppercase flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-xl mt-4"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: '#000',
                  }}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming RSVP...' : 'Confirm My RSVP'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
