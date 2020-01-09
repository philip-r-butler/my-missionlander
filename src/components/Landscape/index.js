import drawElements from '../Draw';

export default class Landscape {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.shape = Landscape.shape;
  }

  draw(context) {
    drawElements(context).execute(this.shape);
  }
}

Landscape.shape = [
  { cmd: 'strokeStyle', style: 'white' },
  { cmd: 'lineWidth', width: 1 },
  { cmd: 'beginPath' },
  { cmd: 'moveTo', x: 0, y: 400 },
  { cmd: 'lineTo', x: 100, y: 500 },
  { cmd: 'lineTo', x: 150, y: 600 },
  { cmd: 'lineTo', x: 300, y: 500 },
  { cmd: 'lineTo', x: 500, y: 700 },
  { cmd: 'lineTo', x: 750, y: 850 },
  { cmd: 'lineTo', x: 800, y: 450 },
  { cmd: 'lineTo', x: 840, y: 475 },
  { cmd: 'lineTo', x: 900, y: 500 },
  { cmd: 'lineTo', x: 1000, y: 600 },
  { cmd: 'stroke' },
];