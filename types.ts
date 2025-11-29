export enum ThemeMode {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export enum SoundMode {
  NORMAL = 'Normal',
  VIBRATE = 'Vibrate',
  SILENT = 'Silent',
}

export interface WifiNetwork {
  ssid: string;
  signalStrength: number; // 0-100
  isConnected: boolean;
}

export interface Profile {
  id: string;
  name: string;
  ssid: string; // The Trigger
  theme: ThemeMode;
  sound: SoundMode;
  brightness: number; // 0-100
  bluetooth: boolean;
  color: string; // Hex for the accent strip
}

export interface ProfileSuggestion {
  theme: ThemeMode;
  sound: SoundMode;
  brightness: number;
  bluetooth: boolean;
  reasoning: string;
}
