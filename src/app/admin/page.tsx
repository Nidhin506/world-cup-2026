'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMatchSimulatorStore } from '../../store/matchSimulator';
import { 
  ArrowLeft, RefreshCw, Activity, ShieldCheck, Database, 
  Terminal, ShieldAlert, Zap, Clock, AlertTriangle, Key, Shield
} from 'lucide-react';

export default function AdminPage() {
  const { 
    syncMode,
    nextCheckTime,
    refreshFrequency,
    dataSource,
    apiConnectionStatus,
    lastUpdated,
    isLoading,
    fetchMatches,
    syncAll
  } = useMatchSimulatorStore();

  const [dbDiagnostics, setDbDiagnostics] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagError, setDiagError] = useState<string | null>(null);
  const [countdownText, setCountdownText] = useState('N/A');

  // 1. Fetch dynamic diagnostics from server endpoint
  const fetchDiagnostics = async () => {
    setDiagLoading(true);
    try {
      const res = await fetch('/api/admin/diagnostics');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDbDiagnostics(data);
      setDiagError(null);
    } catch (e: any) {
      setDiagError(e.message || 'Failed to load diagnostics from server.');
    } finally {
      setDiagLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 5000); // refresh diagnostic variables every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // 2. Scheduled Check Timer countdown
  useEffect(() => {
    if (!nextCheckTime || syncMode === 'PRE_TOURNAMENT' || syncMode === 'COMPLETED') {
      setCountdownText('N/A');
      return;
    }

    const updateCountdown = () => {
      const diff = nextCheckTime - Date.now();
      if (diff <= 0) {
        setCountdownText('Syncing...');
        return;
      }
      
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setCountdownText(`${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextCheckTime, syncMode]);

  // Actions
  const handleForceSync = async () => {
    await fetchMatches(false);
    fetchDiagnostics();
  };

  const handleForceBypassSync = async () => {
    await syncAll();
    fetchDiagnostics();
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-foreground font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider font-display"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
            <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 uppercase tracking-widest text-sm">
              Secured Developer Mode
            </span>
          </div>
        </div>

        {/* Dashboard Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-display uppercase tracking-tight text-on-surface flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" /> Diagnostics Console
          </h1>
          <p className="text-xs text-muted-foreground">
            System performance monitoring, memory caching metrics, and API-Football configuration diagnostics.
          </p>
        </div>

        {diagError && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <span>{diagError}</span>
          </div>
        )}

        {dbDiagnostics?.usage?.warningTriggered && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-500" />
            <span>
              <b>Warning:</b> API Usage has reached <b>{dbDiagnostics.usage.usedToday}</b> requests (80% of daily free-tier quota). Consider reducing active matches browsing or throttling intervals.
            </span>
          </div>
        )}

        {dbDiagnostics?.usage?.safetyTriggered && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold animate-pulse">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>
              <b>Quota Safety Active:</b> API Usage has reached <b>{dbDiagnostics.usage.usedToday}</b> requests (90% of daily free-tier quota). Client active-mode polling has been automatically throttled to 10-minute intervals.
            </span>
          </div>
        )}

        {/* Diagnostic Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel 1: API Configuration Diagnostics */}
          <div className="glass-card p-6 border border-orange-500/5 space-y-4">
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-primary flex items-center gap-2">
              <Key className="w-4 h-4" /> API Configuration
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">API_FOOTBALL_KEY</span>
                <span className={`font-bold ${dbDiagnostics?.isApiKeyConfigured ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {dbDiagnostics?.isApiKeyConfigured ? '✅ Configured' : '❌ Not Configured'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Provider Endpoint</span>
                <span className="font-bold text-foreground break-all text-right max-w-[180px]">
                  {dbDiagnostics?.apiHost || 'v3.football.api-sports.io'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Target League ID</span>
                <span className="font-bold text-foreground">
                  {dbDiagnostics?.leagueId || '1'} (FIFA World Cup)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Target Season</span>
                <span className="font-bold text-foreground">{dbDiagnostics?.season || '2026'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Connection Status</span>
                <span className={`font-bold ${
                  apiConnectionStatus === 'Connected' ? 'text-emerald-400' :
                  apiConnectionStatus === 'Fallback' ? 'text-amber-500' : 'text-rose-400'
                }`}>{apiConnectionStatus}</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Synchronization Diagnostics */}
          <div className="glass-card p-6 border border-orange-500/5 space-y-4">
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-primary flex items-center gap-2">
              <Clock className="w-4 h-4" /> Poll & Timers Status
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Sync Mode</span>
                <span className="font-bold text-foreground uppercase">{syncMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Polling Frequency</span>
                <span className="font-bold text-secondary">{refreshFrequency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Next Check</span>
                <span className="font-bold text-primary">{countdownText}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Active Timers</span>
                <span className={`font-bold ${
                  syncMode === 'TAB_HIDDEN' || syncMode === 'NON_MATCH_PAGE' || syncMode === 'PRE_TOURNAMENT' || syncMode === 'COMPLETED'
                    ? 'text-amber-500'
                    : 'text-emerald-400'
                }`}>
                  {syncMode === 'TAB_HIDDEN' || syncMode === 'NON_MATCH_PAGE' || syncMode === 'PRE_TOURNAMENT' || syncMode === 'COMPLETED'
                    ? 'Paused / Off'
                    : 'Active'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Last Successful Sync</span>
                <span className="font-bold text-foreground">
                  {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('en-IN') : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Panel 3: Cache Monitoring */}
          <div className="glass-card p-6 border border-orange-500/5 space-y-4">
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-primary flex items-center gap-2">
              <Database className="w-4 h-4" /> Server Cache TTLs
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Events Cache TTL</span>
                <span className="font-bold text-foreground">30 seconds</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Statistics Cache TTL</span>
                <span className="font-bold text-foreground">60 seconds</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Lineups Cache TTL</span>
                <span className="font-bold text-foreground">24 hours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Fixtures (Live/Idle)</span>
                <span className="font-bold text-foreground">30s / 10m</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Server Cache Status</span>
                <span className="font-bold text-emerald-400">Optimal</span>
              </div>
            </div>
          </div>

        </div>

        {/* Diagnostics & Request Counters Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Request Monitoring */}
          <div className="glass-card p-6 border border-orange-500/5 lg:col-span-1 space-y-4">
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-primary flex items-center gap-2">
              <Activity className="w-4 h-4" /> API Quota & Safety
            </h3>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Daily Quota Consumption</span>
                  <span className="font-bold text-foreground">
                    {dbDiagnostics?.usage?.usedToday || 0} / {dbDiagnostics?.usage?.dailyLimit || 100} reqs
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      dbDiagnostics?.usage?.safetyTriggered ? 'bg-rose-500 animate-pulse' :
                      dbDiagnostics?.usage?.warningTriggered ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min(100, ((dbDiagnostics?.usage?.usedToday || 0) / (dbDiagnostics?.usage?.dailyLimit || 100)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5 text-[11px]">
                <span className="text-muted-foreground">Remaining Requests</span>
                <span className="font-bold text-foreground">{dbDiagnostics?.usage?.remaining ?? 100} reqs</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5 text-[11px]">
                <span className="text-muted-foreground">Est. Rate per Hour</span>
                <span className="font-bold text-foreground text-secondary">{dbDiagnostics?.usage?.estimatedRequestsPerHour || 6} reqs/hr</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5 text-[11px]">
                <span className="text-muted-foreground">Est. Time to Exhaustion</span>
                <span className={`font-bold ${dbDiagnostics?.usage?.safetyTriggered ? 'text-rose-400' : 'text-primary'}`}>
                  {typeof dbDiagnostics?.usage?.hoursRemaining === 'number' ? `${dbDiagnostics.usage.hoursRemaining} hours` : dbDiagnostics?.usage?.hoursRemaining || 'Unlimited'}
                </span>
              </div>

              <div className="flex justify-between py-1 text-[11px]">
                <span className="text-muted-foreground">Safety Mode Active</span>
                <span className={`font-bold ${dbDiagnostics?.usage?.safetyTriggered ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {dbDiagnostics?.usage?.safetyTriggered ? '🔴 Yes (Throttled)' : '🟢 No (Normal)'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Memory Cache Entries list */}
          <div className="glass-card p-6 border border-orange-500/5 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-primary flex items-center gap-2">
              <Database className="w-4 h-4" /> Active Cache Keys
            </h3>
            
            <div className="max-h-[160px] overflow-y-auto text-xs font-mono divide-y divide-white/5">
              {!dbDiagnostics?.cacheKeys || dbDiagnostics.cacheKeys.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground italic">No server-side cache keys currently initialized.</div>
              ) : (
                dbDiagnostics.cacheKeys.map((c: any, i: number) => (
                  <div key={i} className="flex justify-between py-2 items-center">
                    <span className="text-foreground font-semibold font-mono truncate max-w-[320px]" title={c.key}>
                      🔑 {c.key}
                    </span>
                    <span className="font-mono text-muted-foreground flex-shrink-0 text-right">
                      exp: <span className="text-primary font-bold">{Math.round(c.ttlRemaining / 1000)}s</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Action Controls & Debug Logs Panel */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Diagnostics Actions */}
          <div className="glass-card p-6 border border-orange-500/5 space-y-4">
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-primary flex items-center gap-2">
              ⚙️ Debug Diagnostics Actions
            </h3>
            
            <div className="flex flex-wrap gap-3 font-display">
              <button
                onClick={handleForceSync}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-foreground font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Regular Sync
              </button>

              <button
                onClick={handleForceBypassSync}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                Force Cache Bypass Sync (refresh=true)
              </button>

              <button
                onClick={fetchDiagnostics}
                disabled={diagLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-foreground font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Activity className={`w-3.5 h-3.5 ${diagLoading ? 'animate-pulse' : ''}`} />
                Refresh Diagnostics
              </button>
            </div>
          </div>

          {/* System Debug Logs Console */}
          <div className="glass-card p-6 border border-orange-500/5 space-y-4">
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-primary flex items-center gap-2">
              <Terminal className="w-4 h-4" /> System Diagnostics Error Log
            </h3>
            
            <div className="bg-[#05080f] p-4 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed text-slate-300">
              <div className="text-slate-500 pb-2 mb-2 border-b border-white/5 flex justify-between">
                <span>Diag Log Console v1.0</span>
                <span>Active: {apiConnectionStatus}</span>
              </div>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {!dbDiagnostics?.errors || dbDiagnostics.errors.length === 0 ? (
                  <div className="text-emerald-400 font-semibold italic">System normal: 0 warnings, 0 API-Football integration errors logged.</div>
                ) : (
                  dbDiagnostics.errors.map((err: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-x-2 text-rose-400 items-start">
                      <span className="text-slate-500 flex-shrink-0">
                        [{new Date(err.timestamp).toLocaleTimeString()}]
                      </span>
                      <span className="text-slate-400 font-bold flex-shrink-0">
                        ({err.endpoint}):
                      </span>
                      <span className="text-rose-400 break-all">{err.error}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
