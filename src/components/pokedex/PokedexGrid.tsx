import React, { useState } from 'react';
import { POKEMON, POKEMON_BY_ID } from '../../data/pokemon';
import { TYPES } from '../../data/ingredients';
import { RECIPES } from '../../data/recipes';
import { Pokemon, PokemonType } from '../../types/quest';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { Search, Star, Check, Volume2, TrendingUp, Sparkles, X } from 'lucide-react';

interface PokedexGridProps {
  onLoadRecipeToPot?: (slots: string[]) => void;
}

export const PokedexGrid: React.FC<PokedexGridProps> = ({ onLoadRecipeToPot }) => {
  const [state, store] = useQuestStore();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | 'all'>('all');
  const [filterWishlistOnly, setFilterWishlistOnly] = useState(false);
  const [filterMissingOnly, setFilterMissingOnly] = useState(false);
  const [activeEvoPokemon, setActiveEvoPokemon] = useState<Pokemon | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  const handleToggleSticker = (id: number) => {
    soundService.play('tap');
    const nowOwned = store.toggleSticker(id);
    const p = POKEMON_BY_ID.get(id);
    if (p) {
      if (nowOwned) {
        ttsService.playKey('sticker_added', state.voicePersona, state.voice);
      } else {
        ttsService.playKey('sticker_removed', state.voicePersona, state.voice);
      }
    }
  };

  const handleToggleWish = (id: number) => {
    soundService.play('tap');
    store.toggleWishlist(id);
  };

  const handleSpeakPokemon = (p: Pokemon) => {
    soundService.play('tap');
    const typeNames = p.types.map(t => TYPES[t]?.name).join(' und ');
    const text = `${p.name}, Nummer ${p.id}. Typ: ${typeNames}. ${
      p.bestMove ? `Beste Attacke: ${p.bestMove}.` : ''
    }`;
    ttsService.speakText(text, state.voicePersona, state.voice);
  };

  const openEvolutionModal = (p: Pokemon) => {
    soundService.play('tap');
    setActiveEvoPokemon(p);
    setCurrentLevel(15);
  };

  // Filter Pokemon list
  const filtered = POKEMON.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchId = String(p.id) === q;
      if (!matchName && !matchId) return false;
    }
    if (selectedType !== 'all' && !p.types.includes(selectedType)) {
      return false;
    }
    if (filterWishlistOnly && !state.wishlist.includes(p.id)) {
      return false;
    }
    if (filterMissingOnly && state.stickers.includes(p.id)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="quest-box p-4 sm:p-5 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 flex items-center gap-2">
              <span>📖</span> Alle 151 Pokémon
            </h2>
            <p className="text-xs text-slate-600">
              Finde Entwicklungen, Lieblingsgerichte und die besten Attacken!
            </p>
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Name oder Nummer (z.B. Glumanda / 4)..."
              className="w-full pl-9 pr-3 py-2 bg-amber-50/70 border-2 border-amber-300 focus:border-amber-500 rounded-2xl text-xs font-bold outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Typen-Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              selectedType === 'all'
                ? 'bg-amber-500 text-white shadow-xs scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Alle Typen
          </button>
          {(Object.keys(TYPES) as PokemonType[]).map(t => {
            const cfg = TYPES[t];
            const isSelected = selectedType === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'border-2 border-slate-900 shadow-xs scale-105'
                    : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: cfg.bg, color: cfg.text }}
              >
                <span>{cfg.icon}</span> {cfg.name}
              </button>
            );
          })}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setFilterWishlistOnly(!filterWishlistOnly)}
            className={`px-3 py-1 rounded-xl font-bold border-2 transition-all flex items-center gap-1 ${
              filterWishlistOnly
                ? 'bg-amber-100 border-amber-400 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            Nur Wunschliste ({state.wishlist.length})
          </button>
          <button
            onClick={() => setFilterMissingOnly(!filterMissingOnly)}
            className={`px-3 py-1 rounded-xl font-bold border-2 transition-all flex items-center gap-1 ${
              filterMissingOnly
                ? 'bg-sky-100 border-sky-400 text-sky-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Noch zu entdecken ({151 - state.stickers.length})
          </button>
        </div>
      </div>

      {/* Grid of Pokemon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map(p => {
          const isOwned = state.stickers.includes(p.id);
          const isWished = state.wishlist.includes(p.id);

          return (
            <div
              key={p.id}
              className={`p-3 rounded-3xl border-3 flex flex-col justify-between transition-all bg-white shadow-xs hover:shadow-md ${
                isOwned
                  ? 'border-emerald-400 ring-2 ring-emerald-200'
                  : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              <div>
                {/* Header: ID & Action Icons */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-black text-slate-400 font-mono">
                    #{String(p.id).padStart(3, '0')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleWish(p.id)}
                      className="p-1 hover:scale-110 transition-transform"
                      title={isWished ? 'Von Wunschliste entfernen' : 'Auf Wunschliste setzen'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isWished ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleToggleSticker(p.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isOwned
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title={isOwned ? 'Im Album markiert' : 'Als gefangen markieren'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pokemon Sprite */}
                <div className="w-full h-24 flex items-center justify-center p-1 my-1">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>

                {/* Pokemon Name */}
                <div className="text-center font-black text-sm text-slate-800 truncate mb-1">
                  {p.name}
                </div>

                {/* Types */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  {p.types.map(t => {
                    const cfg = TYPES[t];
                    return (
                      <span
                        key={t}
                        className="text-[9px] font-black px-1.5 py-0.2 rounded-md"
                        style={{ backgroundColor: cfg.bg, color: cfg.text }}
                      >
                        {cfg.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                {p.bestMove && (
                  <div className="text-[10px] text-center font-bold text-amber-800 bg-amber-50 px-1 py-0.5 rounded-lg truncate">
                    ⚔️ {p.bestMove}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-1">
                  {p.next && p.next.length > 0 ? (
                    <button
                      onClick={() => openEvolutionModal(p)}
                      className="py-1 px-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-[10px] font-bold flex items-center justify-center gap-0.5 transition-colors"
                      title="Entwicklungsrechner öffnen"
                    >
                      <TrendingUp className="w-3 h-3 text-purple-600" />
                      Evo Lv.{p.next[0].level}
                    </button>
                  ) : (
                    <div className="text-[9px] font-bold text-slate-400 text-center py-1">
                      Endstufe
                    </div>
                  )}

                  <button
                    onClick={() => handleSpeakPokemon(p)}
                    className="py-1 px-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg text-[10px] font-bold flex items-center justify-center gap-0.5 transition-colors"
                    title="Vorlesen"
                  >
                    <Volume2 className="w-3 h-3" /> Vorlesen
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evolution Rechner Modal */}
      {activeEvoPokemon && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-4 border-purple-400 max-w-md w-full p-6 shadow-2xl relative text-center">
            <h2 className="text-xl font-black text-purple-950 flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" /> Wann entwickelt sich {activeEvoPokemon.name}?
            </h2>

            {/* Current Pokemon & Evolution Chain */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="flex flex-col items-center">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${activeEvoPokemon.id}.png`}
                  alt={activeEvoPokemon.name}
                  className="w-16 h-16 object-contain"
                />
                <span className="text-xs font-black text-slate-800 mt-1">
                  {activeEvoPokemon.name}
                </span>
              </div>

              {activeEvoPokemon.next.map(n => {
                const target = POKEMON_BY_ID.get(n.id);
                return (
                  <React.Fragment key={n.id}>
                    <div className="text-purple-600 font-black text-sm">
                      ➔ <br />
                      <span className="text-[10px] bg-purple-100 px-1.5 py-0.5 rounded-full">
                        Lv. {n.level}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${n.id}.png`}
                        alt={target?.name || ''}
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-xs font-black text-slate-800 mt-1">
                        {target?.name}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Special Eevee Hint */}
            {activeEvoPokemon.id === 133 && (
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 text-left text-xs text-amber-900 mb-4">
                <strong>🦊 Das Evoli-Geheimnis ab Level 36:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Mehr rote Angriffssteine ➔ <strong>Flamara</strong></li>
                  <li>Mehr blaue KP-Steine ➔ <strong>Aquana</strong></li>
                  <li>Gleich viele Steine ➔ <strong>Blitza</strong></li>
                </ul>
              </div>
            )}

            {/* Level Slider */}
            <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 my-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-purple-900">
                  Levis aktuelles Level im Spiel:
                </label>
                <span className="text-base font-black text-purple-900 bg-white px-2 py-0.5 rounded-lg border border-purple-300">
                  Level {currentLevel}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={100}
                value={currentLevel}
                onChange={e => setCurrentLevel(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />

              {activeEvoPokemon.next.length > 0 && (
                <div className="mt-3 text-xs font-bold text-slate-700">
                  {currentLevel >= activeEvoPokemon.next[0].level ? (
                    <span className="text-emerald-600 font-black flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Bereit zur Entwicklung! Nach der nächsten Expedition entwickelt es sich!
                    </span>
                  ) : (
                    <span>
                      Es fehlen noch{' '}
                      <strong className="text-purple-700 font-black">
                        {activeEvoPokemon.next[0].level - currentLevel} Level
                      </strong>{' '}
                      bis zur Entwicklung!
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveEvoPokemon(null)}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
            >
              Fertig
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
