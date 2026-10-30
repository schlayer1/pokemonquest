import { SpriteStyle } from '../types/quest';

/**
 * Returns the local asset URL for a Pokémon sprite.
 * Default is 'classic' (official 2D artwork),
 * or 'kubo' (3D in-game voxel models).
 */
export function getPokemonSprite(id: number, style: SpriteStyle = 'classic'): string {
  if (!id || id < 1 || id > 151) return '/icons/icon-192.png';
  return `/assets/pokemon/${style}/${id}.png`;
}
