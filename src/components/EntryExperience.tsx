'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipForward, Sparkles } from 'lucide-react';

// Web Audio API Ambience Engine to generate realistic offline stadium crowd noise
class StadiumAmbienceEngine {
  private ctx: AudioContext | null = null;
  private mainGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private chantSource: AudioBufferSourceNode | null = null;
  private drumOsc: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private drumLfo: OscillatorNode | null = null;
  public isPlaying = false;

  public start() {
    if (this.isPlaying) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Resume context if suspended (browser security autoplays block)
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.mainGain.connect(this.ctx.destination);

      // Create a shared white noise buffer for crowd rumble
      const bufferSize = this.ctx.sampleRate * 2.5; // 2.5s loop
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // 1. Deep crowd murmur (low-pass filtered white noise at 420Hz for laptop speaker response)
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(420, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

      this.noiseSource.connect(lowFilter);
      lowFilter.connect(noiseGain);
      noiseGain.connect(this.mainGain);

      // 2. Vocal crowd cheers/chants (band-pass filtered at 950Hz)
      this.chantSource = this.ctx.createBufferSource();
      this.chantSource.buffer = buffer;
      this.chantSource.loop = true;

      const chantFilter = this.ctx.createBiquadFilter();
      chantFilter.type = 'bandpass';
      chantFilter.frequency.setValueAtTime(950, this.ctx.currentTime);
      chantFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const chantGain = this.ctx.createGain();
      chantGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      // Slow LFO to swell the crowd chants
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 5s cycle

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.lfo.connect(lfoGain);
      lfoGain.connect(chantGain.gain);

      this.chantSource.connect(chantFilter);
      chantFilter.connect(chantGain);
      chantGain.connect(this.mainGain);

      // 3. Matchday heartbeat drum (pitch increased to 80Hz for better speaker punch)
      this.drumOsc = this.ctx.createOscillator();
      this.drumOsc.type = 'sine';
      this.drumOsc.frequency.setValueAtTime(80, this.ctx.currentTime);

      const drumGain = this.ctx.createGain();
      drumGain.gain.setValueAtTime(0, this.ctx.currentTime);

      // Pulse the drum gain using another LFO
      this.drumLfo = this.ctx.createOscillator();
      this.drumLfo.type = 'sine';
      this.drumLfo.frequency.setValueAtTime(0.4, this.ctx.currentTime); // Drum beat every 2.5 seconds

      const drumLfoGain = this.ctx.createGain();
      drumLfoGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

      this.drumLfo.connect(drumLfoGain);
      drumLfoGain.connect(drumGain.gain);

      this.drumOsc.connect(drumGain);
      drumGain.connect(this.mainGain);

      // Start all sound generator nodes
      this.noiseSource.start(0);
      this.chantSource.start(0);
      this.drumOsc.start(0);
      this.lfo.start(0);
      this.drumLfo.start(0);

      // Fade in overall sound to a solid, cinematic volume level
      this.mainGain.gain.linearRampToValueAtTime(0.85, this.ctx.currentTime + 1.2);
      this.isPlaying = true;
    } catch (e) {
      console.error('Failed to initialize Web Audio Ambience Engine:', e);
    }
  }

  public stop() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const activeCtx = this.ctx;
      const activeGain = this.mainGain;

      if (activeGain) {
        activeGain.gain.linearRampToValueAtTime(0.001, activeCtx.currentTime + 0.6);
        setTimeout(() => {
          try {
            activeCtx.close();
          } catch {
            // Context already closed or inactive
          }
        }, 700);
      }
    } catch (e) {
      console.error(e);
    }
    this.isPlaying = false;
  }
}

export default function EntryExperience() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [lightsActive, setLightsActive] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const audioEngineRef = useRef<StadiumAmbienceEngine | null>(null);

  // Helper functions declared first to avoid hoisting/access issues
  const handleClose = () => {
    setIsExiting(true);
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    
    // Save preference to session storage to prevent showing during internal site navigation
    sessionStorage.setItem('fifa-2026-entry-seen', 'true');
    
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, 1000); // match transition out length
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => !prev);
  };

  // 1. Check user visit limits in localStorage (Once per day check)
  useEffect(() => {
    // Check if we are running in the browser
    if (typeof window === 'undefined') return;

    // Listen for custom trigger (e.g. from footer replay button)
    const handleReplay = () => {
      setIsVisible(true);
      setIsExiting(false);
      setLightsActive(false);
      document.body.style.overflow = 'hidden';
    };
    window.addEventListener('replay-fifa-intro', handleReplay);

    // Support url bypass: http://localhost:3000/?welcome=true
    const urlParams = new URLSearchParams(window.location.search);
    const forceWelcome = urlParams.get('welcome') === 'true';

    const lastSeen = sessionStorage.getItem('fifa-2026-entry-seen');

    if (forceWelcome || !lastSeen) {
      // Defer state update to next tick to avoid synchronous render cascade
      setTimeout(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
      }, 0);
    }

    return () => {
      window.removeEventListener('replay-fifa-intro', handleReplay);
    };
  }, []);

  // 2. Sequential timing of stadium lights and reveal
  useEffect(() => {
    if (!isVisible || isExiting) return;

    // Stage 1: Turn on the stadium floodlights after 600ms
    const lightsTimer = setTimeout(() => {
      setLightsActive(true);
    }, 600);

    // Stage 2: Auto transition to main website after 6 seconds
    const autoExitTimer = setTimeout(() => {
      handleClose();
    }, 6000);

    return () => {
      clearTimeout(lightsTimer);
      clearTimeout(autoExitTimer);
    };
  }, [isVisible, isExiting]);

  // 3. Audio engine sync with state
  useEffect(() => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new StadiumAmbienceEngine();
    }

    if (isAudioEnabled && isVisible && !isExiting) {
      audioEngineRef.current.start();
    } else {
      audioEngineRef.current.stop();
    }

    return () => {
      audioEngineRef.current?.stop();
    };
  }, [isAudioEnabled, isVisible, isExiting]);

  // 4. Keyboard accessibility support (Enter to enter, Escape to skip) with a small mount cooldown
  useEffect(() => {
    if (!isVisible) return;

    const mountTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      // Ignore key events in the first 500ms to avoid address-bar Enter propagation
      if (Date.now() - mountTime < 500) {
        return;
      }
      
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
          className="fixed inset-0 z-[99999] bg-[#05070c] text-white flex flex-col justify-between overflow-hidden font-sans select-none"
          role="dialog"
          aria-modal="true"
          aria-label="FIFA World Cup 2026 Experience Welcome"
        >
          {/* Background visuals */}
          <div className="absolute inset-0 z-0">
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Stadium Lights Radial Glow */}
            <motion.div 
              animate={{ 
                opacity: lightsActive ? 0.35 : 0.05,
                scale: lightsActive ? 1.1 : 0.9
              }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-b from-orange-500/25 via-amber-500/5 to-transparent rounded-full blur-[120px] pointer-events-none"
            />

            {/* Moving Light Beams */}
            {lightsActive && (
              <>
                <motion.div 
                  initial={{ rotate: -25, opacity: 0 }}
                  animate={{ rotate: [-20, -10, -20], opacity: [0.15, 0.25, 0.15] }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                  className="absolute -top-[10%] left-[15%] w-32 h-[120vh] origin-top bg-gradient-to-b from-white/10 to-transparent blur-[30px]"
                />
                <motion.div 
                  initial={{ rotate: 25, opacity: 0 }}
                  animate={{ rotate: [20, 10, 20], opacity: [0.15, 0.25, 0.15] }}
                  transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
                  className="absolute -top-[10%] right-[15%] w-32 h-[120vh] origin-top bg-gradient-to-b from-white/10 to-transparent blur-[30px]"
                />
              </>
            )}

            {/* Crowd Silhouette Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#030509] to-transparent z-10 pointer-events-none" />
            
            {/* Atmospheric Fog Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-64 z-20 pointer-events-none">
              <motion.div 
                animate={{ x: ['-5%', '5%', '-5%'] }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(249,115,22,0.08)_0%,_transparent_65%)] blur-[40px] opacity-70"
              />
            </div>
          </div>

          {/* Top Row Controls */}
          <div className="w-full max-w-7xl mx-auto px-6 py-6 z-30 flex justify-between items-center">
            {/* Logo placeholder */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
              <span className="font-display font-black tracking-widest text-[10px] text-orange-500 uppercase">
                FIFA WORLD CUP 2026
              </span>
            </div>

            {/* Audio Toggle Option */}
            <button
              onClick={toggleAudio}
              className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/40 transition-all duration-300 cursor-pointer"
              title="Stadium Ambience Toggle"
              aria-label={isAudioEnabled ? 'Mute Crowd Ambience' : 'Play Crowd Ambience'}
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-orange-500">Mute Ambience</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground group-hover:text-white">Play Ambience</span>
                </>
              )}
            </button>
          </div>

          {/* Central Trophy Reveal Area */}
          <div className="flex-grow flex flex-col justify-center items-center px-4 relative z-30">
            {/* Golden Shimmer Ring */}
            <motion.div 
              animate={{ 
                opacity: lightsActive ? [0.1, 0.3, 0.1] : 0,
                rotate: 360 
              }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute w-72 sm:w-[420px] h-72 sm:h-[420px] border border-dashed border-orange-500/20 rounded-full blur-[2px] pointer-events-none"
            />

            {/* Trophy Image Container */}
            <div className="relative w-48 sm:w-64 h-64 sm:h-80 flex items-center justify-center">
              {/* Backglow glow for trophy */}
              <motion.div 
                animate={{ 
                  scale: lightsActive ? [1, 1.05, 1] : 0.95,
                  opacity: lightsActive ? 0.45 : 0 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-radial-gradient from-amber-500/30 to-transparent blur-[50px]"
              />

              <motion.img
                initial={{ opacity: 0, scale: 0.82, filter: 'brightness(0)' }}
                animate={{ 
                  opacity: lightsActive ? 1 : 0.05, 
                  scale: lightsActive ? 1.03 : 0.82,
                  filter: lightsActive ? 'brightness(1.05) contrast(1.02)' : 'brightness(0)'
                }}
                transition={{ 
                  duration: 2.8, 
                  ease: [0.25, 0.8, 0.25, 1],
                  opacity: { duration: 2 },
                  filter: { duration: 3 }
                }}
                src="/world_cup_trophy.png"
                alt="FIFA World Cup Golden Trophy"
                className="w-full h-full object-contain drop-shadow-[0_0_35px_rgba(245,158,11,0.25)] z-20 pointer-events-none select-none"
              />
            </div>

            {/* Title & Branding */}
            <div className="text-center mt-6 space-y-3">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: lightsActive ? 0 : 50, opacity: lightsActive ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-500 drop-shadow-md"
                >
                  FIFA WORLD CUP 2026
                </motion.h1>
              </div>

              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: lightsActive ? 0 : 20, opacity: lightsActive ? 0.75 : 0 }}
                  transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
                  className="font-sans text-xs sm:text-sm tracking-wider font-semibold text-slate-300 max-w-md mx-auto"
                >
                  {"\"The World's Greatest Football Tournament\""}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Bottom Row Controls */}
          <div className="w-full max-w-lg mx-auto px-6 pb-12 z-30 flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Enter Experience Button */}
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: lightsActive ? 1 : 0.95, opacity: lightsActive ? 1 : 0 }}
              transition={{ duration: 1, delay: 1.6 }}
              onClick={handleClose}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_35px_rgba(249,115,22,0.55)] transition-all cursor-pointer select-none active:scale-95 duration-200 flex items-center justify-center gap-2"
              aria-label="Enter the World Cup site"
            >
              <Sparkles className="w-4 h-4" />
              Enter Experience
            </motion.button>

            {/* Skip Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: lightsActive ? 0.6 : 0 }}
              transition={{ duration: 1, delay: 2.0 }}
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 hover:opacity-100 text-white font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer select-none"
              aria-label="Skip introductory welcome screen"
            >
              <span className="flex items-center justify-center gap-1.5">
                Skip Intro <SkipForward className="w-3.5 h-3.5" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
