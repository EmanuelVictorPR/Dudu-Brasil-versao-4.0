import SaveSystem from '../systems/SaveSystem.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // fundo simples
    this.cameras.main.setBackgroundColor('#111111');

    // título
    this.add.text(width / 2, height * 0.25, 'Dudu & Duque\nPizzaria Lunna', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const saveExists = !!SaveSystem.load();

    // botão CONTINUAR
    const continueBtn = this.add.text(
      width / 2,
      height * 0.5,
      'Continuar',
      {
        fontSize: '28px',
        color: saveExists ? '#ffffff' : '#777777'
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    if (saveExists) {
      continueBtn.on('pointerdown', () => {
        this.scene.start('LevelScene');
      });
    }

    // botão NOVO JOGO
    const newGameBtn = this.add.text(
      width / 2,
      height * 0.62,
      'Novo Jogo',
      {
        fontSize: '28px',
        color: '#ffffff'
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    newGameBtn.on('pointerdown', () => {
      SaveSystem.clear();
      this.scene.start('LevelScene');
    });

    // dica mobile
    this.add.text(
      width / 2,
      height * 0.85,
      'Toque nos botões para jogar',
      {
        fontSize: '14px',
        color: '#aaaaaa'
      }
    ).setOrigin(0.5);
  }
}
