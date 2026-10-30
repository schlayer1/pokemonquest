export interface WorldStage {
  worldId: number;
  stageName: string; // e.g. "1-1", "1-Boss"
  recommendedCP: number;
  bossName: string;
  notes?: string;
}

export const WORLD_STAGES: Record<number, { title: string; bonusType: string; stages: WorldStage[] }> = {
  1: {
    title: 'Die erste Wiese',
    bonusType: 'fighting',
    stages: [
      { worldId: 1, stageName: '1-1', recommendedCP: 800, bossName: 'Rattfratz' },
      { worldId: 1, stageName: '1-2', recommendedCP: 900, bossName: 'Habitak' },
      { worldId: 1, stageName: '1-3', recommendedCP: 1000, bossName: 'Pikachu' },
      { worldId: 1, stageName: '1-Boss', recommendedCP: 1100, bossName: 'Tauboss' }
    ]
  },
  2: {
    title: 'Der dunkle Hain',
    bonusType: 'fire',
    stages: [
      { worldId: 2, stageName: '2-1', recommendedCP: 1500, bossName: 'Raupy' },
      { worldId: 2, stageName: '2-2', recommendedCP: 1700, bossName: 'Hornliu' },
      { worldId: 2, stageName: '2-3', recommendedCP: 1900, bossName: 'Knofensa' },
      { worldId: 2, stageName: '2-Boss', recommendedCP: 2100, bossName: 'Sarzenia' }
    ]
  },
  3: {
    title: 'Der Fluss',
    bonusType: 'grass',
    stages: [
      { worldId: 3, stageName: '3-1', recommendedCP: 2400, bossName: 'Krabby' },
      { worldId: 3, stageName: '3-2', recommendedCP: 2700, bossName: 'Quapsel' },
      { worldId: 3, stageName: '3-3', recommendedCP: 2900, bossName: 'Enton' },
      { worldId: 3, stageName: '3-Boss', recommendedCP: 3200, bossName: 'Turtok' }
    ]
  },
  4: {
    title: 'Der trockene Gipfel',
    bonusType: 'flying',
    stages: [
      { worldId: 4, stageName: '4-1', recommendedCP: 3600, bossName: 'Vulpix' },
      { worldId: 4, stageName: '4-2', recommendedCP: 4000, bossName: 'Ponita' },
      { worldId: 4, stageName: '4-3', recommendedCP: 4300, bossName: 'Fukano' },
      { worldId: 4, stageName: '4-Boss', recommendedCP: 4700, bossName: 'Glurak' }
    ]
  },
  5: {
    title: 'Die Höhle',
    bonusType: 'water',
    stages: [
      { worldId: 5, stageName: '5-1', recommendedCP: 5200, bossName: 'Zubat' },
      { worldId: 5, stageName: '5-2', recommendedCP: 5600, bossName: 'Nebulak' },
      { worldId: 5, stageName: '5-3', recommendedCP: 6000, bossName: 'Smogon' },
      { worldId: 5, stageName: '5-Boss', recommendedCP: 6500, bossName: 'Gengar' }
    ]
  },
  6: {
    title: 'Die Blumenwiese',
    bonusType: 'bug',
    stages: [
      { worldId: 6, stageName: '6-1', recommendedCP: 7100, bossName: 'Sandan' },
      { worldId: 6, stageName: '6-2', recommendedCP: 7600, bossName: 'Digda' },
      { worldId: 6, stageName: '6-3', recommendedCP: 8200, bossName: 'Kleinstein' },
      { worldId: 6, stageName: '6-Boss', recommendedCP: 8800, bossName: 'Onix' }
    ]
  },
  7: {
    title: 'Die Felsenküste',
    bonusType: 'rock',
    stages: [
      { worldId: 7, stageName: '7-1', recommendedCP: 9400, bossName: 'Flegmon' },
      { worldId: 7, stageName: '7-2', recommendedCP: 10000, bossName: 'Dratini' },
      { worldId: 7, stageName: '7-3', recommendedCP: 10600, bossName: 'Lapras' },
      { worldId: 7, stageName: '7-Boss', recommendedCP: 11200, bossName: 'Garados' }
    ]
  },
  8: {
    title: 'Der Dunstwald',
    bonusType: 'ground',
    stages: [
      { worldId: 8, stageName: '8-1', recommendedCP: 11800, bossName: 'Sleima' },
      { worldId: 8, stageName: '8-2', recommendedCP: 12500, bossName: 'Rettan' },
      { worldId: 8, stageName: '8-3', recommendedCP: 13200, bossName: 'Nidoran' },
      { worldId: 8, stageName: '8-Boss', recommendedCP: 13900, bossName: 'Nidoking' }
    ]
  },
  9: {
    title: 'Das Schlummerplateau',
    bonusType: 'psychic',
    stages: [
      { worldId: 9, stageName: '9-1', recommendedCP: 14200, bossName: 'Menki' },
      { worldId: 9, stageName: '9-2', recommendedCP: 15000, bossName: 'Machollo' },
      { worldId: 9, stageName: '9-3', recommendedCP: 15800, bossName: 'Kicklee' },
      { worldId: 9, stageName: '9-Boss', recommendedCP: 16500, bossName: 'Machomei' }
    ]
  },
  10: {
    title: 'Das Grenzgebirge',
    bonusType: 'electric',
    stages: [
      { worldId: 10, stageName: '10-1', recommendedCP: 17500, bossName: 'Abra' },
      { worldId: 10, stageName: '10-2', recommendedCP: 18300, bossName: 'Traumato' },
      { worldId: 10, stageName: '10-3', recommendedCP: 19100, bossName: 'Rossana' },
      { worldId: 10, stageName: '10-Boss', recommendedCP: 20000, bossName: 'Simsala' }
    ]
  },
  11: {
    title: 'Die Kammer der Legenden',
    bonusType: 'none',
    stages: [
      { worldId: 11, stageName: '11-Boss', recommendedCP: 25000, bossName: 'Mewtu (Hauptstory-Endboss!)' }
    ]
  },
  12: {
    title: 'Die Raum-Zeit-Insel (Happenstance Island)',
    bonusType: 'none',
    stages: [
      { worldId: 12, stageName: '12-1', recommendedCP: 18500, bossName: 'Zufälliger Boss' },
      { worldId: 12, stageName: '12-2', recommendedCP: 20000, bossName: 'Zufälliger Boss' },
      { worldId: 12, stageName: '12-3', recommendedCP: 22000, bossName: 'Zufälliger Boss' },
      { worldId: 12, stageName: '12-4', recommendedCP: 24500, bossName: 'Arktos' },
      { worldId: 12, stageName: '12-5', recommendedCP: 27000, bossName: 'Zapdos' },
      { worldId: 12, stageName: '12-6', recommendedCP: 29500, bossName: 'Lavados' },
      { worldId: 12, stageName: '12-7', recommendedCP: 32000, bossName: 'Mew' },
      { worldId: 12, stageName: '12-8', recommendedCP: 34000, bossName: 'Mewtu' },
      { worldId: 12, stageName: '12-9 (FINALE)', recommendedCP: 36500, bossName: 'Mewtu & Legendäre Vögel (Höchste Stufe im Spiel!)' }
    ]
  }
};
