'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMatchSimulatorStore } from '../store/matchSimulator';

const MONITORING_START = new Date('2026-06-10T12:00:00Z').getTime();
const TOURNAMENT_END = new Date('2026-07-20T00:00:00Z').getTime(); // Post-tournament starts July 20

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const { 
    matches, 
    activeMatchId, 
    fetchMatches, 
    fetchMatchDetail, 
    syncAll, 
    setSyncStates,
    isLiveConnected,
    quotaSafetyActive 
  } = useMatchSimulatorStore();

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detailTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const pathname = usePathname();
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [timeTrigger, setTimeTrigger] = useState(0);

  // Diagnostic Logging for Polling Transitions
  const prevSyncModeRef = useRef<string | null>(null);
  const { syncMode, refreshFrequency } = useMatchSimulatorStore();

  useEffect(() => {
    if (prevSyncModeRef.current !== syncMode) {
      console.log(`[DIAGNOSTIC] Client: Polling frequency change: mode transitioned from ${prevSyncModeRef.current || 'INITIAL'} to ${syncMode}. Polling Interval: ${refreshFrequency}`);
      if (syncMode === 'LIVE_MATCH') {
        console.log(`[DIAGNOSTIC] Client: A match entered LIVE status! System automatically switched from Monitoring Mode (10m) to Live Match Mode (30s).`);
      }
      prevSyncModeRef.current = syncMode;
    }
  }, [syncMode, refreshFrequency]);

  // 1. Tab visibility listener
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 2. Date transition watcher (runs every 60 seconds locally to check for stage changes)
  useEffect(() => {
    transitionTimerRef.current = setInterval(() => {
      setTimeTrigger(Date.now());
    }, 60000);

    return () => {
      if (transitionTimerRef.current) {
        clearInterval(transitionTimerRef.current);
      }
    };
  }, []);

  // Determine if the user is currently viewing a match-related page
  const isViewingMatchPage = pathname === '/' || pathname === '/matches' || pathname.startsWith('/matches/');

  // 3. Primary Sync Loop Manager
  useEffect(() => {
    // Clear any active polling timer
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    const now = Date.now();

    // A. Paused checks (visibility or route)
    if (!isTabVisible) {
      setSyncStates({
        syncMode: 'TAB_HIDDEN',
        nextCheckTime: null,
        refreshFrequency: 'Paused',
      });
      return;
    }

    if (!isViewingMatchPage) {
      setSyncStates({
        syncMode: 'NON_MATCH_PAGE',
        nextCheckTime: null,
        refreshFrequency: 'Paused',
      });
      return;
    }

    // B. Check for active live matches
    const hasLiveMatch = matches.some((m) => m.status === 'LIVE');
    if (hasLiveMatch) {
      const intervalTime = quotaSafetyActive ? 600000 : 30000; // 10 minutes if safety is active, 30s otherwise
      const performSync = () => {
        fetchMatches();
        setSyncStates({
          nextCheckTime: Date.now() + intervalTime,
        });
      };
      setSyncStates({
        syncMode: 'LIVE_MATCH',
        refreshFrequency: quotaSafetyActive ? '10 minutes (Quota Safety Active)' : '30 seconds',
        nextCheckTime: Date.now() + intervalTime,
      });
      pollTimerRef.current = setInterval(performSync, intervalTime);
      return;
    }

    // C. Date range checks (only active when no match is live)
    if (now < MONITORING_START) {
      setSyncStates({
        syncMode: 'PRE_TOURNAMENT',
        nextCheckTime: null,
        refreshFrequency: 'None',
        apiConnectionStatus: isLiveConnected ? 'Idle' : 'Fallback'
      });
      return;
    }

    if (now > TOURNAMENT_END) {
      setSyncStates({
        syncMode: 'COMPLETED',
        nextCheckTime: null,
        refreshFrequency: 'None',
        apiConnectionStatus: isLiveConnected ? 'Idle' : 'Fallback'
      });
      return;
    }

    // D. Default to Active Monitoring Mode
    const intervalTime = 600000; // 10m
    const performSync = () => {
      fetchMatches();
      setSyncStates({
        nextCheckTime: Date.now() + intervalTime,
      });
    };
    setSyncStates({
      syncMode: 'MONITORING',
      refreshFrequency: '10 minutes',
      nextCheckTime: Date.now() + intervalTime,
    });
    pollTimerRef.current = setInterval(performSync, intervalTime);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [matches, fetchMatches, isTabVisible, isViewingMatchPage, timeTrigger, isLiveConnected, setSyncStates]);

  // 4. Initial Sync on Mount
  useEffect(() => {
    const now = Date.now();
    // Only perform syncAll on mount if we are within the tournament window
    if (now >= MONITORING_START && now <= TOURNAMENT_END) {
      syncAll();
    } else {
      // In pre-tournament or completed modes, we still run standings computation once to render static data
      useMatchSimulatorStore.getState().fetchStandings();
    }
  }, [syncAll]);

  // 5. Optimized Match Details Polling
  useEffect(() => {
    if (detailTimerRef.current) {
      clearInterval(detailTimerRef.current);
      detailTimerRef.current = null;
    }

    const now = Date.now();
    // Only poll details if within tournament window
    if (now < MONITORING_START || now > TOURNAMENT_END) {
      return;
    }

    // Only poll details if we have an active match, tab is active, and we are in the Match Center
    if (!activeMatchId || !isTabVisible || !pathname.startsWith('/matches/')) {
      return;
    }

    // Determine if active match is live
    const activeMatch = matches.find((m) => m.id === activeMatchId);
    const isLive = activeMatch?.status === 'LIVE';

    // Do NOT poll match details if the match is not live (idle/completed details do not change)
    if (!isLive) {
      return;
    }

    // Poll live match details every 30s
    const intervalTime = 30000;

    detailTimerRef.current = setInterval(() => {
      fetchMatchDetail(activeMatchId);
    }, intervalTime);

    return () => {
      if (detailTimerRef.current) {
        clearInterval(detailTimerRef.current);
        detailTimerRef.current = null;
      }
    };
  }, [activeMatchId, matches, fetchMatchDetail, isTabVisible, pathname, timeTrigger]);

  return <>{children}</>;
}
