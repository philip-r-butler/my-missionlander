import drawElements from '../Draw';

export default class Lander {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.incrementX = 1;
    this.incrementY = 0.02;
    this.shape = Lander.shape;
  }

  move() {
    this.incrementY = this.incrementY * 1.009;
    this.x += this.incrementX;
    this.y += this.incrementY;
  }

  draw(context) {
    drawElements(context).execute(this.shape(this.x, this.y));
  }
}

Lander.shape = (x, y) => {
  const tX = n => x + n;
  const tY = n => y + n;

  return [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
    { cmd: 'moveTo', x, y },
    { cmd: 'lineTo', x: tX(5), y: tY(10) },
    { cmd: 'lineTo', x: tX(-5), y: tY(10) },
    { cmd: 'closePath' },
    { cmd: 'stroke' },
  ];
};
