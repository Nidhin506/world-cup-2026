'use client';

import React, { useState, useEffect } from 'react';
import { getCountdown, CountdownTime } from '../utils/timezone';

export default function Countdown() {
  const targetDate = '2026-06-11T16:00:00Z'; // Opening Kickoff Date
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      setTimeLeft(getCountdown(targetDate));
    }, 0);

    const timer = setInterval(() => {
      setTimeLeft(getCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-4 justify-center items-center h-24">
        <span className="text-muted-foreground animate-pulse text-sm">LOADING COUNTDOWN...</span>
      </div>
    );
  }

  const items = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3 sm:gap-6 justify-center">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center glass-card p-3 sm:p-5 w-16 sm:w-24 transform hover:scale-105 transition-all duration-300 hover:neon-glow-primary"
          >
            <span className="text-2xl sm:text-4xl font-black font-display text-gradient tracking-tight">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-xs font-bold text-on-surface-variant tracking-widest mt-1 font-sans uppercase">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {timeLeft.isOver ? (
        <span className="text-secondary font-bold text-sm uppercase tracking-widest mt-2 animate-bounce">
          🔥 TOURNAMENT HAS KICKED OFF! 🔥
        </span>
      ) : (
        <span className="text-xs sm:text-sm font-semibold text-on-surface-variant uppercase tracking-widest mt-2">
          UNTIL OPENING KICKOFF IN MEXICO CITY
        </span>
      )}
    </div>
  );
}
