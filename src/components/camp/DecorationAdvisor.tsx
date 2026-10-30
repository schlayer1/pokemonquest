import React, { useState } from 'react';
import { DECORATIONS, Decoration } from '../../data/decorations';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { Check, Star, Ticket, Clock, Award, Sparkles } from 'lucide-react';

export const DecorationAdvisor: React.FC = () => {
  const [state, store] = useQuestStore();
  const [tierFilter, setTierFilter] = useState<number | 'all'>('all');
  const [targetId, setTargetId] = useState<string>(state.targetDecorationId || 'charizard_torch');

  const owned = state.ownedDecorations;
  const currentTickets = state.pmTickets;

  const handleToggleOwned = (id: string) => {
    soundService.play('tap');
    store.toggleDecoration(id);
  };

  const handleSetTickets = (amount: number) => {
    store.setPmTickets(amount);
  };

  const targetDeco = DECORATIONS.find(d => d.id === targetId) || DECORATIONS[0];
  const neededTickets = Math.max(0, targetDeco.cost - currentTickets);
  const daysNeeded = Math.ceil(neededTickets / 50); // 50 free tickets per day from Pokéball

  const handleTargetChange = (id: string) => {
    soundService.play('tap');
    setTargetId(id);
    store.setTargetDecoration(id);
  };

  // Check if reached goal
  const checkGoalVoice = () => {
    if (neededTickets === 0) {
      soundService.play('victory');
      ttsService.playKey('deko_goal_reached', state.voicePersona, state.voice);
    }
  };

  // Calculate active bonuses
  const activeMultipliers = {
    redIngredients: owned.includes('charizard_torch') ? 2.0 : owned.includes('flareon_cushion') ? 1.5 : 1.0,
    blueIngredients: owned.includes('blastoise_fountain') ? 2.0 : owned.includes('vaporeon_cushion') ? 1.5 : 1.0,
    yellowIngredients: owned.includes('venusaur_planter') ? 2.0 : owned.includes('jolteon_cushion') ? 1.5 : 1.0,
    grayIngredients: owned.includes('gengar_balloon') ? 2.0 : owned.includes('dodrio_tent') ? 1.5 : 1.0,
    battery: owned.includes('mewtwo_arch') ? '+1 (6 max)' : '5 max',
    expeditionXp: owned.includes('snorlax_lounger') ? 2.0 : owned.includes('pidgeot_wind_sock') ? 1.5 : 1.0,
    moveTraining: owned.includes('machamp_statue') ? 1.5 : 1.0
  };

  const filtered = DECORATIONS.filter(d => {
    if (tierFilter !== 'all' && d.priority !== tierFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* PM Ticket Sparziel-Rechner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-3xl border-3 border-amber-300 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-amber-700" />
            <div>
              <h3 className="text-base font-black text-amber-950">
                Levis PM-Ticket Sparziel-Rechner
              </h3>
              <p className="text-xs text-slate-600">
                Wähle deine nächste Wunsch-Statue und plane deine Tickets!
              </p>
            </div>
          </div>

          {/* Current PM Tickets Input */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-amber-300">
            <span className="text-xs font-bold text-slate-700">Aktuelle PM-Tickets:</span>
            <input
              type="number"
              min={0}
              max={9999}
              value={currentTickets}
              onChange={e => {
                handleSetTickets(Number(e.target.value));
                if (Number(e.target.value) >= targetDeco.cost) checkGoalVoice();
              }}
              className="w-16 font-black text-amber-900 text-sm text-center outline-none bg-amber-50 rounded-lg py-0.5"
            />
          </div>
        </div>

        {/* Selected Goal Card */}
        <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{targetDeco.icon}</span>
            <div>
              <div className="text-sm font-black text-slate-800">
                Sparziel: {targetDeco.germanName} ({targetDeco.cost} Tickets)
              </div>
              <div className="text-xs text-slate-600">{targetDeco.effectDescription}</div>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            {neededTickets === 0 ? (
              <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Du hast genug Tickets!
              </span>
            ) : (
              <div>
                <div className="text-sm font-black text-amber-700">
                  Es fehlen noch: <span className="text-base">{neededTickets} Tickets</span>
                </div>
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 justify-center sm:justify-end">
                  <Clock className="w-3.5 h-3.5" /> Ca. {daysNeeded} Tag(e) mit dem täglichen 50er-Geschenk
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Aktive Boni Übersicht */}
      <div className="p-4 bg-sky-50 rounded-3xl border-3 border-sky-300">
        <h4 className="text-xs font-black text-sky-950 uppercase mb-2 flex items-center gap-1">
          <Award className="w-4 h-4 text-sky-700" /> Levis aktive Deko-Boni:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-sky-200">
            <span className="text-slate-500 block text-[10px]">Rote Zutaten:</span>
            <strong className="text-amber-900 font-black">{activeMultipliers.redIngredients}x Funde</strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-sky-200">
            <span className="text-slate-500 block text-[10px]">Blaue Zutaten:</span>
            <strong className="text-sky-900 font-black">{activeMultipliers.blueIngredients}x Funde</strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-sky-200">
            <span className="text-slate-500 block text-[10px]">Gelbe Zutaten:</span>
            <strong className="text-yellow-700 font-black">{activeMultipliers.yellowIngredients}x Funde</strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-sky-200">
            <span className="text-slate-500 block text-[10px]">Graue Zutaten:</span>
            <strong className="text-slate-700 font-black">{activeMultipliers.grayIngredients}x Funde</strong>
          </div>
        </div>
      </div>

      {/* Deko Liste & Kauf-Rangliste */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-black text-slate-800">
            Alle 18 Statuen & Deko-Objekte nach Kauf-Priorität:
          </h3>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                tierFilter === 'all' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setTierFilter(1)}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                tierFilter === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              ⭐ Tier 1: Pflicht
            </button>
            <button
              onClick={() => setTierFilter(2)}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                tierFilter === 2 ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              Tier 2: Gut
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(d => {
            const isOwned = owned.includes(d.id);
            const isTarget = targetId === d.id;

            return (
              <div
                key={d.id}
                className={`p-3.5 rounded-2xl border-2 flex items-start justify-between gap-3 transition-all ${
                  isOwned
                    ? 'bg-emerald-50/60 border-emerald-400'
                    : isTarget
                    ? 'bg-amber-50/80 border-amber-500 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-3xl mt-0.5">{d.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-slate-800">{d.germanName}</span>
                      <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-1.5 py-0.2 rounded-md">
                        {d.cost} PM
                      </span>
                      {d.priority === 1 && (
                        <span className="bg-emerald-100 text-emerald-800 font-black text-[9px] px-1.5 py-0.2 rounded-md">
                          Top-Kauf
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                      {d.multiplierText}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {d.effectDescription}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleOwned(d.id)}
                    className={`p-1.5 rounded-xl border-2 text-[11px] font-bold flex items-center gap-1 transition-all ${
                      isOwned
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={isOwned ? 'Im Spiel gekauft' : 'Als gekauft markieren'}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isOwned ? 'Gekauft' : 'Habe ich'}
                  </button>

                  {!isOwned && (
                    <button
                      onClick={() => handleTargetChange(d.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        isTarget
                          ? 'bg-amber-400 text-amber-950 font-black'
                          : 'bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-900'
                      }`}
                    >
                      {isTarget ? 'Ziel ⭐' : 'Als Ziel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
