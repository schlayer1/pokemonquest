import React, { useState } from 'react';
import { KNOWLEDGE } from '../../data/knowledge';
import { TOP_MOVES, MOVE_STONES } from '../../data/moves';
import { MoveTrainingAssistant } from './MoveTrainingAssistant';
import { BingoInspector } from './BingoInspector';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { Volume2, Award, Swords, Sparkles, HelpCircle, Trophy } from 'lucide-react';

export const TrainingCamp: React.FC = () => {
  const [state] = useQuestStore();
  const [activeSection, setActiveSection] = useState<'stones' | 'moves' | 'training' | 'bingos' | 'tips'>('stones');

  const speakTip = (title: string, desc: string) => {
    soundService.play('tap');
    ttsService.speakText(`${title}. ${desc}`, state.voicePersona, state.voice);
  };

  return (
    <div className="space-y-6">
      {/* Trainingslager Header */}
      <div className="quest-box p-4 sm:p-5 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-purple-950 flex items-center gap-2">
              <span>💎</span> Levis Trainingslager
            </h2>
            <p className="text-xs text-slate-600">
              Kraftsteine, Move-Steine, Attacken-Training und der Bingo-God-Roll-Prüfer!
            </p>
          </div>

          <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-2xl border-2 border-purple-200 flex-wrap">
            <button
              onClick={() => { soundService.play('tap'); setActiveSection('stones'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                activeSection === 'stones' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              💎 Steine
            </button>
            <button
              onClick={() => { soundService.play('tap'); setActiveSection('moves'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                activeSection === 'moves' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              ⭐ Attacken
            </button>
            <button
              onClick={() => { soundService.play('tap'); setActiveSection('training'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                activeSection === 'training' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              🥊 Move-Training
            </button>
            <button
              onClick={() => { soundService.play('tap'); setActiveSection('bingos'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                activeSection === 'bingos' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              🏆 Bingo-Prüfer
            </button>
            <button
              onClick={() => { soundService.play('tap'); setActiveSection('tips'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                activeSection === 'tips' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              💡 Tipps
            </button>
          </div>
        </div>

        {/* SECTION 1: STEINE */}
        {activeSection === 'stones' && (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300">
              <h3 className="text-sm font-black text-sky-950 flex items-center gap-2 mb-2">
                <span>🤝</span> Die 5 Attacken-Steine (Move Stones)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {MOVE_STONES.map(s => (
                  <div key={s.name} className="p-3 bg-white rounded-xl border border-sky-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-800 mb-1">
                      <span className="text-lg">{s.icon}</span> {s.name}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{s.effect}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-sm font-black text-purple-950">Kraftsteine & P-Stein Wissen:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KNOWLEDGE.stones.map((c, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50/60 hover:bg-purple-50/40 rounded-2xl border-2 border-slate-200 hover:border-purple-300 transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-800 mb-1">
                      <span className="text-xl">{c.icon}</span> {c.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                  </div>
                  <button
                    onClick={() => speakTip(c.title, c.desc)}
                    className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg shrink-0"
                    title="Vorlesen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: ATTACKEN */}
        {activeSection === 'moves' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-purple-950">
              Die stärksten Attacken im Spiel (S-Tier):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TOP_MOVES.map(m => (
                <div
                  key={m.name}
                  className="p-3.5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-purple-900">{m.name}</span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {m.power > 0 ? `Stärke: ${m.power}` : 'Buff / Schutz'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">{m.description}</p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-[11px]">
                    <span className="text-purple-800 font-bold">
                      Beste Steine: {m.recommendedStones.join(', ')}
                    </span>
                    <button
                      onClick={() => speakTip(m.name, m.description)}
                      className="p-1 text-purple-700 hover:bg-purple-100 rounded"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: ATTACKEN-TRAINING ASSISTENT */}
        {activeSection === 'training' && (
          <MoveTrainingAssistant />
        )}

        {/* SECTION 4: BINGO-PRÜFER */}
        {activeSection === 'bingos' && (
          <BingoInspector />
        )}

        {/* SECTION 5: PROFI-TIPPS */}
        {activeSection === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {KNOWLEDGE.tips.map((c, i) => (
              <div
                key={i}
                className="p-3.5 bg-slate-50/60 hover:bg-amber-50/40 rounded-2xl border-2 border-slate-200 hover:border-amber-300 transition-all flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-black text-xs text-slate-800 mb-1">
                    <span className="text-xl">{c.icon}</span> {c.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
                <button
                  onClick={() => speakTip(c.title, c.desc)}
                  className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg shrink-0"
                  title="Vorlesen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
