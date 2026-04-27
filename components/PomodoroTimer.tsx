"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "25/5" | "15/5";

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("25/5");
  const [isWork, setIsWork] = useState(true);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const workMins = mode === "25/5" ? 25 : 15;
  const breakMins = 5;

  useEffect(() => {
    setRunning(false);
    setIsWork(true);
    setSeconds(workMins * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [mode, workMins]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            playBeep();
            const nextIsWork = !isWork;
            setIsWork(nextIsWork);
            if (!nextIsWork) setCycles((c) => c + 1);
            return nextIsWork ? workMins * 60 : breakMins * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, isWork, workMins]);

  function playBeep() {
    try {
      if (!audioRef.current) {
        audioRef.current = new AudioContext();
      }
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1);
    } catch {}
  }

  function reset() {
    setRunning(false);
    setIsWork(true);
    setSeconds(workMins * 60);
    setCycles(0);
  }

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const total = isWork ? workMins * 60 : breakMins * 60;
  const progress = ((total - seconds) / total) * 100;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base">⏱ Pomodoro</h3>
        <div className="flex gap-1">
          {(["25/5", "15/5"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                mode === m
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-4">
        <div
          className={`text-xs font-medium mb-2 uppercase tracking-wide ${
            isWork ? "text-green-400" : "text-blue-400"
          }`}
        >
          {isWork ? "Foco" : "Pausa"} — ciclo {cycles + 1}
        </div>
        <div className="text-5xl font-mono font-bold text-white tracking-widest">
          {mins}:{secs}
        </div>
        <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isWork ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setRunning((r) => !r)}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
            running
              ? "bg-yellow-600 hover:bg-yellow-500 text-white"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          {running ? "⏸ Pausar" : "▶ Iniciar"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors"
          aria-label="Reiniciar timer"
        >
          ↺
        </button>
      </div>

      {cycles > 0 && (
        <p className="text-center text-gray-400 text-xs mt-3">
          {cycles} ciclo{cycles > 1 ? "s" : ""} completo{cycles > 1 ? "s" : ""} hoje
        </p>
      )}
    </div>
  );
}
