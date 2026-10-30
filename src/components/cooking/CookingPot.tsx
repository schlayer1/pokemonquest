import React, { useState } from 'react';
import { useQuestStore } from '../../store/useQuestStore';
import { INGREDIENTS, POTS } from '../../data/ingredients';
import { RECIPES, evaluateRecipe } from '../../data/recipes';
import { POKEMON_BY_ID } from '../../data/pokemon';
import { IngredientKey, PotTier } from '../../types/quest';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import confetti from 'canvas-confetti';
import { Flame, Trash2, Undo2, Check, Sparkles, AlertCircle, Plus, Minus, Search } from 'lucide-react';

export const CookingPot: React.FC = () => {
  const [state, store] = useQuestStore();
  const [potIngredients, setPotIngredients] = useState<IngredientKey[]>([]);
  const [isCooking, setIsCooking] = useState(false);
  const [cookResult, setCookResult] = useState<ReturnType<typeof evaluateRecipe> | null>(null);
  const [lastDeducted, setLastDeducted] = useState<IngredientKey[] | null>(null);
  const [targetPokemonId, setTargetPokemonId] = useState<number | null>(null);
  const [searchPokemon, setSearchPokemon] = useState('');

  const currentPot = POTS[state.pot];

  const handleSelectPot = (tier: PotTier) => {
    if (isCooking) return;
    soundService.play('tap');
    store.setPot(tier);
    ttsService.playKey(`pot_${tier}`, state.voicePersona, state.voice);
  };

  const handleAddIngredient = (key: IngredientKey) => {
    if (isCooking) return;
    if (potIngredients.length >= 5) {
      soundService.play('fail');
      ttsService.playKey('pot_full_warning', state.voicePersona, state.voice);
      return;
    }

    soundService.play('drop');
    const next = [...potIngredients, key];
    setPotIngredients(next);
    const countKey = `count_${next.length}`;
    ttsService.playKey(countKey, state.voicePersona, state.voice);
  };

  const handleRemoveSlot = (index: number) => {
    if (isCooking) return;
    soundService.play('tap');
    const next = [...potIngredients];
    next.splice(index, 1);
    setPotIngredients(next);
  };

  const handleEmptyPot = () => {
    if (isCooking || potIngredients.length === 0) return;
    soundService.play('empty');
    setPotIngredients([]);
    setTargetPokemonId(null);
    ttsService.playKey('pot_empty', state.voicePersona, state.voice);
  };

  const handleCook = () => {
    if (potIngredients.length !== 5 || isCooking) return;

    setIsCooking(true);
    soundService.play('boil');
    ttsService.playKey('cook_start', state.voicePersona, state.voice);

    setTimeout(() => {
      const result = evaluateRecipe(potIngredients);
      setIsCooking(false);
      setCookResult(result);
      soundService.play('victory');

      if (result.qualityKey === 'Special' || result.qualityKey === 'Very Good') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      const voiceText = `${result.recipe.name}! Dein Gericht ist ${result.qualityLabel.toLowerCase()}.`;
      ttsService.speakText(voiceText, state.voicePersona, state.voice);
    }, 1400);
  };

  const handleDeductStock = () => {
    if (!cookResult) return;
    const ok = store.deductRecipe(potIngredients, state.pot);
    if (ok) {
      soundService.play('tap');
      setLastDeducted([...potIngredients]);
      ttsService.playKey('cook_deduct', state.voicePersona, state.voice);
    } else {
      soundService.play('fail');
      alert('Nicht genügend Zutaten im Vorrat für diese Topffarbe!');
    }
  };

  const handleUndoDeduct = () => {
    if (!lastDeducted) return;
    store.undoDeduct(lastDeducted, state.pot);
    soundService.play('tap');
    setLastDeducted(null);
    ttsService.playKey('cook_undo', state.voicePersona, state.voice);
  };

  const handleFillPreset = (slots: IngredientKey[], recipeName?: string) => {
    if (isCooking) return;
    soundService.play('tap');
    setPotIngredients([...slots]);
    if (recipeName) {
      ttsService.speakText(`${recipeName}. Fünf Zutaten liegen im Topf.`, state.voicePersona, state.voice);
    }
  };

  // Reverse cooking lookup
  const handleSelectTargetPokemon = (id: number) => {
    const p = POKEMON_BY_ID.get(id);
    if (!p) return;
    setTargetPokemonId(id);
    setSearchPokemon('');

    // Find best recipe that attracts this pokemon
    const bestRecipeKey = p.recipes[0] || 'mulliganstewalacube';
    const r = RECIPES.find(x => x.key === bestRecipeKey);
    if (r) {
      handleFillPreset(r.slots, r.name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topf & Interaktion */}
      <div className="quest-box p-4 sm:p-6 bg-gradient-to-b from-amber-50 to-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 flex items-center gap-2">
              <span>🍲</span> Der 5-Zutaten Kochtopf
            </h2>
            <p className="text-xs text-slate-600">
              Lege 5 Zutaten hinein, um neue Pokémon für dein Team anzulocken!
            </p>
          </div>

          {/* Topffarbe Selector */}
          <div className="flex items-center gap-1 bg-amber-100 p-1 rounded-2xl border-2 border-amber-300">
            {(Object.keys(POTS) as PotTier[]).map(tier => {
              const cfg = POTS[tier];
              const isSelected = state.pot === tier;
              return (
                <button
                  key={tier}
                  onClick={() => handleSelectPot(tier)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm scale-105'
                      : 'text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {cfg.name} ({cfg.units}x)
                </button>
              );
            })}
          </div>
        </div>

        {/* Kochtopf Kessel Animation & Slots */}
        <div className="relative bg-gradient-to-b from-amber-100 to-amber-200/80 rounded-3xl p-6 border-4 border-amber-400 shadow-inner flex flex-col items-center">
          {isCooking && (
            <div className="absolute inset-0 bg-amber-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xs z-10">
              <div className="text-center">
                <div className="text-5xl animate-bounce mb-2">🫧</div>
                <div className="text-lg font-black text-amber-950">Der Topf brodelt …</div>
              </div>
            </div>
          )}

          {/* Die 5 Slots */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 my-2">
            {[0, 1, 2, 3, 4].map(idx => {
              const ingKey = potIngredients[idx];
              const ing = ingKey ? INGREDIENTS[ingKey] : null;

              return (
                <button
                  key={idx}
                  onClick={() => handleRemoveSlot(idx)}
                  disabled={isCooking || !ing}
                  className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${
                    ing
                      ? 'bg-white border-amber-500 shadow-md scale-102 hover:border-rose-400 cursor-pointer'
                      : 'bg-white/60 border-dashed border-amber-300 text-amber-300'
                  }`}
                  title={ing ? `${ing.name} entfernen` : `Feld ${idx + 1}: Leer`}
                >
                  {ing ? (
                    <>
                      <span className="text-2xl sm:text-3xl">{ing.icon}</span>
                      <span className="text-[10px] font-bold text-slate-700 truncate max-w-[50px]">
                        {ing.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">{idx + 1}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Topf Actions */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCook}
              disabled={potIngredients.length !== 5 || isCooking}
              className="quest-btn quest-btn-yellow text-base px-6 py-3 disabled:opacity-50"
            >
              <Flame className="w-5 h-5 text-amber-800" />
              {potIngredients.length === 5 ? 'Rezept kochen!' : `Noch ${5 - potIngredients.length} Zutat(en)`}
            </button>

            {potIngredients.length > 0 && (
              <button
                onClick={handleEmptyPot}
                disabled={isCooking}
                className="quest-btn quest-btn-red py-3"
                title="Topf leeren"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Zutatenauswahl & Schnellklick */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-amber-950 flex items-center gap-1">
              <span>🧺</span> Levis Zutaten-Vorrat (Tippen zum Hineinlegen):
            </h3>
            <span className="text-[11px] font-bold text-amber-700">
              Benötigt je Slot: {currentPot.units} Einheiten
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(INGREDIENTS) as IngredientKey[]).map(key => {
              const ing = INGREDIENTS[key];
              const stockAmount = state.stock[key] || 0;
              const hasEnough = stockAmount >= currentPot.units;

              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    hasEnough ? 'bg-white border-amber-300' : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <button
                    onClick={() => handleAddIngredient(key)}
                    disabled={isCooking}
                    className="flex items-center gap-2 text-left flex-1 hover:opacity-80"
                    title={`${ing.name} in den Topf legen`}
                  >
                    <span className="text-2xl">{ing.icon}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-800 truncate">{ing.name}</div>
                      <div className="text-[11px] font-black text-amber-600">
                        Vorrat: {stockAmount}
                      </div>
                    </div>
                  </button>

                  <div className="flex flex-col gap-0.5 ml-1">
                    <button
                      onClick={() => store.stepStock(key, 5)}
                      className="w-5 h-5 bg-amber-100 hover:bg-amber-200 rounded text-amber-900 font-bold text-[10px] flex items-center justify-center"
                      title="+5 Vorrat"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => store.stepStock(key, -5)}
                      className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold text-[10px] flex items-center justify-center"
                      title="-5 Vorrat"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wunsch-Pokémon Rechner (Reverse Cooking) */}
      <div className="quest-box p-4 sm:p-5 bg-white">
        <h3 className="text-base font-black text-amber-950 flex items-center gap-2 mb-2">
          <span>🎯</span> Welches Pokémon möchtest du anlocken?
        </h3>
        <p className="text-xs text-slate-600 mb-3">
          Wähle ein Pokémon aus, um sofort die passenden Zutaten in den Kochtopf zu laden.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {[
            { id: 4, name: 'Glumanda', icon: '🔥' },
            { id: 7, name: 'Schiggy', icon: '💧' },
            { id: 1, name: 'Bisasam', icon: '🌿' },
            { id: 25, name: 'Pikachu', icon: '⚡' },
            { id: 66, name: 'Machollo', icon: '🥊' },
            { id: 95, name: 'Onix', icon: '🪨' },
            { id: 133, name: 'Evoli', icon: '🦊' },
            { id: 147, name: 'Dratini', icon: '🐉' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectTargetPokemon(p.id)}
              className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition-all ${
                targetPokemonId === p.id
                  ? 'bg-amber-400 border-amber-600 text-amber-950 scale-105'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
              }`}
            >
              <span>{p.icon}</span> {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Was kann ich kochen? Rezepte-Empfehlungen */}
      <div className="quest-box p-4 sm:p-5 bg-white">
        <h3 className="text-base font-black text-amber-950 flex items-center gap-2 mb-2">
          <span>📖</span> Was kann ich mit meinem Vorrat kochen?
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Hier siehst du alle Rezepte und kannst mit 1 Klick deinen Topf passend füllen:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RECIPES.map(r => {
            // Check if user has enough ingredients
            const needed: Record<string, number> = {};
            for (const s of r.slots) {
              needed[s] = (needed[s] || 0) + currentPot.units;
            }
            let canAfford = true;
            for (const [k, count] of Object.entries(needed)) {
              if ((state.stock[k as IngredientKey] || 0) < count) {
                canAfford = false;
                break;
              }
            }

            return (
              <div
                key={r.key}
                className="p-3 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 flex items-center justify-between gap-2 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{r.name}</span>
                    {canAfford ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Bereit
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Fehlen Zutaten
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.hint}</p>

                  <div className="flex items-center gap-1 mt-1.5">
                    {r.slots.map((s, idx) => (
                      <span key={idx} className="text-sm" title={INGREDIENTS[s]?.name}>
                        {INGREDIENTS[s]?.icon}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleFillPreset(r.slots, r.name)}
                  className="quest-btn quest-btn-yellow text-xs py-1.5 px-3 whitespace-nowrap"
                >
                  In Topf
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Koch-Ergebnis Modal */}
      {cookResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-4 border-amber-400 max-w-lg w-full p-6 shadow-2xl relative text-center">
            <div className="text-4xl mb-2">🎉</div>
            <span className="bg-amber-500 text-white font-black text-xs uppercase px-3 py-1 rounded-full">
              Gericht gekocht!
            </span>
            <h2 className="text-2xl font-black text-amber-950 mt-2 mb-1">
              {cookResult.recipe.name}
            </h2>
            <div className="text-sm font-bold text-amber-700 mb-4">
              Qualität: <span className="font-black text-amber-900">{cookResult.qualityLabel}</span> ({cookResult.points} Punkte)
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 mb-4 text-left">
              <span className="text-xs font-black text-amber-900 block mb-2">
                Diese Pokémon können angelockt werden:
              </span>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                {cookResult.attractedPokemonIds.map(id => {
                  const p = POKEMON_BY_ID.get(id);
                  if (!p) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-amber-200 shadow-2xs text-xs font-bold text-slate-700"
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                        alt={p.name}
                        className="w-6 h-6 object-contain"
                        loading="lazy"
                      />
                      <span>{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aktionen nach dem Kochen */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeductStock}
                className="quest-btn quest-btn-green w-full text-xs"
              >
                Im Spiel gekocht: Zutaten vom Vorrat abziehen
              </button>

              {lastDeducted && (
                <button
                  onClick={handleUndoDeduct}
                  className="quest-btn quest-btn-gray w-full text-xs"
                >
                  <Undo2 className="w-4 h-4" /> Abzug rückgängig machen
                </button>
              )}

              <button
                onClick={() => setCookResult(null)}
                className="mt-2 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
