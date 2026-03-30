export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('bg_sky', 'assets/backgrounds/sky.png');
    this.load.image('bg_far', 'assets/backgrounds/buildings_far.png');
    this.load.image('bg_mid', 'assets/backgrounds/houses_mid.png');
    this.load.image('bg_ground', 'assets/backgrounds/ground.png');
    this.load.image('checkpoint_flag', 'assets/ui/checkpoint.png');
    this.load.image('finish_flag', 'assets/ui/finish.png');
    this.load.image(
      'enemy_static',
      'assets/enemies/enemy_static.png'
    );

    this.load.audio('bg-melody', 'assets/sounds/melody.mp3');
    this.load.audio('sfx-jump', 'assets/sounds/jump.wav');
    this.load.audio('sfx-death', 'assets/sounds/death.wav');
    this.load.audio('sfx-checkpoint', 'assets/sounds/checkpoint.wav');
    this.load.audio('sfx-win', 'assets/sounds/win.wav');
    this.load.audio('sfx-coin', 'assets/sounds/coin.wav');




    this.load.image('player', 'assets/player/player.png');

    this.load.image('hitbox', 'assets/misc/hitbox.png'); // 🔑 NOVO

    this.load.spritesheet('player_walk', 'assets/player/player_walk.png', {
      frameWidth: 82,
      frameHeight: 110
    });

    this.load.spritesheet('pizza_spin', 'assets/items/pizza_spin.png', {
      frameWidth: 88,
      frameHeight: 84
    });

    this.load.spritesheet('enemy_walk', 'assets/enemies/enemy_walk.png', {
      frameWidth: 225,
      frameHeight: 240
    });
  }



  create() {
    this.scene.start('MenuScene');
  }
}
