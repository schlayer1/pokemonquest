import React, { useState, useEffect, useRef } from 'react';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Zap, Trophy, ShieldAlert, Award } from 'lucide-react';

interface BossConfig {
  id: number;
  name: string;
  attack: string;
  color: string;
  theme: string;
  chargeTime: number; // ms to wind up
  reactionWindow: number; // ms window to press escape
}

const BOSSES: Record<number, BossConfig> = {
  6: { id: 6, name: 'Glurak', attack: 'Flammenwurf', color: '#f97316', theme: 'fire', chargeTime: 1800, reactionWindow: 1000 },
  130: { id: 130, name: 'Garados', attack: 'Hyperstrahl', color: '#0284c7', theme: 'water', chargeTime: 1600, reactionWindow: 900 },
  94: { id: 94, name: 'Gengar', attack: 'Spukball', color: '#9333ea', theme: 'ghost', chargeTime: 1500, reactionWindow: 850 },
  95: { id: 95, name: 'Onix', attack: 'Felswurf', color: '#78716c', theme: 'rock', chargeTime: 1900, reactionWindow: 1100 },
  150: { id: 150, name: 'Mewtu', attack: 'Psychostoß', color: '#d946ef', theme: 'psychic', chargeTime: 1400, reactionWindow: 750 }
};

type GamePhase = 'idle' | 'waiting' | 'charging' | 'danger' | 'success' | 'failed';

export const EscapeTrainer: React.FC = () => {
  const [state, store] = useQuestStore();
  const [selectedBossId, setSelectedBossId] = useState<number>(6);
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [streak, setStreak] = useState<number>(0);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Tippe auf Spiel starten, um dein Flucht-Timing zu trainieren!');

  const boss = BOSSES[selectedBossId] || BOSSES[6];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dangerStartRef = useRef<number>(0);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startRound = () => {
    clearTimers();
    setPhase('waiting');
    setStatusMessage(`${boss.name} beobachtet dein Team … Bereitmachen!`);

    // Random delay between 1.5s and 3.5s before attack charge
    const delay = 1500 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      triggerBossAttack();
    }, delay);
  };

  const triggerBossAttack = () => {
    setPhase('charging');
    soundService.play('alarm');
    setStatusMessage(`🚨 ACHTUNG! ${boss.name} lädt ${boss.attack} auf!`);
    ttsService.playKey(`boss_alert_${boss.id}`, state.voicePersona, state.voice);

    // Charge duration until DANGER window
    timerRef.current = setTimeout(() => {
      setPhase('danger');
      dangerStartRef.current = Date.now();
      setStatusMessage('⚡ JETZT FLIEHEN! DRÜCKE DEN FLUCHTKNOPF!');
      ttsService.playKey('dodge_now', state.voicePersona, state.voice);

      // If user doesn't press in time -> fail!
      timerRef.current = setTimeout(() => {
        handleBossHit();
      }, boss.reactionWindow);
    }, boss.chargeTime);
  };

  const handlePlayerDodge = () => {
    if (phase === 'waiting' || phase === 'charging') {
      // Too early!
      clearTimers();
      setPhase('failed');
      soundService.play('fail');
      setStreak(0);
      setStatusMessage('❌ Zu früh geflohen! Warte auf das rote Signal!');
      ttsService.playKey('dodge_early', state.voicePersona, state.voice);
      return;
    }

    if (phase === 'danger') {
      // SUCCESS!
      clearTimers();
      const elapsed = Date.now() - dangerStartRef.current;
      setPhase('success');
      setLastTime(elapsed);
      setStreak(s => s + 1);
      store.setBestEscapeTime(elapsed);

      soundService.play('dodge');
      setTimeout(() => soundService.play('victory'), 150);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      setStatusMessage(`✨ Ausgewichen in ${elapsed} ms! Perfekt getimt!`);
      ttsService.playKey('dodge_success', state.voicePersona, state.voice);
    }
  };

  const handleBossHit = () => {
    clearTimers();
    setPhase('failed');
    soundService.play('fail');
    setStreak(0);
    setStatusMessage(`💥 Getroffen von ${boss.attack}! Übe weiter!`);
    ttsService.playKey('dodge_fail', state.voicePersona, state.voice);
  };

  const handleStop = () => {
    clearTimers();
    setPhase('idle');
    setStatusMessage('Training pausiert.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="quest-box p-4 sm:p-5 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-950 flex items-center gap-2">
              <span>🏃</span> Levis Reaktions-Schule
            </h2>
            <p className="text-xs text-slate-600">
              Trainiere dein Timing für den rettenden gelben Fluchtknopf gegen mächtige Insel-Bosse!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-2 text-xs font-black">
            <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              Bestzeit: {state.bestEscapeTime ? `${state.bestEscapeTime} ms` : 'Noch keine'}
            </div>
            <div className="bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-300">
              Serie: {streak}x
            </div>
          </div>
        </div>

        {/* Boss Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-slate-600">Boss wählen:</span>
          {(Object.values(BOSSES)).map(b => (
            <button
              key={b.id}
              onClick={() => {
                soundService.play('tap');
                handleStop();
                setSelectedBossId(b.id);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all ${
                selectedBossId === b.id
                  ? 'bg-rose-500 text-white border-rose-700 shadow-xs scale-105'
                  : 'bg-slate-50 hover:bg-rose-50 border-slate-200 text-slate-700'
              }`}
            >
              {b.name} ({b.attack})
            </button>
          ))}
        </div>

        {/* Battle Arena View */}
        <div
          className={`rounded-3xl p-6 border-4 transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[320px] ${
            phase === 'danger'
              ? 'bg-rose-200/90 border-rose-500 shadow-xl'
              : phase === 'charging'
              ? 'bg-amber-100/90 border-amber-400'
              : phase === 'success'
              ? 'bg-emerald-100/90 border-emerald-500'
              : 'bg-slate-100 border-slate-300'
          }`}
        >
          {/* Animated Boss Sprite */}
          <div className="relative mb-4 flex flex-col items-center">
            {phase === 'danger' && (
              <div className="absolute -inset-4 rounded-full bg-rose-500/30 animate-ping" />
            )}
            {phase === 'charging' && (
              <div className="absolute -inset-2 rounded-full bg-amber-400/30 animate-pulse" />
            )}
            <img
              src={`/assets/bosses/boss_${boss.id}.png`}
              alt={boss.name}
              className={`w-36 h-36 object-contain drop-shadow-lg transition-transform duration-200 ${
                phase === 'charging'
                  ? 'scale-110 animate-bounce'
                  : phase === 'danger'
                  ? 'scale-125'
                  : ''
              }`}
            />
            <span className="text-base font-black text-slate-800 mt-2 bg-white/80 px-3 py-0.5 rounded-full border border-slate-200">
              {boss.name}
            </span>
          </div>

          {/* Status Message */}
          <div className="text-center font-black text-sm sm:text-base text-slate-800 mb-5 max-w-md px-4">
            {statusMessage}
          </div>

          {/* THE FLUCHT-KNOPF (Big Yellow Dodge Button) */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handlePlayerDodge}
              disabled={phase === 'idle' || phase === 'success' || phase === 'failed'}
              className={`w-44 h-16 sm:w-56 sm:h-20 rounded-3xl font-black text-lg sm:text-xl border-4 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                phase === 'danger'
                  ? 'bg-yellow-400 hover:bg-yellow-300 border-amber-600 text-amber-950 scale-110 animate-pulse'
                  : 'bg-amber-200 border-amber-400 text-amber-800 opacity-80'
              }`}
            >
              <span>🏃</span> FLIEHEN!
            </button>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-2">
              {phase === 'idle' || phase === 'success' || phase === 'failed' ? (
                <button
                  onClick={startRound}
                  className="quest-btn quest-btn-green text-xs py-2 px-4"
                >
                  <Play className="w-4 h-4" /> {phase === 'idle' ? 'Spiel starten' : 'Nächste Runde'}
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="quest-btn quest-btn-gray text-xs py-2 px-4"
                >
                  <Pause className="w-4 h-4" /> Pause
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
