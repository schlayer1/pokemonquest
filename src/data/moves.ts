import { MoveInfo } from '../types/quest';

export const TOP_MOVES: MoveInfo[] = [
  {
    name: 'Protzer (Bulk Up)',
    type: 'fighting',
    category: 'buff',
    power: 0,
    wait: 8,
    description: 'Erhöht Angriff und Verteidigung massiv! Der Schlüssel zum Sieg in Welt 9–12.',
    recommendedStones: ['3x Teilungs-Stein (Sharing Stone)']
  },
  {
    name: 'Härtner (Harden)',
    type: 'normal',
    category: 'buff',
    power: 0,
    wait: 5,
    description: 'Steigert die Verteidigung drastisch. Perfekt auf Onix oder Sleimok.',
    recommendedStones: ['3x Teilungs-Stein (Sharing Stone)']
  },
  {
    name: 'Hydropumpe (Hydro Pump)',
    type: 'water',
    category: 'attack',
    power: 213,
    wait: 5,
    description: 'Die stärkste Spezial-Attacke im ganzen Spiel! Trifft Gegner mehrfach.',
    recommendedStones: ['1x Breiten-Stein', '2x Wartezeit-Stein']
  },
  {
    name: 'Rankenhieb (Vine Whip)',
    type: 'grass',
    category: 'attack',
    power: 237,
    wait: 5,
    description: 'Extrem starker Nahkampfangriff von Bisaflor oder Knofensa.',
    recommendedStones: ['2x Breiten-Stein', '1x Wartezeit-Stein']
  },
  {
    name: 'Psychokinese (Psychic)',
    type: 'psychic',
    category: 'attack',
    power: 121,
    wait: 7,
    description: 'Mächtige Psycho-Welle, die zusätzlich die Verteidigung der Gegner senken kann.',
    recommendedStones: ['1x Wiederholungs-Stein', '2x Wartezeit-Stein']
  },
  {
    name: 'Donnerschlag / Donnerblitz',
    type: 'electric',
    category: 'attack',
    power: 180,
    wait: 5,
    description: 'Trifft mehrere Gegner und kann sie lähmen.',
    recommendedStones: ['1x Breiten-Stein', '1x Wartezeit-Stein']
  },
  {
    name: 'Drachentanz (Dragon Dance)',
    type: 'dragon',
    category: 'buff',
    power: 0,
    wait: 5,
    description: 'Erhöht Angriff und Bewegungstempo. Großartig auf Dragoran!',
    recommendedStones: ['3x Teilungs-Stein']
  },
  {
    name: 'Feuersturm (Fire Blast)',
    type: 'fire',
    category: 'attack',
    power: 171,
    wait: 5,
    description: 'Hinterlässt brennende Flammen auf dem Boden für anhaltenden Schaden.',
    recommendedStones: ['2x Breiten-Stein', '1x Wartezeit-Stein']
  }
];

export const MOVE_STONES = [
  {
    name: 'Teilungs-Stein (Sharing Stone)',
    color: '#38bdf8',
    icon: '🤝',
    effect: 'Der wichtigste Stein! Überträgt 25% jedes Buffs (wie Protzer oder Härtner) auf deine Teammitglieder. Mit 3 Steinen teilen sich deine Pokémon 75% des Schutzes!'
  },
  {
    name: 'Breiten-Stein (Broad Stone)',
    color: '#fb923c',
    icon: '↔️',
    effect: 'Macht Angriffe breiter. Perfekt für Hydropumpe und Rankenhieb, um mehr Gegner gleichzeitig zu treffen.'
  },
  {
    name: 'Wiederholungs-Stein (Repeat Stone)',
    color: '#a855f7',
    icon: '🔁',
    effect: 'Lässt dein Pokémon die Attacke sofort noch einmal hintereinander ausführen.'
  },
  {
    name: 'Wartezeit-Stein (Wait Less Stone)',
    color: '#22c55e',
    icon: '⏳',
    effect: 'Verkürzt die Abklingzeit der Attacke um 5%. Dein Pokémon kann schneller wieder angreifen!'
  },
  {
    name: 'Reichweiten-Stein (Scatter Stone)',
    color: '#eab308',
    icon: '🎯',
    effect: 'Erhöht die Anzahl der Projektile (z.B. mehr Felsen oder Flammenbälle).'
  }
];
