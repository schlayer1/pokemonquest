export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'steel'
  | 'fairy';

export interface PokemonEvolution {
  id: number;
  level: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  base: number;
  next: PokemonEvolution[];
  recipes: string[];
  bestMove?: string;
  role?: 'attacker' | 'defender' | 'support';
  range?: 'melee' | 'ranged';
  hp?: number;
  atk?: number;
}

export type IngredientKey =
  | 'red_mini'
  | 'blue_mini'
  | 'yellow_mini'
  | 'gray_mini'
  | 'red_root'
  | 'blue_ice'
  | 'yellow_honey'
  | 'gray_shroom'
  | 'rainbow'
  | 'mystic_shell';

export interface Ingredient {
  id: IngredientKey;
  name: string;
  icon: string;
  color: 'red' | 'blue' | 'yellow' | 'gray' | 'rainbow' | 'mystic' | 'none';
  texture: 'soft' | 'hard' | 'special' | 'none';
  kind: 'mushroom' | 'sweet' | 'plant' | 'mineral' | 'mystical' | 'precious';
  points: number;
}

export interface Recipe {
  key: string;
  name: string;
  hint: string;
  slots: IngredientKey[];
  colorTheme?: string;
}

export type PotTier = 'iron' | 'bronze' | 'silver' | 'gold';

export interface PotConfig {
  name: string;
  units: number; // ingredients per slot (3, 10, 15, 20)
  color: string;
  badge: string;
}

export interface World {
  id: number;
  slug: string;
  name: string;
  germanName: string;
  bonus: string;
  bosses: number[];
  recommendedPower: number;
  description: string;
}

export interface TeamMember {
  id: number;
  level: number;
  role: 'attacker' | 'defender' | 'support';
  move: string;
  sharingStones?: number;
}

export interface MoveInfo {
  name: string;
  type: PokemonType;
  category: 'attack' | 'buff' | 'utility';
  power: number;
  wait: number;
  description: string;
  recommendedStones: string[];
}

export type VoicePersona = 'killian' | 'katja';

export interface DetailedMemberStones {
  hpValue: number;
  atkValue: number;
  hitHealingPercent: number;
  critRatePercent: number;
}

export interface QuestStoreState {
  stock: Record<IngredientKey, number>;
  stockReady: boolean;
  team: (TeamMember | null)[];
  wishlist: number[];
  stickers: number[];
  pot: PotTier;
  world: number;
  completedWorlds: number[];
  sound: boolean;
  voice: boolean;
  voicePersona: VoicePersona;
  bestEscapeTime: number | null;
  // New features
  ownedDecorations: string[];
  pmTickets: number;
  targetDecorationId: string | null;
  detailedStones: Record<number, DetailedMemberStones>; // slot index -> stones
}
