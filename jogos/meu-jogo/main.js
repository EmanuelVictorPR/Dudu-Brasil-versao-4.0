import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelScene from './scenes/LevelScene.js';
import VictoryScene from './scenes/VictoryScene.js';

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  parent: 'game',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false // 🔍 DEBUG ATIVADO PARA VER HITBOXES
    }
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    LevelScene,
    VictoryScene
  ]
};

new Phaser.Game(config);
