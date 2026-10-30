import React, { useState } from 'react';
import { useQuestStore } from '../../store/useQuestStore';
import { POKEMON, POKEMON_BY_ID } from '../../data/pokemon';
import { INGREDIENTS } from '../../data/ingredients';
import { IngredientKey, TeamMember } from '../../types/quest';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { Check, Star, Shield, Swords, Sparkles, Plus, Trash2, Heart, Award, HelpCircle } from 'lucide-react';

export const CampView: React.FC = () => {
  const [state, store] = useQuestStore();
  const [subTab, setSubTab] = useState<'album' | 'team' | 'wishlist' | 'inventory'>('album');
  const [showTeamDoctor, setShowTeamDoctor] = useState(false);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);

  const discoveredCount = state.stickers.length;
  const progressPercent = Math.round((discoveredCount / 151) * 100);

  const handleSelectTeamPokemon = (slotIndex: number, pokemonId: number) => {
    soundService.play('tap');
    const p = POKEMON_BY_ID.get(pokemonId);
    const newMember: TeamMember = {
      id: pokemonId,
      level: 25,
      role: 'attacker',
      move: p?.bestMove || 'Tackle',
      sharingStones: 0
    };
    store.setTeamSlot(slotIndex, newMember);
    setEditingSlot(null);
  };

  const handleUpdateMember = (slotIndex: number, partial: Partial<TeamMember>) => {
    const current = state.team[slotIndex];
    if (!current) return;
    store.setTeamSlot(slotIndex, { ...current, ...partial });
  };

  const speakTeam = () => {
    soundService.play('tap');
    const members = state.team.filter((m): m is TeamMember => m !== null);
    if (members.length === 0) {
      ttsService.playKey('team_empty', state.voicePersona, state.voice);
      return;
    }
    const names = members.map(m => POKEMON_BY_ID.get(m.id)?.name || '').join(', ');
    ttsService.speakText(`Dein Team: ${names}. Bereit für das Abenteuer!`, state.voicePersona, state.voice);
  };

  // Team Doctor Analysis
  const analyzeTeam = () => {
    const members = state.team.filter((m): m is TeamMember => m !== null);
    if (members.length < 3) {
      return {
        status: 'warning',
        title: 'Team noch unvollständig',
        tips: ['Wähle 3 Pokémon für dein Team aus, um die volle Kampfkraft zu nutzen!']
      };
    }

    const tips: string[] = [];
    const hasBuffer = members.some(
      m => m.move.includes('Protzer') || m.move.includes('Härtner') || m.role === 'support'
    );
    const totalSharingStones = members.reduce((acc, m) => acc + (m.sharingStones || 0), 0);

    if (!hasBuffer) {
      tips.push('💡 Tipp: Dir fehlt ein Puffer-Pokémon! Nimm z.B. Maschok mit Protzer oder Onix mit Härtner ins Team.');
    } else if (totalSharingStones < 3) {
      tips.push('⭐ Geheimnis: Rüste dein Puffer-Pokémon mit 3x Teilungs-Steinen aus, damit dein ganzes Team 75% mehr Schutz erhält!');
    } else {
      tips.push('🏆 Perfekt! Du nutzt die Profi-Strategie: Protzer + 3 Teilungssteine!');
    }

    const avgLevel = Math.round(members.reduce((acc, m) => acc + m.level, 0) / 3);
    tips.push(`📈 Durchschnitts-Level: ${avgLevel}. Sammle goldene P-Steine auf höheren Welten!`);

    return {
      status: 'good',
      title: 'Levis Team-Analyse',
      tips
    };
  };

  return (
    <div className="space-y-6">
      {/* Basislager Header / Subnav */}
      <div className="quest-box p-4 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 flex items-center gap-2">
              <span>🤝</span> Levis Basislager
            </h2>
            <p className="text-xs text-slate-600">
              Verwalte dein Entdecker-Album, dein 3er-Expeditionsteam und deine Wunschliste.
            </p>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-2xl border-2 border-amber-200">
            <button
              onClick={() => { soundService.play('tap'); setSubTab('album'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                subTab === 'album' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              📖 Album ({discoveredCount}/151)
            </button>
            <button
              onClick={() => { soundService.play('tap'); setSubTab('team'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                subTab === 'team' ? 'bg-sky-500 text-white shadow-xs' : 'text-sky-900 hover:bg-sky-100'
              }`}
            >
              🤝 Mein Team
            </button>
            <button
              onClick={() => { soundService.play('tap'); setSubTab('wishlist'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                subTab === 'wishlist' ? 'bg-purple-500 text-white shadow-xs' : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              ⭐ Wunschliste ({state.wishlist.length})
            </button>
            <button
              onClick={() => { soundService.play('tap'); setSubTab('inventory'); }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                subTab === 'inventory' ? 'bg-emerald-500 text-white shadow-xs' : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              🧺 Vorrat
            </button>
          </div>
        </div>

        {/* Fortschrittsbalken */}
        <div className="bg-slate-100 rounded-2xl p-3 border-2 border-slate-200 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
              <span>{discoveredCount} von 151 Pokémon entdeckt!</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: STICKER-ALBUM */}
      {subTab === 'album' && (
        <div className="quest-box p-4 sm:p-5 bg-white">
          <h3 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
            <span>📖</span> Dein Kanto-Stickerheft
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {POKEMON.map(p => {
              const isOwned = state.stickers.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => store.toggleSticker(p.id)}
                  className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                    isOwned
                      ? 'bg-amber-50/80 border-amber-400 shadow-2xs hover:scale-105'
                      : 'bg-slate-50 border-slate-200 opacity-40 grayscale hover:grayscale-0'
                  }`}
                  title={`${p.name} (${isOwned ? 'Gefangen' : 'Noch offen'})`}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                    alt={p.name}
                    className="w-12 h-12 object-contain"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-black text-slate-700 truncate w-full text-center mt-1">
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: MEIN TEAM & TEAM-DOKTOR */}
      {subTab === 'team' && (
        <div className="space-y-4">
          <div className="quest-box p-4 sm:p-6 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>🤝</span> Levis 3er-Expeditionsteam
                </h3>
                <p className="text-xs text-slate-600">
                  Wähle drei Pokémon für deine Reise aus und optimiere ihre Rollen!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={speakTeam}
                  className="quest-btn quest-btn-yellow text-xs py-2 px-3"
                >
                  Team vorlesen
                </button>
                <button
                  onClick={() => setShowTeamDoctor(true)}
                  className="quest-btn quest-btn-blue text-xs py-2 px-3"
                >
                  <Sparkles className="w-4 h-4 text-sky-800" /> Team-Doktor
                </button>
              </div>
            </div>

            {/* 3 Team Slots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map(slotIdx => {
                const member = state.team[slotIdx];
                const p = member ? POKEMON_BY_ID.get(member.id) : null;

                return (
                  <div
                    key={slotIdx}
                    className="p-4 rounded-3xl border-3 border-amber-300 bg-amber-50/50 flex flex-col justify-between"
                  >
                    {member && p ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                            Platz {slotIdx + 1}
                          </span>
                          <button
                            onClick={() => store.clearTeamSlot(slotIdx)}
                            className="text-rose-500 hover:text-rose-700"
                            title="Entfernen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                            alt={p.name}
                            className="w-16 h-16 object-contain"
                          />
                          <div>
                            <div className="text-base font-black text-slate-800">{p.name}</div>
                            <div className="text-xs font-bold text-amber-700">
                              Level {member.level}
                            </div>
                          </div>
                        </div>

                        {/* Level Slider */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            Level anpassen:
                          </label>
                          <input
                            type="range"
                            min={1}
                            max={100}
                            value={member.level}
                            onChange={e => handleUpdateMember(slotIdx, { level: Number(e.target.value) })}
                            className="w-full accent-amber-500"
                          />
                        </div>

                        {/* Role Select */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            Rolle:
                          </label>
                          <select
                            value={member.role}
                            onChange={e => handleUpdateMember(slotIdx, { role: e.target.value as any })}
                            className="w-full text-xs font-bold p-1.5 bg-white border-2 border-amber-300 rounded-xl outline-none"
                          >
                            <option value="attacker">⚔️ Angreifer</option>
                            <option value="defender">🛡️ Beschützer</option>
                            <option value="support">💪 Unterstützer (Puffer)</option>
                          </select>
                        </div>

                        {/* Teilungssteine */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            Teilungs-Steine (Sharing Stones):
                          </label>
                          <div className="flex items-center gap-1">
                            {[0, 1, 2, 3].map(count => (
                              <button
                                key={count}
                                onClick={() => handleUpdateMember(slotIdx, { sharingStones: count })}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold border-2 transition-all ${
                                  (member.sharingStones || 0) === count
                                    ? 'bg-sky-400 border-sky-600 text-sky-950 font-black'
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                {count}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl text-amber-300 mb-2">+</span>
                        <div className="text-xs font-bold text-slate-500 mb-3">
                          Platz {slotIdx + 1} ist noch frei
                        </div>
                        <button
                          onClick={() => setEditingSlot(slotIdx)}
                          className="quest-btn quest-btn-yellow text-xs py-2 px-3"
                        >
                          Pokémon wählen
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: WUNSCHLISTE */}
      {subTab === 'wishlist' && (
        <div className="quest-box p-4 sm:p-5 bg-white">
          <h3 className="text-base font-black text-slate-800 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> Levis Wunsch-Pokémon
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Markiere im Pokédex den Stern an deinen Lieblings-Pokémon, um sie hier zu sammeln.
          </p>

          {state.wishlist.length === 0 ? (
            <div className="text-center py-8 text-xs font-bold text-slate-400">
              Deine Wunschliste ist noch leer! Tippe im Pokédex auf den Stern bei einem Pokémon.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {state.wishlist.map(id => {
                const p = POKEMON_BY_ID.get(id);
                if (!p) return null;

                return (
                  <div
                    key={id}
                    className="p-3 rounded-2xl border-2 border-amber-300 bg-amber-50/50 flex flex-col items-center justify-between"
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                      alt={p.name}
                      className="w-14 h-14 object-contain"
                    />
                    <div className="text-xs font-black text-slate-800 text-center my-1">
                      {p.name}
                    </div>
                    <button
                      onClick={() => store.toggleWishlist(id)}
                      className="text-[10px] text-rose-500 font-bold hover:underline"
                    >
                      Entfernen
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: INVENTAR / VORRAT BEARBEITEN */}
      {subTab === 'inventory' && (
        <div className="quest-box p-4 sm:p-5 bg-white">
          <h3 className="text-base font-black text-slate-800 mb-2 flex items-center gap-2">
            <span>🧺</span> Zutaten-Vorrat bearbeiten
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Trage hier genau ein, wie viele Beeren, Pilze und Mineralien du im Spiel besitzt:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(INGREDIENTS) as IngredientKey[]).map(k => {
              const ing = INGREDIENTS[k];
              const val = state.stock[k] || 0;

              return (
                <div
                  key={k}
                  className="p-3 rounded-2xl border-2 border-amber-200 bg-amber-50/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ing.icon}</span>
                    <span className="text-xs font-bold text-slate-800">{ing.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => store.stepStock(k, -10)}
                      className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded font-black text-xs"
                    >
                      -10
                    </button>
                    <input
                      type="number"
                      value={val}
                      onChange={e => store.setStock(k, Number(e.target.value))}
                      className="w-14 text-center font-black text-xs py-1 border-2 border-amber-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={() => store.stepStock(k, 10)}
                      className="w-6 h-6 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded font-black text-xs"
                    >
                      +10
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team Doctor Modal */}
      {showTeamDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-4 border-sky-400 max-w-lg w-full p-6 shadow-2xl relative">
            <h2 className="text-xl font-black text-sky-950 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-sky-600" /> Levis Team-Doktor
            </h2>
            <p className="text-xs text-slate-600 mb-4">
              Der Team-Doktor prüft dein 3er-Team auf die besten Buffs und Synergien für schwierige Insel-Welten.
            </p>

            {(() => {
              const analysis = analyzeTeam();
              return (
                <div className="space-y-3 mb-5">
                  <div className="p-3 bg-sky-50 rounded-2xl border-2 border-sky-200">
                    <h4 className="text-xs font-black text-sky-900 mb-1">{analysis.title}</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {analysis.tips.map((t, i) => (
                        <li key={i} className="leading-relaxed">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 text-xs text-amber-950 leading-relaxed">
                    <strong>👑 Die Meister-Formel von Pokémon Quest:</strong>
                    <p className="mt-1">
                      1x Maschok mit <strong>Protzer</strong> + <strong>3x Teilungs-Stein</strong> +
                      2x Angreifer mit <strong>Hydropumpe</strong> oder <strong>Rankenhieb</strong> +
                      möglichst <strong>10% Trefferheilung</strong> auf P-Steinen!
                    </p>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => setShowTeamDoctor(false)}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Slot Selection Modal */}
      {editingSlot !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-4 border-amber-400 max-w-xl w-full p-6 shadow-2xl relative max-h-[80vh] flex flex-col">
            <h3 className="text-base font-black text-amber-950 mb-2">
              Wähle ein Pokémon für Platz {editingSlot + 1}:
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto p-1 flex-1">
              {POKEMON.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectTeamPokemon(editingSlot, p.id)}
                  className="p-2 rounded-2xl border-2 border-slate-200 hover:border-amber-400 flex flex-col items-center justify-center hover:bg-amber-50 transition-all"
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                    alt={p.name}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center mt-1">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setEditingSlot(null)}
              className="mt-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
