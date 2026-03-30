export default class Pizza {
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, 'pizza_spin');

    this.sprite.setScale(0.5); // 🔽 reduz o tamanho (ajuste fino)

    this.sprite.body.setAllowGravity(false);
    this.sprite.setImmovable(true);

    this.sprite.play('pizza-spin');


  }

  getBody() {
    return this.sprite;
  }

  destroy() {
    this.sprite.destroy();
  }
}
