import React, { useState } from 'react';
import { useQuestStore } from '../store/useQuestStore';
import { soundService } from '../services/sound';
import { ttsService } from '../services/tts';
import { Volume2, VolumeX, Bell, BellOff, Download, Upload, Sparkles, User, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  const [state, store] = useQuestStore();
  const [showBackup, setShowBackup] = useState(false);
  const [importText, setImportText] = useState('');
  const [backupMessage, setBackupMessage] = useState('');

  const toggleSound = () => {
    soundService.play('tap');
    store.toggleSound();
  };

  const toggleVoice = () => {
    soundService.play('tap');
    store.toggleVoice();
    if (state.voice) {
      ttsService.stop();
    }
  };

  const setPersona = (persona: 'killian' | 'katja') => {
    soundService.play('tap');
    store.setVoicePersona(persona);
    ttsService.playKey(persona === 'killian' ? 'count_1' : 'count_1', persona, state.voice);
  };

  const handleExport = () => {
    const json = store.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levis_quest_handbuch_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage('Sicherung erfolgreich heruntergeladen!');
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = store.importJSON(importText);
    if (ok) {
      setBackupMessage('Spielstand erfolgreich geladen!');
      setTimeout(() => setShowBackup(false), 1200);
    } else {
      setBackupMessage('Ungültige Sicherungsdatei!');
    }
  };

  return (
    <header className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 border-b-4 border-amber-500 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl border-4 border-amber-600 flex items-center justify-center shadow-md text-2xl sm:text-3xl">
            🍲
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="bg-amber-600 text-white text-[11px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                Levis Ausgabe
              </span>
              <span className="text-amber-800 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Version 2.0
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight leading-tight">
              Pokémon Quest Meister-Handbuch
            </h1>
          </div>
        </div>

        {/* Audio & Settings Toolbar */}
        <div className="flex items-center flex-wrap justify-center gap-2">
          {/* Sprite Style Switcher (2D Klassisch vs 3D Kubo) */}
          <div className="bg-white/80 backdrop-blur-xs p-1 rounded-xl border-2 border-amber-400 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => {
                soundService.play('tap');
                store.setSpriteStyle('classic');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                state.spriteStyle === 'classic'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100'
              }`}
              title="2D Klassische Zeichnungen (Standard)"
            >
              <span>🎨</span> <span className="hidden sm:inline">2D</span> Zeichnung
            </button>
            <button
              onClick={() => {
                soundService.play('tap');
                store.setSpriteStyle('kubo');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                state.spriteStyle === 'kubo'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100'
              }`}
              title="3D Kubo-Würfelgrafik wie im Spiel"
            >
              <span>🧊</span> 3D <span className="hidden sm:inline">Kubo</span>
            </button>
          </div>

          {/* Voice Persona Switcher */}
          <div className="bg-white/80 backdrop-blur-xs p-1 rounded-xl border-2 border-amber-400 flex items-center gap-1 shadow-xs">
            <span className="text-[11px] font-bold text-amber-900 px-1 hidden sm:inline">Stimme:</span>
            <button
              onClick={() => setPersona('killian')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                state.voicePersona === 'killian'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100'
              }`}
              title="Killian (Abenteurer)"
            >
              <span>👦</span> Killian
            </button>
            <button
              onClick={() => setPersona('katja')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                state.voicePersona === 'katja'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100'
              }`}
              title="Katja (Begleiterin)"
            >
              <span>👧</span> Katja
            </button>
          </div>

          {/* Voice Mute Toggle */}
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-xl border-2 font-bold transition-all shadow-xs flex items-center gap-1 text-xs ${
              state.voice
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-rose-100 border-rose-300 text-rose-700'
            }`}
            title={state.voice ? 'Sprachausgabe an' : 'Sprachausgabe stumm'}
          >
            {state.voice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{state.voice ? 'Stimme' : 'Stumm'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border-2 font-bold transition-all shadow-xs flex items-center gap-1 text-xs ${
              state.sound
                ? 'bg-sky-500 border-sky-600 text-white'
                : 'bg-slate-200 border-slate-300 text-slate-600'
            }`}
            title={state.sound ? 'Soundeffekte an' : 'Soundeffekte aus'}
          >
            {state.sound ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Backup Dialog Button */}
          <button
            onClick={() => {
              soundService.play('tap');
              setShowBackup(true);
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-xl border-2 border-amber-400 text-amber-900 font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
            title="Sicherung verwalten"
          >
            <RefreshCw className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Speichern</span>
          </button>
        </div>
      </div>

      {/* Backup & Restore Modal */}
      {showBackup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-4 border-amber-400 max-w-lg w-full p-6 shadow-2xl relative">
            <h2 className="text-xl font-black text-amber-950 flex items-center gap-2 mb-2">
              💾 Levis Abenteuer-Speicher
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Dein Fortschritt (Album, Sticker, Vorrat, Team und Welten) wird automatisch im Browser gespeichert.
              Hier kannst du eine Sicherung für ein anderes Tablet oder Handy herunterladen.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-900">1. Sicherung auf Gerät speichern:</span>
                <button
                  onClick={handleExport}
                  className="quest-btn quest-btn-yellow w-full text-sm"
                >
                  <Download className="w-4 h-4" /> Sicherung herunterladen (.json)
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-700">2. Sicherung wiederherstellen:</span>
                <textarea
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder="Kopiere den Inhalt deiner .json-Sicherungsdatei hier hinein..."
                  rows={3}
                  className="w-full text-xs p-2 border-2 border-slate-300 rounded-xl font-mono focus:border-amber-400 outline-none"
                />
                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="quest-btn quest-btn-green w-full text-sm disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" /> Sicherung einspielen
                </button>
              </div>
            </div>

            {backupMessage && (
              <p className="mt-3 text-center text-xs font-black text-emerald-600">
                {backupMessage}
              </p>
            )}

            <button
              onClick={() => setShowBackup(false)}
              className="mt-5 w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
