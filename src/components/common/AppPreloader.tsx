import React, { useState, useEffect } from 'react';
import { assetPreloader, PreloadProgress } from '../../services/assetPreloader';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { useQuestStore } from '../../store/useQuestStore';
import { Sparkles, CheckCircle2, AlertCircle, Volume2, Image as ImageIcon, Rocket, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppPreloaderProps {
  onStart: () => void;
  isManualCheck?: boolean;
}

export const AppPreloader: React.FC<AppPreloaderProps> = ({ onStart, isManualCheck = false }) => {
  const [state] = useQuestStore();
  const [progress, setProgress] = useState<PreloadProgress | null>(assetPreloader.getLastReport());
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = assetPreloader.subscribe(p => {
      setProgress(p);
      if (p.isCompleted && !isManualCheck) {
        // Trigger small confetti burst on complete
        try {
          confetti({
            particleCount: 25,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    });

    if (!hasStartedLoading) {
      setHasStartedLoading(true);
      assetPreloader.startPreload();
    }

    return () => {
      unsubscribe();
    };
  }, [hasStartedLoading, isManualCheck]);

  const handleStartAdventure = () => {
    // Official user-gesture blessing for mobile Safari & Chrome
    soundService.unlock();
    ttsService.unlock();

    soundService.play('victory');
    ttsService.playKey('intro_cooking', state.voicePersona, state.voice);

    onStart();
  };

  const percent = progress?.percent || 0;
  const isDone = progress?.isCompleted || false;
  const audioCount = progress?.report.audioReady || 0;
  const audioTotal = progress?.report.audioTotal || 78;
  const imagesCount = progress?.report.imagesReady || 0;
  const imagesTotal = progress?.report.imagesTotal || 364;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-yellow-400 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-400 p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Pikachu Kubo Icon */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-amber-400 to-yellow-300 rounded-3xl border-4 border-amber-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
            <img
              src="/assets/pokemon/kubo/25.png"
              alt="Pikachu"
              className="w-20 h-20 sm:w-22 sm:h-22 object-contain drop-shadow-md animate-bounce"
              onError={e => {
                // Fallback to classic or emoji if kubo hasn't loaded yet
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-4xl select-none" style={{ display: 'none' }}>⚡</span>
          </div>
          <span className="absolute -bottom-2 -right-2 bg-amber-600 text-white p-1 rounded-full shadow-md text-xs font-black">
            Kubo
          </span>
        </div>

        {/* Header Text */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-200 text-amber-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Kubo-Insel Datei-Check
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight leading-tight">
            Pokémon Quest
          </h1>
          <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
            Meister-Handbuch für Levi 💛
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-amber-900 px-1">
            <span>{isDone ? 'Prüfung abgeschlossen!' : 'Lade & prüfe Spieldateien...'}</span>
            <span>{percent}%</span>
          </div>

          <div className="w-full h-5 bg-amber-200 rounded-full border-2 border-amber-400 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full transition-all duration-200 shadow-md relative"
              style={{ width: `${Math.max(5, percent)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Current File / Phase Status */}
          <div className="text-[11px] font-bold text-slate-600 truncate min-h-[1.2rem] px-2">
            {progress?.phase || 'Initialisiere...'}
          </div>
        </div>

        {/* Verification Stats Badges */}
        <div className="grid grid-cols-2 gap-2 text-left bg-amber-50/80 p-3 rounded-2xl border-2 border-amber-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-300 rounded-xl flex items-center justify-center text-amber-900">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-800">Edge-TTS Stimmen</div>
              <div className="text-xs font-black text-slate-800">
                {audioCount} / {audioTotal}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-300 rounded-xl flex items-center justify-center text-amber-900">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-800">Grafiken & Sprites</div>
              <div className="text-xs font-black text-slate-800">
                {imagesCount} / {imagesTotal}
              </div>
            </div>
          </div>
        </div>

        {/* Error hints if any */}
        {progress && progress.errors.length > 0 && (
          <div className="text-left bg-rose-50 border border-rose-200 p-2 rounded-xl text-[11px] text-rose-700 max-h-20 overflow-y-auto">
            <div className="font-bold flex items-center gap-1 text-rose-800 mb-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Hinweise:
            </div>
            <ul className="list-disc pl-4 space-y-0.5">
              {progress.errors.slice(0, 3).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {progress.errors.length > 3 && (
                <li>... und {progress.errors.length - 3} weitere</li>
              )}
            </ul>
          </div>
        )}

        {/* Action Button: Start or Retry */}
        <div className="pt-2">
          {isDone ? (
            <button
              onClick={handleStartAdventure}
              className="w-full quest-btn quest-btn-green py-3 text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-102 transition-transform animate-pulse"
            >
              <Rocket className="w-5 h-5" />
              Abenteuer starten! 🚀
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800 py-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Prüfe alle Stimmen und Grafiken...</span>
            </div>
          )}

          {isDone && (
            <p className="text-[10px] font-bold text-amber-700 mt-2">
              Tippe auf den Button, um die Sprachausgabe im Browser zu aktivieren!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
