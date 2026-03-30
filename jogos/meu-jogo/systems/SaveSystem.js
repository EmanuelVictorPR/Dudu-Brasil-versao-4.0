import { GAME_CONFIG } from '../config/gameConfig.js';

export default class SaveSystem {
  static load() {
    const raw = localStorage.getItem(GAME_CONFIG.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static save(data) {
    localStorage.setItem(
      GAME_CONFIG.storageKey,
      JSON.stringify(data)
    );
  }

  static clear() {
    localStorage.removeItem(GAME_CONFIG.storageKey);
  }

  static getInitialState() {
    return {
      faseAtual: 1,
      vidas: GAME_CONFIG.initialLives,
      score: 0,
      checkpoint: null
    };
  }
}
