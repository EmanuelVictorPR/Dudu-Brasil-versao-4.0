import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Pizza from '../entities/Pizza.js';
import SaveSystem from '../systems/SaveSystem.js';
import CheckpointSystem from '../systems/CheckpointSystem.js';
import LifeSystem from '../systems/LifeSystem.js';
import InputController from '../systems/InputController.js';
import fase1 from '../levels/fase1.js';
import StaticEnemy from '../entities/StaticEnemy.js';

const LEVELS = { 1: fase1 };

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super('LevelScene');
  }

  init() {
    this.save = SaveSystem.load() || SaveSystem.getInitialState();
    this.levelData = LEVELS[this.save.faseAtual];
    this.checkpoints = new CheckpointSystem();
    this.lives = new LifeSystem(this.save.vidas);
    this.inputController = new InputController(this);
    this.input.addPointer(1);
  }

  create() {
    // ───────── ANIMAÇÕES ─────────
    if (!this.anims.exists('player-walk')) {
      this.anims.create({
        key: 'player-walk',
        frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 11 }),
        frameRate: 12,
        repeat: -1
      });
    }

    if (!this.anims.exists('pizza-spin')) {
      this.anims.create({
        key: 'pizza-spin',
        frames: this.anims.generateFrameNumbers('pizza_spin', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists('enemy-walk')) {
      this.anims.create({
        key: 'enemy-walk',
        frames: this.anims.generateFrameNumbers('enemy_walk', { start: 0, end: 9 }),
        frameRate: 8,
        repeat: -1
      });
    }

    // ───────── LIMITES DO MUNDO ─────────
    const worldW = this.levelData.camera.bounds.width;
    const worldH = this.levelData.camera.bounds.height;

    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBounds(0, 0, worldW, worldH);

    const screenW = this.scale.width;
    const screenH = this.scale.height;

    // ───────── BACKGROUND ─────────
    this.bgSky = this.add.tileSprite(0, 0, screenW, screenH, 'bg_sky')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-30);

    this.bgFar = this.add.tileSprite(0, screenH - 280, worldW, 280, 'bg_far')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-20);

    this.bgMid = this.add.tileSprite(0, screenH - 256, worldW, 256, 'bg_mid')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-10);

    const GROUND_HEIGHT = 512;
    this.bgGround = this.add.tileSprite(
      0,
      screenH - GROUND_HEIGHT,
      worldW,
      GROUND_HEIGHT,
      'bg_ground'
    )
      .setOrigin(0)
      .setScrollFactor(1)
      .setDepth(-5);

    // ───────── GROUND ─────────
    this.ground = this.physics.add.staticGroup();
    this.levelData.ground.forEach(p => {
      const g = this.add.rectangle(p.x, p.y, p.width, p.height, 0x444444, 0);
      this.physics.add.existing(g, true);
      this.ground.add(g);
    });

    // ───────── PLATAFORMAS AÉREAS ─────────
    this.platformsAir = this.physics.add.staticGroup();
    this.levelData.platforms.forEach(p => {
      const z = this.add.zone(p.x, p.y, p.width, p.height);
      this.physics.add.existing(z, true);
      this.platformsAir.add(z);
    });

    // ───────── PLAYER ─────────
    const start = this.levelData.start;
    this.player = new Player(this, start.x, start.y, this.inputController);

    this.physics.add.collider(this.player.getBody(), this.ground);
    this.physics.add.collider(this.player.getBody(), this.platformsAir);

    // ───────── KILL FLOOR ─────────
    this.killFloor = this.add.rectangle(worldW / 2, screenH + 160, worldW, 300, 0xff0000, 0);
    this.physics.add.existing(this.killFloor, true);

    this.physics.add.overlap(this.player.getBody(), this.killFloor, () => {
      if (this.player.invincible) return;
      this.handleDeath();
    });

    // ───────── SONS ─────────
    this.sfx = {
      jump: this.sound.add('sfx-jump', { volume: 0.6 }),
      death: this.sound.add('sfx-death', { volume: 0.8 }),
      checkpoint: this.sound.add('sfx-checkpoint', { volume: 0.7 }),
      win: this.sound.add('sfx-win', { volume: 0.8 }),
      coin: this.sound.add('sfx-coin', { volume: 0.5 })
    }

    if (!this.music || !this.music.isPlaying) {
      this.music = this.sound.add('bg-melody', {
        volume: 0.4,
        loop: true
      });
      this.music.play();
    }

    // ───────── CHECKPOINTS ─────────
    this.checkpointZones = this.physics.add.staticGroup();

    this.levelData.checkpoints.forEach(cp => {
      const zone = this.add.zone(cp.x, cp.y, 40, 60);
      zone.activated = false;
      this.physics.add.existing(zone, true);
      this.checkpointZones.add(zone);

      const sprite = this.add.sprite(cp.x, cp.y + 60, 'checkpoint_flag')
        .setOrigin(0.5, 1)
        .setScale(0.5)
        .setDepth(5);

      zone.sprite = sprite;
    });

    this.physics.add.overlap(this.player.getBody(), this.checkpointZones, (_, zone) => {
      if (zone.activated) return;
      zone.activated = true;
      this.sfx.checkpoint.play();
      this.checkpoints.setCheckpoint({ x: zone.x, y: zone.y });
      if (zone.sprite) zone.sprite.setTint(0x00ff00);
    });

    // ───────── FINAL ─────────
    this.finishZone = this.add.zone(
      this.levelData.finish.x,
      this.levelData.finish.y,
      60,
      100
    );
    this.physics.add.existing(this.finishZone, true);

    this.finishSprite = this.add.sprite(
      this.levelData.finish.x,
      this.levelData.finish.y + 30,
      'finish_flag'
    )
      .setOrigin(0.5, 0.8)
      .setScale(0.3)
      .setDepth(5);

    this.physics.add.overlap(this.player.getBody(), this.finishZone, () => {
      this.music.stop();
      this.sfx.win.play();
      this.scene.start('VictoryScene', { score: this.save.score });
    });

    // ───────── INIMIGOS ─────────
    this.enemies = [];
    this.levelData.enemies.forEach(e => {
      const enemy = new Enemy(this, e.x, e.y, e);
      this.physics.add.collider(enemy.getBody(), this.ground);
      this.physics.add.collider(enemy.getBody(), this.platformsAir);

      this.physics.add.overlap(this.player.getBody(), enemy.getBody(), () => {
        if (this.player.invincible) return;
        this.handleDeath();
      });

      this.enemies.push(enemy);
    });

    this.staticEnemies = [];
    this.levelData.staticEnemies.forEach(e => {
      const enemy = new StaticEnemy(this, e.x, e.y, e);
      this.physics.add.collider(enemy.getBody(), this.ground);
      this.physics.add.collider(enemy.getBody(), this.platformsAir);

      this.physics.add.overlap(this.player.getBody(), enemy.getBody(), () => {
        if (this.player.invincible) return;
        this.handleDeath();
      });

      this.staticEnemies.push(enemy);
    });

    // ───────── PIZZAS ─────────
    this.pizzas = [];
    this.levelData.collectibles.forEach(c => {
      const pizza = new Pizza(this, c.x, c.y);
      this.physics.add.overlap(this.player.getBody(), pizza.getBody(), () => {
        this.handleCollectPizza(pizza);
      });
      this.pizzas.push(pizza);
    });

    // ───────── CÂMERA ─────────
    this.cameras.main.startFollow(this.player.getBody(), true, 0.08, 0.08);

    // ───────── HUD ─────────
    this.livesText = this.add.text(20, 20, `Vidas: ${this.lives.getLives()}`, {
      fontSize: '20px',
      color: '#ffffff'
    }).setScrollFactor(0);

    this.scoreText = this.add.text(20, 50, `Score: ${this.save.score}`, {
      fontSize: '20px',
      color: '#ffffff'
    }).setScrollFactor(0);

    this.createMobileControls();
  }

  update() {
    const cam = this.cameras.main;

    this.bgSky.y = cam.scrollY;
    this.bgFar.y = cam.scrollY + (this.scale.height - 430);
    this.bgMid.y = cam.scrollY + (this.scale.height - 400);

    this.bgFar.tilePositionX = cam.scrollX * 0.25;
    this.bgMid.tilePositionX = cam.scrollX * 0.5;

    this.inputController.update();
    this.player.update();
    this.enemies.forEach(e => e.update());
  }

  handleDeath() {
    this.sfx.death.play();
    this.lives.loseLife();

    SaveSystem.save({
      faseAtual: this.save.faseAtual,
      vidas: this.lives.getLives(),
      score: this.save.score
    });

    this.livesText.setText(`Vidas: ${this.lives.getLives()}`);

    if (this.lives.isGameOver()) {
      SaveSystem.clear();
      this.scene.restart();
      return;
    }

    const respawn = this.checkpoints.getCheckpoint() || this.levelData.start;
    this.player.setPosition(respawn.x, respawn.y);
    this.player.startInvincibility();
  }

  handleCollectPizza(pizza) {
    pizza.destroy();

    this.sfx.coin.play(); // 🔊 SOM DA MOEDA

    this.save.score += 10;
    this.scoreText.setText(`Score: ${this.save.score}`);

    SaveSystem.save({
      faseAtual: this.save.faseAtual,
      vidas: this.lives.getLives(),
      score: this.save.score
    });
  }


  createMobileControls() {
    const h = this.scale.height;
    const w = this.scale.width;

    const left = this.add.rectangle(80, h - 80, 120, 120, 0x000000, 0.4)
      .setScrollFactor(0)
      .setInteractive();

    this.add.text(80, h - 80, '◀', { fontSize: '48px', color: '#fff' })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const right = this.add.rectangle(220, h - 80, 120, 120, 0x000000, 0.4)
      .setScrollFactor(0)
      .setInteractive();

    this.add.text(220, h - 80, '▶', { fontSize: '48px', color: '#fff' })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const jump = this.add.rectangle(w - 100, h - 80, 140, 140, 0x000000, 0.4)
      .setScrollFactor(0)
      .setInteractive();

    this.add.text(w - 100, h - 80, '⤒', { fontSize: '48px', color: '#fff' })
      .setOrigin(0.5)
      .setScrollFactor(0);

    left.on('pointerdown', () => this.inputController.pressLeft(true));
    left.on('pointerup', () => this.inputController.pressLeft(false));
    left.on('pointerout', () => this.inputController.pressLeft(false));
    left.on('pointerupoutside', () => this.inputController.pressLeft(false));

    right.on('pointerdown', () => this.inputController.pressRight(true));
    right.on('pointerup', () => this.inputController.pressRight(false));
    right.on('pointerout', () => this.inputController.pressRight(false));
    right.on('pointerupoutside', () => this.inputController.pressRight(false));

    jump.on('pointerdown', () => this.inputController.pressJump());
  }
}

