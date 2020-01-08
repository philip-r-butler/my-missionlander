import drawElements from '../Draw';

export default class Lander {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.increment = 1;
  }

  move() {
    this.increment *= 0.99;
    this.x += this.increment;
    this.y *= 1.01;
  }

  draw(context) {
    const shape = [
      { cmd: 'strokeStyle', style: 'white'},
      { cmd: 'lineWidth', width: 1},
      { cmd: 'beginPath' },
      { cmd: 'rect', x: this.x, y: this.y, width: 10, height: 10 },
      { cmd: 'stroke' },
    ];

    drawElements(context).execute(shape);
  }
}
