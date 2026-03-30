import SaveSystem from '../systems/SaveSystem.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#111111');

    this.add.text(width / 2, height * 0.25, 'Entrega Concluída! 🍕', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.4, `Score Final: ${this.finalScore}`, {
      fontSize: '26px',
      color: '#ffcc00'
    }).setOrigin(0.5);

    // botão jogar novamente
    const replay = this.add.text(
      width / 2,
      height * 0.6,
      'Jogar Novamente',
      {
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true });

    replay.on('pointerdown', () => {
      SaveSystem.clear();
      this.scene.start('LevelScene');
    });

    // botão menu
    const menu = this.add.text(
      width / 2,
      height * 0.7,
      'Voltar ao Menu',
      {
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menu.on('pointerdown', () => {
      SaveSystem.clear();
      this.scene.start('MenuScene');
    });
  }
}
