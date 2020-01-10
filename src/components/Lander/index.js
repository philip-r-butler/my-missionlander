import GameObject from '../GameObject';

class Lander extends GameObject {
  constructor(x, y) {
    super(x, y, Lander.shape(x, y));
    this.incrementX = 1;
    this.incrementY = 0.02;
  }

  move() {
    this.incrementY = this.incrementY * 1.009;
    this.x += this.incrementX;
    this.y += this.incrementY;
    super.shape = Lander.shape(this.x, this.y);
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

export default Lander;
