import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { CookingPot } from './components/cooking/CookingPot';
import { PokedexGrid } from './components/pokedex/PokedexGrid';
import { CampView } from './components/camp/CampView';
import { WorldAtlas } from './components/worlds/WorldAtlas';
import { TrainingCamp } from './components/training/TrainingCamp';
import { EscapeTrainer } from './components/escape/EscapeTrainer';
import { AppPreloader } from './components/common/AppPreloader';
import { assetPreloader } from './services/assetPreloader';
import { soundService } from './services/sound';
import { ttsService } from './services/tts';
import { useQuestStore } from './store/useQuestStore';
import { IngredientKey } from './types/quest';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('cooking');
  const [isAppReady, setIsAppReady] = useState(() => {
    if (typeof window === 'undefined') return false;
    // If files are already cached on device or session is active, start immediately without blocking!
    return (
      sessionStorage.getItem('quest_session_active') === 'true' ||
      localStorage.getItem('quest_assets_cached_v2') === 'true'
    );
  });
  const [, store] = useQuestStore();

  // Background asset priming & audio wake-up when switching apps
  useEffect(() => {
    // Prime the in-memory audio & image cache silently in the background
    assetPreloader.startPreload().catch(() => {});

    // Revive audio context when returning to the app from Pokemon Quest
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        soundService.unlock();
        ttsService.unlock();
      }
    };

    // Unlock on first touch/click in case the browser suspended media
    const handleFirstTouch = () => {
      soundService.unlock();
      ttsService.unlock();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('click', handleFirstTouch, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  const handleLoadRecipeToPot = (slots: IngredientKey[], targetPokemonId?: number) => {
    store.queueRecipe(slots, targetPokemonId);
    setActiveTab('cooking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 selection:bg-amber-200">
      {/* Startup Asset & Voice Preloader Check */}
      {!isAppReady && (
        <AppPreloader onStart={() => setIsAppReady(true)} />
      )}

      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-6xl w-full mx-auto px-4 py-4 sm:py-6 flex-1">
        {activeTab === 'cooking' && <CookingPot />}
        {activeTab === 'pokedex' && <PokedexGrid onLoadRecipeToPot={handleLoadRecipeToPot} />}
        {activeTab === 'camp' && <CampView onLoadRecipeToPot={handleLoadRecipeToPot} />}
        {activeTab === 'worlds' && <WorldAtlas />}
        {activeTab === 'training' && <TrainingCamp />}
        {activeTab === 'escape' && <EscapeTrainer />}
      </main>

      <footer className="border-t-2 border-amber-200 bg-amber-100/60 py-4 mt-8 text-center text-xs text-amber-900 font-bold">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>💛 Für Levi gemacht · Privates Fan-Handbuch für Pokémon Quest</span>
          <span className="text-[11px] text-amber-700">Kubo-Insel Begleiter · Offline PWA</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
