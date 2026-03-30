export default class Player {
  constructor(scene, x, y, inputController) {
    this.scene = scene;
    this.input = inputController;

    // ── SPRITE ÚNICO (VISUAL + FÍSICA) ──
    this.sprite = scene.physics.add.sprite(x, y, 'player_walk');
    this.sprite.setScale(0.8);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(900);
    this.sprite.setDepth(10);

    // ── HITBOX AJUSTADA ──
    const HIT_W = 40;
    const HIT_H = 56;

    this.sprite.body.setSize(HIT_W, HIT_H);
    this.sprite.body.setOffset(
      (this.sprite.width - HIT_W) / 2,
      this.sprite.height - HIT_H - 12
    );

    // ── ESTADO ──
    this.invincible = false;
    this.coyoteTime = 120;
    this.coyoteTimer = 0;
  }

  update() {
    const body = this.sprite.body;

    // ── COYOTE TIME ──
    if (body.blocked.down) {
      this.coyoteTimer = this.coyoteTime;
    } else {
      this.coyoteTimer -= this.scene.game.loop.delta;
    }

    // ── MOVIMENTO ──
    if (this.input.left) {
      body.setVelocityX(-200);
      this.sprite.setFlipX(true);
      this.sprite.play('player-walk', true);

    } else if (this.input.right) {
      body.setVelocityX(200);
      this.sprite.setFlipX(false);
      this.sprite.play('player-walk', true);

    } else {
      body.setVelocityX(0);
      this.sprite.anims.stop();
      this.sprite.setFrame(0);
    }

    // ── PULO ──
    if (this.input.jump && this.coyoteTimer > 0) {
      body.setVelocityY(-560);
      this.coyoteTimer = 0;
      this.scene.sfx.jump.play(); // 🔊 SOM DE PULO

    }

  }

  // ── INTERFACE ──
  getBody() {
    return this.sprite;
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y);
    this.sprite.body.setVelocity(0, 0);
  }

  startInvincibility(duration = 1200) {
    if (this.invincible) return;

    this.invincible = true;

    this.invincibleTween = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 250,
      yoyo: true,
      repeat: -1
    });

    this.scene.time.delayedCall(duration, () => {
      this.invincible = false;

      if (this.invincibleTween) {
        this.invincibleTween.stop();
        this.invincibleTween = null;
      }

      this.sprite.setAlpha(1);
    });
  }

  isInvincible() {
    return this.invincible;
  }


}
