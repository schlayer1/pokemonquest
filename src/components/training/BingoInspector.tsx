import React, { useState } from 'react';
import { BINGO_GUIDES } from '../../data/bingos';
import { useQuestStore } from '../../store/useQuestStore';
import { soundService } from '../../services/sound';
import { ttsService } from '../../services/tts';
import confetti from 'canvas-confetti';
import { Star, AlertTriangle, Sparkles, Trophy } from 'lucide-react';

export const BingoInspector: React.FC = () => {
  const [state] = useQuestStore();
  const [selectedPokemonId, setSelectedPokemonId] = useState<number>(66); // Machop
  const [slot1Choice, setSlot1Choice] = useState<string>('m_1_wait');
  const [slot2Choice, setSlot2Choice] = useState<string>('m_2_wait');
  const [slot3Choice, setSlot3Choice] = useState<string>('m_3_wait');

  const guide = BINGO_GUIDES[selectedPokemonId] || BINGO_GUIDES[66];

  const opt1 = guide.slots.slot1.find(o => o.id === slot1Choice) || guide.slots.slot1[0];
  const opt2 = guide.slots.slot2.find(o => o.id === slot2Choice) || guide.slots.slot2[0];
  const opt3 = guide.slots.slot3.find(o => o.id === slot3Choice) || guide.slots.slot3[0];

  const totalScore = (opt1.stars + opt2.stars + opt3.stars) / 3;
  const roundedStars = Math.round(totalScore);
  const isGodRoll = opt3.isGodRoll === true;

  const handleSelectSlot = (slot: 1 | 2 | 3, id: string) => {
    soundService.play('tap');
    if (slot === 1) setSlot1Choice(id);
    if (slot === 2) setSlot2Choice(id);
    if (slot === 3) {
      setSlot3Choice(id);
      const chosen = guide.slots.slot3.find(o => o.id === id);
      if (chosen?.isGodRoll) {
        soundService.play('victory');
        confetti({ particleCount: 50, spread: 60 });
        ttsService.playKey('bingo_godroll', state.voicePersona, state.voice);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-3xl border-3 border-amber-300 shadow-xs">
        <h3 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-amber-700" /> Bingo-Boni Inspektor & God-Roll Prüfer
        </h3>
        <p className="text-xs text-slate-600 mb-3">
          Prüfe die 3 Bingo-Reihen deines Pokémon auf Spitzenwerte und vermeide schädliche Entwicklungen!
        </p>

        {/* Pokemon Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700">Pokémon:</span>
          {Object.values(BINGO_GUIDES).map(g => (
            <button
              key={g.pokemonId}
              onClick={() => {
                soundService.play('tap');
                setSelectedPokemonId(g.pokemonId);
                setSlot1Choice(g.slots.slot1[0].id);
                setSlot2Choice(g.slots.slot2[0].id);
                setSlot3Choice(g.slots.slot3[0].id);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all ${
                selectedPokemonId === g.pokemonId
                  ? 'bg-amber-500 text-white border-amber-700 shadow-xs scale-105'
                  : 'bg-white hover:bg-amber-100 border-amber-200 text-amber-900'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Evolution Warning Banner */}
      {guide.evolutionWarning && (
        <div className="p-4 bg-rose-50 border-3 border-rose-400 rounded-3xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-rose-950 uppercase mb-0.5">Wichtige Entwicklungs-Warnung:</h4>
            <p className="text-xs text-rose-900 font-bold leading-relaxed">{guide.evolutionWarning}</p>
          </div>
        </div>
      )}

      {/* The 3 Bingo Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slot 1 */}
        <div className="p-4 bg-white rounded-3xl border-2 border-amber-200">
          <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
            1. Reihe (1 Linie voll)
          </span>
          <h4 className="text-xs font-black text-slate-800 mt-1 mb-3">Wähle deinen 1. Bingo:</h4>

          <div className="space-y-2">
            {guide.slots.slot1.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectSlot(1, opt.id)}
                className={`w-full p-2.5 rounded-2xl border-2 text-left text-xs transition-all ${
                  slot1Choice === opt.id
                    ? 'bg-amber-50 border-amber-500 shadow-xs font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  <span className="text-amber-500 font-bold text-[10px]">
                    {'⭐'.repeat(opt.stars)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">{opt.effect}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Slot 2 */}
        <div className="p-4 bg-white rounded-3xl border-2 border-amber-200">
          <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
            2. Reihe (2 Linien voll)
          </span>
          <h4 className="text-xs font-black text-slate-800 mt-1 mb-3">Wähle deinen 2. Bingo:</h4>

          <div className="space-y-2">
            {guide.slots.slot2.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectSlot(2, opt.id)}
                className={`w-full p-2.5 rounded-2xl border-2 text-left text-xs transition-all ${
                  slot2Choice === opt.id
                    ? 'bg-amber-50 border-amber-500 shadow-xs font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  <span className="text-amber-500 font-bold text-[10px]">
                    {'⭐'.repeat(opt.stars)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">{opt.effect}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Slot 3 */}
        <div className="p-4 bg-white rounded-3xl border-2 border-amber-200">
          <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
            3. Reihe (Volles Amulett!)
          </span>
          <h4 className="text-xs font-black text-slate-800 mt-1 mb-3">Wähle deinen 3. Bingo:</h4>

          <div className="space-y-2">
            {guide.slots.slot3.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectSlot(3, opt.id)}
                className={`w-full p-2.5 rounded-2xl border-2 text-left text-xs transition-all ${
                  slot3Choice === opt.id
                    ? 'bg-amber-50 border-amber-500 shadow-xs font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  <span className="text-amber-500 font-bold text-[10px]">
                    {'⭐'.repeat(opt.stars)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">{opt.effect}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gesamtwertung Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-3xl border-3 border-emerald-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-600">Gesamt-Bewertung deiner Bingos:</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-900">
              {'⭐'.repeat(roundedStars)} ({totalScore.toFixed(1)} / 5.0)
            </span>
            {isGodRoll && (
              <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" /> GOD-ROLL!
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {guide.godRollExplanation}
          </p>
        </div>
      </div>
    </div>
  );
};
