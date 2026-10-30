import { PokemonType } from '../types/quest';

export interface QuestMove {
  name: string;
  type: PokemonType;
  category: 'attack' | 'buff' | 'utility';
  power: number;
  wait: number; // in seconds
  tier: 'S' | 'A' | 'B';
  description: string;
  recommendedStones: string[];
}

export const QUEST_MOVES: Record<string, QuestMove> = {
  hydropump: {
    name: 'Hydropumpe',
    type: 'water',
    category: 'attack',
    power: 213,
    wait: 5,
    tier: 'S',
    description: 'Die mächtigste Fernkampf-Spezialattacke im Spiel! Schießt 4 Wassersäulen nach vorn.',
    recommendedStones: ['1x Breiten-Stein', '2x Wartezeit-Stein']
  },
  vinewhip: {
    name: 'Rankenhieb',
    type: 'grass',
    category: 'attack',
    power: 237,
    wait: 5,
    tier: 'S',
    description: 'Extrem schneller und vernichtender Nahkampfangriff. Trifft Gegner mit doppelten Peitschenhieben.',
    recommendedStones: ['2x Breiten-Stein', '1x Wartezeit-Stein']
  },
  bulkup: {
    name: 'Protzer (Bulk Up)',
    type: 'fighting',
    category: 'buff',
    power: 0,
    wait: 8,
    tier: 'S',
    description: 'Der König aller Buffs! Erhöht Angriff & Abwehr massiv. Mit 3 Teilungssteinen teilen sich alle Freunde 75% des Schutzes.',
    recommendedStones: ['3x Teilungs-Stein (Sharing Stone)']
  },
  harden: {
    name: 'Härtner (Harden)',
    type: 'normal',
    category: 'buff',
    power: 0,
    wait: 5,
    tier: 'S',
    description: 'Macht dein Team steinhart! Erhöht die Verteidigung enorm.',
    recommendedStones: ['3x Teilungs-Stein (Sharing Stone)']
  },
  psychic: {
    name: 'Psychokinese (Psychic)',
    type: 'psychic',
    category: 'attack',
    power: 121,
    wait: 7,
    tier: 'S',
    description: 'Großflächige Psycho-Welle, die Gegner zurückstößt und ihre Verteidigung senkt.',
    recommendedStones: ['1x Wiederholungs-Stein', '2x Wartezeit-Stein']
  },
  megapunch: {
    name: 'Megahieb (Mega Punch)',
    type: 'normal',
    category: 'attack',
    power: 561,
    wait: 5,
    tier: 'S',
    description: 'Höchster Einzelschaden aller normalen Attacken im Spiel! Gewaltiger Schlag.',
    recommendedStones: ['1x Breiten-Stein', '2x Wartezeit-Stein']
  },
  dragondance: {
    name: 'Drachentanz (Dragon Dance)',
    type: 'dragon',
    category: 'buff',
    power: 0,
    wait: 5,
    tier: 'S',
    description: 'Steigert Angriff und Bewegungstempo. Perfekt für Dragoran.',
    recommendedStones: ['3x Teilungs-Stein']
  },
  rockthrow: {
    name: 'Steinwurf (Rock Throw)',
    type: 'rock',
    category: 'attack',
    power: 234,
    wait: 5,
    tier: 'A',
    description: 'Sehr starker Felswurf für Onix oder Georok mit hohem Schaden.',
    recommendedStones: ['1x Breiten-Stein', '2x Wartezeit-Stein']
  },
  fireblast: {
    name: 'Feuersturm (Fire Blast)',
    type: 'fire',
    category: 'attack',
    power: 171,
    wait: 5,
    tier: 'A',
    description: 'Hinterlässt brennende Flammen auf dem Boden für dauerhaften Schaden.',
    recommendedStones: ['2x Breiten-Stein', '1x Wartezeit-Stein']
  },
  thunderbolt: {
    name: 'Donnerblitz (Thunderbolt)',
    type: 'electric',
    category: 'attack',
    power: 180,
    wait: 5,
    tier: 'A',
    description: 'Trifft mehrere Gegner in der Umgebung mit Elektroschocks und kann lähmen.',
    recommendedStones: ['1x Breiten-Stein', '1x Wartezeit-Stein']
  },
  recover: {
    name: 'Genesung (Recover)',
    type: 'normal',
    category: 'utility',
    power: 0,
    wait: 9,
    tier: 'B',
    description: 'Heilt sofort einen großen Teil der KP deines Pokémon.',
    recommendedStones: ['2x Wartezeit-Stein']
  }
};

// Official Quest learnable move mappings for top popular Pokemon
export const LEARNABLE_MOVES_BY_POKEMON: Record<number, string[]> = {
  1: ['vinewhip', 'tackle', 'leechseed', 'petaldance'], // Bisasam
  2: ['vinewhip', 'tackle', 'leechseed', 'petaldance'], // Bisaknosp
  3: ['vinewhip', 'petaldance', 'solarbeam', 'hyperbeam'], // Bisaflor
  4: ['fireblast', 'ember', 'flamethrower', 'metalclaw'], // Glumanda
  6: ['fireblast', 'flamethrower', 'dragonclaw', 'flareblitz'], // Glurak
  7: ['hydropump', 'watergun', 'whirlpool', 'aquajet'], // Schiggy
  9: ['hydropump', 'surf', 'waterfall', 'icebeam'], // Turtok
  25: ['thunderbolt', 'thunder', 'irontail', 'volttackle'], // Pikachu
  66: ['bulkup', 'crosschop', 'rollingkick', 'submission'], // Machollo
  67: ['bulkup', 'crosschop', 'closecombat', 'dynamicpunch'], // Maschok
  68: ['bulkup', 'megapunch', 'crosschop', 'closecombat'], // Machomei
  95: ['rockthrow', 'harden', 'stealthrock', 'sandstorm', 'irondefense'], // Onix
  120: ['hydropump', 'bubblebeam', 'twister', 'psybeam', 'tackle'], // Sterndu
  121: ['hydropump', 'psychic', 'icebeam', 'recover', 'psybeam'], // Starmie
  133: ['flamethrower', 'tackle', 'growl', 'take_down'], // Evoli
  143: ['megapunch', 'bellydrum', 'rest', 'bodyslam'], // Relaxo
  147: ['dragondance', 'twister', 'dragonrush', 'extremespeed'], // Dratini
  149: ['dragondance', 'dracometeor', 'hyperbeam', 'firepunch'], // Dragoran
  150: ['bulkup', 'psychic', 'psystrike', 'recover', 'shadowball'] // Mewtu
};

// Move Training Success Rate Calculator
export function calculateMoveTrainingSuccess(
  targetPokemonId: number,
  targetEvolutionStage: number, // 1 = Basis, 2 = Stufe 1, 3 = Stufe 2
  helperPokemonId: number,
  helperEvolutionStage: number,
  attemptNumber: number = 1, // 1st try = 100% mult, 2nd try = 50%, 3rd = 25%
  hasMachampStatue: boolean = false
): { percent: number; details: string; penaltyNote: string } {
  let baseChance = 12; // default different type

  if (targetPokemonId === helperPokemonId) {
    baseChance = 48; // same species
  } else {
    baseChance = 24; // same type approximation
  }

  // Bonus for evolved helpers
  if (helperEvolutionStage > 1) {
    baseChance += (helperEvolutionStage - 1) * 16;
  }

  // Machamp statue bonus: 1.5x
  if (hasMachampStatue) {
    baseChance = Math.round(baseChance * 1.5);
  }

  // Penalty multiplier: each successive training attempt cuts base rate!
  const penaltyMultipliers = [1.0, 0.5, 0.25, 0.125, 0.06];
  const mult = penaltyMultipliers[Math.min(attemptNumber - 1, penaltyMultipliers.length - 1)];

  const finalPercent = Math.min(100, Math.round(baseChance * mult));

  const penaltyNote =
    attemptNumber === 1
      ? '1. Versuch: Maximale Erfolgschance (100% Multiplikator)!'
      : `${attemptNumber}. Versuch: Chance halbiert sich nach jedem Versuch (${Math.round(mult * 100)}% Multiplikator)!`;

  return {
    percent: finalPercent,
    details: `${baseChance}% Basis-Chance × ${Math.round(mult * 100)}% Penalty = ${finalPercent}%`,
    penaltyNote
  };
}
