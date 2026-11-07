import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.levi.pokemonquest.handbuch',
  appName: 'Pokémon Quest Meister-Handbuch',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: false
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
