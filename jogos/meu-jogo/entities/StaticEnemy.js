export default class StaticEnemy {
  constructor(scene, x, y, config = {}) {
    this.scene = scene;

    // 🔑 CORPO ESTÁTICO (NÃO CAI, NÃO ATRAVESSA)
    this.body = scene.physics.add.staticSprite(
      x,
      y,
      config.key || 'enemy_static'
    );

    // 🔽 ESCALA DO SPRITE
    this.body.setScale(0.45);

    // 🔑 AJUSTE MANUAL DA HITBOX
    this.body.body.setSize(
      this.body.displayWidth * 0.6,
      this.body.displayHeight * 0.75
    );

    this.body.body.setOffset(
      this.body.displayWidth * 0.8,
      this.body.displayHeight * 0.8
    );
  }

  getBody() {
    return this.body;
  }

  update() {}
}
