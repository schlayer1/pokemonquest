export interface KnowledgeCard {
  icon: string;
  title: string;
  desc: string;
}

export const KNOWLEDGE: Record<'stones' | 'moves' | 'tips', KnowledgeCard[]> = {
  stones: [
    {
      icon: '🔴🔵',
      title: 'Kraftsteine: Angriff & Leben',
      desc: 'Rote Angriffssteine stärken den Angriff. Blaue KP-Steine geben deinem Pokémon mehr Leben. Fülle die freien Plätze und halte eine gute Balance!'
    },
    {
      icon: '🤝',
      title: 'Teilungs-Stein (Sharing Stone)',
      desc: 'An Buff-Attacken wie Protzer teilt er 25% des Effekts mit deinen beiden Freunden. Mit 3 Steinen teilen sich alle 75% mehr Kraft und Schutz!'
    },
    {
      icon: '💚',
      title: 'Trefferheilung (Hit Healing)',
      desc: 'Der wertvollste P-Stein-Zusatz! Bei jedem ausgeteilten Treffer heilt sich dein Pokémon selbst. Ab Welt 10 sind 5–10% Trefferheilung Pflicht!'
    },
    {
      icon: '↔️',
      title: 'Breiten- und Streusteine',
      desc: 'Breiten-Steine machen z.B. Hydropumpe und Rankenhieb riesig, damit du ganze Gegnergruppen auf einmal triffst.'
    },
    {
      icon: '⏱️',
      title: 'Wartezeit-Stein',
      desc: 'Verkürzt die Abklingzeit deiner mächtigsten Attacken, damit dein Pokémon fast ohne Pause angreifen kann.'
    },
    {
      icon: '✨',
      title: 'Bingo-Boni',
      desc: 'Eine volle 3er-Reihe im Kraft-Amulett aktiviert einen mächtigen Bingo-Bonus (z.B. -20% Wartezeit oder +500 Angriff!).'
    }
  ],
  moves: [
    {
      icon: '🌊',
      title: 'Hydropumpe',
      desc: 'Die stärkste Spezial-Attacke im ganzen Spiel! Starmie, Entoron oder Golking können sie lernen. Trifft Gegner mit mehreren Wassersäulen.'
    },
    {
      icon: '🌿',
      title: 'Rankenhieb',
      desc: 'Extrem starker Pflanzen-Nahkampf. Bisaflor und Sarzenia schlagen damit blitzschnell zu.'
    },
    {
      icon: '💪',
      title: 'Protzer (Bulk Up)',
      desc: 'Stärkt Angriff und Abwehr. Ein Maschok oder Machomei mit 3 Teilungssteinen macht dein ganzes Team unverwundbar.'
    },
    {
      icon: '🪨',
      title: 'Steinwurf & Felswurf',
      desc: 'Großartiger Gesteins-Angriff für Onix oder Georok. Bringt viel Wucht und wirft Gegner zurück.'
    },
    {
      icon: '⭐',
      title: 'Eine oder zwei Attacken?',
      desc: 'Pokémon mit nur EINER Attacke haben 3 Plätze für Move-Steine! Oft ist 1 verstärkte Attacke viel stärker als 2 schwächere.'
    }
  ],
  tips: [
    {
      icon: '🥈',
      title: 'Der Topf entscheidet über Basis-Werte',
      desc: 'Pokémon aus dem Silber- oder Goldtopf starten mit viel höheren Basiswerten und besseren P-Stein-Plätzen als aus dem Eisentopf!'
    },
    {
      icon: '🦊',
      title: 'Das Geheimnis von Evoli',
      desc: 'Auf Level 36 entscheidet die Anzahl deiner angelegten Steine: Mehr rote Angriffssteine = Flamara, mehr blaue KP-Steine = Aquana, gleich viele = Blitza!'
    },
    {
      icon: '🏃',
      title: 'Der Lebensrettende Flucht-Knopf',
      desc: 'Wenn der Boss rot aufleuchtet, drücke unten rechts auf den gelben Fluchtknopf! Dein Team rennt auseinander und weicht dem K.O.-Treffer aus.'
    },
    {
      icon: '🎟️',
      title: 'Deko im Pokémon-Markt',
      desc: 'Kaufe im Markt zuerst Dekorationen, die dir dauerhaft mehr Zutaten (z.B. Glurak-Fackel oder Turtok-Brunnen) einbringen!'
    }
  ]
};
