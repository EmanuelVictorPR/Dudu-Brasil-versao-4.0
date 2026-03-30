const GROUND_Y = 600; // 580 + 40

export default {
  id: 1,
  name: "Avenida Central",

  type: "horizontal",

  start: { x: 100, y: 450 },
  finish: { x: 9000, y: 475 },

  camera: {
    follow: true,
    bounds: { width: 9200, height: 650 }
  },


  ground: [
    /*
// CHÃO COM BURACOS JOGÁVEIS
{ x: 1000, y: 500, width: 1900, height: 40 },
{ x: 2100, y: 580, width: 1600, height: 40 }, // buraco ~120px
{ x: 3300, y: 580, width: 1800, height: 40 },
{ x: 4500, y: 580, width: 1600, height: 40 }, // buraco ~120px
{ x: 5700, y: 580, width: 1800, height: 40 },*/


    // plataformas aéreas vêm depois
    ,

    { x: 512, y: 530, width: 1024, height: 20 },
    { x: 1572, y: 530, width: 964, height: 20 },
    { x: 2596, y: 530, width: 964, height: 20 },
    { x: 3620, y: 530, width: 964, height: 20 },
    { x: 4644, y: 530, width: 964, height: 20 },
    { x: 5668, y: 530, width: 964, height: 20 },
    { x: 6692, y: 530, width: 964, height: 20 },
    { x: 7716, y: 530, width: 964, height: 20 },
    { x: 8740, y: 530, width: 964, height: 20 },




    // bloco original
    // mesmo padrão deslocado

  ],

  platforms: [

    { x: 72, y: 328, width: 30, height: 7 },
    { x: 73, y: 335, width: 15, height: 7 },

    { x: 205, y: 282, width: 20, height: 7 },
    { x: 400, y: 280, width: 17, height: 7 },
    { x: 375, y: 280, width: 17, height: 7 },
    { x: 345, y: 280, width: 17, height: 7 },

    { x: 570, y: 425, width: 15, height: 7 },
    { x: 570, y: 419, width: 30, height: 7 },
    { x: 495, y: 325, width: 22, height: 10 },

    { x: 504, y: 490, width: 30, height: 15 },
    { x: 620, y: 357, width: 18, height: 7 },
    { x: 626, y: 364, width: 18, height: 7 },
    //  { x: 700, y: 355, width: 17, height: 8 },
    { x: 759, y: 357, width: 17, height: 8 },
    { x: 890, y: 350, width: 120, height: 8 },

    //================================================

    { x: 1096, y: 328, width: 30, height: 7 },
    { x: 1097, y: 335, width: 15, height: 7 },

    { x: 1229, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 1, y: 280, width: 17, height: 7 },
    { x: 1424, y: 280, width: 17, height: 7 },
    { x: 1364, y: 280, width: 17, height: 7 },

    { x: 1594, y: 425, width: 15, height: 7 },
    { x: 1594, y: 419, width: 30, height: 7 },
    { x: 1519, y: 325, width: 22, height: 10 },

    { x: 1524, y: 490, width: 45, height: 15 },
    { x: 1644, y: 357, width: 18, height: 7 },
    { x: 1650, y: 364, width: 18, height: 7 },
    { x: 1783, y: 357, width: 17, height: 8 },
    { x: 1914, y: 350, width: 120, height: 8 },

    //================================================

    { x: 2120, y: 328, width: 30, height: 7 },
    { x: 2121, y: 335, width: 15, height: 7 },

    { x: 2253, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 2, y: 280, width: 17, height: 7 },
    { x: 2448, y: 280, width: 17, height: 7 },
    { x: 2388, y: 280, width: 17, height: 7 },

    { x: 2618, y: 425, width: 15, height: 7 },
    { x: 2618, y: 419, width: 30, height: 7 },
    { x: 2543, y: 325, width: 22, height: 10 },

    { x: 2548, y: 490, width: 45, height: 15 },
    { x: 2668, y: 357, width: 18, height: 7 },
    { x: 2674, y: 364, width: 18, height: 7 },
    { x: 2807, y: 357, width: 17, height: 8 },
    { x: 2938, y: 350, width: 120, height: 8 },

    //================================================

    { x: 2120 + 1024, y: 328, width: 30, height: 7 },
    { x: 2121 + 1024, y: 335, width: 15, height: 7 },

    { x: 2253 + 1024, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 3, y: 280, width: 17, height: 7 },
    { x: 2448 + 1024, y: 280, width: 17, height: 7 },
    { x: 2388 + 1024, y: 280, width: 17, height: 7 },

    { x: 2618 + 1024, y: 425, width: 15, height: 7 },
    { x: 2618 + 1024, y: 419, width: 30, height: 7 },
    { x: 2543 + 1024, y: 325, width: 22, height: 10 },

    { x: 2548 + 1024, y: 490, width: 45, height: 15 },
    { x: 2668 + 1024, y: 357, width: 18, height: 7 },
    { x: 2674 + 1024, y: 364, width: 18, height: 7 },
    { x: 2807 + 1024, y: 357, width: 17, height: 8 },
    { x: 2938 + 1024, y: 350, width: 120, height: 8 },

    //================================================

    { x: 2120 + 2 * 1024, y: 328, width: 30, height: 7 },
    { x: 2121 + 2 * 1024, y: 335, width: 15, height: 7 },

    { x: 2253 + 2 * 1024, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 4, y: 280, width: 17, height: 7 },
    { x: 2448 + 2 * 1024, y: 280, width: 17, height: 7 },
    { x: 2388 + 2 * 1024, y: 280, width: 17, height: 7 },

    { x: 2618 + 2 * 1024, y: 425, width: 15, height: 7 },
    { x: 2618 + 2 * 1024, y: 419, width: 30, height: 7 },
    { x: 2543 + 2 * 1024, y: 325, width: 22, height: 10 },

    { x: 2548 + 2 * 1024, y: 490, width: 45, height: 15 },
    { x: 2668 + 2 * 1024, y: 357, width: 18, height: 7 },
    { x: 2674 + 2 * 1024, y: 364, width: 18, height: 7 },
    { x: 2807 + 2 * 1024, y: 357, width: 17, height: 8 },
    { x: 2938 + 2 * 1024, y: 350, width: 120, height: 8 },

    //================================================

    { x: 2120 + 3 * 1024, y: 328, width: 30, height: 7 },
    { x: 2121 + 3 * 1024, y: 335, width: 15, height: 7 },

    { x: 2253 + 3 * 1024, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 5, y: 280, width: 17, height: 7 },
    { x: 2448 + 3 * 1024, y: 280, width: 17, height: 7 },
    { x: 2388 + 3 * 1024, y: 280, width: 17, height: 7 },

    { x: 2618 + 3 * 1024, y: 425, width: 15, height: 7 },
    { x: 2618 + 3 * 1024, y: 419, width: 30, height: 7 },
    { x: 2543 + 3 * 1024, y: 325, width: 22, height: 10 },

    { x: 2548 + 3 * 1024, y: 490, width: 45, height: 15 },
    { x: 2668 + 3 * 1024, y: 357, width: 18, height: 7 },
    { x: 2674 + 3 * 1024, y: 364, width: 18, height: 7 },
    { x: 2807 + 3 * 1024, y: 357, width: 17, height: 8 },
    { x: 2938 + 3 * 1024, y: 350, width: 120, height: 8 },

    //================================================

    { x: 2120 + 4 * 1024, y: 328, width: 30, height: 7 },
    { x: 2121 + 4 * 1024, y: 335, width: 15, height: 7 },

    { x: 2253 + 4 * 1024, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 6, y: 280, width: 17, height: 7 },
    { x: 2448 + 4 * 1024, y: 280, width: 17, height: 7 },
    { x: 2388 + 4 * 1024, y: 280, width: 17, height: 7 },

    { x: 2618 + 4 * 1024, y: 425, width: 15, height: 7 },
    { x: 2618 + 4 * 1024, y: 419, width: 30, height: 7 },
    { x: 2543 + 4 * 1024, y: 325, width: 22, height: 10 },

    { x: 2548 + 4 * 1024, y: 490, width: 45, height: 15 },
    { x: 2668 + 4 * 1024, y: 357, width: 18, height: 7 },
    { x: 2674 + 4 * 1024, y: 364, width: 18, height: 7 },
    { x: 2807 + 4 * 1024, y: 357, width: 17, height: 8 },
    { x: 2938 + 4 * 1024, y: 350, width: 120, height: 8 },

    //================================================

    { x: 2120 + 5 * 1024, y: 328, width: 30, height: 7 },
    { x: 2121 + 5 * 1024, y: 335, width: 15, height: 7 },

    { x: 2253 + 5 * 1024, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 7, y: 280, width: 17, height: 7 },
    { x: 2448 + 5 * 1024, y: 280, width: 17, height: 7 },
    { x: 2388 + 5 * 1024, y: 280, width: 17, height: 7 },

    { x: 2618 + 5 * 1024, y: 425, width: 15, height: 7 },
    { x: 2618 + 5 * 1024, y: 419, width: 30, height: 7 },
    { x: 2543 + 5 * 1024, y: 325, width: 22, height: 10 },

    { x: 2548 + 5 * 1024, y: 490, width: 45, height: 15 },
    { x: 2668 + 5 * 1024, y: 357, width: 18, height: 7 },
    { x: 2674 + 5 * 1024, y: 364, width: 18, height: 7 },
    { x: 2807 + 5 * 1024, y: 357, width: 17, height: 8 },
    { x: 2938 + 5 * 1024, y: 350, width: 120, height: 8 },

    //================================================

    { x: 2120 + 6 * 1024, y: 328, width: 30, height: 7 },
    { x: 2121 + 6 * 1024, y: 335, width: 15, height: 7 },

    { x: 2253 + 6 * 1024, y: 282, width: 20, height: 7 },
    { x: 375 + 1024 * 8, y: 280, width: 17, height: 7 },
    { x: 2448 + 6 * 1024, y: 280, width: 17, height: 7 },
    { x: 2388 + 6 * 1024, y: 280, width: 17, height: 7 },

    { x: 2618 + 6 * 1024, y: 425, width: 15, height: 7 },
    { x: 2618 + 6 * 1024, y: 419, width: 30, height: 7 },
    { x: 2543 + 6 * 1024, y: 325, width: 22, height: 10 },

    { x: 2548 + 6 * 1024, y: 490, width: 45, height: 15 },
    { x: 2668 + 6 * 1024, y: 357, width: 18, height: 7 },
    { x: 2674 + 6 * 1024, y: 364, width: 18, height: 7 },
    { x: 2807 + 6 * 1024, y: 357, width: 17, height: 8 },
    { x: 2938 + 6 * 1024, y: 350, width: 120, height: 8 },
  ],

  //enemies: [
  //  { x: 1400, y: 400, speed: 100, direction: 'left', movable: true },

  //  { x: 2600, y: 400, speed: 0, movable: false },
  //  { x: 4200, y: 400, speed: 50, direction: 'left', movable: true },

  // depois da metade da fase
  //   { x: 7800, y: 400, speed: 60, direction: 'left', movable: true },
  //  ],

  enemies: [
    {
      x: 1400,
      y: 482,
      speed: 100,
      direction: 'left',
      movable: true,
      patrolDistance: 300
    },

    {
      x: 2500,
      y: 482,
      speed: 100,
      direction: 'left',
      movable: true,
      patrolDistance: 300
    },

      {
      x: 6500,
      y: 482,
      speed: 100,
      direction: 'left',
      movable: true,
      patrolDistance: 250
    }
  ],



  collectibles: [

    //1
    { x: 75, y: 180 },
    { x: 280, y: 350 },
    { x: 400, y: 180 },
    { x: 1050, y: 420 },

    //2
    { x: 1400, y: 500 },
    { x: 1519+1024*3, y: 280 },

    //3
    { x: 2973, y: 300 },
    { x: 3100, y: 420 },
    { x: 505 + 2 * 1024, y: 440 },

    //4
    { x: 200 + 1024 * 3, y: 200 },
    //5

    //6
    { x: 5200, y: 440 },

    //7
    { x: 75 + 1024 * 6, y: 180 },
    { x: 280 + 1024 * 6, y: 350 },
    { x: 400 + 1024 * 6, y: 180 },
    { x: 1050 + 1024 * 6, y: 420 },
    //8
    { x: 7400, y: 280 },

  ],

  staticEnemies: [
    {
      x: 2910,
      y: 300,
      key: 'enemy_static',
      scale: 0.6,
      hitWidth: 40,
      hitHeight: 60
    },

    {
      x: 4466,
      y: 230,
      key: 'enemy_static',
      scale: 0.6,
      hitWidth: 40,
      hitHeight: 60
    }
  ],


  checkpoints: [
    { x: 5000, y: 465 },
  ],



  settings: {
    gravity: 800,
    autoScrollSpeed: 0
  }



};
