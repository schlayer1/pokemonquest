import React from 'react';
import { WORLDS } from '../../data/worlds';
import { TYPES } from '../../data/ingredients';
import { POKEMON_BY_ID } from '../../data/pokemon';
import { PokemonType } from '../../types/quest';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { Check, Volume2, ShieldAlert, Award } from 'lucide-react';

export const WorldAtlas: React.FC = () => {
  const [state, store] = useQuestStore();

  const handleSelectWorld = (worldId: number) => {
    soundService.play('tap');
    store.setWorld(worldId);
  };

  const handleToggleCompleted = (worldId: number) => {
    soundService.play('victory');
    store.toggleCompletedWorld(worldId);
  };

  const handleSpeakWorld = (worldId: number) => {
    soundService.play('tap');
    const w = WORLDS.find(x => x.id === worldId);
    if (!w) return;
    const bonusType = w.bonus.toLowerCase() as PokemonType;
    const bonusName = TYPES[bonusType]?.name || w.bonus;
    const bossNames = w.bosses.map(id => POKEMON_BY_ID.get(id)?.name || '').join(' und ');

    const text = `Welt ${w.id}. ${w.germanName}. Hier hilft besonders der Typ ${bonusName}. Am Ende wartet Boss ${bossNames}!`;
    ttsService.speakText(text, state.voicePersona, state.voice);
  };

  const activeWorld = WORLDS.find(w => w.id === state.world) || WORLDS[0];

  return (
    <div className="space-y-6">
      {/* Insel-Atlas Header */}
      <div className="quest-box p-4 sm:p-5 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-indigo-950 flex items-center gap-2">
              <span>🗺️</span> Der Insel-Atlas (12 Welten)
            </h2>
            <p className="text-xs text-slate-600">
              Wähle deine aktuelle Welt, nutze den Typen-Bonus und besiege den Boss!
            </p>
          </div>
          <div className="text-xs font-black text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
            Geschafft: {state.completedWorlds.length} / 12 Welten
          </div>
        </div>
      </div>

      {/* Grid of 12 Worlds */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {WORLDS.map(w => {
          const isSelected = state.world === w.id;
          const isCompleted = state.completedWorlds.includes(w.id);
          const bonusKey = w.bonus.toLowerCase() as PokemonType;
          const typeCfg = TYPES[bonusKey];

          return (
            <button
              key={w.id}
              onClick={() => handleSelectWorld(w.id)}
              className={`p-3 rounded-3xl border-3 text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-500 shadow-md scale-102 ring-2 ring-indigo-300'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-slate-400 font-mono">
                    Welt {w.id}
                  </span>
                  {isCompleted && (
                    <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>

                <div className="text-xs font-black text-slate-800 truncate mb-1">
                  {w.germanName}
                </div>

                {typeCfg && (
                  <div
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 mb-2"
                    style={{ backgroundColor: typeCfg.bg, color: typeCfg.text }}
                  >
                    <span>{typeCfg.icon}</span> +{typeCfg.name}
                  </div>
                )}
              </div>

              <div className="text-[10px] font-bold text-slate-400">
                Stärke: ~{w.recommendedPower.toLocaleString('de-DE')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected World Detail Card */}
      {activeWorld && (
        <div className="quest-box p-4 sm:p-6 bg-gradient-to-b from-indigo-50 to-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase">
                Aktuell ausgewählt
              </span>
              <h3 className="text-2xl font-black text-indigo-950 mt-1">
                Welt {activeWorld.id}: {activeWorld.germanName}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">{activeWorld.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeakWorld(activeWorld.id)}
                className="quest-btn quest-btn-yellow text-xs py-2 px-3"
              >
                <Volume2 className="w-4 h-4" /> Vorlesen
              </button>
              <button
                onClick={() => handleToggleCompleted(activeWorld.id)}
                className={`quest-btn text-xs py-2 px-3 ${
                  state.completedWorlds.includes(activeWorld.id)
                    ? 'quest-btn-green'
                    : 'quest-btn-gray'
                }`}
              >
                <Check className="w-4 h-4" />
                {state.completedWorlds.includes(activeWorld.id) ? 'Geschafft!' : 'Als geschafft markieren'}
              </button>
            </div>
          </div>

          {/* World Details: Bonus & Bosses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bonus Box */}
            <div className="p-4 bg-white rounded-2xl border-2 border-indigo-200">
              <h4 className="text-xs font-black text-indigo-900 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" /> Der Typen-Bonus für Welt {activeWorld.id}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nimm Pokémon vom Typ{' '}
                <strong className="text-indigo-900 font-black">
                  {TYPES[activeWorld.bonus.toLowerCase() as PokemonType]?.name || activeWorld.bonus}
                </strong>{' '}
                mit! Auf dieser Insel erhalten sie einen enormen Stärkeschub für alle Attacken und mehr KP.
              </p>
              <div className="mt-3 text-xs font-bold text-slate-700">
                Empfohlene Teamstärke: <span className="font-black text-indigo-900">{activeWorld.recommendedPower.toLocaleString('de-DE')} KP/ATK</span>
              </div>
            </div>

            {/* Bosses Box */}
            <div className="p-4 bg-white rounded-2xl border-2 border-rose-200">
              <h4 className="text-xs font-black text-rose-900 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Der Insel-Boss
              </h4>
              <div className="flex items-center gap-3">
                {activeWorld.bosses.map(id => {
                  const p = POKEMON_BY_ID.get(id);
                  if (!p) return null;

                  return (
                    <div key={id} className="flex items-center gap-2">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                        alt={p.name}
                        className="w-14 h-14 object-contain"
                      />
                      <div>
                        <div className="text-sm font-black text-slate-800">{p.name}</div>
                        <div className="text-[11px] font-bold text-slate-500">
                          Boss #{p.id}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
