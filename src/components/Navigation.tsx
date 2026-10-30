import React from 'react';
import { useQuestStore } from '../store/useQuestStore';
import { soundService } from '../services/sound';
import { ttsService } from '../services/tts';

export type TabKey = 'cooking' | 'pokedex' | 'camp' | 'worlds' | 'training' | 'escape';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TABS: { id: TabKey; label: string; icon: string; introKey: string; color: string }[] = [
  { id: 'cooking', label: 'Küche', icon: '🍲', introKey: 'intro_cooking', color: 'border-amber-400 text-amber-900' },
  { id: 'pokedex', label: 'Pokédex', icon: '📖', introKey: 'intro_pokedex', color: 'border-emerald-400 text-emerald-900' },
  { id: 'camp', label: 'Basislager', icon: '🤝', introKey: 'intro_album', color: 'border-sky-400 text-sky-900' },
  { id: 'worlds', label: 'Insel-Atlas', icon: '🗺️', introKey: 'intro_worlds', color: 'border-indigo-400 text-indigo-900' },
  { id: 'training', label: 'Trainingslager', icon: '💎', introKey: 'intro_training', color: 'border-purple-400 text-purple-900' },
  { id: 'escape', label: 'Reaktions-Schule', icon: '🏃', introKey: 'intro_escape', color: 'border-rose-400 text-rose-900' }
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [state] = useQuestStore();

  const handleSelectTab = (tab: typeof TABS[0]) => {
    soundService.play('tap');
    onTabChange(tab.id);
    ttsService.playKey(tab.introKey, state.voicePersona, state.voice);
  };

  return (
    <nav className="max-w-6xl mx-auto px-4 mt-3 sm:mt-5" aria-label="Handbuch Navigation">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab)}
              className={`p-2 sm:p-3 rounded-2xl border-4 font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
                isActive
                  ? 'bg-white shadow-md scale-102 -translate-y-0.5 ' + tab.color
                  : 'bg-white/60 hover:bg-white/90 border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <span className="text-xl sm:text-2xl">{tab.icon}</span>
              <span className="truncate w-full text-center">{tab.label}</span>
              {tab.id === 'camp' && state.stickers.length > 0 && (
                <span className="text-[10px] bg-sky-500 text-white font-black px-1.5 py-0.2 rounded-full">
                  {state.stickers.length}/151
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
