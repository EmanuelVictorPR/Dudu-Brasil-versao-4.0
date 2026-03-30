export default class Enemy {
  constructor(scene, x, y, config = {}) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, 'enemy_walk');
    this.sprite.play('enemy-walk');


    const size = 40;
    this.sprite.setDisplaySize(size, size);
    this.sprite.setSize(size, size);

    // inimigos terrestres NÃO usam gravidade
    this.sprite.body.setAllowGravity(false);

    this.sprite.setImmovable(true);
    this.sprite.setCollideWorldBounds(true);

    this.speed = config.speed || 40;
    this.direction = config.direction || 'left';
    this.movable = config.movable ?? true;


    this.startX = x;
    this.patrolDistance = config.patrolDistance || 120; // padrão
    this.speed = config.speed || 40;
    this.direction = -1; // começa andando para a esquerda
    this.sprite.body.setSize(120, 180);
    this.sprite.body.setOffset(50, 40);

    // 🔥 AUMENTA O TAMANHO DO INIMIGO
    this.sprite.setScale(0.4);

    // animação
    this.sprite.play('enemy-walk');

  }


  update() {
    const body = this.sprite.body;

    body.setVelocityX(this.speed * this.direction);

    // limites da patrulha
    if (this.sprite.x <= this.startX - this.patrolDistance) {
      this.direction = 1;
      this.sprite.setFlipX(false);
    }

    if (this.sprite.x >= this.startX + this.patrolDistance) {
      this.direction = -1;
      this.sprite.setFlipX(true);
    }

    this.sprite.setFlipX(this.direction < 0);

  }



  getBody() {
    return this.sprite;
  }
}
