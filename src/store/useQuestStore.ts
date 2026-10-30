import { useState, useEffect } from 'react';
import { IngredientKey, PotTier, QuestStoreState, TeamMember, VoicePersona, DetailedMemberStones } from '../types/quest';
import { POTS } from '../data/ingredients';

const STORAGE_KEY = 'levi_quest_handbook_v3';

const initialStock: Record<IngredientKey, number> = {
  red_mini: 0,
  blue_mini: 0,
  yellow_mini: 0,
  gray_mini: 0,
  red_root: 0,
  blue_ice: 0,
  yellow_honey: 0,
  gray_shroom: 0,
  rainbow: 0,
  mystic_shell: 0
};

const defaultState: QuestStoreState = {
  stock: initialStock,
  stockReady: false,
  team: [null, null, null],
  wishlist: [],
  stickers: [],
  pot: 'silver',
  world: 1,
  completedWorlds: [],
  sound: true,
  voice: true,
  voicePersona: 'killian',
  spriteStyle: 'classic', // User preference: 2D classic artwork is default!
  bestEscapeTime: null,
  ownedDecorations: [],
  pmTickets: 50,
  targetDecorationId: 'charizard_torch',
  detailedStones: {
    0: { hpValue: 1200, atkValue: 1800, hitHealingPercent: 5.0, critRatePercent: 10.0 },
    1: { hpValue: 1100, atkValue: 1900, hitHealingPercent: 6.2, critRatePercent: 12.0 },
    2: { hpValue: 2500, atkValue: 800, hitHealingPercent: 8.5, critRatePercent: 5.0 }
  }
};

function loadStoredState(): QuestStoreState {
  if (typeof window === 'undefined') return defaultState;
  try {
    // Also check for v2 legacy data if v3 is not yet present!
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('levi_quest_handbook_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsed,
        stock: { ...initialStock, ...(parsed.stock || {}) },
        team: Array.isArray(parsed.team) && parsed.team.length === 3 ? parsed.team : [null, null, null],
        stickers: Array.isArray(parsed.stickers) ? parsed.stickers : [],
        wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
        completedWorlds: Array.isArray(parsed.completedWorlds) ? parsed.completedWorlds : [],
        voicePersona: parsed.voicePersona === 'katja' ? 'katja' : 'killian',
        spriteStyle: parsed.spriteStyle === 'kubo' ? 'kubo' : 'classic'
      };
    }
  } catch {
    // JSON parse error
  }
  return defaultState;
}

let globalState: QuestStoreState = loadStoredState();
const listeners = new Set<(state: QuestStoreState) => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch {}
  }
  listeners.forEach(fn => fn(globalState));
}

export const questStore = {
  getState(): QuestStoreState {
    return globalState;
  },

  setState(partial: Partial<QuestStoreState>) {
    globalState = { ...globalState, ...partial };
    notify();
  },

  setStock(key: IngredientKey, amount: number) {
    globalState = {
      ...globalState,
      stock: {
        ...globalState.stock,
        [key]: Math.max(0, Math.min(999, amount))
      },
      stockReady: true
    };
    notify();
  },

  stepStock(key: IngredientKey, delta: number) {
    const cur = globalState.stock[key] || 0;
    this.setStock(key, cur + delta);
  },

  deductRecipe(slots: IngredientKey[], potTier: PotTier): boolean {
    const units = POTS[potTier]?.units || 3;
    const required: Record<string, number> = {};
    for (const s of slots) {
      required[s] = (required[s] || 0) + units;
    }

    // Check if can afford
    for (const [k, count] of Object.entries(required)) {
      if ((globalState.stock[k as IngredientKey] || 0) < count) {
        return false;
      }
    }

    const nextStock = { ...globalState.stock };
    for (const [k, count] of Object.entries(required)) {
      nextStock[k as IngredientKey] = Math.max(0, (nextStock[k as IngredientKey] || 0) - count);
    }

    globalState = { ...globalState, stock: nextStock };
    notify();
    return true;
  },

  undoDeduct(slots: IngredientKey[], potTier: PotTier) {
    const units = POTS[potTier]?.units || 3;
    const nextStock = { ...globalState.stock };
    for (const s of slots) {
      nextStock[s] = Math.min(999, (nextStock[s] || 0) + units);
    }
    globalState = { ...globalState, stock: nextStock };
    notify();
  },

  toggleSticker(id: number) {
    const has = globalState.stickers.includes(id);
    globalState = {
      ...globalState,
      stickers: has ? globalState.stickers.filter(x => x !== id) : [...globalState.stickers, id]
    };
    notify();
    return !has; // returns true if now owned
  },

  toggleWishlist(id: number) {
    const has = globalState.wishlist.includes(id);
    globalState = {
      ...globalState,
      wishlist: has ? globalState.wishlist.filter(x => x !== id) : [...globalState.wishlist, id]
    };
    notify();
    return !has;
  },

  setTeamSlot(index: number, member: TeamMember | null) {
    const nextTeam = [...globalState.team];
    nextTeam[index] = member;
    globalState = { ...globalState, team: nextTeam };
    notify();
  },

  clearTeamSlot(index: number) {
    this.setTeamSlot(index, null);
  },

  setPot(pot: PotTier) {
    globalState = { ...globalState, pot };
    notify();
  },

  setWorld(world: number) {
    globalState = { ...globalState, world };
    notify();
  },

  toggleCompletedWorld(worldId: number) {
    const has = globalState.completedWorlds.includes(worldId);
    globalState = {
      ...globalState,
      completedWorlds: has
        ? globalState.completedWorlds.filter(x => x !== worldId)
        : [...globalState.completedWorlds, worldId]
    };
    notify();
  },

  toggleSound() {
    globalState = { ...globalState, sound: !globalState.sound };
    notify();
  },

  toggleVoice() {
    globalState = { ...globalState, voice: !globalState.voice };
    notify();
  },

  setVoicePersona(persona: VoicePersona) {
    globalState = { ...globalState, voicePersona: persona };
    notify();
  },

  toggleSpriteStyle() {
    globalState = {
      ...globalState,
      spriteStyle: globalState.spriteStyle === 'classic' ? 'kubo' : 'classic'
    };
    notify();
  },

  setSpriteStyle(style: 'classic' | 'kubo') {
    globalState = { ...globalState, spriteStyle: style };
    notify();
  },

  setBestEscapeTime(ms: number) {
    const current = globalState.bestEscapeTime;
    if (current === null || ms < current) {
      globalState = { ...globalState, bestEscapeTime: ms };
      notify();
    }
  },

  toggleDecoration(id: string) {
    const has = globalState.ownedDecorations.includes(id);
    globalState = {
      ...globalState,
      ownedDecorations: has
        ? globalState.ownedDecorations.filter(x => x !== id)
        : [...globalState.ownedDecorations, id]
    };
    notify();
  },

  setPmTickets(amount: number) {
    globalState = { ...globalState, pmTickets: Math.max(0, amount) };
    notify();
  },

  setTargetDecoration(id: string | null) {
    globalState = { ...globalState, targetDecorationId: id };
    notify();
  },

  setDetailedStones(slotIndex: number, stones: Partial<DetailedMemberStones>) {
    const current = globalState.detailedStones[slotIndex] || {
      hpValue: 1000,
      atkValue: 1000,
      hitHealingPercent: 0,
      critRatePercent: 0
    };
    globalState = {
      ...globalState,
      detailedStones: {
        ...globalState.detailedStones,
        [slotIndex]: { ...current, ...stones }
      }
    };
    notify();
  },

  exportJSON(): string {
    return JSON.stringify(globalState, null, 2);
  },

  importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      globalState = {
        ...defaultState,
        ...parsed,
        stock: { ...initialStock, ...(parsed.stock || {}) },
        team: Array.isArray(parsed.team) && parsed.team.length === 3 ? parsed.team : [null, null, null],
        stickers: Array.isArray(parsed.stickers) ? parsed.stickers : [],
        wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
        completedWorlds: Array.isArray(parsed.completedWorlds) ? parsed.completedWorlds : []
      };
      notify();
      return true;
    } catch {
      return false;
    }
  }
};

export function useQuestStore(): [QuestStoreState, typeof questStore] {
  const [state, setState] = useState<QuestStoreState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return [state, questStore];
}
