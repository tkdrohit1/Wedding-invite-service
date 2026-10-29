'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Phone,
  Calendar,
  MapPin,
  Lock,
  RefreshCw,
  Search,
  Film,
  KeyRound,
} from 'lucide-react';
import { WeddingInvite } from '@/lib/types';
import { getThemeById } from '@/config/themes';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [invites, setInvites] = useState<WeddingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/invites');
      const data = await res.json();
      if (data.success) {
        setInvites(data.invites);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInvites();
    }
  }, [isAuthenticated, fetchInvites]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setIsVerifying(true);
    setPinError(false);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPin(pinInput);
        setPinError(false);
      } else {
        setPinError(true);
      }
    } catch {
      setPinError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApprove = async (slug: string) => {
    try {
      setActionMessage(`Approving ${slug} & rendering video...`);
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, pin }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Approved! ${slug} is now live and video rendering started.`);
        fetchInvites();
      } else {
        alert(data.error || 'Approval failed');
      }
    } catch {
      alert('Network error approving invite');
    }
  };

  const handleReject = async (slug: string) => {
    if (!confirm(`Are you sure you want to reject ${slug}?`)) return;
    try {
      const res = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, pin }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Rejected ${slug}`);
        fetchInvites();
      }
    } catch {
      alert('Network error rejecting invite');
    }
  };

  const handleSeed70 = async () => {
    setActionMessage('Seeding preview invites for all 70 themes...');
    try {
      const res = await fetch('/api/admin/seed-70', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        fetchInvites();
      }
    } catch {
      alert('Error seeding themes');
    }
  };

  // Filtered lists
  const pendingInvites = invites.filter((i) => i.status === 'pending_approval' && !i.isDemoTemplate);
  const approvedInvites = invites.filter((i) => i.status === 'approved');
  const demoInvites = invites.filter((i) => i.isDemoTemplate);

  const displayedList =
    activeTab === 'pending'
      ? pendingInvites
      : activeTab === 'approved'
      ? approvedInvites
      : invites;

  const filteredList = displayedList.filter((inv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.title.toLowerCase().includes(q) ||
      inv.slug.toLowerCase().includes(q) ||
      inv.couple.groomName.toLowerCase().includes(q) ||
      inv.couple.brideName.toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080a] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl p-8 bg-zinc-900 border border-amber-500/30 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full mx-auto bg-amber-400 text-black flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">
            Owner Admin Portal
          </h1>
          <p className="text-xs text-zinc-400 mb-6">
            Enter your admin credentials to access the management portal.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (pinError) setPinError(false);
              }}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-center text-sm tracking-widest focus:border-amber-400 focus:outline-none"
            />
            {pinError && (
              <p className="text-xs text-red-400">Invalid credentials. Access denied.</p>
            )}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-black/60 border-b border-white/10 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold text-sm shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-amber-200">
                EternalVows Owner Panel
              </h1>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                Approval Gate & Asset Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeed70}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seed All 70 Previews</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 transition-all"
            >
              View Studio Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setActiveTab('pending')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500/15 border-amber-500/50'
                : 'bg-zinc-900 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                Pending Approval
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-amber-300 mt-2">
              {pendingInvites.length}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">Awaiting your permission</p>
          </div>

          <div
            onClick={() => setActiveTab('approved')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'approved'
                ? 'bg-emerald-500/15 border-emerald-500/50'
                : 'bg-zinc-900 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                Approved & Active
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-emerald-300 mt-2">
              {approvedInvites.length}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">Fully unlocked invites</p>
          </div>

          <div
            onClick={() => setActiveTab('all')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'all'
                ? 'bg-blue-500/15 border-blue-500/50'
                : 'bg-zinc-900 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                70 Theme Previews
              </span>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-blue-300 mt-2">
              {demoInvites.length}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">Catalog preview links</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                Total Database Records
              </span>
              <RefreshCw className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-white mt-2">
              {invites.length}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">All stored invites</p>
          </div>
        </div>

        {/* Action notification */}
        {actionMessage && (
          <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs mb-6 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button
              onClick={() => setActionMessage(null)}
              className="text-amber-300 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: 'pending', label: `Pending Requests (${pendingInvites.length})` },
              { id: 'approved', label: `Approved Active (${approvedInvites.length})` },
              { id: 'all', label: `All / Previews (${invites.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'pending' | 'approved' | 'all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-black shadow-lg font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by couple name, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Invites Table / Cards */}
        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-xs animate-pulse">
            Loading invitations...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/60 border border-white/10 rounded-3xl p-8">
            <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 font-serif">
              No invitations found in this tab.
            </p>
            {activeTab === 'pending' && (
              <p className="text-xs text-zinc-500 mt-1">
                New user submissions from the Creator Studio will appear here for your confirmation.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((inv) => {
              const theme = getThemeById(inv.themeId);
              const isApproved = inv.status === 'approved';

              return (
                <div
                  key={inv.id}
                  className="p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : inv.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {isApproved ? 'Approved & Live' : inv.status.replace('_', ' ')}
                      </span>

                      {inv.isDemoTemplate && (
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          70 Theme Demo
                        </span>
                      )}

                      <span className="text-xs font-serif font-bold text-amber-200">
                        Theme: {theme?.name || inv.themeId}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white">
                      {inv.couple.groomName} & {inv.couple.brideName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {new Date(inv.weddingDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {inv.venue.name}
                      </span>
                      {inv.contactInfo?.phone && (
                        <span className="flex items-center gap-1 text-emerald-300 font-mono">
                          <Phone className="w-3.5 h-3.5" />
                          {inv.contactInfo.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                    {/* Visitor 2-Screen Preview link */}
                    <Link
                      href={`/invite/${inv.slug}`}
                      target="_blank"
                      className="px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center gap-1.5 transition-colors"
                      title="View as standard visitor (2-screen restricted preview)"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Preview (Restricted)</span>
                    </Link>

                    {/* Admin Full Bypass Link */}
                    <Link
                      href={`/invite/${inv.slug}?admin=1`}
                      target="_blank"
                      className="px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center gap-1.5 transition-colors"
                      title="View full unrestricted invitation"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      <span>Admin View (Full)</span>
                    </Link>

                    {/* Approve Button */}
                    {!isApproved && (
                      <button
                        onClick={() => handleApprove(inv.slug)}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Approve & Render Video</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {inv.status === 'pending_approval' && (
                      <button
                        onClick={() => handleReject(inv.slug)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
