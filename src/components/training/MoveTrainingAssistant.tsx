import React, { useState } from 'react';
import { POKEMON, POKEMON_BY_ID } from '../../data/pokemon';
import { QUEST_MOVES, LEARNABLE_MOVES_BY_POKEMON, calculateMoveTrainingSuccess } from '../../data/movesDatabase';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import { getPokemonSprite } from '../../utils/pokemonSprite';
import { Swords, ShieldAlert, Sparkles, AlertTriangle, ChefHat, Volume2 } from 'lucide-react';

export const MoveTrainingAssistant: React.FC = () => {
  const [state] = useQuestStore();
  const [targetId, setTargetId] = useState<number>(121); // Default Starmie
  const [selectedMoveKey, setSelectedMoveKey] = useState<string>('hydropump');
  const [helperTypeMatch, setHelperTypeMatch] = useState<'species' | 'same_type' | 'diff_type'>('species');
  const [helperStage, setHelperStage] = useState<number>(1);
  const [attemptCount, setAttemptCount] = useState<number>(1);

  const target = POKEMON_BY_ID.get(targetId) || POKEMON[0];
  const learnableKeys = LEARNABLE_MOVES_BY_POKEMON[targetId] || ['tackle', 'scratch'];
  const hasMachampStatue = state.ownedDecorations.includes('machamp_statue');

  const helperId = helperTypeMatch === 'species' ? targetId : 7; // placeholder ID
  const result = calculateMoveTrainingSuccess(
    targetId,
    target.next.length === 0 ? 3 : 1,
    helperId,
    helperStage,
    attemptCount,
    hasMachampStatue
  );

  const speakTip = () => {
    soundService.play('tap');
    ttsService.playKey('move_training_tip', state.voicePersona, state.voice);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-100 to-purple-50 rounded-3xl border-3 border-purple-300 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-purple-950 flex items-center gap-2">
              <Swords className="w-5 h-5 text-purple-700" /> Attacken-Trainings-Rechner & Assistent
            </h3>
            <p className="text-xs text-slate-600">
              Prüfe erlernbare Attacken und maximiere deine Erfolgschance beim Umlernen!
            </p>
          </div>
          <button
            onClick={speakTip}
            className="quest-btn quest-btn-yellow text-xs py-1.5 px-3"
          >
            <Volume2 className="w-4 h-4" /> Tipp vorlesen
          </button>
        </div>

        {/* Target Pokemon Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700">Pokémon wählen:</span>
          {[
            { id: 121, name: 'Starmie' },
            { id: 67, name: 'Maschok' },
            { id: 1, name: 'Bisasam' },
            { id: 6, name: 'Glurak' },
            { id: 95, name: 'Onix' },
            { id: 149, name: 'Dragoran' },
            { id: 150, name: 'Mewtu' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => {
                soundService.play('tap');
                setTargetId(p.id);
                const moves = LEARNABLE_MOVES_BY_POKEMON[p.id] || [];
                if (moves.length > 0) setSelectedMoveKey(moves[0]);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all flex items-center gap-1.5 ${
                targetId === p.id
                  ? 'bg-purple-600 text-white border-purple-800 shadow-xs scale-105'
                  : 'bg-white hover:bg-purple-50 border-purple-200 text-purple-900'
              }`}
            >
              <img
                src={getPokemonSprite(p.id, state.spriteStyle)}
                alt={p.name}
                className="w-5 h-5 object-contain"
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Learnable Moves Pool */}
      <div className="p-4 bg-white rounded-3xl border-2 border-purple-200">
        <h4 className="text-xs font-black text-purple-950 uppercase mb-3 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Alle erlernbaren Attacken für {target.name}:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {learnableKeys.map(k => {
            const move = QUEST_MOVES[k];
            if (!move) return null;
            const isSelected = selectedMoveKey === k;

            return (
              <button
                key={k}
                onClick={() => {
                  soundService.play('tap');
                  setSelectedMoveKey(k);
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'bg-purple-50 border-purple-600 shadow-xs ring-2 ring-purple-300'
                    : 'bg-slate-50/50 hover:bg-purple-50/30 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-800">{move.name}</span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                      move.tier === 'S'
                        ? 'bg-amber-400 text-amber-950 font-black'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Tier {move.tier}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 mb-1">
                  {move.power > 0 ? `Stärke: ${move.power}` : 'Buff'} · Wartezeit: {move.wait}s
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{move.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator: Erfolgschance beim Opfern */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border-3 border-amber-300">
        <h4 className="text-sm font-black text-amber-950 mb-2 flex items-center gap-1.5">
          <span>🎯</span> Erfolgschancen-Rechner für das Training
        </h4>
        <p className="text-xs text-slate-600 mb-4">
          Finde heraus, wie hoch deine Chance beim Attacken-Training im Spiel ist:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Helper Match */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Welches Pokémon opferst du?
            </label>
            <select
              value={helperTypeMatch}
              onChange={e => setHelperTypeMatch(e.target.value as any)}
              className="w-full text-xs font-bold p-1.5 bg-white border border-amber-300 rounded-xl outline-none"
            >
              <option value="species">Gleiche Art (z.B. {target.name}) ⭐⭐⭐</option>
              <option value="same_type">Gleicher Typ (z.B. gleiches Element) ⭐⭐</option>
              <option value="diff_type">Anderer Typ (beliebiges Pokémon) ⭐</option>
            </select>
          </div>

          {/* Helper Stage */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Entwicklungsstufe des Helfers:
            </label>
            <select
              value={helperStage}
              onChange={e => setHelperStage(Number(e.target.value))}
              className="w-full text-xs font-bold p-1.5 bg-white border border-amber-300 rounded-xl outline-none"
            >
              <option value={1}>Basis-Pokémon (z.B. Sterndu / Machollo)</option>
              <option value={2}>1. Entwicklung (z.B. Starmie / Maschok)</option>
              <option value={3}>2. Entwicklung (z.B. Machomei)</option>
            </select>
          </div>

          {/* Attempt Penalty */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Der wievielte Trainings-Versuch?
            </label>
            <select
              value={attemptCount}
              onChange={e => setAttemptCount(Number(e.target.value))}
              className="w-full text-xs font-bold p-1.5 bg-white border border-amber-300 rounded-xl outline-none"
            >
              <option value={1}>1. Versuch (100% volle Chance)</option>
              <option value={2}>2. Versuch (50% halbe Chance)</option>
              <option value={3}>3. Versuch (25% Viertel-Chance)</option>
              <option value={4}>4.+ Versuch (12.5% Mini-Chance)</option>
            </select>
          </div>
        </div>

        {/* Result Box */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-2xl border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-bold">Errechnete Erfolgschance pro Helfer:</div>
            <div className="text-2xl font-black text-emerald-800">
              {result.percent}% Erfolgsquote
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {result.penaltyNote} {hasMachampStatue && '🥊 (+50% Bonus durch Machomei-Statue aktiv!)'}
            </div>
          </div>

          {/* Recipe Recommendation */}
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2 max-w-sm">
            <ChefHat className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Günstiger Farming-Tipp:</strong> Koche im <em>Eisentopf</em> (nur 15 Zutaten!) gezielt nach Helfern derselben Art für 100% Erfolge!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
