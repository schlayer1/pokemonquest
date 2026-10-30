import { Ingredient, IngredientKey, PotConfig, PotTier, PokemonType } from '../types/quest';

export const INGREDIENTS: Record<IngredientKey, Ingredient> = {
  red_mini: { id: 'red_mini', name: 'Minipilz', icon: '🍄', color: 'red', texture: 'soft', kind: 'mushroom', points: 1 },
  blue_mini: { id: 'blue_mini', name: 'Morbbeere', icon: '🫐', color: 'blue', texture: 'soft', kind: 'sweet', points: 1 },
  yellow_mini: { id: 'yellow_mini', name: 'Aprikoko', icon: '🌰', color: 'yellow', texture: 'hard', kind: 'plant', points: 1 },
  gray_mini: { id: 'gray_mini', name: 'Fossil', icon: '🪨', color: 'gray', texture: 'hard', kind: 'mineral', points: 1 },
  red_root: { id: 'red_root', name: 'Großwurzel', icon: '🌱', color: 'red', texture: 'soft', kind: 'plant', points: 2 },
  blue_ice: { id: 'blue_ice', name: 'Eisbrocken', icon: '🧊', color: 'blue', texture: 'hard', kind: 'mineral', points: 2 },
  yellow_honey: { id: 'yellow_honey', name: 'Honig', icon: '🍯', color: 'yellow', texture: 'soft', kind: 'sweet', points: 2 },
  gray_shroom: { id: 'gray_shroom', name: 'Duftpilz', icon: '🌸', color: 'gray', texture: 'soft', kind: 'mushroom', points: 2 },
  rainbow: { id: 'rainbow', name: 'Regenbogentropfen', icon: '🌈', color: 'rainbow', texture: 'special', kind: 'precious', points: 3 },
  mystic_shell: { id: 'mystic_shell', name: 'Wundermuschel', icon: '🐚', color: 'mystic', texture: 'special', kind: 'mystical', points: 4 }
};

export const POTS: Record<PotTier, PotConfig> = {
  iron: { name: 'Eisen', units: 3, color: '#94a3b8', badge: 'Tier 1' },
  bronze: { name: 'Bronze', units: 10, color: '#d97706', badge: 'Tier 2' },
  silver: { name: 'Silber', units: 15, color: '#cbd5e1', badge: 'Tier 3' },
  gold: { name: 'Gold', units: 20, color: '#facc15', badge: 'Tier 4' }
};

export interface TypeConfig {
  name: string;
  icon: string;
  bg: string;
  text: string;
  border: string;
}

export const TYPES: Record<PokemonType, TypeConfig> = {
  normal: { name: 'Normal', icon: '⚪', bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
  fire: { name: 'Feuer', icon: '🔥', bg: '#fee2e2', text: '#991b1b', border: '#f87171' },
  water: { name: 'Wasser', icon: '💧', bg: '#dbeafe', text: '#1e40af', border: '#60a5fa' },
  grass: { name: 'Pflanze', icon: '🌿', bg: '#dcfce7', text: '#166534', border: '#4ade80' },
  electric: { name: 'Elektro', icon: '⚡', bg: '#fef3c7', text: '#92400e', border: '#facc15' },
  ice: { name: 'Eis', icon: '❄️', bg: '#e0f2fe', text: '#0369a1', border: '#38bdf8' },
  fighting: { name: 'Kampf', icon: '🥊', bg: '#ffedd5', text: '#9a3412', border: '#fb923c' },
  poison: { name: 'Gift', icon: '☠️', bg: '#f3e8ff', text: '#6b21a8', border: '#c084fc' },
  ground: { name: 'Boden', icon: '🏜️', bg: '#fed7aa', text: '#7c2d12', border: '#f97316' },
  flying: { name: 'Flug', icon: '🪶', bg: '#e0e7ff', text: '#3730a3', border: '#818cf8' },
  psychic: { name: 'Psycho', icon: '🔮', bg: '#fce7f3', text: '#9d174d', border: '#f472b6' },
  bug: { name: 'Käfer', icon: '🐛', bg: '#ecfccb', text: '#3f6212', border: '#a3e635' },
  rock: { name: 'Gestein', icon: '🪨', bg: '#e7e5e4', text: '#44403c', border: '#a8a29e' },
  ghost: { name: 'Geist', icon: '👻', bg: '#ede9fe', text: '#5b21b6', border: '#a78bfa' },
  dragon: { name: 'Drache', icon: '🐉', bg: '#c7d2fe', text: '#312e81', border: '#6366f1' },
  steel: { name: 'Stahl', icon: '🔩', bg: '#e2e8f0', text: '#334155', border: '#94a3b8' },
  fairy: { name: 'Fee', icon: '✨', bg: '#ffe4e6', text: '#9f1239', border: '#fb7185' }
};
