import React, { useState } from 'react';
import { WORLD_STAGES } from '../../data/worldStages';
import { POKEMON_BY_ID } from '../../data/pokemon';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp, Wrench, Heart, Swords, Sparkles, Volume2 } from 'lucide-react';

export const ExpeditionPowerCalculator: React.FC = () => {
  const [state, store] = useQuestStore();
  const [showPapaMode, setShowPapaMode] = useState<boolean>(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  const worldData = WORLD_STAGES[state.world] || WORLD_STAGES[1];
  const stages = worldData.stages;
  const currentStage = stages[selectedStageIndex] || stages[0];

  // Team calculation
  const members = state.team;

  let totalTeamCP = 0;
  let totalHitHealing = 0;

  members.forEach((m, idx) => {
    if (!m) return;
    const p = POKEMON_BY_ID.get(m.id);
    if (!p) return;

    // Check Papa-Mode stones
    const stones = state.detailedStones[idx] || { hpValue: 1200, atkValue: 1500, hitHealingPercent: 5 };

    // Base CP estimation from Level
    const baseStat = m.level * 40;
    let memberCP = baseStat + stones.hpValue + stones.atkValue;

    // Check World Bonus Type
    const matchesBonus = p.types.map(t => t.toLowerCase()).includes(worldData.bonusType.toLowerCase());
    if (matchesBonus) {
      memberCP = Math.round(memberCP * 1.25); // +25% bonus stats in Quest
    }

    totalTeamCP += memberCP;
    totalHitHealing += stones.hitHealingPercent || 0;
  });

  const avgHitHealing = Math.round((totalHitHealing / 3) * 10) / 10;
  const neededCP = currentStage.recommendedCP;
  const isReady = totalTeamCP >= neededCP;
  const isClose = totalTeamCP >= neededCP * 0.85;

  const handleSpeakStatus = () => {
    soundService.play('tap');
    if (isReady) {
      ttsService.playKey('power_ready', state.voicePersona, state.voice);
    } else {
      ttsService.playKey('power_warning', state.voicePersona, state.voice);
    }
  };

  return (
    <div className="p-4 sm:p-5 bg-white rounded-3xl border-3 border-indigo-300 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-indigo-950 flex items-center gap-2">
            <span>⚡</span> Expeditions-Stärkerechner
          </h3>
          <p className="text-xs text-slate-600">
            Reicht die Kraft deines Teams für die Etappen von {worldData.title}?
          </p>
        </div>

        <button
          onClick={handleSpeakStatus}
          className="quest-btn quest-btn-yellow text-xs py-1.5 px-3"
        >
          <Volume2 className="w-4 h-4" /> Ansage
        </button>
      </div>

      {/* Stage Selector */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-bold text-slate-700">Etappe wählen:</span>
        {stages.map((st, i) => (
          <button
            key={st.stageName}
            onClick={() => {
              soundService.play('tap');
              setSelectedStageIndex(i);
            }}
            className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all ${
              selectedStageIndex === i
                ? 'bg-indigo-600 text-white border-indigo-800 shadow-xs scale-105'
                : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
            }`}
          >
            {st.stageName} ({st.recommendedCP.toLocaleString('de-DE')} CP)
          </button>
        ))}
      </div>

      {/* Comparison Display */}
      <div
        className={`p-4 rounded-2xl border-3 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
          isReady
            ? 'bg-emerald-50/80 border-emerald-400'
            : isClose
            ? 'bg-amber-50/80 border-amber-400'
            : 'bg-rose-50/80 border-rose-400'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            {isReady ? (
              <span className="bg-emerald-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> BEREIT FÜR DEN KAMPF!
              </span>
            ) : isClose ? (
              <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> KNAPP (Gute Taktik nötig!)
              </span>
            ) : (
              <span className="bg-rose-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> GEFAHR (Team noch zu schwach)
              </span>
            )}
          </div>

          <div className="text-2xl font-black text-slate-800 mt-2">
            Dein Team: <span className="text-indigo-900">{totalTeamCP.toLocaleString('de-DE')} CP</span>{' '}
            <span className="text-sm font-bold text-slate-500">
              vs. Boss {currentStage.bossName}: {neededCP.toLocaleString('de-DE')} CP
            </span>
          </div>

          <div className="text-xs text-slate-600 mt-1">
            Trefferheilung im Team: <strong>{avgHitHealing}%</strong> (Empfohlen ab Welt 9: mindestens 5–10%)
          </div>
        </div>
      </div>

      {/* Papa-Modus (Erweitert) Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => {
            soundService.play('tap');
            setShowPapaMode(!showPapaMode);
          }}
          className="flex items-center gap-2 text-xs font-black text-indigo-700 hover:text-indigo-900 transition-colors"
        >
          <Wrench className="w-4 h-4" />
          <span>🔧 Papa-Modus: Exakte Kraftsteine & Trefferheilung einstellen</span>
          {showPapaMode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showPapaMode && (
          <div className="mt-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-4 animate-in fade-in duration-150">
            <p className="text-xs text-slate-600 leading-relaxed">
              Hier kann Papa die genauen Kraftstein-Werte (KP, Angriff und Trefferheilungs-Prozente)
              direkt aus Levis Spiel übertragen, um eine punktgenaue Stärkeberechnung zu erhalten.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[0, 1, 2].map(slotIdx => {
                const member = state.team[slotIdx];
                const p = member ? POKEMON_BY_ID.get(member.id) : null;
                const stones = state.detailedStones[slotIdx] || {
                  hpValue: 1200,
                  atkValue: 1500,
                  hitHealingPercent: 5,
                  critRatePercent: 10
                };

                return (
                  <div key={slotIdx} className="p-3 bg-white rounded-xl border border-slate-300 space-y-2">
                    <div className="text-xs font-black text-slate-800">
                      Platz {slotIdx + 1}: {p ? p.name : 'Kein Pokémon'}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block">
                        Blaue KP-Steine Summe:
                      </label>
                      <input
                        type="number"
                        value={stones.hpValue}
                        onChange={e =>
                          store.setDetailedStones(slotIdx, { hpValue: Number(e.target.value) })
                        }
                        className="w-full text-xs font-bold p-1 border rounded bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block">
                        Rote Angriffs-Steine Summe:
                      </label>
                      <input
                        type="number"
                        value={stones.atkValue}
                        onChange={e =>
                          store.setDetailedStones(slotIdx, { atkValue: Number(e.target.value) })
                        }
                        className="w-full text-xs font-bold p-1 border rounded bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-emerald-700 block">
                        Trefferheilung (Hit Healing %):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        value={stones.hitHealingPercent}
                        onChange={e =>
                          store.setDetailedStones(slotIdx, {
                            hitHealingPercent: Number(e.target.value)
                          })
                        }
                        className="w-full text-xs font-bold p-1 border rounded bg-emerald-50 text-emerald-900"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
