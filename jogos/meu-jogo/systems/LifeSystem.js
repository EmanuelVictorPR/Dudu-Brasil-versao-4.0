import { GAME_CONFIG } from '../config/gameConfig.js';

export default class LifeSystem {
  constructor(initialLives) {
    this.lives = initialLives;
  }

  loseLife() {
    this.lives--;
  }

  isGameOver() {
    return this.lives <= 0;
  }

  reset() {
    this.lives = GAME_CONFIG.initialLives;
  }

  getLives() {
    return this.lives;
  }
}
