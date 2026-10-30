export interface BingoOption {
  id: string;
  slot: 1 | 2 | 3;
  label: string;
  effect: string;
  stars: 1 | 2 | 3 | 4 | 5; // 5 = God-Roll
  isGodRoll?: boolean;
}

export interface PokemonBingoGuide {
  pokemonId: number;
  name: string;
  slots: {
    slot1: BingoOption[];
    slot2: BingoOption[];
    slot3: BingoOption[];
  };
  evolutionWarning?: string;
  godRollExplanation: string;
}

export const BINGO_GUIDES: Record<number, PokemonBingoGuide> = {
  // Machollo (66) & Maschok (67)
  66: {
    pokemonId: 66,
    name: 'Machollo / Maschok',
    evolutionWarning:
      '🚨 ACHTUNG PROFI-GEHEIMNIS: Entwickle Maschok NIEMALS zu Machomei! Bei der Entwicklung zu Machomei sinkt der -20% Wartezeit-Bingo auf -15% ab! Nur als Maschok kannst du Protzer dauerhaft aktiv halten!',
    godRollExplanation:
      'Der heilige Gral von Pokémon Quest: -5% (Slot 1) + -10% (Slot 2) + -20% (Slot 3) = -35% Wartezeit auf Kampf-Attacken! Damit schützt Maschok dein Team permanent ohne Unterbrechung.',
    slots: {
      slot1: [
        { id: 'm_1_wait', slot: 1, label: '-5% Kampf-Wartezeit', effect: 'Verkürzt Wartezeit von Protzer um 5%', stars: 5, isGodRoll: true },
        { id: 'm_1_hp', slot: 1, label: '+100 Basis-KP', effect: 'Gibt Maschok etwas mehr Überlebenskraft', stars: 3 },
        { id: 'm_1_atk', slot: 1, label: '+100 Basis-Angriff', effect: 'Erhöht leicht den Schaden', stars: 2 }
      ],
      slot2: [
        { id: 'm_2_wait', slot: 2, label: '-10% Kampf-Wartezeit', effect: 'Verkürzt Wartezeit von Protzer um weitere 10%', stars: 5, isGodRoll: true },
        { id: 'm_2_hp', slot: 2, label: '+250 Basis-KP', effect: 'Gibt Maschok mehr Leben', stars: 3 },
        { id: 'm_2_res', slot: 2, label: '+20% Resistenz gegen Statuseffekte', effect: 'Schützt vor Verbrennung/Gift', stars: 3 }
      ],
      slot3: [
        { id: 'm_3_wait', slot: 3, label: '-20% Kampf-Wartezeit (GOD-ROLL!)', effect: 'Die wichtigste Eigenschaft im gesamten Spiel! Dauer-Buff!', stars: 5, isGodRoll: true },
        { id: 'm_3_atk', slot: 3, label: '+500 Angriff', effect: 'Guter Angriffsschub', stars: 3 },
        { id: 'm_3_heal', slot: 3, label: '+2.5% Trefferheilung', effect: 'Heilt sich beim Zuschlagen', stars: 4 }
      ]
    }
  },

  // Starmie (121) / Sterndu (120)
  121: {
    pokemonId: 121,
    name: 'Sterndu / Starmie',
    evolutionWarning:
      'Tipp: Lerne Sterndu vor der Entwicklung zuerst Hydropumpe, oder koche im Silber-/Goldtopf nach weiteren Sterndu als Trainings-Opfer.',
    godRollExplanation:
      'Mit +30% Wasser-Attacken-Schaden im 3. Bingo-Slot wird Starmies Hydropumpe zur stärksten Waffe auf ganz Tumblecube Island!',
    slots: {
      slot1: [
        { id: 's_1_atk', slot: 1, label: '+5% Wasser-Schaden', effect: 'Erhöht Schaden von Hydropumpe um 5%', stars: 5, isGodRoll: true },
        { id: 's_1_wait', slot: 1, label: '-5% Wasser-Wartezeit', effect: 'Hydropumpe 5% schneller wieder bereit', stars: 4 },
        { id: 's_1_hp', slot: 1, label: '+100 KP', effect: 'Etwas mehr Leben', stars: 2 }
      ],
      slot2: [
        { id: 's_2_wait', slot: 2, label: '-10% Wasser-Wartezeit', effect: 'Hydropumpe deutlich schneller bereit', stars: 5, isGodRoll: true },
        { id: 's_2_atk', slot: 2, label: '+10% Wasser-Schaden', effect: 'Mehr Trefferschaden', stars: 4 },
        { id: 's_2_crit', slot: 2, label: '+10% Kritischer Schaden', effect: 'Stärkere kritische Treffer', stars: 3 }
      ],
      slot3: [
        { id: 's_3_dmg', slot: 3, label: '+30% Wasser-Schaden (GOD-ROLL!)', effect: 'Gewaltige Schadensexplosion für Hydropumpe!', stars: 5, isGodRoll: true },
        { id: 's_3_wait', slot: 3, label: '-15% Wasser-Wartezeit', effect: 'Sehr schnelles Schießen', stars: 4 },
        { id: 's_3_atk', slot: 3, label: '+500 Basis-Angriff', effect: 'Starker Angriffswert', stars: 3 }
      ]
    }
  },

  // Onix (95)
  95: {
    pokemonId: 95,
    name: 'Onix',
    evolutionWarning:
      'Onix entwickelt sich in Pokémon Quest nicht weiter (kein Stahlos). Es ist der perfekte frühe Tank für Welt 1 bis Welt 9!',
    godRollExplanation:
      'Mit -20% Gestein-Wartezeit kann Onix Härtner fast ohne Pause wirken oder ununterbrochen Steinwurf abfeuern.',
    slots: {
      slot1: [
        { id: 'o_1_wait', slot: 1, label: '-5% Gestein-Wartezeit', effect: 'Schnellere Angriffe und Härtner', stars: 5, isGodRoll: true },
        { id: 'o_1_hp', slot: 1, label: '+100 KP', effect: 'Mehr Leben', stars: 3 },
        { id: 'o_1_res', slot: 1, label: '+20% Knockback-Resistenz', effect: 'Wird weniger zurückgeworfen', stars: 3 }
      ],
      slot2: [
        { id: 'o_2_heal', slot: 2, label: '+2.5% Trefferheilung', effect: 'Onix heilt sich bei Felswurf selbst!', stars: 5, isGodRoll: true },
        { id: 'o_2_hp', slot: 2, label: '+250 KP', effect: 'Massiver Lebensbalken', stars: 4 },
        { id: 'o_2_wait', slot: 2, label: '-10% Gestein-Wartezeit', effect: 'Schnellere Attacken', stars: 4 }
      ],
      slot3: [
        { id: 'o_3_wait', slot: 3, label: '-20% Gestein-Wartezeit (GOD-ROLL!)', effect: 'Onix feuert Felswurf wie ein Maschinengewehr!', stars: 5, isGodRoll: true },
        { id: 'o_3_hp', slot: 3, label: '+500 KP', effect: 'Riesiger KP-Tank', stars: 4 },
        { id: 'o_3_atk', slot: 3, label: '+500 Angriff', effect: 'Guter Felswurf-Schaden', stars: 3 }
      ]
    }
  },

  // Bisaflor / Bisasam (1)
  1: {
    pokemonId: 1,
    name: 'Bisasam / Bisaflor',
    evolutionWarning:
      'Bisaflor behält seine starken Pflanzen-Bingos bei der Entwicklung von Bisasam (Lv. 16) zu Bisaknosp (Lv. 32) und Bisaflor!',
    godRollExplanation:
      'Mit Rankenhieb und -15% Pflanzen-Wartezeit schlägt Bisaflor blitzschnell zu und heilt sich mit Trefferheilung ununterbrochen.',
    slots: {
      slot1: [
        { id: 'b_1_wait', slot: 1, label: '-5% Pflanzen-Wartezeit', effect: 'Rankenhieb schneller bereit', stars: 5, isGodRoll: true },
        { id: 'b_1_hp', slot: 1, label: '+100 KP', effect: 'Mehr Leben', stars: 3 },
        { id: 'b_1_dmg', slot: 1, label: '+5% Pflanzen-Schaden', effect: 'Stärkere Peitschenhiebe', stars: 4 }
      ],
      slot2: [
        { id: 'b_2_dmg', slot: 2, label: '+10% Pflanzen-Schaden', effect: 'Mehr Rankenhieb-Schaden', stars: 5, isGodRoll: true },
        { id: 'b_2_wait', slot: 2, label: '-10% Pflanzen-Wartezeit', effect: 'Sehr schnelle Attacken', stars: 5, isGodRoll: true },
        { id: 'b_2_hp', slot: 2, label: '+250 KP', effect: 'Mehr Durchhaltevermögen', stars: 3 }
      ],
      slot3: [
        { id: 'b_3_wait', slot: 3, label: '-15% Pflanzen-Wartezeit (GOD-ROLL!)', effect: 'Dauereinsatz von Rankenhieb!', stars: 5, isGodRoll: true },
        { id: 'b_3_dmg', slot: 3, label: '+20% Pflanzen-Schaden', effect: 'Enormer Schaden', stars: 4 },
        { id: 'b_3_hp', slot: 3, label: '+500 KP', effect: 'Solider Tank', stars: 3 }
      ]
    }
  }
};
