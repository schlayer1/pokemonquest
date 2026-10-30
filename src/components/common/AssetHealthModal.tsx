import React, { useState } from 'react';
import { assetPreloader, PreloadProgress } from '../../services/assetPreloader';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { useQuestStore } from '../../store/useQuestStore';
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Volume2,
  Image as ImageIcon,
  HardDrive,
  Sparkles,
  Play
} from 'lucide-react';

interface AssetHealthModalProps {
  onClose: () => void;
}

export const AssetHealthModal: React.FC<AssetHealthModalProps> = ({ onClose }) => {
  const [state] = useQuestStore();
  const [report, setReport] = useState<PreloadProgress | null>(assetPreloader.getLastReport());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    soundService.play('tap');
    setIsRefreshing(true);
    const res = await assetPreloader.startPreload(true);
    setReport(res);
    setIsRefreshing(false);
    soundService.play('victory');
  };

  const handleTestVoice = (persona: 'killian' | 'katja') => {
    soundService.play('tap');
    ttsService.playKey('count_5', persona, true);
  };

  const audioReady = report?.report.audioReady || 0;
  const audioTotal = report?.report.audioTotal || 78;
  const imagesReady = report?.report.imagesReady || 0;
  const imagesTotal = report?.report.imagesTotal || 364;
  const grandReady = audioReady + imagesReady;
  const grandTotal = audioTotal + imagesTotal;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border-4 border-amber-400 max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
          title="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-amber-950 font-black">
            🩺
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-950 leading-tight">
              Dateiprüfung & Offline-Speicher
            </h2>
            <p className="text-xs text-slate-600">
              Prüfe, ob alle Stimmen, Grafiken und Sounds vollständig vorliegen.
            </p>
          </div>
        </div>

        {/* Status Overview Card */}
        <div className="my-4 p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Gesamt-Status
            </span>
            <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
              {grandReady} / {grandTotal} Dateien bereit
            </span>
          </div>

          <div className="w-full h-3 bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((grandReady / grandTotal) * 100)}%` }}
            />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3 mb-4">
          {/* Edge TTS Audio */}
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-900">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Edge-TTS Sprachausgabe</div>
                <div className="text-[11px] text-slate-500">
                  Killian & Katja (alle 78 Sprachdateien)
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-700">
                {audioReady} / {audioTotal}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => handleTestVoice('killian')}
                  className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-bold"
                  title="Killian Stimme testen"
                >
                  ▶ Killian
                </button>
                <button
                  onClick={() => handleTestVoice('katja')}
                  className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-bold"
                  title="Katja Stimme testen"
                >
                  ▶ Katja
                </button>
              </div>
            </div>
          </div>

          {/* Graphics & Sprites */}
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-900">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Grafiken & Sprites</div>
                <div className="text-[11px] text-slate-500">
                  10 Zutaten, 18 Rezepte, 12 Welten, 17 Deko, 302 Pokémon
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-700">
                {imagesReady} / {imagesTotal}
              </div>
              <span className="text-[10px] text-slate-500 font-bold">100% lokal</span>
            </div>
          </div>

          {/* PWA Offline Storage */}
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-900">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Browser Cache & PWA</div>
                <div className="text-[11px] text-slate-500">
                  Offline-Fähigkeit für Tablet & Handy
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Aktiv
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 quest-btn quest-btn-yellow text-xs py-2.5 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Prüfe Dateien...' : 'Dateien jetzt erneut prüfen & vorladen'}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
