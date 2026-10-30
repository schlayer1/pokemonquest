export interface Decoration {
  id: string;
  name: string;
  germanName: string;
  pokemon: string;
  icon: string;
  image: string;
  cost: number; // PM Tickets
  priority: 1 | 2 | 3; // 1 = Must-have, 2 = Sehr gut, 3 = Luxus
  category: 'ingredients' | 'expedition' | 'training' | 'pokemon';
  effectDescription: string;
  multiplierText: string;
}

const RAW_DECORATIONS: Omit<Decoration, 'image'>[] = [
  // --- TIER 1: MUST-HAVES (Zutaten verdoppeln & mehr Kochen) ---
  {
    id: 'charizard_torch',
    name: 'Charizard Torch',
    germanName: 'Glurak-Fackel',
    pokemon: 'Glurak',
    icon: '🔥',
    cost: 300,
    priority: 1,
    category: 'ingredients',
    effectDescription: 'Verdoppelt alle roten Zutaten (Minipilze & Großwurzeln), die du auf Expeditionen findest!',
    multiplierText: 'Rote Zutaten x2'
  },
  {
    id: 'blastoise_fountain',
    name: 'Blastoise Fountain',
    germanName: 'Turtok-Brunnen',
    pokemon: 'Turtok',
    icon: '💧',
    cost: 300,
    priority: 1,
    category: 'ingredients',
    effectDescription: 'Verdoppelt alle blauen Zutaten (Morbbeeren & Eisbrocken) auf Expeditionen!',
    multiplierText: 'Blaue Zutaten x2'
  },
  {
    id: 'venusaur_planter',
    name: 'Venusaur Planter',
    germanName: 'Bisaflor-Pflanztopf',
    pokemon: 'Bisaflor',
    icon: '🌿',
    cost: 300,
    priority: 1,
    category: 'ingredients',
    effectDescription: 'Verdoppelt alle gelben Zutaten (Aprikokos & Honig) auf Expeditionen!',
    multiplierText: 'Gelbe Zutaten x2'
  },
  {
    id: 'gengar_balloon',
    name: 'Gengar Balloon',
    germanName: 'Gengar-Ballon',
    pokemon: 'Gengar',
    icon: '👻',
    cost: 300,
    priority: 1,
    category: 'ingredients',
    effectDescription: 'Verdoppelt alle grauen Zutaten (Fossilien & Duftpilze) auf Expeditionen!',
    multiplierText: 'Graue Zutaten x2'
  },
  {
    id: 'mewtwo_arch',
    name: 'Mewtwo Arch',
    germanName: 'Mewtu-Bogen',
    pokemon: 'Mewtu',
    icon: '⚡',
    cost: 700,
    priority: 1,
    category: 'expedition',
    effectDescription: 'Erhöht die maximale Batterie von 5 auf 6! Du kannst 1 Expedition mehr spielen.',
    multiplierText: 'Max. Batterie +1'
  },
  {
    id: 'machamp_statue',
    name: 'Machamp Statue',
    germanName: 'Machomei-Statue',
    pokemon: 'Machomei',
    icon: '🥊',
    cost: 300,
    priority: 1,
    category: 'training',
    effectDescription: 'Steigert die Erfolgschance beim Attacken-Training um das 1,5-fache!',
    multiplierText: 'Attacken-Training x1.5'
  },

  // --- TIER 2: SEHR EMPFEHLENSWERT (Günstige Booster & EP) ---
  {
    id: 'flareon_cushion',
    name: 'Flareon Cushion',
    germanName: 'Flamara-Kissen',
    pokemon: 'Flamara',
    icon: '🛋️',
    cost: 50,
    priority: 2,
    category: 'ingredients',
    effectDescription: 'Erhöht rote Zutatenfunde um 50%. Super günstig für den Start!',
    multiplierText: 'Rote Zutaten x1.5'
  },
  {
    id: 'vaporeon_cushion',
    name: 'Vaporeon Cushion',
    germanName: 'Aquana-Kissen',
    pokemon: 'Aquana',
    icon: '🛋️',
    cost: 50,
    priority: 2,
    category: 'ingredients',
    effectDescription: 'Erhöht blaue Zutatenfunde um 50%.',
    multiplierText: 'Blaue Zutaten x1.5'
  },
  {
    id: 'jolteon_cushion',
    name: 'Jolteon Cushion',
    germanName: 'Blitza-Kissen',
    pokemon: 'Blitza',
    icon: '🛋️',
    cost: 50,
    priority: 2,
    category: 'ingredients',
    effectDescription: 'Erhöht gelbe Zutatenfunde um 50%.',
    multiplierText: 'Gelbe Zutaten x1.5'
  },
  {
    id: 'dodrio_tent',
    name: 'Dodrio Tent',
    germanName: 'Dodu-Zelt',
    pokemon: 'Dodu',
    icon: '⛺',
    cost: 50,
    priority: 2,
    category: 'ingredients',
    effectDescription: 'Erhöht graue Zutatenfunde um 50%.',
    multiplierText: 'Graue Zutaten x1.5'
  },
  {
    id: 'snorlax_lounger',
    name: 'Snorlax Lounger',
    germanName: 'Relaxo-Hängematte',
    pokemon: 'Relaxo',
    icon: '💤',
    cost: 800,
    priority: 2,
    category: 'expedition',
    effectDescription: 'Verdoppelt die erhaltenen Erfahrungspunkte auf Expeditionen! Perfekt zum schnellen Hochleveln.',
    multiplierText: 'Expeditions-EP x2'
  },
  {
    id: 'pidgeot_wind_sock',
    name: 'Pidgeot Wind Sock',
    germanName: 'Tauboss-Wetterfahne',
    pokemon: 'Tauboss',
    icon: '🎏',
    cost: 200,
    priority: 2,
    category: 'expedition',
    effectDescription: 'Erhöht die Expeditions-Erfahrungspunkte um das 1,5-fache.',
    multiplierText: 'Expeditions-EP x1.5'
  },

  // --- TIER 3: LUXUS & SPEZIAL-DEKO ---
  {
    id: 'pikachu_surfboard',
    name: 'Pikachu Surfboard',
    germanName: 'Pikachu-Surfbrett',
    pokemon: 'Pikachu',
    icon: '🏄',
    cost: 400,
    priority: 3,
    category: 'pokemon',
    effectDescription: 'Erhöht die Chance, dass ein gekochter Topf mehrere Pokémon auf einmal anlockt!',
    multiplierText: 'Multi-Anlockung x1.5'
  },
  {
    id: 'eevee_guitar',
    name: 'Eevee Guitar',
    germanName: 'Evoli-Gitarre',
    pokemon: 'Evoli',
    icon: '🎸',
    cost: 300,
    priority: 3,
    category: 'pokemon',
    effectDescription: 'Erhöht ebenfalls die Chance auf mehrere angelockte Pokémon.',
    multiplierText: 'Multi-Anlockung x1.5'
  },
  {
    id: 'kangaskhan_swing',
    name: 'Kangaskhan Swing',
    germanName: 'Kangama-Schaukel',
    pokemon: 'Kangama',
    icon: '🎪',
    cost: 800,
    priority: 3,
    category: 'pokemon',
    effectDescription: 'Verdoppelt die Chance, dass neu angelockte Pokémon mehrere Move-Stein-Slots haben.',
    multiplierText: 'Mehr Move-Slots x2'
  },
  {
    id: 'meowth_balloon',
    name: 'Meowth Balloon',
    germanName: 'Mauzi-Ballon',
    pokemon: 'Mauzi',
    icon: '🎈',
    cost: 400,
    priority: 3,
    category: 'ingredients',
    effectDescription: 'Verdoppelt alle Zutaten, die du als Belohnung nach Abschluss einer Expedition erhältst.',
    multiplierText: 'Zutatenbelohnung x2'
  },
  {
    id: 'chansey_statue',
    name: 'Chansey Statue',
    germanName: 'Chaneira-Statue',
    pokemon: 'Chaneira',
    icon: '🥚',
    cost: 500,
    priority: 3,
    category: 'expedition',
    effectDescription: 'K.O. gegangene Pokémon beleben sich im Kampf 1,5x schneller wieder!',
    multiplierText: 'Reanimation x1.5'
  }
];

export const DECORATIONS: Decoration[] = RAW_DECORATIONS.map(d => ({
  ...d,
  image: `/assets/decorations/${d.id}.png`
}));
