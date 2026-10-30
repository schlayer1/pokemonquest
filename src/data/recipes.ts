import { IngredientKey, Recipe } from '../types/quest';
import { INGREDIENTS } from './ingredients';

export interface RecipeCounts {
  red: number;
  blue: number;
  yellow: number;
  gray: number;
  soft: number;
  hard: number;
  mushroom: number;
  plant: number;
  sweet: number;
  mineral: number;
  mystical: number;
}

export interface InternalRecipe extends Recipe {
  rule: (c: RecipeCounts) => boolean;
}

export const RECIPES: InternalRecipe[] = [
  {
    key: 'mulliganstewalacube',
    name: 'Kubo-Suppe',
    hint: 'Eine freie Mischung verschiedenster Zutaten',
    image: '/assets/recipes/1.png',
    slots: ['red_mini', 'blue_mini', 'yellow_mini', 'gray_mini', 'red_root'],
    colorTheme: '#fbbf24',
    rule: () => true
  },
  {
    key: 'redstewalacube',
    name: 'Roter Kubo-Eintopf',
    hint: 'Mindestens 4 rote Zutaten (z.B. Minipilze & Großwurzeln)',
    image: '/assets/recipes/2.png',
    slots: ['red_root', 'red_root', 'red_root', 'red_root', 'red_root'],
    colorTheme: '#f87171',
    rule: c => c.red >= 4
  },
  {
    key: 'bluesodaalacube',
    name: 'Blauer Kubo-Saft',
    hint: 'Mindestens 4 blaue Zutaten (Morbbeeren & Eisbrocken)',
    image: '/assets/recipes/3.png',
    slots: ['blue_ice', 'blue_ice', 'blue_ice', 'blue_ice', 'blue_ice'],
    colorTheme: '#60a5fa',
    rule: c => c.blue >= 4
  },
  {
    key: 'yellowcurryalacube',
    name: 'Gelbes Kubo-Curry',
    hint: 'Mindestens 4 gelbe Zutaten (Aprikokos & Honig)',
    image: '/assets/recipes/4.png',
    slots: ['yellow_honey', 'yellow_honey', 'yellow_honey', 'yellow_honey', 'yellow_honey'],
    colorTheme: '#facc15',
    rule: c => c.yellow >= 4
  },
  {
    key: 'grayporridgealacube',
    name: 'Weißer Kubo-Auflauf',
    hint: 'Mindestens 4 graue Zutaten (Fossilien & Duftpilze)',
    image: '/assets/recipes/5.png',
    slots: ['gray_shroom', 'gray_shroom', 'gray_shroom', 'gray_shroom', 'gray_shroom'],
    colorTheme: '#94a3b8',
    rule: c => c.gray >= 4
  },
  {
    key: 'mouth-wateringdipalacube',
    name: 'Kubo-Wasserbrei',
    hint: 'Mindestens 4 weiche und 3 blaue Zutaten',
    image: '/assets/recipes/6.png',
    slots: ['blue_mini', 'blue_mini', 'blue_ice', 'yellow_honey', 'yellow_honey'],
    colorTheme: '#38bdf8',
    rule: c => c.soft >= 4 && c.blue >= 3
  },
  {
    key: 'plaincrepealacube',
    name: 'Kubo-Seidencrêpe',
    hint: 'Mindestens 3 süße und 2 graue Zutaten',
    image: '/assets/recipes/7.png',
    slots: ['yellow_honey', 'yellow_honey', 'yellow_honey', 'gray_shroom', 'gray_shroom'],
    colorTheme: '#e2e8f0',
    rule: c => c.sweet >= 3 && c.gray >= 2
  },
  {
    key: 'sludgesoupalacube',
    name: 'Kubo-Schleimbrühe',
    hint: 'Mindestens 4 Pilze und 3 weiche Zutaten',
    image: '/assets/recipes/8.png',
    slots: ['red_mini', 'red_mini', 'red_mini', 'gray_shroom', 'yellow_mini'],
    colorTheme: '#c084fc',
    rule: c => c.mushroom >= 4 && c.soft >= 3
  },
  {
    key: 'mudpiealacube',
    name: 'Kubo-Lehmbouillon',
    hint: 'Mindestens 2 Mineralien und 3 weiche Zutaten',
    image: '/assets/recipes/9.png',
    slots: ['gray_mini', 'gray_mini', 'red_mini', 'red_mini', 'blue_mini'],
    colorTheme: '#fb923c',
    rule: c => c.mineral >= 2 && c.soft >= 3
  },
  {
    key: 'veggiesmoothiealacube',
    name: 'Kubo-Vitalsmoothie',
    hint: 'Mindestens 4 Pflanzen und 2 weiche Zutaten',
    image: '/assets/recipes/10.png',
    slots: ['yellow_mini', 'yellow_mini', 'yellow_mini', 'red_root', 'red_root'],
    colorTheme: '#4ade80',
    rule: c => c.plant >= 4 && c.soft >= 2
  },
  {
    key: 'honeynectaralacube',
    name: 'Kubo-Honigfondue',
    hint: 'Mindestens 4 süße und 3 gelbe Zutaten',
    image: '/assets/recipes/11.png',
    slots: ['yellow_honey', 'yellow_honey', 'yellow_honey', 'blue_mini', 'red_mini'],
    colorTheme: '#a3e635',
    rule: c => c.sweet >= 4 && c.yellow >= 3
  },
  {
    key: 'brainfoodalacube',
    name: 'Kubo-Mentalgeschnetzeltes',
    hint: 'Mindestens 3 süße und 2 harte Zutaten',
    image: '/assets/recipes/12.png',
    slots: ['blue_mini', 'blue_mini', 'yellow_honey', 'gray_mini', 'yellow_mini'],
    colorTheme: '#f472b6',
    rule: c => c.sweet >= 3 && c.hard >= 2
  },
  {
    key: 'stonesoupalacube',
    name: 'Kubo-Felsengulasch',
    hint: 'Mindestens 4 harte Zutaten und 2 Mineralien',
    image: '/assets/recipes/13.png',
    slots: ['gray_mini', 'gray_mini', 'blue_ice', 'yellow_mini', 'yellow_mini'],
    colorTheme: '#a8a29e',
    rule: c => c.hard >= 4 && c.mineral >= 2
  },
  {
    key: 'light-as-aircasserolealacube',
    name: 'Kubo-Windgratin',
    hint: 'Mindestens 3 Mineralien und 2 Pflanzen',
    image: '/assets/recipes/14.png',
    slots: ['blue_ice', 'blue_ice', 'gray_mini', 'red_root', 'red_root'],
    colorTheme: '#818cf8',
    rule: c => c.mineral >= 3 && c.plant >= 2
  },
  {
    key: 'hotpotalacube',
    name: 'Kubo-Feuerbouillabaisse',
    hint: 'Mindestens 3 Pilze und 2 rote Zutaten',
    image: '/assets/recipes/15.png',
    slots: ['red_mini', 'red_mini', 'gray_shroom', 'blue_mini', 'blue_mini'],
    colorTheme: '#ef4444',
    rule: c => c.mushroom >= 3 && c.red >= 2
  },
  {
    key: 'wattarisottoalacube',
    name: 'Kubo-Britzelrisotto',
    hint: 'Mindestens 4 weiche und 3 gelbe Zutaten',
    image: '/assets/recipes/16.png',
    slots: ['yellow_honey', 'yellow_honey', 'yellow_mini', 'gray_shroom', 'gray_shroom'],
    colorTheme: '#facc15',
    rule: c => c.soft >= 4 && c.yellow >= 3
  },
  {
    key: 'getswolesyrupalacube',
    name: 'Kubo-Muskelmilchkaffee',
    hint: 'Mindestens 3 süße Zutaten und 2 Pilze',
    image: '/assets/recipes/17.png',
    slots: ['blue_mini', 'blue_mini', 'yellow_honey', 'red_mini', 'red_mini'],
    colorTheme: '#f97316',
    rule: c => c.sweet >= 3 && c.mushroom >= 2
  },
  {
    key: 'ambrosiaoflegendsalacube',
    name: 'Kubo-Legendensuppe',
    hint: 'Mit Wundermuschel und wertvollen Zutaten für legendäre Pokémon',
    image: '/assets/recipes/18.png',
    slots: ['mystic_shell', 'red_root', 'blue_ice', 'yellow_honey', 'gray_shroom'],
    colorTheme: '#ec4899',
    rule: c => c.mystical >= 1
  }
];

export const RECIPE_POOLS: Record<string, Record<string, number[]>> = {
  ambrosiaoflegendsalacube: {
    Good: [144, 145, 146],
    "Very Good": [144, 145, 146],
    Special: [150, 144, 145, 146, 151]
  },
  "mouth-wateringdipalacube": {
    Normal: [54, 60, 72, 98, 118, 120],
    Good: [79, 86, 90, 116, 7, 129, 131, 138, 140],
    "Very Good": [79, 86, 90, 116, 7, 129, 131, 138, 140]
  },
  grayporridgealacube: {
    Normal: [19, 41, 74, 81, 100],
    Good: [136, 142, 92, 108, 113, 128, 137],
    "Very Good": [136, 142, 92, 108, 113, 128, 137]
  },
  veggiesmoothiealacube: {
    Normal: [43, 69, 102],
    Good: [1, 46, 83, 114, 127],
    "Very Good": [1, 46, 83, 114, 127]
  },
  hotpotalacube: {
    Normal: [37, 58],
    Good: [4, 77, 126, 136],
    "Very Good": [4, 77, 126, 136]
  },
  wattarisottoalacube: {
    Normal: [81, 100],
    Good: [25, 125, 135],
    "Very Good": [25, 125, 135]
  },
  brainfoodalacube: {
    Normal: [63, 96, 102],
    Good: [79, 121, 122, 124],
    "Very Good": [79, 121, 122, 124]
  },
  stonesoupalacube: {
    Normal: [74, 95],
    Good: [111, 138, 140, 142],
    "Very Good": [111, 138, 140, 142]
  },
  "light-as-aircasserolealacube": {
    Normal: [16, 21, 41],
    Good: [83, 84, 142],
    "Very Good": [83, 84, 142]
  },
  honeynectaralacube: {
    Normal: [10, 13, 46, 48],
    Good: [123, 127],
    "Very Good": [123, 127]
  },
  sludgesoupalacube: {
    Normal: [23, 29, 32, 41, 109],
    Good: [88, 92, 109],
    "Very Good": [88, 92, 109]
  },
  mudpiealacube: {
    Normal: [27, 50, 74],
    Good: [60, 95, 104, 111],
    "Very Good": [60, 95, 104, 111]
  },
  plaincrepealacube: {
    Normal: [19, 39, 52, 108],
    Good: [83, 113, 115, 128, 132, 133, 137, 143],
    "Very Good": [83, 113, 115, 128, 132, 133, 137, 143]
  },
  getswolesyrupalacube: {
    Normal: [56],
    Good: [66, 106, 107],
    "Very Good": [66, 106, 107]
  },
  yellowcurryalacube: {
    Normal: [13, 16, 27, 54, 69],
    Good: [25, 63, 77, 96, 125, 126],
    "Very Good": [25, 63, 77, 96, 125, 126]
  },
  bluesodaalacube: {
    Normal: [29, 43, 60, 72, 116, 118],
    Good: [7, 32, 56, 90, 114, 131, 138, 147],
    "Very Good": [7, 32, 56, 90, 114, 131, 138, 147]
  },
  redstewalacube: {
    Normal: [10, 21, 46, 48, 98, 102],
    Good: [4, 37, 58, 88, 95, 106, 111, 124, 136, 140],
    "Very Good": [4, 37, 58, 88, 95, 106, 111, 124, 136, 140]
  },
  mulliganstewalacube: {
    Normal: [10, 13, 16, 19, 21, 23, 27, 29, 32, 39, 41, 43, 46, 48, 50, 52, 54, 56, 60, 69, 72, 74, 81, 98, 100, 102, 108, 109, 116, 118, 120],
    Good: [1, 4, 7, 25, 37, 58, 63, 66, 77, 79, 83, 84, 86, 88, 90, 92, 95, 96, 104, 106, 107, 111, 113, 114, 115, 121, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 142, 143, 147],
    "Very Good": [1, 4, 7, 25, 37, 58, 63, 66, 77, 79, 83, 84, 86, 88, 90, 92, 95, 96, 104, 106, 107, 111, 113, 114, 115, 121, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 142, 143, 147],
    Special: [144, 145, 146, 150, 151]
  }
};

export const FAVORITE_RECIPES: Record<number, string> = {
  1: 'veggiesmoothiealacube',
  4: 'hotpotalacube',
  7: 'mouth-wateringdipalacube',
  25: 'wattarisottoalacube',
  66: 'getswolesyrupalacube',
  95: 'stonesoupalacube',
  133: 'plaincrepealacube'
};

export function evaluateRecipe(slots: IngredientKey[]) {
  const c: RecipeCounts = {
    red: 0,
    blue: 0,
    yellow: 0,
    gray: 0,
    soft: 0,
    hard: 0,
    mushroom: 0,
    plant: 0,
    sweet: 0,
    mineral: 0,
    mystical: 0
  };

  let points = 0;
  for (const k of slots) {
    const ing = INGREDIENTS[k];
    if (!ing) continue;
    if (ing.color in c) c[ing.color as keyof RecipeCounts]++;
    if (ing.texture in c) c[ing.texture as keyof RecipeCounts]++;
    if (ing.kind in c) c[ing.kind as keyof RecipeCounts]++;
    points += ing.points;
  }

  const recipe =
    c.mystical >= 1
      ? RECIPES[17]
      : RECIPES.slice(1, 17).find(r => r.rule(c)) || RECIPES[0];

  const qualityKey: 'Normal' | 'Good' | 'Very Good' | 'Special' =
    points >= 10 ? 'Special' : points >= 8 ? 'Very Good' : points >= 6 ? 'Good' : 'Normal';

  const qualityLabel: string =
    points >= 10 ? 'Spezial' : points >= 8 ? 'Sehr gut' : points >= 6 ? 'Gut' : 'Einfach';

  const attractedPool = RECIPE_POOLS[recipe.key]?.[qualityKey] || RECIPE_POOLS[recipe.key]?.['Normal'] || [];

  return {
    recipe,
    points,
    qualityKey,
    qualityLabel,
    counts: c,
    attractedPokemonIds: attractedPool
  };
}
