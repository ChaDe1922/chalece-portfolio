"use client";

import * as React from "react";

/** Shared Web Audio engine for the music lessons. Dependency-free, extending
 *  the beat-maker patterns (lazy AudioContext, gesture-unlock, Safari fallback,
 *  cleanup on unmount). Adds a master gain (mute + volume), an AnalyserNode tap
 *  for the oscilloscope (time domain) and spectrum (frequency domain), sustained
 *  notes with live frequency/shape/gain updates, one-shot tones with an envelope,
 *  and an additive (multi-sine) helper for the Fourier lesson.
 *
 *  Audio never starts without a user gesture: call `ensure()` from a click. */

export type WaveType = "sine" | "square" | "sawtooth" | "triangle";
export type Envelope = { attack: number; decay: number; sustain: number; release: number };
/** A handle to a one-shot sound so a button can stop it early and reset its state. */
export type PlayHandle = { stop: () => void; duration: number };

const SAFE_MAX_GAIN = 0.6; // hard cap so nothing is painfully loud

type Note = { osc: OscillatorNode; gain: GainNode };

export type AudioEngine = {
  /** Create/resume the AudioContext (call from a user gesture). Returns null if
   *  Web Audio is unsupported. */
  ensure: () => AudioContext | null;
  isReady: () => boolean;
  context: () => AudioContext | null;
  master: () => GainNode | null;
  analyser: () => AnalyserNode | null;
  /** One-shot tone shaped by an envelope (for plucks/pads and short cues). */
  playTone: (opts: {
    freq: number;
    type?: WaveType;
    gain?: number;
    duration?: number;
    env?: Partial<Envelope>;
  }) => PlayHandle;
  /** Play a set of sine partials at once (additive synthesis), one-shot. */
  playPartials: (
    partials: ReadonlyArray<{ freq: number; gain: number }>,
    opts?: { duration?: number; env?: Partial<Envelope> },
  ) => PlayHandle;
  /** Stop all one-shot tones and partials currently sounding. */
  stopOneShots: () => void;
  /** Start a sustained note kept until noteOff(id). Safe to call again to retrigger. */
  noteOn: (id: string, opts: { freq: number; type?: WaveType; gain?: number; attack?: number }) => void;
  /** Live-update a sustained note. */
  noteUpdate: (id: string, opts: { freq?: number; type?: WaveType; gain?: number }) => void;
  noteOff: (id: string, release?: number) => void;
  allNotesOff: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (v: number) => void;
  /** Suspend output (used when a slide goes offscreen). */
  suspend: () => void;
  /** Load + decode an audio file into a cached AudioBuffer. Returns null on failure. */
  loadSample: (url: string) => Promise<AudioBuffer | null>;
  /** Play a decoded sample through the master bus (so mute/volume/analyser apply).
   *  Returns a stop handle, or null if it could not play, so callers can fall back
   *  to synthesis (null is falsy, so existing `if (ok) return` checks still work). */
  playSample: (url: string, opts?: { gain?: number }) => Promise<PlayHandle | null>;
  /** Warm the cache for a set of sample URLs (fire and forget). */
  preloadSamples: (urls: readonly string[]) => void;
};

export function useAudioEngine(): AudioEngine {
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterRef = React.useRef<GainNode | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const notesRef = React.useRef<Map<string, Note>>(new Map());
  const mutedRef = React.useRef(false);
  const volumeRef = React.useRef(0.8); // 0..1, scaled by SAFE_MAX_GAIN
  const bufferCacheRef = React.useRef<Map<string, AudioBuffer>>(new Map());
  const sampleSourcesRef = React.useRef<Set<AudioBufferSourceNode>>(new Set());
  const oneShotStopsRef = React.useRef<Set<() => void>>(new Set());

  const applyMasterGain = React.useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const target = mutedRef.current ? 0 : volumeRef.current * SAFE_MAX_GAIN;
    master.gain.setTargetAtTime(target, ctx.currentTime, 0.02);
  }, []);

  const ensure = React.useCallback((): AudioContext | null => {
    if (!ctxRef.current) {
      const Ctor =
        (typeof window !== "undefined" && window.AudioContext) ||
        (typeof window !== "undefined" &&
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!Ctor) return null;
      const ctx = new Ctor();
      const master = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      master.gain.value = 0; // ramp up via applyMasterGain
      // master -> analyser (pass-through tap) -> destination
      master.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
      analyserRef.current = analyser;
      applyMasterGain();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, [applyMasterGain]);

  const envOf = (e?: Partial<Envelope>): Envelope => ({
    attack: e?.attack ?? 0.01,
    decay: e?.decay ?? 0.12,
    sustain: e?.sustain ?? 0.0,
    release: e?.release ?? 0.08,
  });

  /** Register a one-shot's stop fn so it can be interrupted, and auto-remove it
   *  after the sound ends. Returns a wrapped stop that also unregisters. */
  const registerOneShot = React.useCallback((rawStop: () => void, durationSec: number): (() => void) => {
    let done = false;
    const stop = () => {
      if (done) return;
      done = true;
      oneShotStopsRef.current.delete(stop);
      try {
        rawStop();
      } catch {
        // already stopped
      }
    };
    oneShotStopsRef.current.add(stop);
    window.setTimeout(stop, Math.max(0, durationSec * 1000 + 60));
    return stop;
  }, []);

  const playTone = React.useCallback(
    ({ freq, type = "sine", gain = 0.8, duration = 0.6, env }: Parameters<AudioEngine["playTone"]>[0]): PlayHandle => {
      const ctx = ensure();
      const master = masterRef.current;
      if (!ctx || !master) return { stop: () => {}, duration: 0 };
      const e = envOf(env);
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, now);
      const peak = Math.max(0.0001, gain);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(peak, now + e.attack);
      const holdLevel = Math.max(0.0001, peak * (e.sustain || 0.0001));
      g.gain.exponentialRampToValueAtTime(holdLevel, now + e.attack + e.decay);
      const end = now + Math.max(duration, e.attack + e.decay) + e.release;
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      o.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(end + 0.02);
      const total = end - now;
      const stop = registerOneShot(() => {
        try {
          o.stop();
        } catch {
          // already stopped
        }
        o.disconnect();
        g.disconnect();
      }, total);
      return { stop, duration: total };
    },
    [ensure, registerOneShot],
  );

  const playPartials = React.useCallback(
    (partials: ReadonlyArray<{ freq: number; gain: number }>, opts?: { duration?: number; env?: Partial<Envelope> }): PlayHandle => {
      const ctx = ensure();
      const master = masterRef.current;
      if (!ctx || !master) return { stop: () => {}, duration: 0 };
      const e = envOf(opts?.env);
      const duration = opts?.duration ?? 0.8;
      const now = ctx.currentTime;
      const mix = ctx.createGain();
      mix.gain.setValueAtTime(0.0001, now);
      mix.gain.exponentialRampToValueAtTime(0.9, now + e.attack);
      const end = now + Math.max(duration, e.attack + e.decay) + e.release;
      mix.gain.exponentialRampToValueAtTime(0.0001, end);
      mix.connect(master);
      const oscs: OscillatorNode[] = [];
      for (const p of partials) {
        if (p.gain <= 0) continue;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(p.freq, now);
        g.gain.setValueAtTime(Math.max(0.0001, p.gain), now);
        o.connect(g);
        g.connect(mix);
        o.start(now);
        o.stop(end + 0.02);
        oscs.push(o);
      }
      const total = end - now;
      const stop = registerOneShot(() => {
        for (const o of oscs) {
          try {
            o.stop();
          } catch {
            // already stopped
          }
        }
        mix.disconnect();
      }, total);
      return { stop, duration: total };
    },
    [ensure, registerOneShot],
  );

  const stopOneShots = React.useCallback(() => {
    for (const stop of Array.from(oneShotStopsRef.current)) stop();
    oneShotStopsRef.current.clear();
  }, []);

  const noteOn = React.useCallback(
    (id: string, { freq, type = "sine", gain = 0.7, attack = 0.012 }: Parameters<AudioEngine["noteOn"]>[1]) => {
      const ctx = ensure();
      const master = masterRef.current;
      if (!ctx || !master) return;
      const existing = notesRef.current.get(id);
      if (existing) {
        existing.osc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.01);
        existing.osc.type = type;
        return;
      }
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), now + attack);
      o.connect(g);
      g.connect(master);
      o.start(now);
      notesRef.current.set(id, { osc: o, gain: g });
    },
    [ensure],
  );

  const noteUpdate = React.useCallback((id: string, { freq, type, gain }: Parameters<AudioEngine["noteUpdate"]>[1]) => {
    const ctx = ctxRef.current;
    const note = notesRef.current.get(id);
    if (!ctx || !note) return;
    if (freq != null) note.osc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.01);
    if (type != null) note.osc.type = type;
    if (gain != null) note.gain.gain.setTargetAtTime(Math.max(0.0001, gain), ctx.currentTime, 0.02);
  }, []);

  const noteOff = React.useCallback((id: string, release = 0.12) => {
    const ctx = ctxRef.current;
    const note = notesRef.current.get(id);
    if (!ctx || !note) return;
    const now = ctx.currentTime;
    note.gain.gain.cancelScheduledValues(now);
    note.gain.gain.setTargetAtTime(0.0001, now, release / 3);
    note.osc.stop(now + release + 0.05);
    notesRef.current.delete(id);
  }, []);

  const allNotesOff = React.useCallback(() => {
    for (const id of Array.from(notesRef.current.keys())) noteOff(id, 0.05);
  }, [noteOff]);

  const setMuted = React.useCallback(
    (muted: boolean) => {
      mutedRef.current = muted;
      applyMasterGain();
    },
    [applyMasterGain],
  );
  const setVolume = React.useCallback(
    (v: number) => {
      volumeRef.current = Math.min(1, Math.max(0, v));
      applyMasterGain();
    },
    [applyMasterGain],
  );

  const stopAllSamples = React.useCallback(() => {
    for (const src of sampleSourcesRef.current) {
      try {
        src.stop();
      } catch {
        // already stopped
      }
    }
    sampleSourcesRef.current.clear();
  }, []);

  const suspend = React.useCallback(() => {
    allNotesOff();
    stopAllSamples();
    stopOneShots();
    const ctx = ctxRef.current;
    if (ctx && ctx.state === "running") void ctx.suspend();
  }, [allNotesOff, stopAllSamples, stopOneShots]);

  const loadSample = React.useCallback(
    async (url: string): Promise<AudioBuffer | null> => {
      const cached = bufferCacheRef.current.get(url);
      if (cached) return cached;
      const ctx = ensure();
      if (!ctx) return null;
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const arr = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(arr);
        bufferCacheRef.current.set(url, buf);
        return buf;
      } catch {
        return null;
      }
    },
    [ensure],
  );

  const playSample = React.useCallback(
    async (url: string, opts?: { gain?: number }): Promise<PlayHandle | null> => {
      const ctx = ensure();
      const master = masterRef.current;
      if (!ctx || !master) return null;
      const buf = await loadSample(url);
      if (!buf) return null;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      // Gentle fade in and fade out so the clip never clicks on start or cuts off.
      const now = ctx.currentTime;
      const dur = buf.duration;
      const peak = Math.min(1, Math.max(0, opts?.gain ?? 0.9));
      const fadeIn = Math.min(0.09, dur * 0.15);
      const fadeOut = Math.min(0.35, dur * 0.3);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(peak, now + fadeIn);
      g.gain.setValueAtTime(peak, Math.max(now + fadeIn, now + dur - fadeOut));
      g.gain.linearRampToValueAtTime(0.0001, now + dur);
      src.connect(g);
      g.connect(master);
      src.onended = () => {
        sampleSourcesRef.current.delete(src);
        try {
          src.disconnect();
          g.disconnect();
        } catch {
          // already disconnected
        }
      };
      sampleSourcesRef.current.add(src);
      src.start(now);
      src.stop(now + dur + 0.03);
      const stop = () => {
        try {
          src.stop();
        } catch {
          // already stopped
        }
      };
      return { stop, duration: dur };
    },
    [ensure, loadSample],
  );

  const preloadSamples = React.useCallback(
    (urls: readonly string[]) => {
      for (const u of urls) void loadSample(u);
    },
    [loadSample],
  );

  // Clean up everything on unmount.
  React.useEffect(() => {
    const notes = notesRef.current;
    const samples = sampleSourcesRef.current;
    const oneShots = oneShotStopsRef.current;
    return () => {
      for (const { osc } of notes.values()) {
        try {
          osc.stop();
        } catch {
          // already stopped
        }
      }
      notes.clear();
      for (const src of samples) {
        try {
          src.stop();
        } catch {
          // already stopped
        }
      }
      samples.clear();
      for (const stop of oneShots) stop();
      oneShots.clear();
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return React.useMemo<AudioEngine>(
    () => ({
      ensure,
      isReady: () => ctxRef.current != null,
      context: () => ctxRef.current,
      master: () => masterRef.current,
      analyser: () => analyserRef.current,
      playTone,
      playPartials,
      stopOneShots,
      noteOn,
      noteUpdate,
      noteOff,
      allNotesOff,
      setMuted,
      setVolume,
      suspend,
      loadSample,
      playSample,
      preloadSamples,
    }),
    [ensure, playTone, playPartials, stopOneShots, noteOn, noteUpdate, noteOff, allNotesOff, setMuted, setVolume, suspend, loadSample, playSample, preloadSamples],
  );
}

/** Map a frequency in Hz to the nearest note name (e.g. "A4"), for readouts. */
export function nearestNoteName(freq: number): string {
  if (freq <= 0) return "";
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  const name = names[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}
